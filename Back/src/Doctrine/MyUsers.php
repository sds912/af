<?php
namespace App\Doctrine;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use App\Entity\Entreprise;
use App\Entity\User;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class MyUsers implements QueryCollectionExtensionInterface,QueryItemExtensionInterface{//pour un get d une collection et le get d'un seul élément video 80 lior
    
    private $userCo;
    private $droit;
    public function __construct(Security $security,AuthorizationCheckerInterface $checker)
    {
        $this->userCo=$security->getUser();//quand on l utilise ne pas oublier de mettre instanceof User pour si l utilisateur n est pas co
        $this->droit=$checker;// donc on pourra faire $this->droit->isGranted('ROLE_ADMIN') pour avoir le role de la personne co
    }
    public function applyToCollection(QueryBuilder $queryBuilder, //la requete à envoyer
                                      QueryNameGeneratorInterface $queryNameGenerator, 
                                      string $resourceClass, //le nom de la classe ex si on fait un getEntreprise ici resourceClass sera Entreprise
                                      ?string $operationName = null)
    {//de l interface QueryCollectionExtensionInterface

        if($resourceClass===User::class && !$this->droit->isGranted('ROLE_SuperAdmin')){
            $rootAlias=$queryBuilder->getRootAliases()[0];//tableau d alias ex dans une requete query builder $this->createQueryBuilder('u')->andWhere('u.exampleField = :val') ici u est un alias
            $queryBuilder->join("$rootAlias.entreprises",'entreprise')
            ->join("entreprise.users",'user')
            ->andWhere('user = :user')
            ->setParameter('user', $this->userCo);//comme dans un query buider
        }
    }
    public function applyToItem(QueryBuilder $queryBuilder,QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {//de l interface QueryItemExtensionInterface
    }
}