<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\InventaireRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
*   normalizationContext={
 *      "groups"={"inv_read"}
 *  }
 * )
 * @ORM\Entity(repositoryClass=InventaireRepository::class)
 */
class Inventaire
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"inv_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"inv_read"})
     */
    private $debut;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"inv_read"})
     */
    private $fin;

    /**
     * @ORM\Column(type="json", length=255, nullable=true)
     * @Groups({"inv_read"})
     */
    private $instruction=[];//[['nom','hashNom'],['nom','hashNom']...]

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     * @Groups({"inv_read"})
     */
    private $presiComite;

    /**
     * @ORM\ManyToMany(targetEntity=User::class)
     * @ORM\JoinTable(name="membres_comite")
     * @Groups({"inv_read"})
     */
    private $membresCom;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"inv_read"})
     */
    private $lieuReunion;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"inv_read"})
     */
    private $dateReunion;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"inv_read"})
     */
    private $presentsReunionOut = [];

    /**
     * @ORM\Column(type="json", length=255, nullable=true)
     * @Groups({"inv_read"})
     */
    private $pvReunion=[];

    /**
     * @ORM\ManyToMany(targetEntity=Zone::class, inversedBy="inventaires")
     * @Groups({"inv_read"})
     */
    private $zones;

    /**
     * @ORM\ManyToMany(targetEntity=Localite::class, inversedBy="inventaires")
     * @Groups({"inv_read"})
     */
    private $localites;

    /**
     * @ORM\ManyToMany(targetEntity=SousZone::class, inversedBy="inventaires")
     * @Groups({"inv_read"})
     */
    private $sousZones;

    /**
     * @ORM\ManyToOne(targetEntity=Entreprise::class, inversedBy="inventaires")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"inv_read"})
     */
    private $entreprise;

    /**
     * @ORM\ManyToMany(targetEntity=User::class)
     * @ORM\JoinTable(name="presents_reunion")
     * @Groups({"inv_read"})
     */
    private $presentsReunion;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"inv_read"})
     */
    private $decisionCC = [];

    public function __construct()
    {
        $this->membresCom = new ArrayCollection();
        $this->zones = new ArrayCollection();
        $this->localites = new ArrayCollection();
        $this->sousZones = new ArrayCollection();
        $this->presentsReunion = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getInstruction(): ?array
    {
        return $this->instruction;
    }

    public function setInstruction(?array $instruction): self
    {
        $this->instruction = $instruction;

        return $this;
    }

    public function getPresiComite(): ?User
    {
        return $this->presiComite;
    }

    public function setPresiComite(?User $presiComite): self
    {
        $this->presiComite = $presiComite;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getMembresCom(): Collection
    {
        return $this->membresCom;
    }

    public function addMembresCom(User $membresCom): self
    {
        if (!$this->membresCom->contains($membresCom)) {
            $this->membresCom[] = $membresCom;
        }

        return $this;
    }

    public function removeMembresCom(User $membresCom): self
    {
        if ($this->membresCom->contains($membresCom)) {
            $this->membresCom->removeElement($membresCom);
        }

        return $this;
    }

    public function getLieuReunion(): ?string
    {
        return $this->lieuReunion;
    }

    public function setLieuReunion(?string $lieuReunion): self
    {
        $this->lieuReunion = $lieuReunion;

        return $this;
    }

    public function getDateReunion(): ?\DateTimeInterface
    {
        return $this->dateReunion;
    }

    public function setDateReunion(?\DateTimeInterface $dateReunion): self
    {
        $this->dateReunion = $dateReunion;

        return $this;
    }

    public function getPresentsReunionOut(): ?array
    {
        return $this->presentsReunionOut;
    }

    public function setPresentsReunionOut(?array $presentsReunionOut): self
    {
        $this->presentsReunionOut = $presentsReunionOut;

        return $this;
    }

    public function getPvReunion(): ?array
    {
        return $this->pvReunion;
    }

    public function setPvReunion(?array $pvReunion): self
    {
        $this->pvReunion = $pvReunion;

        return $this;
    }

    /**
     * @return Collection|Zone[]
     */
    public function getZones(): Collection
    {
        return $this->zones;
    }

    public function addZone(Zone $zone): self
    {
        if (!$this->zones->contains($zone)) {
            $this->zones[] = $zone;
        }

        return $this;
    }

    public function removeZone(Zone $zone): self
    {
        if ($this->zones->contains($zone)) {
            $this->zones->removeElement($zone);
        }

        return $this;
    }

    /**
     * @return Collection|Localite[]
     */
    public function getLocalites(): Collection
    {
        return $this->localites;
    }

    public function addLocalite(Localite $localite): self
    {
        if (!$this->localites->contains($localite)) {
            $this->localites[] = $localite;
        }

        return $this;
    }

    public function removeLocalite(Localite $localite): self
    {
        if ($this->localites->contains($localite)) {
            $this->localites->removeElement($localite);
        }

        return $this;
    }

    /**
     * @return Collection|SousZone[]
     */
    public function getSousZones(): Collection
    {
        return $this->sousZones;
    }

    public function addSousZone(SousZone $sousZone): self
    {
        if (!$this->sousZones->contains($sousZone)) {
            $this->sousZones[] = $sousZone;
        }

        return $this;
    }

    public function removeSousZone(SousZone $sousZone): self
    {
        if ($this->sousZones->contains($sousZone)) {
            $this->sousZones->removeElement($sousZone);
        }

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

    /**
     * @return Collection|User[]
     */
    public function getPresentsReunion(): Collection
    {
        return $this->presentsReunion;
    }

    public function addPresentsReunion(User $presentsReunion): self
    {
        if (!$this->presentsReunion->contains($presentsReunion)) {
            $this->presentsReunion[] = $presentsReunion;
        }

        return $this;
    }

    public function removePresentsReunion(User $presentsReunion): self
    {
        if ($this->presentsReunion->contains($presentsReunion)) {
            $this->presentsReunion->removeElement($presentsReunion);
        }

        return $this;
    }

    public function getDecisionCC(): ?array
    {
        return $this->decisionCC;
    }

    public function setDecisionCC(?array $decisionCC): self
    {
        $this->decisionCC = $decisionCC;

        return $this;
    }
    public function addAllMembreCom($membres){
        $this->membresCom = new ArrayCollection();
        for($i=0;$i<count($membres);$i++){
            $this->addMembresCom($membres[$i]);
        }
        return $this;
    }
    public function addAllLocalite($localites){
        $this->localites = new ArrayCollection();
        for($i=0;$i<count($localites);$i++){
            $this->addLocalite($localites[$i]);
        }
        return $this;
    }
    public function addAllPresentR($membres){
        $this->presentsReunion = new ArrayCollection();
        for($i=0;$i<count($membres);$i++){
            $this->addPresentsReunion($membres[$i]);
        }
        return $this;
    }
}
