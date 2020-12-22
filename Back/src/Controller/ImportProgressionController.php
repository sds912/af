<?php

namespace App\Controller;

use App\Entity\ImportedFile;
use App\Entity\Entreprise;
use App\Entity\Inventaire;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\FileUploader;
use App\Entity\User;
use App\Message\ImportedFileMessage;
use App\Service\ImmobilisationService;
use App\Utils\Shared;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Messenger\MessageBusInterface;

class ImportProgressionController
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
        $table = $request->query->get('table');
        $entreprise = $request->query->get('entreprise');

        if (!$table || !$entreprise) {
            throw new HttpException(400,'Le nom de la table et de l\'entreprise sont obligatoires.');
        }

        $this->validateEntreprise($entreprise);

        switch ($table) {
            case 'immobilisations':
                $importedFile = $this->immobilisationService->getImportProgession($entreprise);
                break;

            default:
                $importedFile = null;
                break;
        }

        return $importedFile;
    }

    public function validateEntreprise(&$idEntreprise)
    {
        $entreprise = $this->entityManager->getRepository(Entreprise::class)->find($idEntreprise);

        if (!$entreprise || (!$this->user->hasRoles(Shared::ROLE_ADMIN) && !$this->user->inEntreprise($entreprise)) ) {
            throw new HttpException(404, 'Cette entreprise n\'existe pas ou a été supprimé.');
        }

        $idEntreprise = $entreprise;
    }
}