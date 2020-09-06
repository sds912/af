<?php

namespace App\Events;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;
use App\Utils\Shared;
//pour gener les evenements du coeur de symfony (kernel)
class PasswordEncoderSubscriber implements EventSubscriberInterface{
    /** @var UserPasswordEncoderInterface */
    private $encoder;

    private $userCo;
    public function __construct(UserPasswordEncoderInterface $encoder,Security $security)
    {
        $this->encoder=$encoder;
        $this->userCo=$security->getUser();
    }
    public static function getSubscribedEvents()
    {
        return [
            //On utilise la fonction encodePassword avant d ecrire dans la base de donnée d ou PRE_WRITE
            KernelEvents::VIEW=>['encodePassword',EventPriorities::PRE_VALIDATE]// si ca doit etre fait avant la validation utiliser: EventPriorities::PRE_VALIDATE voir video 77 lior api plat
        ];
    }
    public function encodePassword(ViewEvent $event){//on peut changer le user par une autre classe et mettre l algo du traitement à faire juste avant que l on ecrive dans la base de donnée
        $user=$event->getControllerResult();//on option le resultat du controller de api plateform
        $method=$event->getRequest()->getMethod();
        if($user instanceof User && $method=="POST"){
            $hash=$this->encoder->encodePassword($user,Shared::DEFAULTPWD);
            $user->setPassword($hash)
                ->setMatricule(Shared::hashMdp(Shared::DEFAULTPWD));
            if(!$user->getStatus()){
                $user->setStatus(Shared::ACTIF);
            }
        }
    }
}