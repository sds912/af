<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200723164711 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire_immobilisation (inventaire_id INT NOT NULL, immobilisation_id INT NOT NULL, INDEX IDX_E8BA6523CE430A85 (inventaire_id), INDEX IDX_E8BA6523988E7A58 (immobilisation_id), PRIMARY KEY(inventaire_id, immobilisation_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inventaire_immobilisation ADD CONSTRAINT FK_E8BA6523CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_immobilisation ADD CONSTRAINT FK_E8BA6523988E7A58 FOREIGN KEY (immobilisation_id) REFERENCES immobilisation (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE inventaire_inventaire');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire_inventaire (inventaire_source INT NOT NULL, inventaire_target INT NOT NULL, INDEX IDX_F91E9265E538EEF2 (inventaire_target), INDEX IDX_F91E9265FCDDBE7D (inventaire_source), PRIMARY KEY(inventaire_source, inventaire_target)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE inventaire_inventaire ADD CONSTRAINT FK_F91E9265E538EEF2 FOREIGN KEY (inventaire_target) REFERENCES inventaire (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_inventaire ADD CONSTRAINT FK_F91E9265FCDDBE7D FOREIGN KEY (inventaire_source) REFERENCES inventaire (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('DROP TABLE inventaire_immobilisation');
    }
}
