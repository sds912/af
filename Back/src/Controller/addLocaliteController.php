<?php

namespace App\Controller;

use App\Entity\Localite;
use App\Repository\LocaliteRepository;
use Doctrine\ORM\EntityManagerInterface;


class addLocaliteController
{
    private $entityManager;
    private $localiteRepository;

    public function __construct(EntityManagerInterface $entityManager, LocaliteRepository $localiteRepository)
    {
        $this->entityManager = $entityManager;
        $this->localiteRepository = $localiteRepository;
    }

    public function __invoke(Localite $data): Localite
    {
        $localite = $this->localiteRepository->findOneBy(['level' => $data->getLevel(), 'nom' => $data->getNom()]);

        $duplicateColumn = $localite && $data->getLastLevel() != true;
        $duplicateLine = $localite && $data->getLastLevel() == true && $data->getParent() == $localite->getParent();

        // Verification si la localité existe déjà
        if ($duplicateColumn || $duplicateLine) {
            return $localite;
        }

        return $data;
    }
}