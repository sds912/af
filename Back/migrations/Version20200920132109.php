<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200920132109 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE lecture');
        $this->addSql('ALTER TABLE immobilisation ADD lecteur_id INT DEFAULT NULL, ADD localite_id INT DEFAULT NULL, ADD end_etat VARCHAR(255) DEFAULT NULL, ADD status VARCHAR(255) DEFAULT NULL, ADD image LONGTEXT DEFAULT NULL, ADD date_lecture DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E2749DB9E60 FOREIGN KEY (lecteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E27924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id)');
        $this->addSql('CREATE INDEX IDX_B1563E2749DB9E60 ON immobilisation (lecteur_id)');
        $this->addSql('CREATE INDEX IDX_B1563E27924DD2B5 ON immobilisation (localite_id)');
        $this->addSql('ALTER TABLE localite CHANGE id_tampon id_tampon LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\'');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE lecture (id INT AUTO_INCREMENT NOT NULL, inventaire_id INT NOT NULL, immobilisation_id INT NOT NULL, lecteur_id INT DEFAULT NULL, date DATETIME DEFAULT NULL, status VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, etat VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_C1677948988E7A58 (immobilisation_id), INDEX IDX_C167794849DB9E60 (lecteur_id), INDEX IDX_C1677948CE430A85 (inventaire_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE lecture ADD CONSTRAINT FK_C167794849DB9E60 FOREIGN KEY (lecteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE lecture ADD CONSTRAINT FK_C1677948988E7A58 FOREIGN KEY (immobilisation_id) REFERENCES immobilisation (id)');
        $this->addSql('ALTER TABLE lecture ADD CONSTRAINT FK_C1677948CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id)');
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E2749DB9E60');
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E27924DD2B5');
        $this->addSql('DROP INDEX IDX_B1563E2749DB9E60 ON immobilisation');
        $this->addSql('DROP INDEX IDX_B1563E27924DD2B5 ON immobilisation');
        $this->addSql('ALTER TABLE immobilisation DROP lecteur_id, DROP localite_id, DROP end_etat, DROP status, DROP image, DROP date_lecture');
        $this->addSql('ALTER TABLE localite CHANGE id_tampon id_tampon LONGTEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_bin`');
    }
}
