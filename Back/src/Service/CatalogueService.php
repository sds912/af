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

        $batchSize = 40;

        $insertedKey = '';

        foreach ($sheetData as $i => $row) {
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

            // make sure that the catalogue does not already exists in the db 
            if (strpos($insertedKey, $recordKey) !== false) {   
                continue;
            }

            $insertedKey .= '-'.$recordKey;

            $catalogue = $this->createCatalogue($row);

            $catalogue->setEntreprise($entreprise)->setRecordKey($recordKey);

            try {
                $this->entityManager->persist($catalogue);

                // flush everything to the database every 40 inserts
                if (($i % $batchSize) == 0) {
                    $this->entityManager->flush();
                    $this->entityManager->clear('App\Entity\Catalogue');
                }
            } catch (\Throwable $th) {
                if ($this->entityManager->isOpen() === false) {
                    $em = $this->container->get('doctrine')->getManager();
                    $this->entityManager = $em->create(
                        $em->getConnection(),
                        $em->getConfiguration()
                    );
                }
                // error_log($th->getMessage());
                continue;
            }
        }
        try {
            $this->entityManager->flush();
            $this->entityManager->clear('App\Entity\Immobilisation');
        } catch (\Throwable $th) {
            // error
        }
    }

    public function createCatalogue($row)
    {
        $agent = new Catalogue(); 
        $agent
            ->setLibelle($row['A']) 
            ->setMarque($row['B'])           
            ->setReference($row['C'])
            ->setSpecifites($row['D'])
            ->setFournisseur($row['E'])
        ;

        return $agent;
    }
}