<?php
namespace App\Controller;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Utils\Shared;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Exception\HttpException;

class LockUserController{
    /** @var EntityManagerInterface */
    public $manager;
    /** @var User */
    private $userCo;
    public function __construct(Security $security,EntityManagerInterface $manager)
    {
        $this->manager=$manager;
        $this->userCo=$security->getUser();
    }
    public function __invoke(User $data)//toujours $data
    {
        if(!$this->userCo->inHolding($data)){
            throw new HttpException(403,"Vous n'êtes pas dans la même entité que cet utilisateur !");
        }
        $status=$data->getStatus();//car si c est autre chose que actif ou bloquer on ne doit pas pouvoir le changer ici
        if($data->getStatus()==Shared::ACTIF){
            $status=Shared::BLOQUE;
        }elseif($data->getStatus()==Shared::BLOQUE){
            $status=Shared::ACTIF;
        }
        $data->setStatus($status);
        $this->manager->flush();
        return $data;
    }
}