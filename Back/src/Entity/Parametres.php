<?php

namespace App\Entity;

use App\Repository\ParametresRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ParametresRepository::class)
 */
class Parametres
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $lastNumero;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLastNumero(): ?int
    {
        return $this->lastNumero;
    }

    public function setLastNumero(int $lastNumero): self
    {
        $this->lastNumero = $lastNumero;

        return $this;
    }
}
