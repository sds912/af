<?php

namespace App\Controller;

use App\Entity\Localite;
use App\Repository\LocaliteRepository;
use Doctrine\ORM\EntityManagerInterface;


class AddLocaliteController
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
        $localite = $this->localiteRepository->findOneBy([
            'entreprise' => $data->getEntreprise(),
            'level' => $data->getLevel(),
            'nom' => $data->getNom(),
            'parent' => $data->getParent() ? $data->getParent()->getId() : null
        ]);

        if ($localite) {
            return $localite;
        }

        return $data;
    }
}