<?php

namespace App\Controller;

use App\Entity\Entreprise;
use App\Entity\ExportedFile;
use App\Entity\Inventaire;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Message\ExportedFileMessage;
use App\Utils\Shared;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Messenger\MessageBusInterface;

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
     * @var MessageBusInterface
     */
    private $busDispatcher;


    public function __construct(
        EntityManagerInterface $entityManager,
        TokenStorageInterface $tokenStorage,
        MessageBusInterface $busDispatcher
    ) {
        $this->entityManager = $entityManager;

        $this->user = $tokenStorage->getToken()->getUser();

        $this->busDispatcher = $busDispatcher;
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

        $downloadKey = $data['cle'];

        $this->validateEntreprise($entreprise);
        $customData['entreprise'] = $entreprise->getId();

        if ($inventaire != '') {
            $this->validateInventaire($inventaire);
            $customData['inventaire'] = $inventaire->getId();
        }

        if ($downloadKey != '') {
            return $this->downloadFile($downloadKey);
        }

        $bytes = random_bytes(15);
        $exportedFile = new ExportedFile();
        $exportedFile
            ->setCle(bin2hex($bytes))
            ->setTargetTable($table)
            ->setStatus(0)
            ->setOwner($this->user)
            ->setDateExport(new \DateTime('now'))
            ->setEntreprise($entreprise)
        ;

        $this->entityManager->persist($exportedFile);
        $this->entityManager->flush();

        // Dispatch message exported file created
        $this->busDispatcher->dispatch(new ExportedFileMessage($exportedFile->getId(), $customData));

        return ['status' => 1, 'cle' => $exportedFile->getCle()];
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

    public function downloadFile($downloadKey) {
        $exportedFile = $this->entityManager->getRepository(ExportedFile::class)->findOneBy(['cle' => $downloadKey]);

        if (!$exportedFile) {
            throw new HttpException(404, 'Cette exportation n\'existe pas ou a été supprimé.');
        }

        if ($exportedFile->getStatus() == 1) {
            $fileName = $exportedFile->getFileName();
            $tempFile = $exportedFile->getTmpFile();
            $this->entityManager->remove($exportedFile);
            $this->entityManager->flush();

            $content_file = file_get_contents($tempFile);

            unlink($tempFile);

            return ['file' => base64_encode($content_file), 'fileName' => $fileName];
        }

        return ['file' => '', 'fileName' => ''];
    }
}