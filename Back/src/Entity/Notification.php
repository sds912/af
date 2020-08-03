<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\NotificationRepository")
 */
class Notification
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"list_userNotif"})
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     * @Groups({"list_userNotif"})
     */
    private $message;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"list_userNotif"})
     */
    private $icon;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"list_userNotif"})
     */
    private $lien;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $statut;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"list_userNotif"})
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="notifications")
     * @Groups({"list_userNotif"})
     */
    private $emetteur;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"list_userNotif"})
     */
    private $type;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserNotif", mappedBy="notification")
     */
    private $userNotifs;

    public function __construct()
    {
        $this->userNotifs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }

    public function getLien(): ?string
    {
        return $this->lien;
    }

    public function setLien(string $lien): self
    {
        $this->lien = $lien;

        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(?string $statut): self
    {
        $this->statut = $statut;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getEmetteur(): ?User
    {
        return $this->emetteur;
    }

    public function setEmetteur(?User $emetteur): self
    {
        $this->emetteur = $emetteur;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Collection|UserNotif[]
     */
    public function getUserNotifs(): Collection
    {
        return $this->userNotifs;
    }

    public function addUserNotif(UserNotif $userNotif): self
    {
        if (!$this->userNotifs->contains($userNotif)) {
            $this->userNotifs[] = $userNotif;
            $userNotif->setNotification($this);
        }

        return $this;
    }

    public function removeUserNotif(UserNotif $userNotif): self
    {
        if ($this->userNotifs->contains($userNotif)) {
            $this->userNotifs->removeElement($userNotif);
            // set the owning side to null (unless already changed)
            if ($userNotif->getNotification() === $this) {
                $userNotif->setNotification(null);
            }
        }

        return $this;
    }
}
