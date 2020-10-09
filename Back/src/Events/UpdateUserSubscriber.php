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
use Symfony\Component\HttpKernel\Exception\HttpException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

//pour gener les evenements du coeur de symfony (kernel)
class UpdateUserSubscriber implements EventSubscriberInterface{
    /** @var User */
    private $userCo;
    private $encoder;
    private $droit;
    public function __construct(UserPasswordEncoderInterface $encoder,Security $security,EntityManagerInterface $manager,AuthorizationCheckerInterface $checker)
    {
        $this->encoder=$encoder;
        $this->userCo=$security->getUser();
        $this->manager=$manager;
        $this->droit=$checker;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW=>['updateInfos',EventPriorities::PRE_VALIDATE]
        ];
    }
    public function updateInfos(ViewEvent $event){
        $user=$event->getControllerResult();
        $request=$event->getRequest();
        $method=$request->getMethod();
        $route=$request->attributes->get('_route');
        if($user instanceof User && $method=="PUT"){
            if($route=="api_users_PUT_item"){//les gens qui peuvent modifier les infos des users
                $this->onlyFor($user);//seul les admins, les superviseurs et le super admin peuvent y accèder )
                $this->sameEntité($user);
            }
            elseif($route=="api_users_INFO_item"){//j ai dégagé une route speciale pour modifier ses infos personnelles dans l entité user
                $this->isMe($user);
            }
        }
    }
    public function isMe(User $user){
        if($this->userCo->getId()!=$user->getId()){
            throw new HttpException(403,"Vous ne pouvez pas modifier les informations d'un autre utilisateur via cette route");
        }
    }
    public function onlyFor($user){//les gens qui peuvent modifier les infos des users
        if(!$this->droit->isGranted('ROLE_SuperAdmin') && 
           !$this->droit->isGranted('ROLE_Admin') && 
           !$this->droit->isGranted('ROLE_Superviseur') && 
           !$this->droit->isGranted('ROLE_SuperViseurGene') && 
           !$this->droit->isGranted('ROLE_SuperViseurAdjoint') && 
           $this->userCo->getId()!=$user->getId()
        ){
            throw new HttpException(403,"Vous n'êtes pas autoriser à modifier les informations d'un utilisateur !");
        }
    }
    public function sameEntité($user){
        if(!$this->userCo->inHolding($user) && !$this->droit->isGranted('ROLE_SuperAdmin')){
            throw new HttpException(403,"Vous n'êtes pas dans la même entité que cet utilisateur !");
        }
    }

}