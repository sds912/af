<?php
namespace App\Controller;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Utils\Shared;

class LockUserController{
    /** @var EntityManagerInterface */
    public $manager;
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager=$manager;
    }
    public function __invoke(User $data)//toujours $data
    {
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