<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200723185043 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE lecture (id INT AUTO_INCREMENT NOT NULL, inventaire_id INT NOT NULL, immobilisation_id INT NOT NULL, lecteur_id INT DEFAULT NULL, date DATETIME DEFAULT NULL, status VARCHAR(255) DEFAULT NULL, INDEX IDX_C1677948CE430A85 (inventaire_id), INDEX IDX_C1677948988E7A58 (immobilisation_id), INDEX IDX_C167794849DB9E60 (lecteur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE lecture ADD CONSTRAINT FK_C1677948CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id)');
        $this->addSql('ALTER TABLE lecture ADD CONSTRAINT FK_C1677948988E7A58 FOREIGN KEY (immobilisation_id) REFERENCES immobilisation (id)');
        $this->addSql('ALTER TABLE lecture ADD CONSTRAINT FK_C167794849DB9E60 FOREIGN KEY (lecteur_id) REFERENCES user (id)');
        $this->addSql('DROP TABLE inventaire_immobilisation');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire_immobilisation (inventaire_id INT NOT NULL, immobilisation_id INT NOT NULL, INDEX IDX_E8BA6523988E7A58 (immobilisation_id), INDEX IDX_E8BA6523CE430A85 (inventaire_id), PRIMARY KEY(inventaire_id, immobilisation_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE inventaire_immobilisation ADD CONSTRAINT FK_E8BA6523988E7A58 FOREIGN KEY (immobilisation_id) REFERENCES immobilisation (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_immobilisation ADD CONSTRAINT FK_E8BA6523CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('DROP TABLE lecture');
    }
}
