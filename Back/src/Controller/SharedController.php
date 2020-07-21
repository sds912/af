<?php

namespace App\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Shared;
use App\Entity\Entreprise;
use App\Entity\Inventaire;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use App\Repository\EntrepriseRepository;
use App\Repository\InventaireRepository;
use App\Repository\LocaliteRepository;
use App\Repository\SousZoneRepository;
use App\Repository\UserRepository;
use App\Repository\ZoneRepository;
use DateTime;
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

    /** @var EntrepriseRepository */
    private $repoEse;

    /** @var InventaireRepository */
    private $repoInv;

    /** @var UserRepository */
    private $repoUser;

    /** @var UserRepository */
    private $repoLoc;

    /** @var ZoneRepository */
    private $repoZ;

    /** @var SousZoneRepository */
    private $repoSZ;

    public function __construct(Security $security,EntityManagerInterface $manager,EntrepriseRepository $repoEse,AuthorizationCheckerInterface $checker,InventaireRepository $repoInv,UserRepository $repoUser,LocaliteRepository $repoLoc,ZoneRepository $repoZ,SousZoneRepository $repoSZ)
    {
        $this->userCo=$security->getUser();
        $this->manager=$manager;
        $this->repoEse=$repoEse;
        $this->droit=$checker;
        $this->repoInv=$repoInv;
        $this->repoUser=$repoUser;
        $this->repoLoc=$repoLoc;
        $this->repoZ=$repoZ;
        $this->repoSZ=$repoSZ;
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
            $image=Shared::IMAGEDEFAULT2;
        }
        if($requestFile && isset($requestFile[Shared::IMAGE])){
            $file=$requestFile[Shared::IMAGE];
            $fileName=md5(uniqid()).'.'.$file->guessExtension();//on change le nom du fichier
            $file->move($this->getParameter(Shared::IMAGE_DIR),$fileName); //definir le image_directory dans service.yaml
            $ancienPhoto=$this->getParameter(Shared::IMAGE_DIR)."/".$image;
            if($image!=Shared::IMAGEDEFAULT2){
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
    * @Route("/update/pp", methods={"POST"})
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

    /**
    * @Route("/inventaires", methods={"POST"})
    * @Route("/inventaires/{id}", methods={"POST"})
    */
    public function addInventaire(Request $request,$id=null){//si put tableau vide
        $data=Shared::getData($request);
        $tatus=201;
        $inventaire=new Inventaire();
        if($id){
            $inventaire=$this->repoInv->find($id);
            $tatus=200;
        }
        $requestFile=$request->files->all();
        $instructions=[];
        if(isset($data["countInstruction"])){
            $countInstruction=$data["countInstruction"];
            $instructions=$this->traitementFile($inventaire->getInstruction(),$data,$requestFile,$countInstruction,"instruction");
        }

        $decisionCCs=[];
        if(isset($data["countDecisionCC"])){
            $countDecisionCC=$data["countDecisionCC"];
            $decisionCCs=$this->traitementFile($inventaire->getDecisionCC(),$data,$requestFile,$countDecisionCC,"decisionCC"); 
        }
        
        $pvReunions=[];
        if(isset($data["countPvReunion"])){
            $countPvReunion=$data["countPvReunion"];
            $pvReunions=$this->traitementFile($inventaire->getPvReunion(),$data,$requestFile,$countPvReunion,"pvReunion");
        }
        $presiComite=null;
        if($data["presiComite"]){
           $presiComite=$this->repoUser->find($data["presiComite"]); 
        }
        $idMembresCom=$this->toArray($data["membresCom"]);
        $membresCom=$this->getallByTabId($this->repoUser,$idMembresCom);

        $idPresent=$this->toArray($data["presentsReunion"]);
        $presentHere=$this->getallByTabId($this->repoUser,$idPresent);
        
        $presentsReunionOut=$this->toArray($data["presentsReunionOut"]);
        $entreprise=$this->repoEse->find($data["entreprise"]); 

        $idLocalites=$this->toArray($data["localites"]);
        $localites=$this->getallByTabId($this->repoLoc,$idLocalites);

        $idZones=$this->toArray($data["zones"]);
        $zones=$this->getallByTabId($this->repoZ,$idZones);
        
        $idSousZones=$this->toArray($data["sousZones"]);
        $sousZones=$this->getallByTabId($this->repoSZ,$idSousZones);
        $localInstructionPv=$this->toArray($data["localInstructionPv"]);
        if($localInstructionPv[0]==Shared::CREATION && isset($data['bloc1e1'])){
            $instructions=[
                [$data['bloc1e1'],$data['bloc1e2'],$data['bloc1e3']],
                [$data['bloc2e1'],$data['bloc2e2'],$data['bloc2e3']],
                [$data['bloc3e1'],$data['bloc3e2'],$data['bloc3e3'],$data['bloc3e4']]
            ];
        }
        if($localInstructionPv[1]==Shared::CREATION && isset($data['pvCB1'])){
            $pvReunions=$this->getPvCreer($data);
        }
        $inventaire->setDebut(new DateTime($data["debut"]))
                   ->setFin(new DateTime($data["fin"]))
                   ->setLieuReunion($data["lieuReunion"])
                   ->setDateReunion(new DateTime($data["dateReunion"]))
                   ->setInstruction($instructions)
                   ->setDecisionCC($decisionCCs)
                   ->setPresiComite($presiComite)
                   ->addAllMembreCom($membresCom)
                   ->addAllPresentR($presentHere)
                   ->setPresentsReunionOut($presentsReunionOut)
                   ->setPvReunion($pvReunions)
                   ->setEntreprise($entreprise)
                   ->addAllLocalite($localites)
                   ->addAllZones($zones)
                   ->addAllSousZones($sousZones)
                   ->setLocalInstructionPv($localInstructionPv);
        
        if($tatus==201){
            $this->manager->persist($inventaire);
        }
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => 'Enregistré',
            Shared::STATUS => $tatus
        ]);
    }
    public function getPvCreer($data){
        $d=[
            [
                $data['pvCB1'],$data['pvCB2'],$data['pvCB3']
            ],
            [
                // ['titre1','content1'],['titre2','content2']
            ]
        ];
        for($i=1;$i<=$data['countPvCreer'];$i++){
            array_push($d[1],[$data["pvDelTitre{$i}"],$data["pvDelContent{$i}"]]);
        }
        return $d;
    }
    public function getallByTabId($repo,$tab){
        $t=[];
        for($i=0;$i<count($tab);$i++){
            $object=$repo->find($tab[$i]);
            if($object){
                array_push($t,$object);
            }
        }
        return $t;
    }
    public function traitementFile($oldFichiers,$data,$requestFile,$count,$name){
        $fichiers=$this->fileExiste($oldFichiers,$data,$count,$name);
        for($i=1;$i<=$count;$i++){
            if($requestFile && isset($requestFile["{$name}{$i}"])){
                $file=$requestFile["{$name}{$i}"];
                $fileName=md5(uniqid()).'.'.$file->guessExtension();
                $file->move($this->getParameter(Shared::DOC_DIR),$fileName);
                $nom_fichier=$file->getClientOriginalName();
                array_push($fichiers,[$nom_fichier,$fileName]);//["nom fichier","nom fichier hasher"]
            }
        }
        return $fichiers;
    }
    public function fileExiste($oldFichiers,$data,$count,$name){
        $back=[];
        for($i=0;$i<count($oldFichiers);$i++){
            for($j=1;$j<=$count;$j++){
                if(isset($data["{$name}{$j}"]) && $oldFichiers[$i][1]==$data["{$name}{$j}"]){//si update instruction1: 349257a8657b2f6ac73542aabb60281d.png et non objet de type file
                    array_push($back,$oldFichiers[$i]);
                }
            }
        }
        return $back;
    }
    public function toArray(string $chaine){
        $tab=explode(',',$chaine);
        $t2=[];
        for($i=0;$i<count($tab);$i++){
            if(trim($tab[$i])){
                array_push($t2,trim($tab[$i]));
            }
        }
        return  $t2;
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