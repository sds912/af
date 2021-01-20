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
    public function findByInventaireAndStatus($inventaire, $status, $user = null){
        $immos = $this->createQueryBuilder('i')
            ->join("i.inventaire",'inventaire')
            ->andWhere('inventaire.id = :inventaire')
            ->setParameter('inventaire', $inventaire)
            ->andWhere('i.status IN(:status)')
            ->setParameter('status', $status)
        ;
        if ($user) {
            $immos->join("i.localite",'localite')
                ->andWhere('localite.createur = :user')
                ->setParameter('user', $user)
            ;
        }

        return $immos->getQuery()->getResult();
    }

    public function findCountByInventaireAndStatus($inventaire, $status, $user = null, $affectation = false){
        $entityManager = $this->getEntityManager();

        $sqlQuery = "SELECT 
            COUNT(i) as count,
            SUM(case when i.endEtat = 1 then 1 else 0 end) AS bon,
            SUM(case when i.endEtat = 0 then 1 else 0 end) AS mauvais
            FROM App\Entity\Immobilisation AS i
        ";

        $sqlFilters = " WHERE i.inventaire = :inventaire AND i.status in (:status)";

        $parameters = [['inventaire', $inventaire], ['status', $status]];

        if ($user && !$affectation) {
            $sqlQuery .= " JOIN i.localite l";
            $sqlFilters .= " AND l.createur = :user";
            $parameters[] = ['user', $user];
        } elseif ($user && $affectation) {
            $query = $entityManager->createQuery("SELECT DISTINCT l.id FROM App\Entity\Affectation AS a LEFT JOIN a.localite l WHERE a.user = :user and a.inventaire = :inventaire");
            $query->setParameter('inventaire', $inventaire)->setParameter('user', $user);
            $dataIds = $query->getArrayResult();
            $ids = [];
            foreach ($dataIds as $dataIds) {
                $ids[] = $dataIds['id'];
            }
            $sqlQuery .= " JOIN i.localite l";
            $sqlFilters .= " AND l.id IN (:ids)";
            $parameters[] = ['ids', $ids];
        }

        $sqlQuery .= $sqlFilters;

        $query = $entityManager->createQuery($sqlQuery);
        foreach ($parameters as $parameter) {
            $query->setParameter($parameter[0], $parameter[1]);
        }

        return $query->getSingleResult();
    }

    /**
     * @return Immobilisation[] Returns an array of Immobilisation objects
     */
    public function findImmoSupAdjoint($user, $inventaire = null){
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
