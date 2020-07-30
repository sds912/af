<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200730114445 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE localite ADD subdivision_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE localite ADD CONSTRAINT FK_F5D7E4A9E05F13C FOREIGN KEY (subdivision_id) REFERENCES localite (id)');
        $this->addSql('CREATE INDEX IDX_F5D7E4A9E05F13C ON localite (subdivision_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE localite DROP FOREIGN KEY FK_F5D7E4A9E05F13C');
        $this->addSql('DROP INDEX IDX_F5D7E4A9E05F13C ON localite');
        $this->addSql('ALTER TABLE localite DROP subdivision_id');
    }
}
