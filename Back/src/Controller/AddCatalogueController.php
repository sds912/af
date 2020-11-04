<?php

namespace App\Controller;

use App\Entity\Catalogue;
use App\Repository\CatalogueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;


class AddCatalogueController
{
    private $entityManager;
    private $catalogueRepository;

    public function __construct(EntityManagerInterface $entityManager, CatalogueRepository $catalogueRepository)
    {
        $this->entityManager = $entityManager;
        $this->catalogueRepository = $catalogueRepository;
    }

    public function __invoke(Catalogue $data): Catalogue
    {
        $recordKey = preg_replace('/\s+/', '', sprintf('%s-%s-%s-%s-%s-%s',
            $data->getLibelle(),
            $data->getMarque(),
            $data->getReference(),
            $data->getSpecifites(),
            $data->getFournisseur(),
            $data->getEntreprise()->getId()
        ));

        $catalogue = $this->catalogueRepository->findOneBy(['recordKey' => $recordKey]);

        if ($catalogue) {
            throw new HttpException(409,"Conflit: Une catalogue existe déjà pour cette entreprise.");
        }

        $data->setRecordKey($recordKey);

        return $data;
    }
}