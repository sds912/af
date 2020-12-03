<?php

namespace App\Controller;

use App\Entity\Entreprise;
use App\Entity\License;
use App\Entity\User;
use App\Repository\EntrepriseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;


class AddEntrepriseController
{
    private $user;
    private $entityManager;
    private $entrepriseRepository;
    private $client;
    private $params;

    public function __construct(
        EntityManagerInterface $entityManager,
        EntrepriseRepository $entrepriseRepository,
        TokenStorageInterface $tokenStorage,
        HttpClientInterface $client,
        ParameterBagInterface $params
    ) {
        $this->entityManager = $entityManager;
        $this->entrepriseRepository = $entrepriseRepository;
        $this->client = $client;
        $this->params = $params;
        /**
         * @var User
         */
        $this->user = $tokenStorage->getToken()->getUser();
    }

    public function __invoke(Entreprise $data): Entreprise
    {
        /**
         * @var License
         */
        $license = $this->entityManager->getRepository(License::class)->findOneBy(['licenseCle' => $this->user->getCle()]);

        // Vérification si la license exite.
        if (!$license || false === $dataLicense = $this->getLicenseData($license->getLicenseCle())) {
            throw new HttpException(500,'ERREUR: License invalide');
        }
        
        $entreprises = $this->entrepriseRepository->findBy(['license' => $license]);
        $countEntreprises = count($entreprises);

        if ($countEntreprises >= $dataLicense[2]) {
            throw new HttpException(500,'ERREUR: Vous avez atteint le nombre entreprise a créer.');
        }

        $data->setLicense($license);

        return $data;
    }

    public function getLicenseData($licenseCle)
    {
        try {
            $response = $this->client->request('GET', sprintf('%s/api/clients/validation?license=%s', $this->params->get('administrateur_api_url'), $licenseCle), [
                'headers' => [
                    'Accept' => 'application/json',
                ],
            ]);
    
            $content = json_decode($response->getContent());

        } catch (\Throwable $th) {
            return false;
        }

        if (!$content || count(explode('-', $content)) != 3) {
            return false;
        }

        return explode('-', $content);
    }
}