<?php

namespace App\Repository;

use App\Entity\ApproveInst;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ApproveInst|null find($id, $lockMode = null, $lockVersion = null)
 * @method ApproveInst|null findOneBy(array $criteria, array $orderBy = null)
 * @method ApproveInst[]    findAll()
 * @method ApproveInst[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ApproveInstRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ApproveInst::class);
    }

    // /**
    //  * @return ApproveInst[] Returns an array of ApproveInst objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ApproveInst
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
