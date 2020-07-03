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

//pour gener les evenements du coeur de symfony (kernel)
class UpdatePwdSubscriber implements EventSubscriberInterface{

    private $userCo;
    private $encoder;
    public function __construct(UserPasswordEncoderInterface $encoder,Security $security,EntityManagerInterface $manager)
    {
        $this->encoder=$encoder;
        $this->userCo=$security->getUser();
        $this->manager=$manager;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW=>['updatePassword',EventPriorities::PRE_VALIDATE]
        ];
    }
    public function updatePassword(ViewEvent $event){
        $user=$event->getControllerResult();
        $request=$event->getRequest();
        $method=$request->getMethod();
        $route=$request->attributes->get('_route');
        $data=json_decode($request->getContent(),true);
        if($user instanceof User && $method=="PUT" && $route=="api_users_UPDPWD_item"){
            $this->isMe($user);
            $data=json_decode($request->getContent(),true);
            $mdp=$data["ancien"];
            if(!$this->encoder->isPasswordValid($this->userCo, $mdp)){
                throw new HttpException(403,"Le mot de passe est invalide");
            }
            if($data["newPassword"]!=$data["confPassword"]){
                throw new HttpException(403,"Les mots de passe ne correspondent pas");
            }
            $hash=$this->encoder->encodePassword($user, $data["newPassword"]);
            $user->setPassword($hash);
            $this->manager->flush();
        }
    }
    public function isMe(User $user){
        if($this->userCo->getId()!=$user->getId()){
            throw new HttpException(403,"Vous ne pouvez pas modifier le mot de passe d'un autre utilisateur");
        }
    }
}