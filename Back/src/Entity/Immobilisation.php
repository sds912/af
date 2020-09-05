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
 *          "path"="/immobilisations/delete/{id}/invantaire",
 *           "openapi_context"={
 *              "summary"="Supprimer les immos d'un inventaire",
 *              "description"="Supprime l'ensemble des immobilisations d'un inventaire"
 *           }
 *      }
 *  }
 * )
 * @ORM\Entity(repositoryClass=ImmobilisationRepository::class)
 * @ApiFilter(SearchFilter::class, properties={"inventaire.id": "exact"})
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
     * @ORM\Column(type="string", length=255, nullable=true)
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
     * @ORM\OneToMany(targetEntity=Lecture::class, mappedBy="immobilisation")
     */
    private $lectures;

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
    private $inventaitre;

    public function __construct()
    {
        $this->lectures = new ArrayCollection();
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
            $lecture->setImmobilisation($this);
        }

        return $this;
    }

    public function removeLecture(Lecture $lecture): self
    {
        if ($this->lectures->contains($lecture)) {
            $this->lectures->removeElement($lecture);
            // set the owning side to null (unless already changed)
            if ($lecture->getImmobilisation() === $this) {
                $lecture->setImmobilisation(null);
            }
        }

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

    public function getInventaitre(): ?Inventaire
    {
        return $this->inventaitre;
    }

    public function setInventaitre(?Inventaire $inventaitre): self
    {
        $this->inventaitre = $inventaitre;

        return $this;
    }
}
