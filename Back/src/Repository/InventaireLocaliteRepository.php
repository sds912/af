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

    public function deleteMultipleByIventaire($idInventaire): void
    {
        $qb = $this->createQueryBuilder('i');
        $qb->delete();
        $qb->where('i.inventaire = :idInventaire');
        $qb->setParameter('idInventaire', $idInventaire);

        $qb->getQuery()->execute();
    }

    // /**
    //  * @return InventaireLocalite[] Returns an array of InventaireLocalite objects
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
