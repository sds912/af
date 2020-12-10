<?php

namespace App\Service;

use App\Entity\Immobilisation;
use App\Entity\Entreprise;
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

        foreach ($sheetData as $row) { 
            $immobilisationExistant = $this->entityManager->getRepository(Immobilisation::class)->findOneBy(['code' => $row['B']]); 
            // make sure that the Immobilisation does not already exists in the db 
            if (!$row['A'] || !$row['B'] || $immobilisationExistant ) {   
                continue;
            }

            $immobilisation = $this->createImmobilisation($row);

            if (!$immobilisation) {
                continue;
            }

            $immobilisation->setEntreprise($entreprise);

            $this->entityManager->persist($immobilisation); 
            
            $this->entityManager->flush(); 
        }
    }

    public function createImmobilisation($row)
    {
        $numeroOrdre = $row['A'] ?: ''; // store the numeroOrdre on each iteration 
        $code = $row['B'] ?: ''; // store the code on each iteration
        $compteImmo = $row['C'] ?: ''; // store the compteImmo on each iteration
        $compteAmort = $row['D'] ?: ''; // store the compteAmort on each iteration
        $emplacement = $row['E'] ?: ''; // store the emplacement on each iteration
        $libelle = $row['F'] ?: ''; // store the libelle on each iteration
        $dateAcquisition = $row['G'] ?: 'now'; // store the dateAcquisition on each iteration
        $dateMiseServ = $row['H'] ?: 'now'; // store the dateMiseServ on each iteration
        $dureeUtilite = $row['I'] ?: ''; // store the dureeUtilite on each iteration
        $taux = $row['J'] ?: ''; // store the taux on each iteration
        $valOrigine = $row['K'] ?: ''; // store the valOrigine on each iteration
        $dotation = $row['L'] ?: ''; // store the dotation on each iteration
        $cumulAmortiss = $row['M'] ?: ''; // store the cumulAmortiss on each iteration
        $vnc = $row['N'] ?: ''; // store the vnc on each iteration
        $etat = $row['O'] ?: ''; // store the etat on each iteration

        $immobilisation = new Immobilisation(); 
        $immobilisation
            ->setNumeroOrdre($numeroOrdre)           
            ->setCode($code)
            ->setCompteImmo($compteImmo)
            ->setCompteAmort($compteAmort)
            ->setEmplacement($emplacement)
            ->setLibelle($libelle)
            ->setDateAcquisition(\DateTime::createFromFormat('d/m/Y', $dateAcquisition))
            ->setDateMiseServ(\DateTime::createFromFormat('d/m/Y', $dateMiseServ))
            ->setDureeUtilite($dureeUtilite)
            ->setTaux(floatval($taux))
            ->setValOrigine(floatval($valOrigine))
            ->setDotation(floatval($dotation))
            ->setCumulAmortiss(floatval($cumulAmortiss))
            ->setVnc(floatval($vnc))
            ->setEtat($etat)
            ->setDescription('')
        ;

        return $immobilisation;
    }
}