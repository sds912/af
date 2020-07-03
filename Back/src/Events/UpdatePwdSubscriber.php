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
class UpdatePwdSubscriber implements EventSubscriberInterface{

    private $userCo;
    public function __construct(Security $security)
    {
        $this->userCo=$security->getUser();
    }
    public static function getSubscribedEvents()
    {
        return [
            //On utilise la fonction encodePassword avant d ecrire dans la base de donnée d ou PRE_WRITE
            KernelEvents::VIEW=>['updatePassword',EventPriorities::PRE_VALIDATE]// si ca doit etre fait avant la validation utiliser: EventPriorities::PRE_VALIDATE voir video 77 lior api plat
        ];
    }
    public function updatePassword(ViewEvent $event){//on peut changer le user par une autre classe et mettre l algo du traitement à faire juste avant que l on ecrive dans la base de donnée
        
        //à terminer
        $user=$event->getControllerResult();//on option le resultat du controller de api plateform
        $request=$event->getRequest();
        $method=$request->getMethod();
        $route=$request->attributes->get('_route');
        $data=json_decode($request->getContent(),true);
        //dd($data); à terminer
        if($user instanceof User && $method=="POST" && $route=="api_users_UPDPWD_item"){
            $data=json_decode($request->getContent(),true);
            $mdp=$data["ancien"];
            if(!$encodePassword->isPasswordValid($userCo, $mdp)){
                throw new HttpException(403,"Le mot de passe est invalide");
            }
            if($data["password"]!=$data["confPassword"]){
                throw new HttpException(403,"Les mots de passe ne correspondent pas");
            }
            $userCo->setPassword($encodePassword->encodePassword($userCo, $data["password"]));
        }
    }
    public function isMe(User $user){
        if($this->userCo->getId()!=$user->getId()){
            throw new HttpException(403,"Vous ne pouvez pas modifier le mot de passe d'un autre utilisateur");
        }
    }
}