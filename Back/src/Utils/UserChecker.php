<?php
namespace App\Utils;

use App\Entity\User as User ;
use App\Utils\Shared;
use Symfony\Component\Security\Core\User\UserInterface ;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\User\UserCheckerInterface ;


class UserChecker implements UserCheckerInterface
{//gerer dans security.yaml avec user_checker et dans services.yaml 
    public function checkPreAuth ( UserInterface $user )
    {
        if ( ! $user instanceof User ) {//si l'User n'existe pas ne rien retourner
            return ;
        }

        if ( $user->getStatus()==Shared::BLOQUE) {//si l'User est bloqué
            throw new HttpException(403,'Ce compte est bloqué, veuillez contacter l\'administrateur');
        }elseif($user->getStatus()==Shared::OUT){
            throw new HttpException(403,'Ce compte est inactif , veuillez contacter l\'administrateur');
        }
    }

    public function checkPostAuth ( UserInterface $user ){}
}
