<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Utils\Shared;

class AppFixtures extends Fixture
{
    private $encoder;
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder=$encoder;
    }
    public function load(ObjectManager $manager)
    {
        $membres=[
            ["admin",["ROLE_Admin"]]
        ];
        for($i=0;$i<count($membres);$i++){
            $m=$membres[$i];
            $user=$user=new User();
            $user->setUsername($m[0])->setRoles($m[1])
                 ->setPassword($this->encoder->encodePassword($user, Shared::DEFAULTPWD))
                 ->setImage(Shared::IMAGEDEFAULT)
                 ->setStatus(Shared::ACTIF);
            $manager->persist($user);
        }
        $manager->persist($user);
        $manager->flush();
    }
}
