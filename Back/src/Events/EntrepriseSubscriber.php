<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Entreprise;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;
class EntrepriseSubscriber implements EventSubscriberInterface{
    /** @var User */
    private $userCo;
    public function __construct(Security $security)
    {
        $this->userCo=$security->getUser();
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW=>['addUser',EventPriorities::PRE_WRITE]
        ];
    }
    public function addUser(ViewEvent $event){//fait dans SharedController
        // $entreprise=$event->getControllerResult();
        // $method=$event->getRequest()->getMethod();
        // if($entreprise instanceof Entreprise && $method=="POST"){
        //     $entreprise->addUser($this->userCo);
        // }
    }
}