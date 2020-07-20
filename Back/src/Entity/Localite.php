<?php

namespace App\Entity;

use App\Repository\LocaliteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=LocaliteRepository::class)
 * @ApiResource()
 */
class Localite
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"entreprise_read","user_read","inv_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"entreprise_read","user_read","inv_read"})
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $adresse;

    /**
     * @ORM\ManyToOne(targetEntity=Entreprise::class, inversedBy="localites")
     */
    private $entreprise;

    /**
     * @ORM\OneToMany(targetEntity=Zone::class, mappedBy="localite")
     * @Groups({"entreprise_read","inv_read"})
     */
    private $zones;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="localites")
     */
    private $users;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $position = [];

    /**
     * @ORM\ManyToMany(targetEntity=Inventaire::class, mappedBy="localites")
     */
    private $inventaires;

    public function __construct()
    {
        $this->zones = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->inventaires = new ArrayCollection();
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
        return count($this->zones)>0;
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

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): self
    {
        $this->adresse = $adresse;

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
            $zone->setLocalite($this);
        }

        return $this;
    }

    public function removeZone(Zone $zone): self
    {
        if ($this->zones->contains($zone)) {
            $this->zones->removeElement($zone);
            // set the owning side to null (unless already changed)
            if ($zone->getLocalite() === $this) {
                $zone->setLocalite(null);
            }
        }

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

    /**
     * @return Collection|Inventaire[]
     */
    public function getInventaires(): Collection
    {
        return $this->inventaires;
    }

    public function addInventaire(Inventaire $inventaire): self
    {
        if (!$this->inventaires->contains($inventaire)) {
            $this->inventaires[] = $inventaire;
            $inventaire->addLocalite($this);
        }

        return $this;
    }

    public function removeInventaire(Inventaire $inventaire): self
    {
        if ($this->inventaires->contains($inventaire)) {
            $this->inventaires->removeElement($inventaire);
            $inventaire->removeLocalite($this);
        }

        return $this;
    }
}
