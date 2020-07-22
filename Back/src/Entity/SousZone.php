<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\SousZoneRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=SousZoneRepository::class)
 */
class SousZone
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
     * @Groups({"entreprise_read","inv_read"})
     */
    private $nom;

    /**
     * @ORM\ManyToOne(targetEntity=Zone::class, inversedBy="sousZones")
     */
    private $zone;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="sousZones")
     */
    private $users;

    /**
     * @ORM\ManyToMany(targetEntity=Inventaire::class, mappedBy="sousZones")
     */
    private $inventaires;

    /**
    * @Groups({"user_read"})
    */
    public function getIdEntreprise(): ?int{
        $z=$this->zone;
        $idZ=null;
        if($z){
            $idZ=$z->getIdEntreprise();
        }
        return $idZ;
    }

    /**
    * @Groups({"inv_read"})
    */
    public function getZonename(){
        $z=$this->zone;
        $name=null;
        if($z){
            $name=$z->getNom();
        }
        return $name;
    }

    /**
    * @Groups({"inv_read"})
    */
    public function getidLoc(){
        $z=$this->zone;
        $name=null;
        if($z){
            $name=$z->getidLoc();
        }
        return $name;
    }

    /**
    * @Groups({"entreprise_read"})
    */
    public function getRemovable(){
        $removable=1;
        if($this->users && count($this->users)>0){
            $removable=0;
        }
        return $removable;
    }

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->inventaires = new ArrayCollection();
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

    public function getZone(): ?Zone
    {
        return $this->zone;
    }

    public function setZone(?Zone $zone): self
    {
        $this->zone = $zone;

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
            $user->addSousZone($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            $user->removeSousZone($this);
        }

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
            $inventaire->addSousZone($this);
        }

        return $this;
    }

    public function removeInventaire(Inventaire $inventaire): self
    {
        if ($this->inventaires->contains($inventaire)) {
            $this->inventaires->removeElement($inventaire);
            $inventaire->removeSousZone($this);
        }

        return $this;
    }
}
