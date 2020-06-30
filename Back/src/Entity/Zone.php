<?php

namespace App\Entity;

use App\Repository\ZoneRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

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
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $adresse;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $libelle;

    /**
     * @ORM\ManyToOne(targetEntity=Zone::class, inversedBy="sousZones")
     */
    private $parent;

    /**
     * @ORM\OneToMany(targetEntity=Zone::class, mappedBy="parent")
     */
    private $sousZones;

    /**
     * @ORM\ManyToOne(targetEntity=Localite::class, inversedBy="zones")
     */
    private $localite;

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

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): self
    {
        $this->parent = $parent;

        return $this;
    }

    /**
     * @return Collection|self[]
     */
    public function getSousZones(): Collection
    {
        return $this->sousZones;
    }

    public function addSousZone(self $sousZone): self
    {
        if (!$this->sousZones->contains($sousZone)) {
            $this->sousZones[] = $sousZone;
            $sousZone->setParent($this);
        }

        return $this;
    }

    public function removeSousZone(self $sousZone): self
    {
        if ($this->sousZones->contains($sousZone)) {
            $this->sousZones->removeElement($sousZone);
            // set the owning side to null (unless already changed)
            if ($sousZone->getParent() === $this) {
                $sousZone->setParent(null);
            }
        }

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
}
