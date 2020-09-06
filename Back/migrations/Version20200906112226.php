<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200906112226 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E27CE430A85');
        $this->addSql('DROP INDEX IDX_B1563E27CE430A85 ON immobilisation');
        $this->addSql('ALTER TABLE immobilisation ADD inventaitre_id INT DEFAULT NULL, DROP inventaire_id');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E27B86294C FOREIGN KEY (inventaitre_id) REFERENCES inventaire (id)');
        $this->addSql('CREATE INDEX IDX_B1563E27B86294C ON immobilisation (inventaitre_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E27B86294C');
        $this->addSql('DROP INDEX IDX_B1563E27B86294C ON immobilisation');
        $this->addSql('ALTER TABLE immobilisation ADD inventaire_id INT NOT NULL, DROP inventaitre_id');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E27CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id)');
        $this->addSql('CREATE INDEX IDX_B1563E27CE430A85 ON immobilisation (inventaire_id)');
    }
}
