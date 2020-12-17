<?php

namespace App\Service;

use App\Entity\Immobilisation;
use App\Entity\Entreprise;
use App\Entity\Inventaire;

use Doctrine\ORM\EntityManagerInterface;

class ImmobilisationService
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function saveImportedImmobilisations(array $sheetData, array $customData)
    {
        /**
         * @var Entreprise
         */
        $entreprise = $this->entityManager->getRepository(Entreprise::class)->find($customData['entreprise']);

        /**
         * @var Inventaire
         */
        $inventaire = $this->entityManager->getRepository(Inventaire::class)->find($customData['inventaire']);

        $batchSize = 20;

        foreach ($sheetData as $i => $row) {
            error_log(json_encode([$row['A'], $i]));

            if (!$row['A'] || !$row['B']) {   
                continue;
            }

            $immobilisation = $this->createImmobilisation($row);

            $immobilisation->setEntreprise($entreprise);

            $immobilisation->setInventaire($inventaire);

            $this->entityManager->persist($immobilisation);

            // flush everything to the database every 20 inserts
            if (($i % $batchSize) == 0) {
                try {
                    $this->entityManager->flush();
                    $this->entityManager->clear('Immobilisation');
                } catch (\Throwable $th) {
                    continue;
                }
            }
        }
        try {
            $this->entityManager->flush();
            $this->entityManager->clear('Immobilisation');
        } catch (\Throwable $th) {
            // error
        }
    }

    public function createImmobilisation($row)
    {
        $immobilisation = new Immobilisation(); 
        $immobilisation
            ->setNumeroOrdre($row['A'])           
            ->setCode($row['B'])
            ->setCompteImmo($row['C'])
            ->setCompteAmort($row['D'])
            ->setEmplacement($row['E'])
            ->setLibelle($row['F'])
            ->setDateAcquisition(\DateTime::createFromFormat('d/m/Y', $row['G']?: 'now'))
            ->setDateMiseServ(\DateTime::createFromFormat('d/m/Y', $row['H'] ?: 'now'))
            ->setDureeUtilite($row['I'])
            ->setTaux(floatval($row['J']))
            ->setValOrigine(floatval($row['K']))
            ->setDotation(floatval($row['L']))
            ->setCumulAmortiss(floatval($row['M']))
            ->setVnc(floatval($row['N']))
            ->setEtat($row['O'])
            ->setDescription('')
        ;

        return $immobilisation;
    }
}