<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @UniqueEntity(fields= {"username"},message="Login déja utilisé")
 * @ApiResource(
 *   normalizationContext={
 *      "groups"={"user_read"}
 *  },
 *  itemOperations={
 *      "GET",
 *      "PUT",
 *      "DELETE",
 *      "PATCH",
 *      "LOCK"={
 *          "method"="get",
 *          "path"="/users/lock/{id}",
 *           "controller"="App\Controller\LockUserController",
 *           "swagger_context"={
 *              "summary"="Bloquer ou debloquer un utilisateur",
 *              "description"="Les utilisateurs bloqués ne pourront plus se connecter à la plateforme"
 *           }
 *      },
 *      "BACKUPPWD"={
 *          "method"="get",
 *          "path"="/users/back-up-pwd/{id}",
 *           "controller"="App\Controller\BackUpPwdController",
 *           "swagger_context"={
 *              "summary"="Réinitialiser le mot de passe d'un utilisateur",
 *              "description"=""
 *           }
 *      },
 *      "UPDPWD"={
 *          "method"="put",
 *          "path"="/users/password/{id}",
 *           "swagger_context"={
 *              "summary"="Modifier son mot de passe",
 *              "description"=""
 *           }
 *      },
 *      "INFO"={
 *          "method"="put",
 *          "path"="/users/info/{id}",
 *           "swagger_context"={
 *              "summary"="Modifier ses informations personnelles",
 *              "description"=""
 *           }
 *      },
 *      "MY_INFO"={
 *          "method"="get",
 *          "path"="/info",
 *           "swagger_context"={
 *              "summary"="Avoir ses informations personnelles",
 *              "description"=""
 *           }
 *      }
 *  }
 * )
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_read","inv_read","entreprise_read","list_userNotif","mobile_users_read","affectation_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"user_read","mobile_users_read"})
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     * @Groups({"user_read","entreprise_read","mobile_users_read"})
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\ManyToMany(targetEntity=Entreprise::class, mappedBy="users")
     * @Groups({"user_read"})
     */
    private $entreprises;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read","inv_read","entreprise_read","list_userNotif","mobile_users_read"})
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read","inv_read"})
     */
    private $poste;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read"})
     */
    private $departement;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read","inv_read","entreprise_read","list_userNotif"})
     */
    private $image;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read","entreprise_read","mobile_users_read"})
     */
    private $status;

    /**
     * @ORM\ManyToMany(targetEntity=Localite::class, inversedBy="users")
     * @Groups({"user_read"})
     */
    private $localites;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"user_read"})
     */
    private $menu = [];

    /**
     * @ORM\OneToMany(targetEntity=Lecture::class, mappedBy="lecteur")
     */
    private $lectures;

    /**
     * @ORM\ManyToOne(targetEntity=Entreprise::class)
     * @Groups({"user_read"})
     */
    private $currentEse;

    /**
     * @ORM\OneToMany(targetEntity=Localite::class, mappedBy="createur")
     */
    private $localitesCrees;

    /**
     * @ORM\OneToMany(targetEntity=Affectation::class, mappedBy="user")
     */
    private $affectations;

    public function __construct()
    {
        $this->entreprises = new ArrayCollection();
        $this->localites = new ArrayCollection();
        $this->lectures = new ArrayCollection();
        $this->localitesCrees = new ArrayCollection();
        $this->affectations = new ArrayCollection();
    }

    /**
     * @Groups({"mobile_users_read"})
     */
    public function getEntreprisess()
    {
        /** Only for mobile when we get user by entreprise we need all entreprises of user (circular ref) */
        $eses=$this->entreprises;
        $tab=[];
        foreach($eses as $ese){
            $obj=["id"=>$ese->getId(),"denomination"=>$ese->getDenomination()];
            array_push($tab,$obj);
        }
        return $tab;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection|Entreprise[]
     */
    public function getEntreprises(): Collection
    {
        return $this->entreprises;
    }

    public function addEntreprise(Entreprise $entreprise): self
    {
        if (!$this->entreprises->contains($entreprise)) {
            $this->entreprises[] = $entreprise;
            $entreprise->addUser($this);
        }

        return $this;
    }

    public function removeEntreprise(Entreprise $entreprise): self
    {
        if ($this->entreprises->contains($entreprise)) {
            $this->entreprises->removeElement($entreprise);
            $entreprise->removeUser($this);
        }

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPoste(): ?string
    {
        return $this->poste;
    }

    public function setPoste(?string $poste): self
    {
        $this->poste = $poste;

        return $this;
    }

    public function getDepartement(): ?string
    {
        return $this->departement;
    }

    public function setDepartement(?string $departement): self
    {
        $this->departement = $departement;

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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): self
    {
        $this->status = $status;

        return $this;
    }
    public function inHolding(User $user){
        foreach($this->entreprises as $entreprise){
            if($user->inEntreprise($entreprise)){
                return true;
            }
        }
        return false;
    }
    public function inEntreprise(Entreprise $entreprise)
    {
        if ($this->entreprises->contains($entreprise)) {
            return true;
        }

        return false;
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

    public function getMenu(): ?array
    {
        return $this->menu;
    }

    public function setMenu(?array $menu): self
    {
        $this->menu = $menu;

        return $this;
    }

    /**
     * @return Collection|Lecture[]
     */
    public function getLectures(): Collection
    {
        return $this->lectures;
    }

    public function addLecture(Lecture $lecture): self
    {
        if (!$this->lectures->contains($lecture)) {
            $this->lectures[] = $lecture;
            $lecture->setLecteur($this);
        }

        return $this;
    }

    public function removeLecture(Lecture $lecture): self
    {
        if ($this->lectures->contains($lecture)) {
            $this->lectures->removeElement($lecture);
            // set the owning side to null (unless already changed)
            if ($lecture->getLecteur() === $this) {
                $lecture->setLecteur(null);
            }
        }

        return $this;
    }

    public function getCurrentEse(): ?Entreprise
    {
        return $this->currentEse;
    }

    public function setCurrentEse(?Entreprise $currentEse): self
    {
        $this->currentEse = $currentEse;

        return $this;
    }

    /**
     * @return Collection|Localite[]
     */
    public function getLocalitesCrees(): Collection
    {
        return $this->localitesCrees;
    }

    public function addLocalitesCree(Localite $localitesCree): self
    {
        if (!$this->localitesCrees->contains($localitesCree)) {
            $this->localitesCrees[] = $localitesCree;
            $localitesCree->setCreateur($this);
        }

        return $this;
    }

    public function removeLocalitesCree(Localite $localitesCree): self
    {
        if ($this->localitesCrees->contains($localitesCree)) {
            $this->localitesCrees->removeElement($localitesCree);
            // set the owning side to null (unless already changed)
            if ($localitesCree->getCreateur() === $this) {
                $localitesCree->setCreateur(null);
            }
        }

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
            $affectation->setUser($this);
        }

        return $this;
    }

    public function removeAffectation(Affectation $affectation): self
    {
        if ($this->affectations->contains($affectation)) {
            $this->affectations->removeElement($affectation);
            // set the owning side to null (unless already changed)
            if ($affectation->getUser() === $this) {
                $affectation->setUser(null);
            }
        }

        return $this;
    }
}
