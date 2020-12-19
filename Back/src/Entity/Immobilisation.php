<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ImmobilisationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Filter\OrSearchFilter;
use App\Filter\NullFilter;

/**
 * @ApiResource(
 * normalizationContext={
 *      "groups"={"immo_read"}
 *  },
 * itemOperations={
 *      "GET",
 *      "PUT",
 *      "DELETE_BY_INV"={
 *          "method"="get",
 *          "path"="/immobilisations/delete/{id}/inventaire",
 *           "openapi_context"={
 *              "summary"="Supprimer les immos d'un inventaire",
 *              "description"="Supprime l'ensemble des immobilisations d'un inventaire"
 *           }
 *      }
 *  }
 * )
 * @ORM\Entity(repositoryClass=ImmobilisationRepository::class)
 * @ApiFilter(SearchFilter::class, properties={"inventaire.id": "exact", "status": "exact", "code": "exact"})
 * @ApiFilter(OrSearchFilter::class, properties={"status": "exact"})
 * @ApiFilter(NullFilter::class, properties={"status": "exact"})
 */
class Immobilisation
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"lecture_read","mobile_inv_read","immo_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"lecture_read","mobile_inv_read","immo_read"})
     */
    private $libelle;

    /**
     * @ORM\Column(type="string", length=255, nullable=true, unique=true)
     * @Groups({"lecture_read","mobile_inv_read","immo_read"})
     */
    private $code;
    
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"immo_read"})
     */
    private $compteImmo;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"immo_read"})
     */
    private $compteAmort;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"lecture_read","mobile_inv_read","immo_read"})
     */
    private $emplacement;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"immo_read"})
     */
    private $dateAcquisition;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"immo_read"})
     */
    private $dateMiseServ;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"immo_read"})
     */
    private $dateSortie;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @Groups({"immo_read"})
     */
    private $dureeUtilite;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"immo_read"})
     */
    private $taux;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"immo_read"})
     */
    private $valOrigine;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"immo_read"})
     */
    private $dotation;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"immo_read"})
     */
    private $cumulAmortiss;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"immo_read"})
     */
    private $vnc;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"immo_read"})
     */
    private $etat;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"mobile_inv_read","immo_read"})
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity=Entreprise::class, inversedBy="immobilisations")
     */
    private $entreprise;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"immo_read"})
     */
    private $numeroOrdre;

    /**
     * @ORM\ManyToOne(targetEntity=Inventaire::class, inversedBy="immobilisations")
     */
    private $inventaire;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="scanImmos")
     * @Groups({"immo_read"})
     */
    private $lecteur;

    /**
     * @ORM\ManyToOne(targetEntity=Localite::class, inversedBy="immobilisations")
     * @Groups({"immo_read"})
     */
    private $localite;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"immo_read"})
     */
    private $endEtat;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"immo_read"})
     */
    private $status;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"immo_read"})
     */
    private $image;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"immo_read"})
     */
    private $dateLecture;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"immo_read"})
     */
    private $isMatched;

    /**
     * @ORM\ManyToOne(targetEntity=Immobilisation::class, inversedBy="immobilisations")
     * @Groups({"immo_read"})
     */
    private $matchedImmo;

    /**
     * @ORM\OneToMany(targetEntity=Immobilisation::class, mappedBy="matchedImmo")
     */
    private $immobilisations;//matched

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="mesAjustements")
     * @Groups({"immo_read"})
     */
    private $ajusteur;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"immo_read"})
     */
    private $approvStatus;//0 - pending, 1 - approve, -1 save

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"immo_read"})
     */
    private $endDescription;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"immo_read"})
     */
    private $endLibelle;

    public function __construct()
    {
        $this->immobilisations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(?string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getCompteImmo(): ?string
    {
        return $this->compteImmo;
    }

    public function setCompteImmo(?string $compteImmo): self
    {
        $this->compteImmo = $compteImmo;

        return $this;
    }

    public function getCompteAmort(): ?string
    {
        return $this->compteAmort;
    }

    public function setCompteAmort(?string $compteAmort): self
    {
        $this->compteAmort = $compteAmort;

        return $this;
    }

    public function getEmplacement(): ?string
    {
        return $this->emplacement;
    }

    public function setEmplacement(?string $emplacement): self
    {
        $this->emplacement = $emplacement;

        return $this;
    }

    public function getDateAcquisition(): ?\DateTimeInterface
    {
        return $this->dateAcquisition;
    }

    public function setDateAcquisition(?\DateTimeInterface $dateAcquisition): self
    {
        $this->dateAcquisition = $dateAcquisition;

        return $this;
    }

    public function getDateMiseServ(): ?\DateTimeInterface
    {
        return $this->dateMiseServ;
    }

    public function setDateMiseServ(?\DateTimeInterface $dateMiseServ): self
    {
        $this->dateMiseServ = $dateMiseServ;

        return $this;
    }

    public function getDateSortie(): ?\DateTimeInterface
    {
        return $this->dateSortie;
    }

    public function setDateSortie(?\DateTimeInterface $dateSortie): self
    {
        $this->dateSortie = $dateSortie;

        return $this;
    }

    public function getDureeUtilite(): ?string
    {
        return $this->dureeUtilite;
    }

    public function setDureeUtilite(?string $dureeUtilite): self
    {
        $this->dureeUtilite = $dureeUtilite;

        return $this;
    }

    public function getTaux(): ?float
    {
        return $this->taux;
    }

    public function setTaux(?float $taux): self
    {
        $this->taux = $taux;

        return $this;
    }

    public function getValOrigine(): ?float
    {
        return $this->valOrigine;
    }

    public function setValOrigine(float $valOrigine): self
    {
        $this->valOrigine = $valOrigine;

        return $this;
    }

    public function getDotation(): ?float
    {
        return $this->dotation;
    }

    public function setDotation(?float $dotation): self
    {
        $this->dotation = $dotation;

        return $this;
    }

    public function getCumulAmortiss(): ?float
    {
        return $this->cumulAmortiss;
    }

    public function setCumulAmortiss(?float $cumulAmortiss): self
    {
        $this->cumulAmortiss = $cumulAmortiss;

        return $this;
    }

    public function getVnc(): ?float
    {
        return $this->vnc;
    }

    public function setVnc(?float $vnc): self
    {
        $this->vnc = $vnc;

        return $this;
    }

    public function getEtat(): ?string
    {
        return $this->etat;
    }

    public function setEtat(?string $etat): self
    {
        $this->etat = $etat;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

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

    public function getNumeroOrdre(): ?string
    {
        return $this->numeroOrdre;
    }

    public function setNumeroOrdre(?string $numeroOrdre): self
    {
        $this->numeroOrdre = $numeroOrdre;

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

    public function getLecteur(): ?User
    {
        return $this->lecteur;
    }

    public function setLecteur(?User $lecteur): self
    {
        $this->lecteur = $lecteur;

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

    public function getEndEtat(): ?string
    {
        return $this->endEtat;
    }

    public function setEndEtat(?string $endEtat): self
    {
        $this->endEtat = $endEtat;

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

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getDateLecture(): ?\DateTimeInterface
    {
        return $this->dateLecture;
    }

    public function setDateLecture(?\DateTimeInterface $dateLecture): self
    {
        $this->dateLecture = $dateLecture;

        return $this;
    }

    public function getIsMatched(): ?bool
    {
        return $this->isMatched;
    }

    public function setIsMatched(?bool $isMatched): self
    {
        $this->isMatched = $isMatched;

        return $this;
    }

    public function getMatchedImmo(): ?self
    {
        return $this->matchedImmo;
    }

    public function setMatchedImmo(?self $matchedImmo): self
    {
        $this->matchedImmo = $matchedImmo;

        return $this;
    }

    /**
     * @return Collection|self[]
     */
    public function getImmobilisations(): Collection
    {
        return $this->immobilisations;
    }

    public function addImmobilisation(self $immobilisation): self
    {
        if (!$this->immobilisations->contains($immobilisation)) {
            $this->immobilisations[] = $immobilisation;
            $immobilisation->setMatchedImmo($this);
        }

        return $this;
    }

    public function removeImmobilisation(self $immobilisation): self
    {
        if ($this->immobilisations->contains($immobilisation)) {
            $this->immobilisations->removeElement($immobilisation);
            // set the owning side to null (unless already changed)
            if ($immobilisation->getMatchedImmo() === $this) {
                $immobilisation->setMatchedImmo(null);
            }
        }

        return $this;
    }

    public function getAjusteur(): ?User
    {
        return $this->ajusteur;
    }

    public function setAjusteur(?User $ajusteur): self
    {
        $this->ajusteur = $ajusteur;

        return $this;
    }

    public function getApprovStatus(): ?int
    {
        return $this->approvStatus;
    }

    public function setApprovStatus(?int $approvStatus): self
    {
        $this->approvStatus = $approvStatus;

        return $this;
    }

    public function getEndDescription(): ?string
    {
        return $this->endDescription;
    }

    public function setEndDescription(?string $endDescription): self
    {
        $this->endDescription = $endDescription;

        return $this;
    }

    public function getEndLibelle(): ?string
    {
        return $this->endLibelle;
    }

    public function setEndLibelle(?string $endLibelle): self
    {
        $this->endLibelle = $endLibelle;

        return $this;
    }
}
