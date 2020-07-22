<?php
namespace App\Doctrine;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use App\Entity\Entreprise;
use App\Entity\Inventaire;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Exception\HttpException;

class MyInventaire implements QueryCollectionExtensionInterface,QueryItemExtensionInterface{//pour un get d une collection et le get d'un seul élément video 80 lior
    
    private $userCo;
    private $droit;
    public function __construct(Security $security,AuthorizationCheckerInterface $checker)
    {
        $this->userCo=$security->getUser();
        $this->droit=$checker;
    }
    public function applyToCollection(QueryBuilder $queryBuilder,
                                      QueryNameGeneratorInterface $queryNameGenerator, 
                                      string $resourceClass, 
                                      ?string $operationName = null)
    {
        if($resourceClass===Inventaire::class){//ca marche mais ca rend les requetes lent
            // $rootAlias=$queryBuilder->getRootAliases()[0];
            // $queryBuilder->join("$rootAlias.entreprise",'entreprise')
            // ->join("entreprise.users",'user')
            // ->andWhere('user = :user')
            // ->setParameter('user', $this->userCo);
        }
    }
    public function applyToItem(QueryBuilder $queryBuilder,QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
    }
}