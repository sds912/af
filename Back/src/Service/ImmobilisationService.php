<?php

namespace App\Service;

use App\Entity\Immobilisation;
use App\Entity\Entreprise;
use App\Entity\ImportedFile;
use App\Entity\Inventaire;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerInterface;

class ImmobilisationService
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var ContainerInterface
     */
    private $container;

    public function __construct(EntityManagerInterface $entityManager, ContainerInterface $container)
    {
        $this->entityManager = $entityManager;
        $this->container = $container;
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

        // $lastImmobilisation = $this->entityManager->getRepository(Immobilisation::class)->getLastImportedImmobilisation($entreprise->getId());

        $batchSize = 40;

        $insertedCodes = '';

        // if (!$lastImmobilisation) {
        //     $insertedCodes = $lastImmobilisation->getRecordKey();
        // }

        $startDate = new \DateTime('now');

        foreach ($sheetData as $i => $row) {
            $interval = $startDate->diff(new \DateTime('now'));
            error_log(json_encode([$row['A'], $i, $startDate->format('H:i:s'), $interval->format('%h')."h ".$interval->format('%i')."m ".$interval->format('%s')."s"]));

            if (!$row['A'] || !$row['B'] || strpos($insertedCodes, $row['B']) !== false) {   
                continue;
            }

            $insertedCodes .= '-'.$row['B'];

            $immobilisation = $this->createImmobilisation($row);

            $immobilisation->setEntreprise($entreprise)->setInventaire($inventaire)->setRecordKey($insertedCodes);

            try {
                $this->entityManager->persist($immobilisation);

                // flush everything to the database every 40 inserts
                if (($i % $batchSize) == 0) {
                    $this->entityManager->flush();
                    $this->entityManager->clear('App\Entity\Immobilisation');
                }
            } catch (\Throwable $th) {
                if ($this->entityManager->isOpen() === false) {
                    $em = $this->container->get('doctrine')->getManager();
                    $this->entityManager = $em->create(
                        $em->getConnection(),
                        $em->getConfiguration()
                    );
                }
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

    public function getImportProgession($entreprise)
    {
        $importedFiles = $this->entityManager->getRepository(ImportedFile::class)->findBy([
            'entreprise' => $entreprise->getId(),
            'targetTable' => 'immobilisations'
        ], ['id'=>'DESC'], 1, 0);

        if (empty($importedFiles)) {
            return null;
        }

        /** @var ImportedFile */
        $importedFile = $importedFiles[0];

        if ($importedFile->getStatut() == 1) {

            $importedFile->setProgression(100);

            $this->entityManager->flush();

            return $importedFile;
        }

        $totalImmobilisations = $this->entityManager->getRepository(Immobilisation::class)->getCountImmobilisations($entreprise->getId());

        $progression = $importedFile->getProgression();

        if ($importedFile->getTotalItems() != 0) {
            $progression = floor(((int)$totalImmobilisations / (int)$importedFile->getTotalItems()) * 100);
        }

        $importedFile->setProgression($progression);

        $this->entityManager->flush();

        return $progression;
    }
}