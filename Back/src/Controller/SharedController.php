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
    public function __construct(Security $security,EntityManagerInterface $manager,EntrepriseRepository $repoEse)
    {
        $this->userCo=$security->getUser();
        $this->manager=$manager;
        $this->repoEse=$repoEse;
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
}