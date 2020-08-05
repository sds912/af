<?php

namespace App\Repository;

use App\Entity\UserNotif;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UserNotif|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserNotif|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserNotif[]    findAll()
 * @method UserNotif[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserNotifRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserNotif::class);
    }
    public function findCountNew($id)
    {
        return $this->createQueryBuilder('u')
            ->select('count(u.id)')
            ->andWhere('u.status = :status')
            ->setParameter('status', 0)
            ->join('u.recepteur','recepteur')
            ->andWhere('recepteur.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    // /**
    //  * @return UserNotif[] Returns an array of UserNotif objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserNotif
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
