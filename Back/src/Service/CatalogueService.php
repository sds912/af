<?php

namespace App\Service;

use App\Entity\Catalogue;
use App\Entity\Entreprise;
use Doctrine\ORM\EntityManagerInterface;

class CatalogueService
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function saveImportedCatalogues(array $sheetData, array $customData)
    {
        /**
         * @var Entreprise
         */
        $entreprise = $this->entityManager->getRepository(Entreprise::class)->find($customData['entreprise']);

        foreach ($sheetData as $row) {
            // make sure that the username is informed
            if (empty($row['A']) || empty($row['B']) || empty($row['C']) || empty($row['D']) || empty($row['E'])) {
                continue;
            }

            $recordKey = preg_replace('/\s+/', '', sprintf('%s-%s-%s-%s-%s-%s',
                $row['A'],
                $row['B'],
                $row['C'],
                $row['D'],
                $row['E'],
                $entreprise->getId()
            ));

            $catalogueExistant = $this->entityManager->getRepository(Catalogue::class)->findOneBy(['recordKey' => $recordKey]);

            // make sure that the catalogue does not already exists in the db 
            if ($catalogueExistant) {   
                continue;
            }

            $catalogue = $this->createCatalogue($row);

            if (!$catalogue) {
                continue;
            }

            $catalogue->setEntreprise($entreprise)->setRecordKey($recordKey);
            
            $this->entityManager->persist($catalogue); 
            
            $this->entityManager->flush(); 
        }
    }

    public function createCatalogue($row)
    {
        $libelle = $row['A']; // store the libelle on each iteration 
        $marque = $row['B']; // store the marque on each iteration 
        $reference = $row['C']; // store the reference on each iteration
        $specifites = $row['D']; // store the specifites on each iteration
        $fournisseur = $row['E']; // store the fournisseur on each iteration

        $agent = new Catalogue(); 
        $agent
            ->setLibelle($libelle) 
            ->setMarque($marque)           
            ->setReference($reference)
            ->setSpecifites($specifites)
            ->setFournisseur($fournisseur)
        ;

        return $agent;
    }
}