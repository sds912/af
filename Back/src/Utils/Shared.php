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
    const IMAGEDEFAULT2="exemple2.png";//les Ese
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
    const OPEN="open";
    const CLOSE="close";
    const ENREGISTRER="Enregistré";
    const ALPHAB=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    const NUMB=['0','1','2','3','4','5','6','7','8','9'];
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
    public static function getIndexAZ($caract){
        return array_search(strtoupper($caract), self::ALPHAB);
    }
    public static function getEquivOf($chiffre){
        return array_search(strtoupper($chiffre), self::NUMB);
    }
    public static function hashMdp($text){
        $t = str_replace($text, "0", "Z");
        for ($i=0; $i <=9; $i++) { 
            $t = str_replace($t, $i, "Z");
        }
    }
}