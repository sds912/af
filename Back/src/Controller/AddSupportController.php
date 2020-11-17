<?php

namespace App\Controller;

use App\Entity\Support;
use App\Entity\Parametres;
use App\Form\SupportType;
use App\Repository\SupportRepository;
use App\Repository\ParametresRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;



class AddSupportController
{
    private $entityManager;
    private $supportRepository;
    private $parametresRepository;

    public function __construct(EntityManagerInterface $entityManager, SupportRepository $supportRepository, ParametresRepository $parametresRepository)
    {
        $this->entityManager = $entityManager;
        $this->supportRepository = $supportRepository;
        $this->parametresRepository = $parametresRepository;
    }

    public function __invoke(Support $data, \Swift_Mailer $mailer): Support
    {
        $numero = $this->generateNumero();
        $data->setNumero($numero);

        try {
            $message = (new \Swift_Message('Votre requête est reçue et enregistrée avec le ticket n°'.$numero))
                ->setFrom('support@asma-technologies.fr')
                ->setTo($data->getAuteur()['username'])
                ->addCc('ousmanendiaye352@gmail.com')
                ->setBody('
                    <p style="font-size: 1.2rem">Monsieur/Madame,</p>
                    <p style="font-size: 1.2rem">
                        Nous sommes heureux de vous informer que votre requête a été reçue par notre<br>
                        service Support. Le numéro de ticket est le suivant: <strong>'.$numero.'</strong>.<br>
                        Le titre de votre requête est: <strong>"'.$data->getObjet().'"</strong>.<br>
                        Veuillez retenir le numéro de ticket et le mentionner sur toute vos communications<br>
                        avec notre service Support.<br>
                        <br>
                        Cordialement,
                    </p>
            
                    <p style="font-size: 1.2rem">
                        <strong>
                            IT Support Team<br>
                            08:00 - 18:00
                        </strong>
                    </p>'
                ,'text/html')
            ;
            $mailer->send($message);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }

    public function generateNumero()
    {
        $lastNumero = 600000;

        $parametre = $this->parametresRepository->findOneBy([]);
        
        if (!$parametre) {
            $parametre = new Parametres();
            $parametre->setLastNumero($lastNumero);
            $this->entityManager->persist($parametre);
        }

        $lastNumero = $parametre->getLastNumero();

        if (strpos(strval($lastNumero), "99999")) {
            $index = intval(substr(strval($lastNumero), 0, 1)) + 2;
            $lastNumero = intval($index+"00000");
        }

        $lastNumero++;

        $parametre->setLastNumero($lastNumero);
        $this->entityManager->flush();

        return $lastNumero;
    }
}