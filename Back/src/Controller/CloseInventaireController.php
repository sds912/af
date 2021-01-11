<?php

namespace App\Controller;

use App\Entity\Inventaire;
use App\Entity\Affectation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;


class CloseInventaireController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function __invoke(Inventaire $data)
    {
        $entreprise = $data->getEntreprise();
        $level = count($entreprise->getSubdivisions()) - 1;

        $affectedLocalites = $this->entityManager->getRepository(Affectation::class)->findByInventaireAndLevel($data->getId(), $level);

        $closedLocs = $data->getClosedLoc();

        $notClosedLoc = [];

        foreach ($affectedLocalites as $affectedLocalite) {
            $localite = $affectedLocalite->getLocalite();
            if (empty($closedLocs) || !in_array($localite->getId(), $closedLocs)) {
                $notClosedLoc[] = ['id' => $localite->getId(), 'nom' => $localite->getNom(), 'arborescence' => $localite->getArborescence()];
            }
        }

        if (!empty($notClosedLoc)) {
            return $notClosedLoc;
        }

        $data->setStatus('close');
        $this->entityManager->flush();

        return $data;
    }
}