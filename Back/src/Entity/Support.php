<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\SupportRepository;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(
 *   normalizationContext={"groups"={"support_read"}},
 *   denormalizationContext={"groups"={"support_write"}},
 *   collectionOperations={
 *     "get",
 *     "post"={
 *       "method"="POST",
 *       "controller"="App\Controller\AddSupportController",
 *       "swagger_context"={
 *         "summary"="Ajout d'un Support",
 *         "description"="Ajout d'un Support"
 *       }
 *     }
 *   }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "licence": "exact"
 * })
 * @ORM\Entity(repositoryClass=SupportRepository::class)
 */
class Support
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"support_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"support_read", "support_write"})
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"support_read", "support_write"})
     */
    private $objet;

    /**
     * @ORM\Column(type="text")
     * @Groups({"support_read", "support_write"})
     */
    private $description;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"support_read", "support_write"})
     */
    private $status;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"support_read", "support_write"})
     */
    private $piecesJointes = [];

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups({"support_read"})
     */
    private $numero;

    /**
     * @ORM\Column(type="json")
     * @Groups({"support_read", "support_write"})
     */
    private $entreprise = [];

    /**
     * @ORM\Column(type="json")
     * @Groups({"support_read", "support_write"})
     */
    private $auteur = [];

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="supports")
     * @Groups({"support_read", "support_write"})
     */
    private $assigner;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"support_read", "support_write"})
     */
    private $satisfaction;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"support_read", "support_write"})
     */
    private $closed;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"support_read"})
     */
    private $startDate;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"support_read"})
     */
    private $closedDate;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"support_read", "support_write"})
     */
    private $licence;

    /**
     * @ORM\Column(type="json")
     */
    private $client = [];

    public function __construct()
    {
        $this->startDate = new \DateTime('now');
        $this->status = 0;
        $this->piecesJointes = [];
        $this->closed = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getObjet(): ?string
    {
        return $this->objet;
    }

    public function setObjet(string $objet): self
    {
        $this->objet = $objet;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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

    public function getPiecesJointes(): ?array
    {
        return $this->piecesJointes;
    }

    public function setPiecesJointes(?array $piecesJointes): self
    {
        $this->piecesJointes = $piecesJointes;

        return $this;
    }

    public function getNumero(): ?string
    {
        return $this->numero;
    }

    public function setNumero(string $numero): self
    {
        $this->numero = $numero;

        return $this;
    }

    public function getEntreprise(): ?array
    {
        return $this->entreprise;
    }

    public function setEntreprise(?array $entreprise): self
    {
        $this->entreprise = $entreprise;

        return $this;
    }

    public function getAuteur(): ?array
    {
        return $this->auteur;
    }

    public function setAuteur(?array $auteur): self
    {
        $this->auteur = $auteur;

        return $this;
    }

    public function getAssigner(): ?User
    {
        return $this->assigner;
    }

    public function setAssigner(?User $assigner): self
    {
        $this->assigner = $assigner;

        return $this;
    }

    public function getSatisfaction(): ?int
    {
        return $this->satisfaction;
    }

    public function setSatisfaction(?int $satisfaction): self
    {
        $this->satisfaction = $satisfaction;

        return $this;
    }

    public function getClosed(): ?bool
    {
        return $this->closed;
    }

    public function setClosed(bool $closed): self
    {
        $this->closed = $closed;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): self
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getClosedDate(): ?\DateTimeInterface
    {
        return $this->closedDate;
    }

    public function setClosedDate(?\DateTimeInterface $closedDate): self
    {
        $this->closedDate = $closedDate;

        return $this;
    }

    public function getLicence(): ?string
    {
        return $this->licence;
    }

    public function setLicence(string $licence): self
    {
        $this->licence = $licence;

        return $this;
    }

    public function getClient(): ?array
    {
        return $this->client;
    }

    public function setClient(array $client): self
    {
        $this->client = $client;

        return $this;
    }
}
