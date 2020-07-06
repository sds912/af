<?php

namespace App\Entity;

use App\Repository\ZoneRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ZoneRepository::class)
 * @ApiResource()
 */
class Zone
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"entreprise_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $adresse;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"entreprise_read"})
     */
    private $nom;

    /**
     * @ORM\ManyToOne(targetEntity=Localite::class, inversedBy="zones")
     */
    private $localite;

    /**
     * @ORM\OneToMany(targetEntity=SousZone::class, mappedBy="zone")
     * @Groups({"entreprise_read"})
     */
    private $sousZones;

    public function __construct()
    {
        $this->sousZones = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): self
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

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

    /**
     * @return Collection|SousZone[]
     */
    public function getSousZones(): Collection
    {
        return $this->sousZones;
    }

    public function addSousZones(SousZone $sousZones): self
    {
        if (!$this->sousZones->contains($sousZones)) {
            $this->sousZones[] = $sousZones;
            $sousZones->setZone($this);
        }

        return $this;
    }

    public function removeSousZones(SousZone $sousZones): self
    {
        if ($this->sousZones->contains($sousZones)) {
            $this->sousZones->removeElement($sousZones);
            // set the owning side to null (unless already changed)
            if ($sousZones->getZone() === $this) {
                $sousZones->setZone(null);
            }
        }

        return $this;
    }
}
