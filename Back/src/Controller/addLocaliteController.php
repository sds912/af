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

        // Verification si la localité existe déjà
        if ($localite && $data->getParent() == $localite->getParent()) {
            return $localite;
        }

        return $data;
    }
}