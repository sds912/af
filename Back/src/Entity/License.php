<?php

namespace App\Entity;

use App\Repository\LicenseRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(
 *  normalizationContext={
 *    "groups"={"license_read"}
 *  }
 * )
 * @ORM\Entity(repositoryClass=LicenseRepository::class)
 */
class License
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * 
     * @Groups({"user_read","license_read","entreprise_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     * 
     * @Groups({"user_read","license_read","entreprise_read"})
     */
    private $dateCreation;

    /**
     * @ORM\Column(type="text")
     * 
     * @Groups({"user_read","license_read","entreprise_read"})
     */
    private $licenseCle;

    /**
     * @ORM\OneToMany(targetEntity=Entreprise::class, mappedBy="license")
     */
    private $entreprises;

    public function __construct()
    {
        $this->entreprises = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->dateCreation;
    }

    public function setDateCreation(\DateTimeInterface $dateCreation): self
    {
        $this->dateCreation = $dateCreation;

        return $this;
    }

    public function getLicenseCle(): ?string
    {
        return $this->licenseCle;
    }

    public function setLicenseCle(string $licenseCle): self
    {
        $this->licenseCle = $licenseCle;

        return $this;
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
            $entreprise->setLicense($this);
        }

        return $this;
    }

    public function removeEntreprise(Entreprise $entreprise): self
    {
        if ($this->entreprises->contains($entreprise)) {
            $this->entreprises->removeElement($entreprise);
            // set the owning side to null (unless already changed)
            if ($entreprise->getLicense() === $this) {
                $entreprise->setLicense(null);
            }
        }

        return $this;
    }
}
