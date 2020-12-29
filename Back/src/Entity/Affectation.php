<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AffectationRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
/**
 * @ApiResource(
 *     normalizationContext={
 *     "groups"={"affectation_read"}
 *  }
 * )
 * @ORM\Entity(repositoryClass=AffectationRepository::class)
 * @ApiFilter(SearchFilter::class, properties={
 *     "user.id": "exact","inventaire.id": "exact"
 * })
 */
class Affectation
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"affectation_read", "loc_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="affectations")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"affectation_read", "loc_read"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity=Inventaire::class, inversedBy="affectations")
     * @Groups({"affectation_read", "loc_read"})
     */
    private $inventaire;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"affectation_read", "loc_read"})
     */
    private $debut;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"affectation_read", "loc_read"})
     */
    private $fin;

    /**
     * @ORM\ManyToOne(targetEntity=Localite::class, inversedBy="affectations")
     * @Groups({"affectation_read"})
     */
    private $localite;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getInventaire(): ?Inventaire
    {
        return $this->inventaire;
    }

    public function setInventaire(?Inventaire $inventaire): self
    {
        $this->inventaire = $inventaire;

        return $this;
    }

    public function getDebut(): ?\DateTimeInterface
    {
        return $this->debut;
    }

    public function setDebut(?\DateTimeInterface $debut): self
    {
        $this->debut = $debut;

        return $this;
    }

    public function getFin(): ?\DateTimeInterface
    {
        return $this->fin;
    }

    public function setFin(?\DateTimeInterface $fin): self
    {
        $this->fin = $fin;

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
