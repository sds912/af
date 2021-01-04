<?php

namespace App\Entity;

use App\Repository\LocaliteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiFilter;

/**
 * @ORM\Entity(repositoryClass=LocaliteRepository::class)
 * @ApiResource(
 * normalizationContext={
 *      "groups"={"loc_read"}
 *  },
 *  collectionOperations={
 *     "get",
 *     "post"={
 *         "method"="POST",
 *         "controller"="App\Controller\AddLocaliteController",
 *         "swagger_context"={
 *            "summary"="Ajout d'une localite",
 *            "description"="Ajout d'une localite"
 *         }
 *     }
 *  }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "entreprise.id": "exact",
 *     "nom": "exact",
 *     "parent": "exact",
 *     "level": "exact"
 * })
 */
class Localite
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"entreprise_read","loc_read","user_read","inv_read","mobile_loc_read","affectation_read","immo_read", "inventaireLocalite_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"entreprise_read","loc_read","user_read","inv_read","mobile_loc_read","immo_read", "affectation_read", "inventaireLocalite_read"})
     */
    private $nom;

    /**
     * @ORM\ManyToOne(targetEntity=Entreprise::class, inversedBy="localites")
     */
    private $entreprise;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="localites")
     */
    private $users;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"entreprise_read","loc_read","inv_read", "inventaireLocalite_read"})
     */
    private $position = [];

    /**
     * @ORM\ManyToOne(targetEntity=Localite::class, inversedBy="subdivisions")
     */
    private $parent;

    /**
     * @ORM\OneToMany(targetEntity=Localite::class, mappedBy="parent")
     * @Groups({"entreprise_read","loc_read","user_read","inv_read","mobile_loc_read", "affectation_read", "inventaireLocalite_read"})
     */
    private $subdivisions;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="localitesCrees")
     * @Groups({"entreprise_read","loc_read","inv_read","immo_read", "inventaireLocalite_read"})
     */
    private $createur;

    /**
     * @ORM\OneToMany(targetEntity=Affectation::class, mappedBy="localite")
     * @Groups({"loc_read"})
     */
    private $affectations;

    /**
     * @ORM\OneToMany(targetEntity=Immobilisation::class, mappedBy="localite")
     */
    private $immobilisations;

    /**
     * @ORM\Column(type="json", length=255, nullable=true)
     */
    private $idTampon;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"entreprise_read","loc_read","user_read","inv_read","mobile_loc_read","immo_read", "inventaireLocalite_read"})
     */
    private $level;

    /**
     * @ORM\OneToMany(targetEntity=InventaireLocalite::class, mappedBy="localite")
     * @Groups({"loc_read"})
     */
    private $inventaireLocalites;

    /**
     * @ORM\Column(type="text", nullable=true)
     * 
     * @Groups({"entreprise_read","loc_read","user_read","inv_read","mobile_loc_read","immo_read", "affectation_read", "inventaireLocalite_read"})
     */
    private $arborescence;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->inventaires = new ArrayCollection();
        $this->subdivisions = new ArrayCollection();
        $this->affectations = new ArrayCollection();
        $this->immobilisations = new ArrayCollection();
        $this->inventaireLocalites = new ArrayCollection();
    }
    /**
    * @Groups({"user_read"})
    */
    public function getIdEntreprise(): ?int{
        $entreprise=$this->entreprise;
        $id=null;
        if($entreprise){
            $id=$entreprise->getId();
        }
        return $id;
    }
    /**
    * @Groups({"entreprise_read"})
    */
    public function getRattacher(){
        return count($this->subdivisions)>0;
    }
    /**
    * @Groups({"entreprise_read"})
    */
    public function getLinkToUser() {
        /** revoir car maintenant on doit chercher dans les affectations si l id est dans le json localites */
        return count($this->users)>0;
    }
    /**
    * @Groups({"entreprise_read","loc_read","inv_read", "affectation_read"})
    */
    public function getIdParent(){//utilisé ne pas sup
        $p=$this->parent;
        $idP=null;
        if($p){
            $idP=$p->getId();
        }
        return $idP;
    }

    public function getId(): ?int
    {
        return $this->id;
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
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->addLocalite($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            $user->removeLocalite($this);
        }

        return $this;
    }

    public function getPosition(): ?array
    {
        return $this->position;
    }

    public function setPosition(?array $position): self
    {
        $this->position = $position;

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
    public function getSubdivisions(): Collection
    {
        return $this->subdivisions;
    }

    public function addSubdivision(self $subdivision): self
    {
        if (!$this->subdivisions->contains($subdivision)) {
            $this->subdivisions[] = $subdivision;
            $subdivision->setParent($this);
        }

        return $this;
    }

    public function removeSubdivision(self $subdivision): self
    {
        if ($this->subdivisions->contains($subdivision)) {
            $this->subdivisions->removeElement($subdivision);
            // set the owning side to null (unless already changed)
            if ($subdivision->getParent() === $this) {
                $subdivision->setParent(null);
            }
        }

        return $this;
    }

    public function getCreateur(): ?User
    {
        return $this->createur;
    }

    public function setCreateur(?User $createur): self
    {
        $this->createur = $createur;

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
            $affectation->setLocalite($this);
        }

        return $this;
    }

    public function removeAffectation(Affectation $affectation): self
    {
        if ($this->affectations->contains($affectation)) {
            $this->affectations->removeElement($affectation);
            // set the owning side to null (unless already changed)
            if ($affectation->getLocalite() === $this) {
                $affectation->setLocalite(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Immobilisation[]
     */
    public function getImmobilisations(): Collection
    {
        return $this->immobilisations;
    }

    public function addImmobilisation(Immobilisation $immobilisation): self
    {
        if (!$this->immobilisations->contains($immobilisation)) {
            $this->immobilisations[] = $immobilisation;
            $immobilisation->setLocalite($this);
        }

        return $this;
    }

    public function removeImmobilisation(Immobilisation $immobilisation): self
    {
        if ($this->immobilisations->contains($immobilisation)) {
            $this->immobilisations->removeElement($immobilisation);
            // set the owning side to null (unless already changed)
            if ($immobilisation->getLocalite() === $this) {
                $immobilisation->setLocalite(null);
            }
        }

        return $this;
    }

    public function getIdTampon(): ?array
    {
        return $this->idTampon;
    }

    public function setIdTampon(?array $idTampon): self
    {
        $this->idTampon = $idTampon;

        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(int $level): self
    {
        $this->level = $level;

        return $this;
    }

    /**
     * @return Collection|InventaireLocalite[]
     */
    public function getInventaireLocalites(): Collection
    {
        return $this->inventaireLocalites;
    }

    public function addInventaireLocalite(InventaireLocalite $inventaireLocalite): self
    {
        if (!$this->inventaireLocalites->contains($inventaireLocalite)) {
            $this->inventaireLocalites[] = $inventaireLocalite;
            $inventaireLocalite->setLocalite($this);
        }

        return $this;
    }

    public function removeInventaireLocalite(InventaireLocalite $inventaireLocalite): self
    {
        if ($this->inventaireLocalites->contains($inventaireLocalite)) {
            $this->inventaireLocalites->removeElement($inventaireLocalite);
            // set the owning side to null (unless already changed)
            if ($inventaireLocalite->getLocalite() === $this) {
                $inventaireLocalite->setLocalite(null);
            }
        }

        return $this;
    }

    public function __toString() {
        return strval($this->id);
    }

    public function getArborescence(): ?string
    {
        return $this->arborescence;
    }

    public function setArborescence(?string $arborescence): self
    {
        $this->arborescence = $arborescence;

        return $this;
    }
}
