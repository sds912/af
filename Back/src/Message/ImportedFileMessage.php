<?php

namespace App\Message;

class ImportedFileMessage
{
    /**
     * @var int
     */
    private $importedFile;

    /**
     * @var array
     */
    private $customData;

    public function __construct(int $importedFile, array $customData = [])
    {
        $this->importedFile = $importedFile;

        $this->customData = $customData;
    }

    /**
     * @return int|null
     */
    public function getImportedFile()
    {
        return $this->importedFile;
    }

    /**
     * @return array|null
     */
    public function getCustomData()
    {
        return $this->customData;
    }
}