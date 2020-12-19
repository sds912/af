<?php

namespace App\Service;

use App\Entity\Immobilisation;
use App\Entity\Entreprise;
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

        $batchSize = 40;

        $insertedCodes = '';

        $startDate = new \DateTime('now');

        foreach ($sheetData as $i => $row) {
            $interval = $startDate->diff(new \DateTime('now'));
            error_log(json_encode([$row['A'], $i, $startDate->format('H:i:s'), $interval->format('%h')."h ".$interval->format('%i')."m ".$interval->format('%s')."s"]));

            if (!$row['A'] || !$row['B'] || strpos($insertedCodes, $row['B']) !== false) {   
                continue;
            }

            $insertedCodes .= '-'.$row['B'];

            $immobilisation = $this->createImmobilisation($row);

            $immobilisation->setEntreprise($entreprise);

            $immobilisation->setInventaire($inventaire);

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
}