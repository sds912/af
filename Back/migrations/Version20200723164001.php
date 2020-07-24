<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200723164001 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE immobilisation (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, code VARCHAR(255) DEFAULT NULL, compte_immo VARCHAR(255) DEFAULT NULL, compte_amort VARCHAR(255) DEFAULT NULL, emplacement VARCHAR(255) DEFAULT NULL, date_acquisition DATE DEFAULT NULL, date_mise_serv DATE DEFAULT NULL, date_sortie DATE DEFAULT NULL, duree_utilite DATE DEFAULT NULL, taux DOUBLE PRECISION DEFAULT NULL, val_origine DOUBLE PRECISION DEFAULT NULL, dotation DOUBLE PRECISION DEFAULT NULL, cumul_amortiss DOUBLE PRECISION DEFAULT NULL, vnc DOUBLE PRECISION DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE immobilisation');
    }
}
