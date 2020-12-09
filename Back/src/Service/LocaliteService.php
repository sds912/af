<?php

namespace App\Service;

use App\Entity\Localite;
use App\Entity\Entreprise;
use Doctrine\ORM\EntityManagerInterface;

class LocaliteService
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function saveImportedLocalites(array $sheetData, array $customData)
    {
        /**
         * @var Entreprise
         */
        $entreprise = $this->entityManager->getRepository(Entreprise::class)->find($customData['entreprise']);

        foreach ($sheetData as $data) {
            $row = array_values($data);
            $countRow = count($row);
            $idParent = null;
            $position = [rand(10, 99).'%', rand(10, 99).'%'];
            for ($i=0; $i < $countRow; $i++) {
                $localiteExistant = $this->entityManager->getRepository(Localite::class)->findOneBy([
                    'entreprise' => $entreprise,
                    'level' => $i,
                    'nom' => $row[$i],
                    'parent' => $idParent
                ]);

                if ($localiteExistant) {
                    $idParent = $localiteExistant->getId();
                    $position = [];
                    continue;
                }

                $localite = new Localite();
                $localite
                    ->setNom($row[$i]) 
                    ->setEntreprise($entreprise)
                    ->setCreateur($customData['user'])
                    ->setLevel($i)
                    ->setPosition($position)
                ;
                if ($idParent != null) {
                    $localite->setParent($this->entityManager->getRepository(Localite::class)->find($idParent));
                }

                $this->entityManager->persist($localite); 

                $this->entityManager->flush();

                $idParent = $localite->getId();

                $position = [];
            }
        }
    }
}