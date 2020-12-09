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
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


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
 * @ApiFilter(SearchFilter::class, properties={
 *   "nom": "partial",
 *   "username": "partial",
 *   "status": "partial"
 * })
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_read","inv_read","entreprise_read","loc_read","list_userNotif","mobile_users_read","affectation_read","immo_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"user_read","mobile_users_read"})
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     * @Groups({"user_read","entreprise_read","mobile_users_read","affectation_read"})
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
     * @Groups({"user_read","inv_read","entreprise_read","loc_read","list_userNotif","mobile_users_read","affectation_read","immo_read"})
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read","inv_read","entreprise_read"})
     */
    private $poste;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read"})
     */
    private $departement;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read","inv_read","entreprise_read","list_userNotif","affectation_read"})
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

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"matricule_read"})
     */
    private $matricule;

    /**
     * @ORM\OneToMany(targetEntity=Immobilisation::class, mappedBy="lecteur")
     */
    private $scanImmos;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user_read"})
     */
    private $cle;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user_read"})
     */
    private $nombre;

    private $myLoAffectes;//for mobile file before add groups user_idLoc look in SharedController getAffectLocOf

    /**
    * @Groups({"user_idLoc"})
    */
    private $idOfMyLoAffectes;

    /**
     * @ORM\OneToMany(targetEntity=Immobilisation::class, mappedBy="ajusteur")
     */
    private $mesAjustements;

    public function __construct()
    {
        $this->roles = ['ROLE_USER'];
        $this->entreprises = new ArrayCollection();
        $this->localites = new ArrayCollection();
        $this->localitesCrees = new ArrayCollection();
        $this->affectations = new ArrayCollection();
        $this->scanImmos = new ArrayCollection();
        $this->mesAjustements = new ArrayCollection();
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
        return array_unique($this->roles);
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

    public function getMatricule(): ?string
    {
        return $this->matricule;
    }

    public function setMatricule(?string $matricule): self
    {
        $this->matricule = $matricule;

        return $this;
    }

    /**
     * @return Collection|Immobilisation[]
     */
    public function getScanImmos(): Collection
    {
        return $this->scanImmos;
    }

    public function addScanImmo(Immobilisation $scanImmo): self
    {
        if (!$this->scanImmos->contains($scanImmo)) {
            $this->scanImmos[] = $scanImmo;
            $scanImmo->setLecteur($this);
        }

        return $this;
    }

    public function removeScanImmo(Immobilisation $scanImmo): self
    {
        if ($this->scanImmos->contains($scanImmo)) {
            $this->scanImmos->removeElement($scanImmo);
            // set the owning side to null (unless already changed)
            if ($scanImmo->getLecteur() === $this) {
                $scanImmo->setLecteur(null);
            }
        }

        return $this;
    }

    public function getCle(): ?string
    {
        return $this->cle;
    }

    public function setCle(?string $cle): self
    {
        $this->cle = $cle;

        return $this;
    }

    public function getNombre(): ?int
    {
        return $this->nombre;
    }

    public function setNombre(?int $nombre): self
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getMyLoAffectes(){
        return $this->myLoAffectes;
    }

    public function setMyLoAffectes($myLoAffectes){
        $this->myLoAffectes=$myLoAffectes;
        return $this;
    }

    public function getIdOfMyLoAffectes(){
        return $this->idOfMyLoAffectes;
    }
    
    public function setIdOfMyLoAffectes($idOfMyLoAffectes){
        $this->idOfMyLoAffectes=$idOfMyLoAffectes;
        return $this;
    }

    /**
     * @return Collection|Immobilisation[]
     */
    public function getMesAjustements(): Collection
    {
        return $this->mesAjustements;
    }

    public function addMesAjustement(Immobilisation $mesAjustement): self
    {
        if (!$this->mesAjustements->contains($mesAjustement)) {
            $this->mesAjustements[] = $mesAjustement;
            $mesAjustement->setAjusteur($this);
        }

        return $this;
    }

    public function removeMesAjustement(Immobilisation $mesAjustement): self
    {
        if ($this->mesAjustements->contains($mesAjustement)) {
            $this->mesAjustements->removeElement($mesAjustement);
            // set the owning side to null (unless already changed)
            if ($mesAjustement->getAjusteur() === $this) {
                $mesAjustement->setAjusteur(null);
            }
        }

        return $this;
    }
}
