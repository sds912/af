<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Localite;
use App\Entity\Notification;
use App\Entity\User;
use App\Entity\UserNotif;
use App\Repository\UserRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;
use App\Utils\Shared;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

//pour gener les evenements du coeur de symfony (kernel)
class LocaliteSubscriber implements EventSubscriberInterface{
    /** @var User */
    private $userCo;
    /** @var MessageBusInterface */
    private $bus;
    /** @var EntityManagerInterface */
    private $manager;
    /** @var AuthorizationCheckerInterface */
    private $droit;
    public function __construct(Security $security,EntityManagerInterface $manager,MessageBusInterface $bus,AuthorizationCheckerInterface $checker, UserRepository $repoUser)
    {
        $this->userCo=$security->getUser();
        $this->bus=$bus;
        $this->manager=$manager;
        $this->droit=$checker;
        $this->repoUser=$repoUser;
    }
    public static function getSubscribedEvents()
    {
        return [
            //On utilise la fonction encodePassword avant d ecrire dans la base de donnée d ou PRE_WRITE
            KernelEvents::VIEW=>['addLocalite',EventPriorities::POST_WRITE]
        ];
    }
    public function addLocalite(ViewEvent $event){//on peut changer le user par une autre classe et mettre l algo du traitement à faire juste avant que l on ecrive dans la base de donnée
        $localite=$event->getControllerResult();//on option le resultat du controller de api plateform
        $method=$event->getRequest()->getMethod();
        if($localite instanceof Localite && $method=="POST" && $this->droit->isGranted('ROLE_SuperViseurAdjoint')){
            $user=$this->userCo;
            $nomParent=$localite->getParent()?$localite->getParent()->getNom():null;
            $nomNew=$localite->getNom();
            $message=$user->getNom()." vient d'ajouter $nomNew dans la liste des localités.";
            $message=!$nomParent?$message:$user->getNom()." vient d'ajouter $nomNew dans $nomParent.";
            
            $notif=new Notification();
            $id=$localite->getId();
            $idHash= $id?Shared::hashId($id):null;
            $lien=$idHash?"/zonage/$idHash":"/zonage";
            $notif->setLien($lien)
                  ->setEmetteur($user)
                  ->setMessage($message)
                  ->setType(Shared::NOTIFICATION)
                  ->setDate(new \DateTime());
            $this->manager->persist($notif);
            $supervGens=$this->repoUser->findAllSuperViseurGene($user->getId());
            foreach($supervGens as $supervGen){
                $userNotif=new UserNotif($this->bus);
                $userNotif->setRecepteur($supervGen)->setNotification($notif)->setStatus(0);
                $this->manager->persist($userNotif); 
            }
            $this->manager->flush();//vu k POST_WRITE il faut flush
        }
    }
}