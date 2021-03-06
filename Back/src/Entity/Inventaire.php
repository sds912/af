<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\InventaireRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *   normalizationContext={
 *      "groups"={"inv_read"}
 *  },
 *  itemOperations={
 *    "GET",
 *    "PUT",
 *    "DELETE",
 *    "PATCH",
 *    "CLOSE_INVENTAIRE"={
 *      "method"="get",
 *      "path"="/inventaires/close/{id}",
 *      "controller"="App\Controller\CloseInventaireController",
 *      "swagger_context"={
 *        "summary"="Clôturer un inventaire",
 *        "description"="Clôturer un inventaire"
 *      }
 *    }
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "entreprise.id": "exact"
 * })
 * @ORM\Entity(repositoryClass=InventaireRepository::class)
 */
class Inventaire
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"inv_read","mobile_inv_read","affectation_read", "inventaireLocalite_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"inv_read","mobile_inv_read", "inventaireLocalite_read"})
     */
    private $debut;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"inv_read","mobile_inv_read", "inventaireLocalite_read"})
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

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"inv_read"})
     */
    private $localInstructionPv = [];//['creation','creation'] le 1er c est pour les iventaires le 2pour pv 'creation' ou 'download'

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"inv_read"})
     */
    private $dateInv;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"inv_read","mobile_inv_read","affectation_read"})
     */
    private $status;/** status : open et close */
    
    /**
     * @ORM\OneToMany(targetEntity=Affectation::class, mappedBy="inventaire")
    */
    private $affectations;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $closedLoc = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $beginnedLoc = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     * 
     * @Groups({"inv_read"})
     */
    private $uploadInstructions = []; // [['nom','hashNom'],['nom','hashNom']...]


    public function __construct()
    {
        $this->membresCom = new ArrayCollection();
        $this->presentsReunion = new ArrayCollection();
        $this->affectations = new ArrayCollection();
        $this->uploadInstructions = [];
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

    public function addAllPresentR($membres){
        $this->presentsReunion = new ArrayCollection();
        for($i=0;$i<count($membres);$i++){
            $this->addPresentsReunion($membres[$i]);
        }
        return $this;
    }

    public function getLocalInstructionPv(): ?array
    {
        return $this->localInstructionPv;
    }

    public function setLocalInstructionPv(?array $localInstructionPv): self
    {
        $this->localInstructionPv = $localInstructionPv;

        return $this;
    }

    public function getDateInv(): ?\DateTimeInterface
    {
        return $this->dateInv;
    }

    public function setDateInv(?\DateTimeInterface $dateInv): self
    {
        $this->dateInv = $dateInv;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): self
    {
        $this->status = $status;

        return $this;
    }

    /**
    * @return Collection|Affectation[]
     */
    public function getAffectations(): Collection
    {
        return $this->affectations;
    }

    public function addAffectation(Affectation $affectation): self
    {
        if (!$this->affectations->contains($affectation)) {
            $this->affectations[] = $affectation;
            $affectation->setInventaire($this);
        }

        return $this;
    }

    public function removeAffectation(Affectation $affectation): self
    {
        if ($this->affectations->contains($affectation)) {
            $this->affectations->removeElement($affectation);
            // set the owning side to null (unless already changed)
            if ($affectation->getInventaire() === $this) {
                $affectation->setInventaire(null);
            }
        }

        return $this;
    }

    public function getClosedLoc(): ?array
    {
        if (!is_array($this->closedLoc)) {
            return [];
        }
        return $this->closedLoc;
    }

    public function setClosedLoc(?array $closedLoc): self
    {
        $this->closedLoc = $closedLoc;

        return $this;
    }

    public function getBeginnedLoc(): ?array
    {
        if (!is_array($this->beginnedLoc)) {
            return [];
        }
        return $this->beginnedLoc;
    }

    public function setBeginnedLoc(?array $beginnedLoc): self
    {
        $this->beginnedLoc = $beginnedLoc;

        return $this;
    }

    public function getUploadInstructions(): ?array
    {
        return $this->uploadInstructions;
    }

    public function setUploadInstructions(?array $uploadInstructions): self
    {
        $this->uploadInstructions = $uploadInstructions;

        return $this;
    }
}
