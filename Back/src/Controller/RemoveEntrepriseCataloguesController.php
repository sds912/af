<?php

namespace App\Controller;

use App\Entity\Entreprise;
use App\Repository\EntrepriseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;


class RemoveEntrepriseCataloguesController
{
    private $entityManager;
    private $entrepriseRepository;

    public function __construct(EntityManagerInterface $entityManager, EntrepriseRepository $entrepriseRepository)
    {
        $this->entityManager = $entityManager;
        $this->entrepriseRepository = $entrepriseRepository;
    }

    public function __invoke(Entreprise $data): Entreprise
    {
        $catalogues = $data->getCatalogues();

        foreach ($catalogues as $catalogue) {
            $data->removeCatalogue($catalogue);
        }

        $this->entityManager->flush();

        return $data;
    }
}