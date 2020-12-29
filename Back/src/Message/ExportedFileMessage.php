<?php

namespace App\Message;

class ExportedFileMessage
{
    /**
     * @var int
     */
    private $exportedFile;

    /**
     * @var array
     */
    private $customData;

    public function __construct(int $exportedFile, array $customData = [])
    {
        $this->exportedFile = $exportedFile;

        $this->customData = $customData;
    }

    /**
     * @return int|null
     */
    public function getExportedFile()
    {
        return $this->exportedFile;
    }

    /**
     * @return array|null
     */
    public function getCustomData()
    {
        return $this->customData;
    }
}