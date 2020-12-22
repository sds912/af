<?php

namespace App\Controller;

use App\Entity\Entreprise;
use App\Entity\Inventaire;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Service\ImmobilisationService;
use App\Utils\Shared;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ExportController
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var User
     */
    private $user;

    /**
     * @var ImmobilisationService
     */
    private $immobilisationService;


    public function __construct(
        EntityManagerInterface $entityManager,
        TokenStorageInterface $tokenStorage,
        ImmobilisationService $immobilisationService
    ) {
        $this->entityManager = $entityManager;

        $this->user = $tokenStorage->getToken()->getUser();

        $this->immobilisationService = $immobilisationService;
    }

    public function __invoke(Request $request)
    {
        $data = Shared::getData($request);

        $table = $data['table'];
        $entreprise = $data['entreprise'];

        if (!$table || !$entreprise) {
            throw new HttpException(400,'Le nom de la table et de l\'entreprise sont obligatoires.');
        }

        $inventaire = $data['inventaire'];

        $this->validateEntreprise($entreprise);

        if ($inventaire != '') {
            $this->validateInventaire($inventaire);
        }

        try {
            switch ($table) {
                case 'immobilisations':
                    $file = $this->immobilisationService->exportImmobilisations($entreprise, $inventaire, $data);
                    break;
    
                default:
                    $file = null;
                    break;
            }

            $fileName = $file['fileName'];

            $temp_file = $file['temp_file'];

        } catch (\Throwable $th) {
            return ['Erreur: '.$th->getMessage()];
        }

        return ['file' => base64_encode(file_get_contents($temp_file)), 'fileName' => $fileName];
    }

    public function validateEntreprise(&$idEntreprise)
    {
        $entreprise = $this->entityManager->getRepository(Entreprise::class)->find($idEntreprise);

        if (!$entreprise || (!$this->user->hasRoles(Shared::ROLE_ADMIN) && !$this->user->inEntreprise($entreprise)) ) {
            throw new HttpException(404, 'Cette entreprise n\'existe pas ou a été supprimé.');
        }

        $idEntreprise = $entreprise;
    }

    public function validateInventaire(&$idInventaire)
    {
        $inventaire = $this->entityManager->getRepository(Inventaire::class)->find($idInventaire);

        if (!$inventaire || (!$this->user->hasRoles(Shared::ROLE_ADMIN) && !$this->user->inEntreprise($inventaire->getEntreprise())) ) {
            throw new HttpException(404, 'Cette entreprise n\'existe pas ou a été supprimé.');
        }

        $idInventaire = $inventaire;
    }
}