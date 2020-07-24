<?php

namespace App\Repository;

use App\Entity\Immobilisation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Immobilisation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Immobilisation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Immobilisation[]    findAll()
 * @method Immobilisation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImmobilisationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Immobilisation::class);
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

    /*
    public function findOneBySomeField($value): ?Immobilisation
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
