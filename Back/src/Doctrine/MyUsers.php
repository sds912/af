<?php
namespace App\Doctrine;
use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use App\Entity\Entreprise;
use App\Entity\User;
use App\Utils\Shared;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\RequestStack;

class MyUsers implements QueryCollectionExtensionInterface,QueryItemExtensionInterface{//pour un get d une collection et le get d'un seul élément video 80 lior
    /** @var User */
    private $userCo;
    private $droit;
    protected $requestStack;

    public function __construct(Security $security,AuthorizationCheckerInterface $checker, RequestStack $requestStack)
    {
        $this->userCo=$security->getUser();//quand on l utilise ne pas oublier de mettre instanceof User pour si l utilisateur n est pas co
        $this->droit=$checker;// donc on pourra faire $this->droit->isGranted('ROLE_ADMIN') pour avoir le role de la personne co
        $this->requestStack = $requestStack;
    }
    public function applyToCollection(QueryBuilder $queryBuilder, //la requete à envoyer
                                      QueryNameGeneratorInterface $queryNameGenerator, 
                                      string $resourceClass, //le nom de la classe ex si on fait un getEntreprise ici resourceClass sera Entreprise
                                      ?string $operationName = null)
    {//de l interface QueryCollectionExtensionInterface
        if ($resourceClass === User::class) {
            $rootAlias = $queryBuilder->getRootAliases()[0];// tableau d'alias ex dans une requete query builder $this->createQueryBuilder('u')->andWhere('u.exampleField = :val') ici u est un alias
            $request = $this->requestStack->getCurrentRequest();

            if (!$this->droit->isGranted('ROLE_SuperAdmin') && $this->droit->isGranted('ROLE_Admin')) {
                $queryBuilder->join("$rootAlias.entreprises",'entreprise');
                $queryBuilder->join("entreprise.users",'user')
                    ->andWhere('user.id = :id')
                    ->setParameter('id', $this->userCo->getId());
            } elseif (!$this->droit->isGranted('ROLE_SuperAdmin') && !$this->droit->isGranted('ROLE_Admin')) {
                $queryBuilder->join("$rootAlias.entreprises",'entreprise');
                $queryBuilder->andWhere('entreprise.id = :id')->setParameter('id', $this->getIdCurrentEse());
            }
            if (!$request->query->has('status')) {
                $queryBuilder->andWhere(sprintf('%s.status != :status', $rootAlias));
                $queryBuilder->setParameter('status', Shared::OUT);
            }
        }
    }
    public function applyToItem(QueryBuilder $queryBuilder,QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {//de l interface QueryItemExtensionInterface
        // if($resourceClass===User::class && !$this->droit->isGranted('ROLE_SuperAdmin')){
        //     $user=$queryBuilder->getOneOrNullResult(); //revoir car cette methode ne marche pas
        //     if( $user && !$this->userCo->inHolding($user)){
        //         throw new HttpException(403,"Vous n'êtes pas dans la même entité que cet utilisateur !");
        //     }
        // }
    }
    public function getIdCurrentEse(){
        if(count($this->userCo->getEntreprises())==1){
            return $this->userCo->getEntreprises()[0]->getId();
        }
        return $this->userCo->getCurrentEse()->getId();
    }
}