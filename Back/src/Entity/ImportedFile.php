<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\ImportedFileRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"imported_file_read"}},
 *  denormalizationContext={"groups"={"imported_file_write"}},
 * )
 * @ORM\Entity(repositoryClass=ImportedFileRepository::class)
 */
class ImportedFile
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * 
     * @Groups({"imported_file_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=150)
     * @Assert\NotBlank
     * 
     * @Groups({"imported_file_read"})
     */
    private $targetTable;

    /**
     * @ORM\Column(type="integer")
     * 
     * @Groups({"imported_file_read"})
     */
    private $statut;

    /**
     * @ORM\Column(type="integer")
     * 
     * @Groups({"imported_file_read"})
     */
    private $progression;

    /**
     * @ORM\Column(type="json", nullable=true)
     * 
     * @Groups({"imported_file_read"})
     */
    private $log = [];

    /**
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank
     * 
     * @Groups({"imported_file_read"})
     */
    private $fileName;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="imports")
     * @ORM\JoinColumn(onDelete="SET NULL")
     * 
     * @Groups({"imported_file_read"})
     */
    private $user;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateImport;

    /**
     * @ORM\Column(type="integer")
     */
    private $totalItems;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getStatut(): ?int
    {
        return $this->statut;
    }

    public function setStatut(int $statut): self
    {
        $this->statut = $statut;

        return $this;
    }

    public function getProgression(): ?int
    {
        return $this->progression;
    }

    public function setProgression(int $progression): self
    {
        $this->progression = $progression;

        return $this;
    }

    public function getLog(): ?array
    {
        return $this->log;
    }

    public function setLog(?array $log): self
    {
        $this->log = $log;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getDateImport(): ?\DateTimeInterface
    {
        return $this->dateImport;
    }

    public function setDateImport(\DateTimeInterface $dateImport): self
    {
        $this->dateImport = $dateImport;

        return $this;
    }

    public function getTotalItems(): ?int
    {
        return $this->totalItems;
    }

    public function setTotalItems(int $totalItems): self
    {
        $this->totalItems = $totalItems;

        return $this;
    }
}
