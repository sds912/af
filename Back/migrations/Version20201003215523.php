<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201003215523 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE immobilisation ADD matched_immo_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E273C43260F FOREIGN KEY (matched_immo_id) REFERENCES immobilisation (id)');
        $this->addSql('CREATE INDEX IDX_B1563E273C43260F ON immobilisation (matched_immo_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E273C43260F');
        $this->addSql('DROP INDEX IDX_B1563E273C43260F ON immobilisation');
        $this->addSql('ALTER TABLE immobilisation DROP matched_immo_id');
    }
}
