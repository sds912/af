<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
/**
 * @ApiResource(
 *  normalizationContext={
 *    "groups"={"list_userNotif"}
 *  }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\UserNotifRepository")
 * @ApiFilter(SearchFilter::class, properties={"recepteur.id": "exact"})
 * @ApiFilter(OrderFilter::class, properties={"id"="DESC"})
 */
class UserNotif
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"list_userNotif"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Notification", inversedBy="userNotifs")
     * @Groups({"list_userNotif"})
     */
    private $notification;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User")
     */
    private $recepteur;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"list_userNotif"})
     */
    private $status;

    private $bus;
    private $type;
    public function __construct(MessageBusInterface $bus,$type='notification')
    {
        $this->bus=$bus;
        $this->type=$type;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNotification(): ?Notification
    {
        return $this->notification;
    }

    public function setNotification(?Notification $notification): self
    {
        $this->notification = $notification;

        return $this;
    }

    public function getRecepteur(): ?User
    {
        return $this->recepteur;
    }

    public function setRecepteur(?User $recepteur): self
    {
        $this->recepteur = $recepteur;
        $this->loadNotification($recepteur);
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }
    public function loadNotification(User $user){//pour qu'il recoit le message instantanément grace à mercure
        $idUser=null;
        if($user){
            $idUser=$user->getId();//le destinataire
        }
        $update = new Update("http://monsite.com/{$this->type}",json_encode([]),true,$idUser);//l'url n'est pas important ça doit etre le même qu'on front
        $this->bus->dispatch($update);//asynchrone 
    }
}
