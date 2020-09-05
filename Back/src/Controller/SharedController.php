<?php

namespace App\Controller;

use App\Entity\Affectation;
use App\Entity\ApproveInst;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Shared;
use App\Entity\Entreprise;
use App\Entity\Immobilisation;
use App\Entity\Inventaire;
use App\Entity\User;
use App\Repository\AffectationRepository;
use App\Repository\ApproveInstRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use App\Repository\EntrepriseRepository;
use App\Repository\ImmobilisationRepository;
use App\Repository\InventaireRepository;
use App\Repository\LocaliteRepository;
use App\Repository\UserNotifRepository;
use App\Repository\UserRepository;
use App\Service\MercureCookieGenerator;
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

    /** @var LocaliteRepository */
    private $repoLoc;

    /** @var ImmobilisationRepository */
    private $repoImmo;

    public function __construct(Security $security,
                                EntityManagerInterface $manager,
                                EntrepriseRepository $repoEse,
                                AuthorizationCheckerInterface $checker,
                                InventaireRepository $repoInv,
                                UserRepository $repoUser,
                                ImmobilisationRepository $repoImmo,
                                LocaliteRepository $repoLoc)
    {
        $this->userCo=$security->getUser();
        $this->manager=$manager;
        $this->repoEse=$repoEse;
        $this->droit=$checker;
        $this->repoInv=$repoInv;
        $this->repoUser=$repoUser;
        $this->repoLoc=$repoLoc;
        $this->repoImmo=$repoImmo;
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
    public function userConnecte(SerializerInterface $serializer,UserPasswordEncoderInterface $encodePassword,MercureCookieGenerator $cookieGenerator){
        
        $user = $this->userCo;
        $mercureToken=$cookieGenerator->generate($user);
        $updatePwd=0;
        if($encodePassword->isPasswordValid($user, Shared::DEFAULTPWD)){
            $updatePwd=1;
        }
        $data = $serializer->serialize([$user,$mercureToken,$updatePwd], 'json', ['groups' => ['user_read']]);
        return new Response($data,200);
    }
    /**
    * @Route("/user_notis/count/new", methods={"GET"})
    */
    public function newNotif(UserNotifRepository $repo){
        $count=$repo->findCountNew($this->userCo->getId());
        return new Response($count,200);
    }

    /**
    * @Route("/inventaires", methods={"POST"})
    * @Route("/inventaires/{id}", methods={"POST"})
    */
    public function addInventaire(Request $request,$id=null){//si put tableau vide
        $data=Shared::getData($request);
        $code=201;
        $inventaire=new Inventaire();
        if($id){
            $inventaire=$this->repoInv->find($id);
            $code=200;
        }
        $status=$inventaire->getStatus()?$inventaire->getStatus():Shared::OPEN;
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
        $inventaire->initLocalite();
        $localInstructionPv=$this->toArray($data["localInstructionPv"]);
        if($localInstructionPv[0]==Shared::CREATION && isset($data['bloc1e1'])){
            $instructions=[
                [$data['bloc1e1'],$data['bloc1e2'],$data['bloc1e3']],
                [$data['bloc2e1'],$data['bloc2e2'],$data['bloc2e3']],
                [$data['bloc3e1'],$data['bloc3e2'],$data['bloc3e3'],$data['bloc3e4']],
                $this->toArray($data['signataireInst'])
            ];
        }
        if($localInstructionPv[1]==Shared::CREATION && isset($data['pvCB1'])){
            $pvReunions=$this->getPvCreer($data);
        }
        $inventaire->setDateInv(new DateTime($data["dateInv"]))
                   ->setDebut(new DateTime($data["debut"]))
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
                   ->setLocalInstructionPv($localInstructionPv)
                   ->setStatus($status);

        if($code==201){
            $this->manager->persist($inventaire);
        }
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => Shared::ENREGISTRER,
            Shared::STATUS => $code
        ]);
    }

    /**
    * @Route("/mobile-locality/{id}", methods={"GET"})
    */
    public function getMobilLocality(SerializerInterface $serializer, $id=null){
        $entreprise=$this->repoEse->find($id);
        $inventaire=$this->repoInv->findOneBy(['entreprise' => $entreprise,'status' => Shared::OPEN],["id" => "DESC"]);
        /** seul les first localites */
        $locs=$inventaire->getLocalites();
        $localites=[];
        foreach ($locs as $loc) {
            if(!$loc->getParent()){
                array_push($localites,$loc);
            }
        }
        $data=[
            "libelles"=>$entreprise->getSubdivisions(),
            "localites"=>$localites
        ];
        $data = $serializer->serialize($data, 'json', ['groups' => ['mobile_loc_read']]);
        return new Response($data,200);
    }

    /**
    * @Route("/mobile-iventaire/{id}", methods={"GET"})
    */
    public function getMobilInventaire(SerializerInterface $serializer, $id=null){
        $entreprise=$this->repoEse->find($id);
        $inventaire=$this->repoInv->findOneBy(['entreprise' => $entreprise,'status' => Shared::OPEN],["id" => "DESC"]);
        $data=[
            "immos"=>$this->repoImmo->findAll(),
            "inventaire"=>$inventaire
        ];
        $data = $serializer->serialize($data, 'json', ['groups' => ['mobile_inv_read']]);
        return new Response($data,200);
    }

    /**
    * @Route("/mobile/data/{id}", methods={"GET"})
    */
    public function getMobileData(SerializerInterface $serializer, $id=null){
        $entreprise=$this->repoEse->find($id);
        $inventaire=$this->repoInv->findOneBy(['entreprise' => $entreprise,'status' => Shared::OPEN],["id" => "DESC"]);
        /** chef equipe et membre inventaire seulement */
        $users=[];
        $all=$entreprise->getUsers();
        foreach ($all as $user) {
            if( in_array('ROLE_CE',$user->getRoles()) || in_array('ROLE_MI',$user->getRoles())){
                array_push($users,$user);
            }
        }
        /** seul les first localites */
        $locs=$inventaire->getLocalites();
        $localites=[];
        foreach ($locs as $loc) {
            if(!$loc->getParent()){
                array_push($localites,$loc);
            }
        }

        $data=[
            "immos"=>$this->repoImmo->findAll(),
            "inventaire"=>$inventaire,
            "libelles"=>$entreprise->getSubdivisions(),
            "localites"=>$localites,
            "users"=>$users
        ];
        $data = $serializer->serialize($data, 'json', ['groups' => ['mobile_inv_read','mobile_loc_read','mobile_users_read']]);
        return new Response($data,200);
    }

    /**
    * @Route("/affectations/localites/inventaire/{id}", methods={"GET"})
    */
    public function getTabIdLoc(SerializerInterface $serializer,AffectationRepository $affectationRepository,$id=null){
        $inventaire=$this->repoInv->find($id);
        $affectations=$affectationRepository->findBy(['user'=>$this->userCo,'inventaire'=>$inventaire]);
        $loc=[];
        foreach($affectations as $affectation){
            array_push($loc,
                [
                    'localite'=>$affectation->getLocalite(),
                    'debut'=>$affectation->getDebut(),
                    'fin'=>$affectation->getFin()
                ]
            );
        }
        $data = $serializer->serialize($affectations?$loc:[], 'json', ['groups' => ['entreprise_read']]);
        return new Response($data,200);
    }

    /**
    * @Route("/approve_insts/inventaire/{id}", methods={"GET"})
    */
    public function approveInstruction(ApproveInstRepository $repo,$id=null){
        $inv=$this->repoInv->find($id);
        $approv=$repo->findOneBy(['inventaire'=>$inv,'user'=>$this->userCo]);
        if(!$approv){
            $approv=new ApproveInst();
            $approv->setInventaire($inv)->setUser($this->userCo);
        }
        $approv->setStatus(true);
        $this->manager->persist($approv);
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => 'Enregistré',
            Shared::STATUS => 200
        ]);
    }

    /**
    * @Route("/approve_insts/status/inventaire/{id}", methods={"GET"})
    */
    public function getStatusAppr(ApproveInstRepository $repo,$id=null){
        $inv=$this->repoInv->find($id);
        $approv=$repo->findOneBy(['inventaire'=>$inv,'user'=>$this->userCo]);
        $stat=0;
        if($approv &&  $approv->getStatus()){
            $stat=1;
        }
        return new Response($stat,200);
    }

    /**
    * @Route("/affectations/user", methods={"POST"})
    */
    public function makeAffectation(Request $request,AffectationRepository $repo){
        $data=Shared::getData($request);
        $user=$this->repoUser->find($data['user']);
        $inventaire=$this->repoInv->find($data['inventaire']);
        $affectations=$repo->findBy(['user'=>$user,'inventaire'=>$inventaire]);
        if($data['remove']){
            foreach ($affectations as $affectation) {
                $this->manager->remove($affectation);
            }  
        }
        
        $affects=$data['affectations'];
        foreach ($affects as $aff) {
            $affectation=new Affectation();
            $affectation->setUser($user)->setInventaire($inventaire)
                        ->setDebut(isset($aff['debut'])?new DateTime($aff['debut']):null)
                        ->setFin(isset($aff['fin'])?new DateTime($aff['fin']):null)
                        ->setLocalite($this->repoLoc->find($aff['localite']['id']));
            $this->manager->persist($affectation);
        }
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => Shared::ENREGISTRER,
            Shared::STATUS => 200
        ]);
    }

    /**
    * @Route("/immobilisations/delete/{id}/invantaire", methods={"GET"})
    */
    public function deleteByinventaire($idImmo){
        $all=$this->repoImmo->findBy(['inventaire'=>$this->repoImmo]);
        foreach ($all as $immo) {
            $this->manager->remove($immo);
        }
        return $this->json([
            Shared::MESSAGE => "Supprimer",
            Shared::STATUS => 200
        ]);
    }

    public function getPvCreer($data){
        $d=[
            [
                $data['pvCB1'],$data['pvCB2'],$data['pvCB3'],$this->toArray($data['pvCB4'])//les signataires
            ],
            [
                //ca sera apres ['titre1','content1'],['titre2','content2']
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