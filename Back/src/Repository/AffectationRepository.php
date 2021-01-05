<?php

namespace App\Repository;

use App\Entity\Affectation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Affectation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Affectation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Affectation[]    findAll()
 * @method Affectation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AffectationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Affectation::class);
    }

    /**
     * @return Affectation[] Returns an array of Affectation objects
     */
    public function findByInventaireAndLevel($inventaire, $level)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.inventaire = :inventaire')
            ->setParameter('inventaire', $inventaire)
            ->leftJoin('a.localite','l')
            ->andWhere('l.level = :level')
            ->setParameter('level', $level)
            ->distinct()
            ->getQuery()
            ->getResult()
        ;
    }

    /*
    public function findOneBySomeField($value): ?Affectation
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
