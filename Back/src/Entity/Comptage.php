<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ComptageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *  normalizationContext={"groups"={"comptage_read"}},
 *  denormalizationContext={"groups"={"comptage_write"}},
 * )
 * @ORM\Entity(repositoryClass=ComptageRepository::class)
 */
class Comptage
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * 
     * @Groups({"comptage_read","entreprise_read", "mobile_inv_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Inventaire::class)
     * 
     * @Groups({"comptage_read", "comptage_write","entreprise_read", "mobile_inv_read"})
     */
    private $inventaire;

    /**
     * @ORM\ManyToOne(targetEntity=Immobilisation::class, inversedBy="comptages")
     * 
     * @Groups({"comptage_read", "comptage_write","entreprise_read", "mobile_inv_read"})
     */
    private $immobilisation;

    /**
     * @ORM\ManyToOne(targetEntity=Localite::class)
     * 
     * @Groups({"comptage_read", "comptage_write","entreprise_read", "mobile_inv_read"})
     */
    private $localite;

    /**
     * @ORM\Column(type="integer")
     * 
     * @Groups({"comptage_read", "comptage_write","entreprise_read", "mobile_inv_read"})
     */
    private $etat;

    /**
     * @ORM\Column(type="integer")
     * 
     * @Groups({"comptage_read", "comptage_write","entreprise_read", "mobile_inv_read"})
     */
    private $statut;

    /**
     * @ORM\Column(type="datetime")
     * 
     * @Groups({"comptage_read", "comptage_write","entreprise_read", "mobile_inv_read"})
     */
    private $dateCreation;

    /**
     * @ORM\Column(type="json")
     */
    private $lecteur = [];

    public function __construct()
    {
        $this->dateCreation = new \DateTime('now');
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInventaire(): ?Inventaire
    {
        return $this->inventaire;
    }

    public function setInventaire(?Inventaire $inventaire): self
    {
        $this->inventaire = $inventaire;

        return $this;
    }

    public function getImmobilisation(): ?Immobilisation
    {
        return $this->immobilisation;
    }

    public function setImmobilisation(?Immobilisation $immobilisation): self
    {
        $this->immobilisation = $immobilisation;

        return $this;
    }

    public function getLocalite(): ?Localite
    {
        return $this->localite;
    }

    public function setLocalite(?Localite $localite): self
    {
        $this->localite = $localite;

        return $this;
    }

    public function getEtat(): ?int
    {
        return $this->etat;
    }

    public function setEtat(int $etat): self
    {
        $this->etat = $etat;

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

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): self
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function getLecteur(): ?array
    {
        return $this->lecteur;
    }

    public function setLecteur(array $lecteur): self
    {
        $this->lecteur = $lecteur;

        return $this;
    }
}
