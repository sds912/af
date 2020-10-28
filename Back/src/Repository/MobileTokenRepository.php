<?php

namespace App\Repository;

use App\Entity\MobileToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method MobileToken|null find($id, $lockMode = null, $lockVersion = null)
 * @method MobileToken|null findOneBy(array $criteria, array $orderBy = null)
 * @method MobileToken[]    findAll()
 * @method MobileToken[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MobileTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, MobileToken::class);
    }

    // /**
    //  * @return MobileToken[] Returns an array of MobileToken objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MobileToken
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
