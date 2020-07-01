<?php
namespace App\Utils;

use App\Entity\Balance;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Shared{
    const GROUPS = 'groups';
    const CONTENT_TYPE='Content-Type';
    const APPLICATION_TYPE='application/json';
    const STATUS="status";
    const MESSAGE="message";
    const NOTFOUND="Ressource non trouvée !!";
    const ACTIF="actif";
    const BLOQUE="bloque"; 
    const LIST_USER="list-user";
    const LIST_ENT="list-entreprise";
    const NOTIFICATION="notification";
    const RECEPTEUR="recepteur";
    const AP="AP";
    const CREATION="creation";
    const IMAGE="image";
    const IMAGE_DIR="image_directory";
    const DOC_DIR="document_directory";
    const DEFAULTPWD="azerty";
    const NOTEREVUE="noteRevue";
    const GROUPE="groupe";
    const IMAGEDEFAULT="exemple.jpg";
    const BASEUSERNAME="@Ges-immo.com";//modifier sur le front aussi creation user
    const HERE="HERE";
    const OUT="OUT";
    const ONESHOOT="ONESHOOT";
    const NORMAL="NORMAL";
    const MANY='MANY';
    const ONE='ONE';
    const DEBUT="debut";
    const FIN="fin";
    const ENTREPRISE="entreprise";
    public static function  getData(Request $request){
        $data=json_decode($request->getContent(),true);
        if(!$data){
            $data=$request->request->all();
        }
        return $data;
    }
    public static function sum($montants){
        $sum=0;
        foreach($montants as $montant){
            $sum+=$montant;
        }
        return $sum;
    }
    public static function  hashId($id){
        return $id*52+179580387954682;
    }
    public static function  decodId($id){
        return ($id-179580387954682)/52;
    }
    public static function isExiste($obj){
        if(!$obj){
            throw new HttpException(404,Shared::NOTFOUND);
        }
    }
    public static function trimInTab($tab){
        for($i=0;$i<count($tab);$i++){
            $tab[$i]=trim($tab[$i]);
        }
        return $tab;
    }
}