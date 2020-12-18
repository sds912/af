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
use App\Entity\License;
use App\Entity\Inventaire;
use App\Entity\Localite;
use App\Entity\MobileToken;
use App\Entity\InventaireLocalite;
use App\Entity\Notification;
use App\Entity\User;
use App\Entity\UserNotif;
use App\Repository\AffectationRepository;
use App\Repository\ApproveInstRepository;
use App\Repository\DeviceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use App\Repository\EntrepriseRepository;
use App\Repository\ImmobilisationRepository;
use App\Repository\InventaireRepository;
use App\Repository\LocaliteRepository;
use App\Repository\MobileTokenRepository;
use App\Repository\UserNotifRepository;
use App\Repository\UserRepository;
use App\Service\MercureCookieGenerator;
use DateTime;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
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

    /** @var MessageBusInterface */
    private $bus;

    public function __construct(Security $security,
                                EntityManagerInterface $manager,
                                EntrepriseRepository $repoEse,
                                AuthorizationCheckerInterface $checker,
                                InventaireRepository $repoInv,
                                UserRepository $repoUser,
                                ImmobilisationRepository $repoImmo,
                                LocaliteRepository $repoLoc,
                                MessageBusInterface $bus)
    {
        $this->userCo=$security->getUser();
        $this->manager=$manager;
        $this->repoEse=$repoEse;
        $this->droit=$checker;
        $this->repoInv=$repoInv;
        $this->repoUser=$repoUser;
        $this->repoLoc=$repoLoc;
        $this->repoImmo=$repoImmo;
        $this->bus=$bus;
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
    * @Route("/activeKey", methods={"POST"})
    */
    public function activeKey(Request $request,EntityManagerInterface $manager){
        $data=Shared::getData($request);
        $user=$this->getUser();
        $cle = $data['cle'];

        $license = $this->manager->getRepository(License::class)->findOneBy(['licenseCle' => $cle]);

        if (!$license) {
            $license = new License();
            $license->setDateCreation(new \DateTime('now'))->setLicenseCle($cle);
            $this->manager->persist($license);
            $this->manager->flush();
        }

        $nmbre=$data['nombre'];
        $user->setCle($cle)->setNombre($nmbre);
        $txt="une entité";
        if($nmbre>1){
            $txt=$nmbre." entités";
        }
        $manager->flush();
        $afficher = [
            Shared::STATUS => 200,
            Shared::MESSAGE => "Licence pour {$txt} activée"
        ];
        return $this->json($afficher);
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
                   ->setLocalInstructionPv($localInstructionPv)
                   ->setStatus($status);

        if($code==201){
            $this->manager->persist($inventaire);
        }
        $this->manager->flush();

        $idLocalites=$this->toArray($data["localites"]);
        if ($data['allLocIsChecked'] == true) {
            $localites = $this->repoLoc->findBy(['entreprise' => $entreprise->getId()]);
        } else {
            $localites = $this->getallByTabId($this->repoLoc,$idLocalites);
        }

        $inventaireLocaliteRepo = $this->manager->getRepository(InventaireLocalite::class);
        $inventaireLocaliteRepo->deleteMultipleByIventaire($inventaire->getId());

        $batchSize = 50;

        foreach ($localites as $i => $localite) {
            $inventaireLocalite = new InventaireLocalite();
            $inventaireLocalite->setInventaire($inventaire)->setLocalite($localite);
            $this->manager->persist($inventaireLocalite);

            // flush everything to the database every 40 inserts
            if (($i % $batchSize) == 0) {
                $this->manager->flush();
                $this->manager->clear('App\Entity\InventaireLocalite');
            }
        }
        $this->manager->flush();
        $this->manager->clear('App\Entity\InventaireLocalite');

        return $this->json([
            Shared::MESSAGE => Shared::ENREGISTRER,
            Shared::STATUS => $code
        ]);
    }

    /**
    * @Route("/mobile-locality/{id}", methods={"GET"})
    */
    public function getMobilLocality(SerializerInterface $serializer,AffectationRepository $repo, $id=null){
        $entreprise=$this->repoEse->find($id);
        $inventaire=$this->repoInv->findOneBy(['entreprise' => $entreprise,'status' => Shared::OPEN],["id" => "DESC"]);
        /** seul les first localites */
        $inventaireLocalites = $this->manager->getRepository(InventaireLocalite::class)->findBy(['inventaire' => $inventaire->getId()]);
        $localites = [];

        foreach ($inventaireLocalites as $inventaireLocalite) {
            $localite = $inventaireLocalite->getLocalite();
            if(!$localite->getParent()){
                array_push($localites,$localite);
            }
        }

        $data=[
            "libelles"=>$entreprise->getSubdivisions(),
            "localites"=>$localites,
            "idOfMyLoAffectes"=>$this->getAffectLocOf($this->userCo, $inventaire, $repo)[1]
        ];
        $data = $serializer->serialize($data, 'json', ['groups' => ['mobile_loc_read']]);
        return new Response($data,200);
    }

    /**
    * @Route("/mobile-inventaire/{id}", methods={"GET"})
    */
    public function getMobilInventaire(SerializerInterface $serializer, $id=null){
        $entreprise=$this->repoEse->find($id);
        $inventaire=$this->repoInv->findOneBy(['entreprise' => $entreprise,'status' => Shared::OPEN],["id" => "DESC"]);
        $data=[
            "immos"=>$this->repoImmo->findBy(['inventaire' => $inventaire]),
            "inventaire"=>$inventaire, // Ajouter dans l'api,
            "catalogues"=>$inventaire->getEntreprise()->getCatalogues()
        ];
        $data = $serializer->serialize($data, 'json', ['groups' => ['mobile_inv_read']]);
        return new Response($data,200);
    }

    /**
    * @Route("/mobile/data/{id}", methods={"GET"})
    */
    public function getMobileData(SerializerInterface $serializer,DeviceRepository $repoDevice,AffectationRepository $repoAff, $id){
        $entreprise=$this->repoEse->find($id);
        $inventaire=$this->repoInv->findOneBy(['entreprise' => $entreprise,'status' => Shared::OPEN],["id" => "DESC"]);
        /** chef equipe et membre inventaire seulement */
        $users=[];
        $all=$entreprise->getUsers();
        foreach ($all as $user) {
            if( in_array('ROLE_CE',$user->getRoles()) || in_array('ROLE_MI',$user->getRoles())){
                $t=$this->getAffectLocOf($user,$inventaire,$repoAff);
                $user->setMyLoAffectes($t[0])->setIdOfMyLoAffectes($t[1]);
                array_push($users,$user);
            }
        }
        /** seul les first localites */
        $inventaireLocalites = $this->manager->getRepository(InventaireLocalite::class)->findBy(['inventaire' => $inventaire->getId()]);
        $localites = [];

        foreach ($inventaireLocalites as $inventaireLocalite) {
            $localite = $inventaireLocalite->getLocalite();
            if(!$localite->getParent()){
                array_push($localites,$localite);
            }
        }

        $devices=[];
        foreach ($repoDevice->findAll() as $dev) {
                array_push($devices,$dev->getImei());
        }

        $data=[
            "immos"=>$this->repoImmo->findBy(['inventaire'=>$inventaire,'status'=>null]),
            "inventaire"=>$inventaire,
            "libelles"=>$entreprise->getSubdivisions(),
            "localites"=>$localites,
            "users"=>$users,
            "devices"=>$devices
        ];
        $data = $serializer->serialize($data, 'json', ['groups' => ['mobile_inv_read','mobile_loc_read','mobile_users_read','matricule_read','device_read','user_idLoc']]);
        return new Response($data,200);
    }
    public function getAffectLocOf(User $user,Inventaire $inventaire,AffectationRepository $repo){
        {
            $tabLoc=[];
            $tabId=[];
            $affectations=$repo->findBy(['user'=>$user,'inventaire'=>$inventaire]);
            foreach ($affectations as $affectation) {
                array_push($tabId,$affectation->getLocalite()->getId());
            }
            return [$tabLoc,$tabId];
        }
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
    * @Route("/immobilisations/delete/{id}/entreprise", methods={"GET"})
    */
    public function deleteByEntreprise($id){
        //@TODO::Costumiser cette methode
        $all=$this->repoImmo->findBy(['entreprise' => $id]);
        foreach ($all as $immo) {
            $this->manager->remove($immo);
        }
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => "Supprimer",
            Shared::STATUS => 200
        ]);
    }

    /**
    * @Route("/mobile/data", methods={"POST"})
    */
    public function treatmentMobileFile(Request $request,MobileTokenRepository $tokenRepo){
        $data=Shared::getData($request)['inventaire'];
        $inventaire=$this->repoInv->find($data['id']);
        $this->treatmentNewLoc($data,$inventaire,$tokenRepo);
        $this->treatmentImmo($data,$inventaire);
        $closed = $inventaire->getClosedLoc()?$inventaire->getClosedLoc():[];
        $beginned = $inventaire->getBeginnedLoc() ? $inventaire->getBeginnedLoc() : [];
        if(isset($data["close"])) {
            $closed=array_merge($closed, $data["close"]);
            $closed=array_unique($closed);
        }
        $filteredBeginned = [];
        if(isset($data["begin"])) {
            foreach ($data['begin'] as $value) {
                // Suppression des localite entamé et close
                if (!in_array($value, $closed)) {
                    $filteredBeginned[] = $value;
                }
            }
            $filteredBeginned = array_unique($filteredBeginned);
        }
        $inventaire->setClosedLoc($closed);
        $inventaire->setBeginnedLoc($filteredBeginned);
        $this->manager->flush();

        return $this->json([
            Shared::MESSAGE => Shared::ENREGISTRER,
            Shared::CODE => 200
        ]);
    }
    public function treatmentNewLoc($data,$inventaire,MobileTokenRepository $tokenRepo){
        $idEse=$inventaire->getEntreprise()->getId();
        $localites=$data['localites'];
        $profondeur=0;
        $newLoc=[];
        if(!$tokenRepo->findOneByToken($data["token"])){
            /** only one problem if we have new localities in the next file with same token */
            foreach($localites as $loc) {
                if(!$this->repoLoc->findOneInIdTampon($loc["id"])){  
                    $profondeur=(count(explode("-",$loc["id"]))-1)>=$profondeur?(count(explode("-",$loc["id"]))-1):$profondeur;     
                    $id=$loc["id"];
                    $idParent=$loc["idParent"];
                    $parent=$this->repoLoc->find($idParent);
                    $localite=new Localite();
                    if($parent){//1ere sous couche
                        $localite->setParent($parent)->setCreateur($parent->getCreateur())
                            ->setEntreprise($parent->getEntreprise());
                    }
                    $localite->setNom($loc['nom'])->setIdTampon([$id,$idParent]);
                    $this->manager->persist($localite);
                }
            }
            if($profondeur>0){
                $entreprise=$this->repoEse->find($idEse);
                $subdivs=$entreprise->getSubdivisions();
                $last=!empty($subdivs)?$subdivs[count($subdivs)-1]:null;
                for($i=0;$i<$profondeur;$i++){
                    array_push($subdivs,"Sous-".$last." ".($i+1)); //sous-zone 1
                }
                $entreprise->setSubdivisions($subdivs);
            }
            $this->manager->flush();//it s for locality
            foreach($localites as $loc) {
                $localite=$this->repoLoc->findOneInIdTampon($loc["id"]);
                array_push($newLoc,$localite);
                if($localite && !$localite->getParent()){
                    //2em sous couche
                    $parent=$this->repoLoc->findOneInIdTampon($loc["idParent"]);
                    $localite->setParent($parent);
                    if($parent->getCreateur() && !$localite->getCreateur()){//egalement pour ne pas ecraser 
                        $localite->setCreateur($parent->getCreateur())->setEntreprise($parent->getEntreprise());
                    }
                }
            }
            $token =new MobileToken();
            $token->setToken($data["token"]);
            $this->manager->persist($token);
            $this->notiSG($newLoc,$data);
            $this->manager->flush();
        }
    }
    public function treatmentImmo($data,$inventaire){
        $immos=$data['immos'];
        foreach($immos as $immo){
            $immobilisation=new Immobilisation();
            
            if($immo['status']=='1'){
                $immobilisation=$this->repoImmo->find($immo["id"]);
                if($immobilisation->getInventaire()->getId()!=$data['id']){
                    throw new HttpException(403,"Une des immobilisations n'appartient pas à cette inventaire.");
                }
            }
            else{
                $im=$this->repoImmo->findOneBy(['libelle'=>$immo["libelle"],'code'=>$immo["code"],'description'=>$immo["description"],'inventaire'=>$inventaire]);
                if($im){
                    $immobilisation=$im;
                }
                $immobilisation->setLibelle($immo["libelle"])->setEndLibelle($immo["libelle"])->setCode($immo["code"])->setDescription($immo["description"])
                ->setEndDescription($immo["description"])->setInventaire($inventaire)->setEntreprise($inventaire->getEntreprise());
            }
            $immobilisation->setLecteur($this->repoUser->find($immo["lecteur"]))
                ->setEndEtat($immo["etat"])->setStatus($immo["status"])
                ->setImage($immo["image"])
                ->setDateLecture(new DateTime($immo["date"]));
            $loc=$this->repoLoc->find($immo["emplacement"]);
            if(!$loc){
                /** For the new locality */
                $loc=$this->repoLoc->findOneInIdTampon($immo["emplacement"]);
            }
            if($loc){
                /** two il and not one and else because we need the second $loc here too */
              $loc->setIdTampon(null);/** init because other phone can take the same */ 
              $immobilisation->setLocalite($loc);
            }
            $this->manager->persist($immobilisation);
        }
    }
    public function notiSG($newLoc,$data){
        $user=$this->repoUser->find($data["idCE"]);
        foreach ($newLoc as $localite) {
            $nomNew=$localite->getNom();
            $message=$user->getNom()." vient d'ajouter $nomNew dans la liste des localités.";
            $notif=new Notification();
            $id=$localite->getId();
            $idHash= $id?Shared::hashId($id):null;
            $lien=$idHash?"/zonage/$idHash":"/zonage";
            $notif->setLien($lien)
                ->setEmetteur($user)
                ->setMessage($message)
                ->setType(Shared::NOTIFICATION)
                ->setDate(new \DateTime());
            $this->manager->persist($notif);
            $supervGens=$this->repoUser->findAllSuperViseurGene($user->getId());
            foreach($supervGens as $supervGen){
                $userNotif=new UserNotif($this->bus);
                $userNotif->setRecepteur($supervGen)->setNotification($notif)->setStatus(0);
                $this->manager->persist($userNotif); 
            }
        }
        
    }
    /**
    * @Route("/code/defectueux", methods={"POST"})
    */
    public function ajoutCodeBarre(Request $request){
        $data=Shared::getData($request);
        $immo=$this->repoImmo->find($data["id"]);
        $codeBefore=$immo->getCode();
        $matchedBefore=$immo->getIsMatched();
        Shared::isExiste($immo);
        $code=$data["code"];
        $immo->setCode($code);
        if($matchedBefore){
            $immo->setIsMatched(false)->setMatchedImmo(null);
            $matchedImmoBefore=$this->repoImmo->findOneByCode($codeBefore);
            $matchedImmoBefore->setIsMatched(null)->setLecteur(null)->setLocalite(null)
                        ->setEndEtat(null)->setStatus(null)->setImage(null)->setDateLecture(null);
        }
        if($data["match"]){
            $matchedImmo=$this->repoImmo->findOneByCode($code);
            $matchedImmo->setIsMatched(true)->setLecteur($immo->getLecteur())
                        ->setLocalite($immo->getLocalite())->setEndEtat($immo->getEndEtat())->setImage($immo->getImage())
                        ->setDateLecture($immo->getDateLecture())->setStatus(1);
            $immo->setIsMatched(true)->setMatchedImmo($matchedImmo);
        }
        
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => Shared::ENREGISTRER,
            Shared::CODE => 200
        ]);
    }

    /**
    * @Route("/approuve/ajustement/{id}/{value}", methods={"GET"})
    */
    public function approuveAjustement($id,$value){
        $immo=$this->repoImmo->find($id);
        $immo->setApprovStatus($value);
        $message=$value=="1"?"L'ajustement d'une immobilisation a été approuvé.":"L'ajustement d'une immobilisation a été rejeté.";
        $notif=new Notification();
        $id=$immo->getId();
        $idHash= $id?Shared::hashId($id):null;
        $lien=$idHash?"/ajuster/fi/$idHash":"/ajuster/fi";
        $notif->setLien($lien)
              ->setEmetteur($this->userCo)
              ->setMessage($message)
              ->setType(Shared::NOTIFICATION)
              ->setDate(new \DateTime());
        $this->manager->persist($notif);
        $userNotif=new UserNotif($this->bus);
        $userNotif->setRecepteur($immo->getAjusteur())->setNotification($notif)->setStatus(0);
        $this->manager->persist($userNotif); 
        $this->manager->flush();
        return $this->json([
            Shared::MESSAGE => Shared::ENREGISTRER,
            Shared::CODE => 200
        ]);
    }

    /**
    * @Route("/approuve/waitting/{id}", methods={"GET"})
    */
    public function approuveWaittingByEse($id) {
        //@TODO::URGENT::Revoir cette fonctionnalité pour permettre les notifications, prévoir la pagination
        return $this->json(0);
        $entreprise=$this->repoEse->find($id);
        $inv=$this->repoInv->findOneBy(['entreprise' => $entreprise,'status' => Shared::OPEN],["id" => "DESC"]);
        $immos=$this->repoImmo->findBy(["inventaire"=>$inv,"approvStatus"=>0]);
        return $this->json(count($immos));
    }

    /**
     * @Route("/dashbord/{id}", methods={"POST"})
     */
    public function bashbordData(SerializerInterface $serializer,Request $request,AffectationRepository $repoAff, ApproveInstRepository $approveInstRepository, $id=null){
        $data=Shared::getData($request);

        $user = $this->getUser();

        $inventaire= $this->repoInv->find($data['id']);

        if (!$user->inEntreprise($inventaire->getEntreprise())) {
            return $this->json([], 200);
        }

        //si superviseur ou sup gen tous les immos
        $immos=$this->repoImmo->findByInventaire($inventaire);

        $affectations = [];

        if($this->droit->isGranted('ROLE_SuperViseurAdjoint')){
            //si sup adjoint les immos de sa loc
           $immos=$this->repoImmo->findImmoSupAdjoint($this->userCo); 
        }elseif($this->droit->isGranted('ROLE_CE')){
            //si chef equipes les immos ou il est
            $affectations=$repoAff->findBy(['user'=>$this->userCo, 'inventaire'=>$inventaire]);
            $immos=$this->getImmoInMyLocalities($affectations,$immos);
        }elseif($this->droit->isGranted('ROLE_MI')){
            //mi les immos qu ils a scannees
            $user=$this->repoUser->find($this->userCo->getId());
            $immos=$user->getScanImmos();
        }

        $inventaireLocalites = $this->manager->getRepository(InventaireLocalite::class)->findBy(['inventaire' => $inventaire->getId()]);
        $localites = [];

        foreach ($inventaireLocalites as $inventaireLocalite) {
            $localites[] = $inventaireLocalite->getLocalite();
        }

        $allLocalites = array_unique($this->getChilds($localites));

        $_localitesId = [];

        foreach ($allLocalites as $value) {
            $_localitesId[] = $value->getId();
        }

        $localitesId = $this->filtreByAffectation($_localitesId, $affectations);

        $closedId = $this->filtreByAffectation($inventaire->getClosedLoc(), $affectations);//pour zone comptées par rapport aux zones qui lui sont affecté
        $beginnedId = $this->filtreByAffectation($inventaire->getBeginnedLoc(), $affectations);//pour zone entamées par rapport aux zones qui lui sont affecté

        $zones = [
            'pended' => count($localitesId) - count(array_unique(array_merge($beginnedId, $closedId))),
            'beginned' => count($beginnedId),
            'closed' => count($closedId)
        ];

        // $locInventories=$this->filtreByAffectation($this->loopOfImmo($immos)[0],$affectations);

        $inventairesCloses = $this->repoInv->findBy(['status' => 'close']);

        $approv = $approveInstRepository->findBy(['inventaire' => $inventaire->getId(), 'status'=> 1]);
        $allUsers = $inventaire->getEntreprise()->getUsers();
        $prisConnaissance = count($approv);

        $instructions = ['prisConnaissance' => $prisConnaissance, 'pasPrisConnaissance' => (count($allUsers) - 1) - $prisConnaissance];

        //me les immos qu ils a scannees
        // $d = $serializer->serialize(['zones' => $zones, 'immobilisations' => $immos], 'json', ['groups' => ['entreprise_read']]);
        return $this->json(['zones' => $zones, 'immobilisations' => $immos, 'instructions' => $instructions, 'inventairesCloses' => count($inventairesCloses)], 200);
    }

    public function getChilds($localites) {
        $listChilds = [];
        foreach ($localites as $localite) {
            $childs = $this->repoLoc->findBy(['parent' => $localite]);
            if (count($childs) > 0) {
                $listChilds = array_merge($listChilds, $this->getChilds($childs));
            } else {
                $listChilds[] = $localite;
            }
        }
        return $listChilds;
    }

    public function getLastLevelChilds($localite) {
        $firstChilds = $this->repoLoc->findBy(['parent' => $localite->getId()]);
        $lastChilds = [];

        foreach ($firstChilds as $firstChild) {
            $childs = $this->repoLoc->findBy(['parent' => $firstChild->getId()]);
            while (is_array($childs) && count($childs) > 0) {
                $childs = $this->repoLoc->findBy(['parent' => $localite->getId()]);
            }
        }
        return $lastChilds;
    }

    public function getImmoInMyLocalities($affectations,$immos){
        $myImmos=[];
        foreach ($immos as $immo) {
            foreach ($affectations as $affectation) {
                if($immo instanceof Immobilisation && $immo->getLocalite() &&
                   $affectation instanceof Affectation && $affectation->getLocalite() && 
                   $affectation->getLocalite()->getId()==$immo->getLocalite()->getId()){
                    array_push($myImmos,$immo);
                    break;
                }
            }
        }
        return $myImmos;
    }

    public function loopOfImmo($immos){
        $idZones=[];
        foreach ($immos as $immo) {
            if($immo instanceof Immobilisation && $immo->getLocalite()){
                array_push($idZones,$immo->getId());
            }
        }
        $idZones=array_unique($idZones);
        return [$idZones];
    }

    public function filtreByAffectation($allId, $affectations) {
        if (!is_array($allId)) {
            $allId = [];
        }
        if($this->droit->isGranted('ROLE_SuperViseurGene') || $this->droit->isGranted('ROLE_SuperViseurAdjoint') || $this->droit->isGranted('ROLE_SuperViseur')){
            return $allId;
        }
        $ids=[];
        foreach ($affectations as $affectation) {
            if($affectation instanceof Affectation && $affectation->getLocalite() && 
                in_array($affectation->getLocalite()->getId(),$allId)){
                array_push($ids,$affectation->getLocalite()->getId());
            }
        }
        return $ids;
    }

    public function onlyId($collection){
        $ids=[];
        foreach ($collection as $object) {
            array_push($ids,$object->getId());
        }
        return $ids;
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