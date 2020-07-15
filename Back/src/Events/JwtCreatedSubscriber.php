<?php
namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber{//dans services.yaml
    public function updateJwtData(JWTCreatedEvent $event){
        // $user=$event->getUser();
        // $data=$event->getData();// c est un tableau
        // if($user && $user->getId()){}
        // $data['id']=$user->getId();
        // $data=$event->setData($data);
    }
}