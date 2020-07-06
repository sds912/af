<?php

namespace App\Repository;

use App\Entity\SousZone;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SousZone|null find($id, $lockMode = null, $lockVersion = null)
 * @method SousZone|null findOneBy(array $criteria, array $orderBy = null)
 * @method SousZone[]    findAll()
 * @method SousZone[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SousZoneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SousZone::class);
    }

    // /**
    //  * @return SousZone[] Returns an array of SousZone objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?SousZone
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
