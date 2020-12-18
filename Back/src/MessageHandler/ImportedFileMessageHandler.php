<?php

namespace App\MessageHandler;

use App\Entity\ImportedFile;
use App\Entity\Inventaire;
use App\Message\ImportedFileMessage;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;
use App\Service\ImmobilisationService;
use App\Service\LocaliteService;
use App\Service\UserService;
use App\Service\XslxManager;
use App\Service\CatalogueService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\EntityManagerInterface;

class ImportedFileMessageHandler implements MessageHandlerInterface
{
    /**
     * @var ImmobilisationService
     */
    private $immobilisationService;

    /**
     * @var UserService
     */
    private $userService;

    /**
     * @var LocaliteService
     */
    private $localiteService;

    /**
     * @var CatalogueService
     */
    private $catalogueService;

    /**
     * @var XslxManager
     */
    private $xslxManager;

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(
        ImmobilisationService $immobilisationService,
        UserService $userService,
        XslxManager $xslxManager,
        ContainerInterface $container,
        EntityManagerInterface $entityManager,
        LocaliteService $localiteService,
        CatalogueService $catalogueService
    )
    {
        $this->immobilisationService = $immobilisationService;

        $this->userService = $userService;

        $this->localiteService = $localiteService;

        $this->xslxManager = $xslxManager;

        $this->container = $container;

        $this->entityManager = $entityManager;

        $this->catalogueService = $catalogueService;
    }

    public function __invoke(ImportedFileMessage $message)
    {
        /**
         * @var ImportedFile
         */
        $importedFile = $this->entityManager->getRepository(ImportedFile::class)->find($message->getImportedFile());

        if (!$importedFile || $importedFile->getStatut() != 0) {
            return;
        }

        $sheetData = $this->xslxManager->getDataToArray($this->getUploadDirectory().'/'.$importedFile->getFileName());

        $importedFile->setTotalItems(count($sheetData));
        $this->entityManager->flush();

        $customData = $message->getCustomData();
        $customData['user'] = $importedFile->getUser();

        switch ($importedFile->getTargetTable()) {
            case 'immobilisations':
                $this->immobilisationService->saveImportedImmobilisations($sheetData, $customData);
                break;

            case 'agents':
                $this->userService->saveImportedAgents($sheetData, $customData);
                break;

            case 'localites':
                $this->localiteService->saveImportedLocalites($sheetData, $customData);
                break;

            case 'catalogues':
                $this->catalogueService->saveImportedCatalogues($sheetData, $customData);
                break;

            default:
                $this->entityManager->remove($importedFile);
                break;
        }

        $importedFile->setStatut(1);
        $this->entityManager->flush();
    }

    public function getUploadDirectory()
    {
        return $this->container->getParameter('uploads_directory');
    }
}