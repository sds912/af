<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201111083002 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE support (id INT AUTO_INCREMENT NOT NULL, client_id INT NOT NULL, auteur_id INT NOT NULL, assigner_id INT DEFAULT NULL, type VARCHAR(255) NOT NULL, objet VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, status INT NOT NULL, pieces_jointes JSON DEFAULT NULL, numero VARCHAR(255) NOT NULL, satisfaction INT DEFAULT NULL, closed TINYINT(1) NOT NULL, start_date DATETIME NOT NULL, closed_date DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_8004EBA5F55AE19E (numero), INDEX IDX_8004EBA519EB6921 (client_id), INDEX IDX_8004EBA560BB6FE6 (auteur_id), INDEX IDX_8004EBA594221246 (assigner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE support ADD CONSTRAINT FK_8004EBA519EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE support ADD CONSTRAINT FK_8004EBA560BB6FE6 FOREIGN KEY (auteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE support ADD CONSTRAINT FK_8004EBA594221246 FOREIGN KEY (assigner_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE support');
    }
}
