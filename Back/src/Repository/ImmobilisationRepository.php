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
    public function findImmoSupAdjoint(User $user, $inventaire = null){
        $immos= $this->createQueryBuilder('i')
        ->join("i.localite",'localite')
        ->andWhere('localite.createur = :user')
        ->setParameter('user', $user);
        if ($inventaire) {
            $immos->join("i.inventaire",'inventaire')
                ->andWhere('inventaire.id = :inventaire')
                ->setParameter('inventaire', $inventaire);
        }

        return $immos->getQuery()->getResult();
    }

    public function getCountImmobilisations(int $idEntreprise)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.entreprise = :entreprise')
            ->setParameter('entreprise', $idEntreprise)
            ->select('count(i.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getLastImportedImmobilisation($idEntreprise): ?Immobilisation
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.recordKey IS NOT NULL')
            ->andWhere('i.entreprise = :entreprise')
            ->setParameter('entreprise', $idEntreprise)
            ->orderBy('i.id', 'DESC')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
