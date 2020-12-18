<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InventaireLocaliteRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiFilter;

/**
 * @ApiResource(
 *     normalizationContext={
 *         "groups"={"inventaireLocalite_read"}
 *     }
 * )
 * @ORM\Entity(repositoryClass=InventaireLocaliteRepository::class)
 * @ApiFilter(SearchFilter::class, properties={
 *     "inventaire.id": "exact",
 *     "localite.id": "exact"
 * })
 */
class InventaireLocalite
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * 
     * @Groups({"inventaireLocalite_read", "loc_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Inventaire::class)
     * @ORM\JoinColumn(nullable=false)
     * 
     * @Groups({"inventaireLocalite_read", "loc_read"})
     */
    private $inventaire;

    /**
     * @ORM\ManyToOne(targetEntity=Localite::class, inversedBy="inventaireLocalites")
     * @ORM\JoinColumn(nullable=false)
     * 
     * @Groups({"inventaireLocalite_read"})
     */
    private $localite;

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
