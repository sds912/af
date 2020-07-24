<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200723164459 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire_inventaire (inventaire_source INT NOT NULL, inventaire_target INT NOT NULL, INDEX IDX_F91E9265FCDDBE7D (inventaire_source), INDEX IDX_F91E9265E538EEF2 (inventaire_target), PRIMARY KEY(inventaire_source, inventaire_target)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inventaire_inventaire ADD CONSTRAINT FK_F91E9265FCDDBE7D FOREIGN KEY (inventaire_source) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_inventaire ADD CONSTRAINT FK_F91E9265E538EEF2 FOREIGN KEY (inventaire_target) REFERENCES inventaire (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE inventaire_inventaire');
    }
}
