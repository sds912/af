<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CatalogueRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *   normalizationContext={"groups"={"catalogue_read"}},
 *   denormalizationContext={"groups"={"catalogue_write"}},
 *   collectionOperations={
 *     "get",
 *     "post"={
 *       "method"="POST",
 *       "controller"="App\Controller\AddCatalogueController",
 *       "swagger_context"={
 *         "summary"="Ajout d'un catalogue",
 *         "description"="Ajout d'un catalogue"
 *       }
 *     }
 *   }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *   "catalogue.libelle": "partial",
 *   "entreprise": "exact"
 * })
 * @ORM\Entity(repositoryClass=CatalogueRepository::class)
 */
class Catalogue
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"catalogue_read","entreprise_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"catalogue_read", "catalogue_write","entreprise_read"})
     */
    private $libelle;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Groups({"catalogue_read", "catalogue_write","entreprise_read"})
     */
    private $marque;

    /**
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Groups({"catalogue_read", "catalogue_write","entreprise_read"})
     */
    private $reference;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"catalogue_read", "catalogue_write","entreprise_read"})
     */
    private $specifites;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"catalogue_read", "catalogue_write","entreprise_read"})
     */
    private $fournisseur;

    /**
     * @ORM\ManyToOne(targetEntity=Entreprise::class, inversedBy="catalogues")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"catalogue_read", "catalogue_write","entreprise_read"})
     */
    private $entreprise;

    /**
     * @ORM\Column(type="text")
     */
    private $recordKey;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getMarque(): ?string
    {
        return $this->marque;
    }

    public function setMarque(string $marque): self
    {
        $this->marque = $marque;

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }

    public function getSpecifites(): ?string
    {
        return $this->specifites;
    }

    public function setSpecifites(string $specifites): self
    {
        $this->specifites = $specifites;

        return $this;
    }

    public function getFournisseur(): ?string
    {
        return $this->fournisseur;
    }

    public function setFournisseur(string $fournisseur): self
    {
        $this->fournisseur = $fournisseur;

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

    public function getRecordKey(): ?string
    {
        return $this->recordKey;
    }

    public function setRecordKey(string $recordKey): self
    {
        $this->recordKey = $recordKey;

        return $this;
    }
}
