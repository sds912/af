<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ExportedFileRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=ExportedFileRepository::class)
 */
class ExportedFile
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $cle;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $fileName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $targetTable;

    /**
     * @ORM\Column(type="integer")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     */
    private $owner;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateExport;

    /**
     * @ORM\ManyToOne(targetEntity=Entreprise::class)
     */
    private $entreprise;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $tmpFile;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCle(): ?string
    {
        return $this->cle;
    }

    public function setCle(string $cle): self
    {
        $this->cle = $cle;

        return $this;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileName(?string $fileName): self
    {
        $this->fileName = $fileName;

        return $this;
    }

    public function getTargetTable(): ?string
    {
        return $this->targetTable;
    }

    public function setTargetTable(string $targetTable): self
    {
        $this->targetTable = $targetTable;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getDateExport(): ?\DateTimeInterface
    {
        return $this->dateExport;
    }

    public function setDateExport(\DateTimeInterface $dateExport): self
    {
        $this->dateExport = $dateExport;

        return $this;
    }

    public function getEntreprise(): ?Entreprise
    {
        return $this->entreprise;
    }

    public function setEntreprise(?Entreprise $entreprise): self
    {
        $this->entreprise = $entreprise;

        return $this;
    }

    public function getTmpFile(): ?string
    {
        return $this->tmpFile;
    }

    public function setTmpFile(?string $tmpFile): self
    {
        $this->tmpFile = $tmpFile;

        return $this;
    }
}
