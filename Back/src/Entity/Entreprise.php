<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\EntrepriseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *    normalizationContext={
 *      "groups"={"entreprise_read"}
 *  }
 * )
 * @ORM\Entity(repositoryClass=EntrepriseRepository::class)
 */
class Entreprise
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_read","entreprise_read","inv_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read","entreprise_read","inv_read"})
     */
    private $denomination;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $ninea;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $adresse;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $image;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $republique;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $ville;

    /**
     * @ORM\OneToMany(targetEntity=Localite::class, mappedBy="entreprise")
     * @Groups({"entreprise_read"})
     */
    private $localites;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, inversedBy="entreprises")
     * @Groups({"entreprise_read"})
     */
    private $users;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $sigleUsuel;

    /**
     * @ORM\OneToMany(targetEntity=Inventaire::class, mappedBy="entreprise")
     */
    private $inventaires;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $capital;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"entreprise_read"})
     */
    private $subdivisions = [];

    public function __construct()
    {
        $this->localites = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->inventaires = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDenomination(): ?string
    {
        return $this->denomination;
    }

    public function setDenomination(?string $denomination): self
    {
        $this->denomination = $denomination;

        return $this;
    }

    public function getNinea(): ?string
    {
        return $this->ninea;
    }

    public function setNinea(?string $ninea): self
    {
        $this->ninea = $ninea;

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

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getRepublique(): ?string
    {
        return $this->republique;
    }

    public function setRepublique(?string $republique): self
    {
        $this->republique = $republique;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(?string $ville): self
    {
        $this->ville = $ville;

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
            $localite->setEntreprise($this);
        }

        return $this;
    }

    public function removeLocalite(Localite $localite): self
    {
        if ($this->localites->contains($localite)) {
            $this->localites->removeElement($localite);
            // set the owning side to null (unless already changed)
            if ($localite->getEntreprise() === $this) {
                $localite->setEntreprise(null);
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
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
        }

        return $this;
    }

    public function getSigleUsuel(): ?string
    {
        return $this->sigleUsuel;
    }

    public function setSigleUsuel(?string $sigleUsuel): self
    {
        $this->sigleUsuel = $sigleUsuel;

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
            $inventaire->setEntreprise($this);
        }

        return $this;
    }

    public function removeInventaire(Inventaire $inventaire): self
    {
        if ($this->inventaires->contains($inventaire)) {
            $this->inventaires->removeElement($inventaire);
            // set the owning side to null (unless already changed)
            if ($inventaire->getEntreprise() === $this) {
                $inventaire->setEntreprise(null);
            }
        }

        return $this;
    }

    public function getCapital(): ?float
    {
        return $this->capital;
    }

    public function setCapital(?float $capital): self
    {
        $this->capital = $capital;

        return $this;
    }

    public function getSubdivisions(): ?array
    {
        return $this->subdivisions;
    }

    public function setSubdivisions(?array $subdivisions): self
    {
        $this->subdivisions = $subdivisions;

        return $this;
    }
}
