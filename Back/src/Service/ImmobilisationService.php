<?php

namespace App\Service;

use App\Entity\Immobilisation;
use App\Entity\Entreprise;
use App\Entity\ImportedFile;
use App\Entity\Inventaire;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerInterface;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Color;

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

    public function exportImmobilisations($entreprise, $inventaire, $data)
    {
        $immobilisations = $this->entityManager->getRepository(Immobilisation::class)->findBy([
            'entreprise' => $entreprise->getId(),
            'inventaire' => $inventaire->getId()
        ], ['id' => 'ASC'], 1000, 0);

        $head = ["Numéro d'ordre","Code","Compte d'immobilisation","Compte d'amortissement","Emplacement théorique","Description","Date d'acquisition","Date de mise en service","Durée d'utilité","Taux","Valeur d'origine","Dotation de l'exercice","Amortissements cumulés","VNC","Etat du bien théorique","Statut du bien","Etat réel du bien","Emplacement réel","ID localité","Lecteur","Date de comptage"];
        $alphabets = range('A', 'Z');

        $spreadsheet = new Spreadsheet();
        $sheetColor = new Color();
        
        /** @var $sheet \PhpOffice\PhpSpreadsheet\Writer\Xlsx\Worksheet */
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle("Immobilisations");

        foreach ($head as $key => $value) {
            $letter = $alphabets[$key];
            $sheet->setCellValue($letter.'1', $value);
            $sheet->getColumnDimension($letter)->setAutoSize(true);
        }
        $sheet->getStyle('A:U')->getAlignment()->setHorizontal('center');

        $row = 1;
        foreach ($immobilisations as $immobilisation) {
            $row++;
            $this->addRow($sheet, $row, $immobilisation);
            // $sheet->getStyle('A'.$row.':U'.$row)->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FF0000FF');
            $sheet->getStyle('A'.$row.':U'.$row)->getFont()->getColor()->setARGB($sheetColor::COLOR_BLACK);
        }
        
        // Create your Office 2007 Excel (XLSX Format)
        $writer = new Xlsx($spreadsheet);
        
        // Create a Temporary file in the system
        $fileName = 'fichier_des_immobilisations_ajuste_au_'.$inventaire->getDateInv()->format('d-M-Y').'.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $fileName);
        
        // Create the excel file in the tmp directory of the system
        $writer->save($temp_file);

        return ['fileName' => $fileName, 'temp_file' => $temp_file];
    }

    public function addRow(&$sheet, $row, $immobilisation)
    {
        $sheet->setCellValue('A'.$row, $immobilisation->getNumeroOrdre());
        $sheet->setCellValue('B'.$row, $immobilisation->getCode());
        $sheet->setCellValue('C'.$row, $immobilisation->getCompteImmo());
        $sheet->setCellValue('D'.$row, $immobilisation->getCompteAmort());
        $sheet->setCellValue('E'.$row, $immobilisation->getEmplacement());
        $sheet->setCellValue('F'.$row, $immobilisation->getEndLibelle());
        $sheet->setCellValue('G'.$row, $immobilisation->getDateAcquisition()->format('dd/M/Y'));
        $sheet->setCellValue('H'.$row, $immobilisation->getDateMiseServ()->format('dd/M/Y'));
        $sheet->setCellValue('I'.$row, $immobilisation->getDureeUtilite());
        $sheet->setCellValue('J'.$row, $immobilisation->getTaux() ?? 0);
        $sheet->setCellValue('K'.$row, $immobilisation->getValOrigine() ?? 0);
        $sheet->setCellValue('L'.$row, $immobilisation->getDotation() ?? 0);
        $sheet->setCellValue('M'.$row, $immobilisation->getCumulAmortiss() ?? 0);
        $sheet->setCellValue('N'.$row, $immobilisation->getVnc() ?? 0);
        $sheet->setCellValue('O'.$row, $immobilisation->getEtat());
        $sheet->setCellValue('P'.$row, $this->getStatus($immobilisation->getStatus()));
        $sheet->setCellValue('Q'.$row, $immobilisation->getEndEtat() == 0 ? 'Mauvais état' : 'Bon état');
        $sheet->setCellValue('R'.$row, $immobilisation->getLocalite() ? $immobilisation->getLocalite()->getName() : "");
        $sheet->setCellValue('S'.$row, $immobilisation->getLocalite() ? $immobilisation->getLocalite()->getId() : "");
        $sheet->setCellValue('T'.$row, $immobilisation->getLecteur() ? $immobilisation->getLecteur()->getNom() : "");
        $sheet->setCellValue('U'.$row, $immobilisation->getDateLecture() ? $immobilisation->getDateLecture()->format('dd/M/Y') : "");
    }

    public function getStatus($status)
    {
        if ($status == null) {
            return "Immobilisations non scannées";
        }

        switch ($status) {
            case 0:
                $text="Immobilisations scannées non réconciliées";
                break;
            case 1:
                $text="Immobilisations scannées réconciliées";
                break;
            case 2:
                $text="Immobilisations rajoutées";
                break;
            case 3:
                $text="Immobilisations avec un code barre défectueux";
                break;
            default:
                $text="Immobilisations non scannées";
                break;
        }
        return $text;
    }
}