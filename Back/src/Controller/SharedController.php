<?php

namespace App\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Shared;
use App\Entity\Entreprise;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use App\Repository\EntrepriseRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;


/**
* @Route("/api")
*/
class SharedController extends AbstractController
{
    /** @var User */
    private $userCo;

    /** @var EntityManagerInterface */
    private $manager;

    /** @var EntityManagerInterface */
    private $repoEse;

    public function __construct(Security $security,EntityManagerInterface $manager,EntrepriseRepository $repoEse,AuthorizationCheckerInterface $checker)
    {
        $this->userCo=$security->getUser();
        $this->manager=$manager;
        $this->repoEse=$repoEse;
        $this->droit=$checker;
    }
    /**
    * @Route("/entreprises", methods={"POST"})
    * @Route("/entreprises/{id}", methods={"POST"})
    */
    public function addEntreprise(Request $request,$id=null){//à cause du logo
        $data=Shared::getData($request);
        $tatus=201;
        $entreprise=new Entreprise();
        if($id){
            $entreprise=$this->repoEse->find($id);//l injection de dependances ne marchait pas
            $tatus=200;
            $this->inEntreprise($entreprise);
        }
        $entreprise->addUser($this->userCo);
        $entreprise->setDenomination($data['denomination'])
                   ->setNinea($data['ninea'])
                   ->setVille($data['ville'])
                   ->setAdresse($data['adresse'])
                   ->setRepublique($data['republique'])
                   ->setSigleUsuel($data['sigleUsuel']);
        $requestFile=$request->files->all();
        $image=$entreprise->getImage();
        if(!$image){
            $image=Shared::IMAGEDEFAULT;
        }
        if($requestFile && isset($requestFile[Shared::IMAGE])){
            $file=$requestFile[Shared::IMAGE];
            $fileName=md5(uniqid()).'.'.$file->guessExtension();//on change le nom du fichier
            $file->move($this->getParameter(Shared::IMAGE_DIR),$fileName); //definir le image_directory dans service.yaml
            $ancienPhoto=$this->getParameter(Shared::IMAGE_DIR)."/".$image;
            if($image!=Shared::IMAGEDEFAULT){
               unlink($ancienPhoto);//supprime l'ancienne 
            }
            $image=$fileName;
        }
        $entreprise->setImage($image);
        if($tatus==201){
            $this->manager->persist($entreprise);
        }
        
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => 'Enregistré',
            Shared::STATUS => $tatus
        ]);
    }
    /**
     * @Route("/update/pp", name="update-pp", methods={"POST"})
     */
     public function updatePP(Request $request)
     {
         $image=$this->userCo->getImage();
         $requestFile=$request->files->all();
         if($requestFile && isset($requestFile[Shared::IMAGE])){
             $file=$requestFile[Shared::IMAGE];
             $fileName=md5(uniqid()).'.'.$file->guessExtension();//on change le nom du fichier
             $file->move($this->getParameter(Shared::IMAGE_DIR),$fileName); //definir le image_directory dans service.yaml
             $ancienPhoto=$this->getParameter(Shared::IMAGE_DIR)."/".$image;
             if($image!=Shared::IMAGEDEFAULT){
                unlink($ancienPhoto);//supprime l'ancienne 
             }
             $image=$fileName;
         }
         $this->userCo->setImage($image);
         $this->manager->flush();
         
         $afficher = [
             Shared::STATUS => 200,
             Shared::MESSAGE => 'La photo de profil a été modifié avec succès'
         ];
         return $this->json($afficher);
     }

    /**
    * @Route("/info", methods={"GET"})
    */
    public function userConnecte(SerializerInterface $serializer,UserPasswordEncoderInterface $encodePassword){
        //,MercureCookieGenerator $cookieGenerator
        $user = $this->userCo;
        //$mercureToken=$cookieGenerator->generate($user);
        $updatePwd=0;
        if($encodePassword->isPasswordValid($user, Shared::DEFAULTPWD)){
            $updatePwd=1;
        }
        $data = $serializer->serialize([$user,'$mercureToken',$updatePwd], 'json', ['groups' => ['user_read']]);
        return new Response($data,200);
    }
    public function sameEntité($user){
        if(!$this->userCo->inHolding($user) && !$this->droit->isGranted('ROLE_SuperAdmin')){
            throw new HttpException(403,"Vous n'êtes pas dans la même entité que cet utilisateur !");
        }
    }
    public function inEntreprise($e){
        if(!$this->userCo->inEntreprise($e) && !$this->droit->isGranted('ROLE_SuperAdmin')){
            throw new HttpException(403,"Vous n'êtes pas dans cette entité !");
        }
    }
}