<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ImmobilisationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=ImmobilisationRepository::class)
 */
class Immobilisation
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"lecture_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"lecture_read"})
     */
    private $libelle;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"lecture_read"})
     */
    private $code;
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $compteImmo;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $compteAmort;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $emplacement;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $dateAcquisition;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $dateMiseServ;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $dateSortie;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $dureeUtilite;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $taux;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $valOrigine;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $dotation;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $cumulAmortiss;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $vnc;

    /**
     * @ORM\OneToMany(targetEntity=Lecture::class, mappedBy="immobilisation")
     */
    private $lectures;

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

    public function getDureeUtilite(): ?\DateTimeInterface
    {
        return $this->dureeUtilite;
    }

    public function setDureeUtilite(?\DateTimeInterface $dureeUtilite): self
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
}
