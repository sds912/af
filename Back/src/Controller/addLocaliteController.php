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
        $localites = $this->localiteRepository->findBy(['level' => $data->getLevel(), 'nom' => $data->getNom()]);

        foreach ($localites as $localite) {
            // Verification si la localité existe déjà
            if ($localite && $localite->getParent() && $data->getParent() && $data->getParent()->getId() == $localite->getParent()->getId()) {
                $data = $localite;
                break;
            }
        }

        return $data;
    }
}