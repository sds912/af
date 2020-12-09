<?php

namespace App\Controller;

use App\Entity\ImportedFile;
use App\Entity\Entreprise;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\FileUploader;
use App\Entity\User;
use App\Message\ImportedFileMessage;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Messenger\MessageBusInterface;

class ImportController
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var FileUploader
     */
    private $fileUploader;

    /**
     * @var User
     */
    private $user;

    /**
     * @var MessageBusInterface
     */
    private $busDispatcher;

    public function __construct(
        EntityManagerInterface $entityManager,
        FileUploader $fileUploader,
        TokenStorageInterface $tokenStorage, 
        MessageBusInterface $busDispatcher
    ) {
        $this->entityManager = $entityManager;

        $this->fileUploader = $fileUploader;

        $this->user = $tokenStorage->getToken()->getUser();

        $this->busDispatcher = $busDispatcher;
    }

    public function __invoke(Request $request)
    {
        $file = $request->files->get('file');
        $table = $request->request->get('table');

        if (!$table || !$file) {
            throw new HttpException(400,'Le nom de la table et le fichier sont obligatoires.');
        }

        $entreprise = $request->request->get('entreprise');
        $this->validateEntreprise($entreprise);

        try {
            $xlsFileName = $this->fileUploader->upload($file);

        } catch (\Throwable $th) {
            return ['Erreur: Le fichier importé n\'est pas un fichier excel ou est invalide.'];
        }

        // Create imported file
        $importedFile = new ImportedFile();
        $importedFile
            ->setFileName($xlsFileName)
            ->setTargetTable($table)
            ->setStatut(0)
            ->setProgression(0)
            ->setUser($this->user)
            ->setDateImport(new \DateTime('now'))
        ;

        $this->entityManager->persist($importedFile);
        $this->entityManager->flush();

        // Dispatch message imported file created
        $this->busDispatcher->dispatch(new ImportedFileMessage($importedFile->getId(), ['entreprise' => $entreprise->getId()]));

        return ['Fichier importé avec succès'];
    }

    public function validateEntreprise(&$idEntreprise)
    {
        $entreprise = $this->entityManager->getRepository(Entreprise::class)->find($idEntreprise);

        if (!$entreprise || !$this->user->inEntreprise($entreprise) ) {
            throw new HttpException(404,'Cette entreprise n\'existe pas ou a été supprimé.');
        }

        $idEntreprise = $entreprise;
    }
}