<?php

namespace App\Repository;

use App\Entity\InventaireLocalite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method InventaireLocalite|null find($id, $lockMode = null, $lockVersion = null)
 * @method InventaireLocalite|null findOneBy(array $criteria, array $orderBy = null)
 * @method InventaireLocalite[]    findAll()
 * @method InventaireLocalite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InventaireLocaliteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InventaireLocalite::class);
    }

    public function deleteByLocalites($ids): void
    {
        $this->createQueryBuilder('i')
            ->where('i.localite in (:ids)')
            ->setParameter('ids', $ids)
            ->delete()
            ->getQuery()
            ->execute();
    }

    /**
     * @return InventaireLocalite[] Returns an array of InventaireLocalite objects
     */
    public function findByInventaireAndLevel($inventaire, $level)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.inventaire = :inventaire')
            ->setParameter('inventaire', $inventaire)
            ->leftJoin('i.localite','l')
            ->andWhere('l.level = :level')
            ->setParameter('level', $level)
            ->distinct()
            ->getQuery()
            ->getResult()
        ;
    }

    /*
    public function findOneBySomeField($value): ?InventaireLocalite
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
