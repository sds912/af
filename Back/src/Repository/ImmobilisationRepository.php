<?php

namespace App\Repository;

use App\Entity\Immobilisation;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @method Immobilisation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Immobilisation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Immobilisation[]    findAll()
 * @method Immobilisation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImmobilisationRepository extends ServiceEntityRepository
{
    /** @var AuthorizationCheckerInterface */
    private $droit;
    public function __construct(ManagerRegistry $registry,AuthorizationCheckerInterface $checker)
    {
        parent::__construct($registry, Immobilisation::class);
        $this->droit=$checker;
    }

    /**
     * @return Immobilisation[] Returns an array of Immobilisation objects
     */
    public function findImmoSupAdjoint(User $user){
        $immos= $this->createQueryBuilder('i')
        ->join("i.localite",'localite')->
        andWhere('localite.createur = :user')
        ->setParameter('user', $user);
        return $immos->getQuery()->getResult();
    }

    // /**
    //  * @return Immobilisation[] Returns an array of Immobilisation objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /**
     * @return Immobilisation Returns an Immobilisation object
     */
    public function getLastImportedImmobilisation(): ?Immobilisation
    {
        $qb = $this->createQueryBuilder('i');
        return $qb->where($qb->expr()->isNotNull("i.recordKey"))
            ->orderBy("id", "DESC")
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
