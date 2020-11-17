<?php

namespace App\Controller;

use App\Entity\Support;
use App\Entity\Parametres;
use App\Form\SupportType;
use App\Repository\SupportRepository;
use App\Repository\ParametresRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;



class AddSupportController
{
    private $entityManager;
    private $supportRepository;
    private $parametresRepository;

    public function __construct(EntityManagerInterface $entityManager, SupportRepository $supportRepository, ParametresRepository $parametresRepository)
    {
        $this->entityManager = $entityManager;
        $this->supportRepository = $supportRepository;
        $this->parametresRepository = $parametresRepository;
    }

    public function __invoke(Support $data): Support
    {
        $data->setNumero($this->generateNumero());

        return $data;
    }

    public function generateNumero()
    {
        $lastNumero = 600000;

        $parametre = $this->parametresRepository->findOneBy([]);
        
        if (!$parametre) {
            $parametre = new Parametres();
            $parametre->setLastNumero($lastNumero);
            $this->entityManager->persist($parametre);
        }

        $lastNumero = $parametre->getLastNumero();

        if (strpos(strval($lastNumero), "99999")) {
            $index = intval(substr(strval($lastNumero), 0, 1)) + 2;
            $lastNumero = intval($index+"00000");
        }

        $lastNumero++;

        $parametre->setLastNumero($lastNumero);
        $this->entityManager->flush();

        return $lastNumero;
    }
}