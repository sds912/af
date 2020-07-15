<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200706090138 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE sous_zone (id INT AUTO_INCREMENT NOT NULL, zone_id INT DEFAULT NULL, libelle VARCHAR(255) NOT NULL, INDEX IDX_2EE69E4B9F2C3FAB (zone_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE sous_zone ADD CONSTRAINT FK_2EE69E4B9F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id)');
        $this->addSql('ALTER TABLE zone DROP FOREIGN KEY FK_A0EBC007727ACA70');
        $this->addSql('DROP INDEX IDX_A0EBC007727ACA70 ON zone');
        $this->addSql('ALTER TABLE zone DROP parent_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE sous_zone');
        $this->addSql('ALTER TABLE zone ADD parent_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE zone ADD CONSTRAINT FK_A0EBC007727ACA70 FOREIGN KEY (parent_id) REFERENCES zone (id)');
        $this->addSql('CREATE INDEX IDX_A0EBC007727ACA70 ON zone (parent_id)');
    }
}
