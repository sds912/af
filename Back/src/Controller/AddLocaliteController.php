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
        $localites = $this->localiteRepository->findBy(['level' => $data->getLevel(), 'nom' => $data->getNom()]);

        foreach ($localites as $localite) {            
            // Si le localite existe déjà et qu'il n'a pas de parent
            $localiteHasNotParent = $localite && !$localite->getParent();

            // Si le localite existe déjà et qu'il a de parent
            $localiteHasParent = $localite && $localite->getParent() && $data->getParent() && $data->getParent()->getId() == $localite->getParent()->getId();

            if ($localiteHasNotParent || $localiteHasParent) {
                $data = $localite;
                break;
            }
        }

        return $data;
    }
}