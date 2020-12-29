<?php

namespace App\MessageHandler;

use App\Entity\ExportedFile;
use App\Message\ExportedFileMessage;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;
use App\Service\ImmobilisationService;
use Doctrine\ORM\EntityManagerInterface;

class ExportedFileMessageHandler implements MessageHandlerInterface
{
    /**
     * @var ImmobilisationService
     */
    private $immobilisationService;

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(
        ImmobilisationService $immobilisationService,
        EntityManagerInterface $entityManager
    )
    {
        $this->immobilisationService = $immobilisationService;

        $this->entityManager = $entityManager;
    }

    public function __invoke(ExportedFileMessage $message)
    {
        /**
         * @var ExportedFile
         */
        $exportedFile = $this->entityManager->getRepository(ExportedFile::class)->find($message->getExportedFile());

        if (!$exportedFile || $exportedFile->getStatus() != 0) {
            return;
        }

        $customData = $message->getCustomData();

        if ($exportedFile->getTargetTable() == 'immobilisations') {
            $file = $this->immobilisationService->exportImmobilisations($customData['entreprise'], $customData['inventaire']);
        }

        $exportedFile->setFileName($file['fileName'])->setTmpFile($file['tempFile'])->setStatus(1);
        $this->entityManager->flush();
    }
}