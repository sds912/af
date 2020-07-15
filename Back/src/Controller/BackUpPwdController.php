<?php
namespace App\Controller;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Utils\Shared;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Repository\UserRepository;

class BackUpPwdController{
    /** @var EntityManagerInterface */
    public $manager;
    private $encoder;
    private $repoUser;
    public function __construct(EntityManagerInterface $manager,UserPasswordEncoderInterface $encoder,UserRepository $repoUser)
    {
        $this->manager=$manager;
        $this->encoder=$encoder;
        $this->repoUser=$repoUser;
    }
    public function __invoke(User $data)//toujours $data
    {
        $hash=$this->encoder->encodePassword($data, Shared::DEFAULTPWD);
        $this->repoUser->upgradePassword($data,$hash);
        return $data;
    }
}