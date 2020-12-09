<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Entreprise;
use App\Utils\Shared;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserService
{
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->entityManager = $entityManager;

        $this->passwordEncoder = $passwordEncoder;
    }

    public function saveImportedAgents(array $sheetData, array $customData)
    {
        /**
         * @var Entreprise
         */
        $entreprise = $this->entityManager->getRepository(Entreprise::class)->find($customData['entreprise']);

        foreach ($sheetData as $row) {
            // make sure that the username is informed
            if (empty($row['D'])) {
                continue;
            }

            $agentExistant = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $row['D']]); 
            // make sure that the user does not already exists in the db 
            if ($agentExistant) {   
                continue;
            }

            $agent = $this->createAgent($row);

            if (!$agent) {
                continue;
            }

            if ($entreprise) {
                $agent->addEntreprise($entreprise);
            }
            
            $this->entityManager->persist($agent); 
            
            $this->entityManager->flush(); 
        }
    }

    public function createAgent($row)
    {
        $nom = $row['A'] ?: ''; // store the nom on each iteration 
        $poste = $row['B'] ?: ''; // store the poste on each iteration 
        $departement = $row['C'] ?: ''; // store the departement on each iteration
        $username = $row['D'] ?: ''; // store the username on each iteration
        $password = Shared::DEFAULTPWD;

        $agent = new User(); 
        $agent
            ->setNom($nom) 
            ->setPoste($poste)           
            ->setDepartement($departement)
            ->setUsername($username)
            ->setStatus('OUT')
            ->setImage('exemple.jpg')
            ->setPassword($this->passwordEncoder->encodePassword($agent, $password))
            ->setMatricule(Shared::hashMdp(Shared::DEFAULTPWD))
        ;

        return $agent;
    }
}