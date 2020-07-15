<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200714085035 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire_zone (inventaire_id INT NOT NULL, zone_id INT NOT NULL, INDEX IDX_6FA79DC2CE430A85 (inventaire_id), INDEX IDX_6FA79DC29F2C3FAB (zone_id), PRIMARY KEY(inventaire_id, zone_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventaire_localite (inventaire_id INT NOT NULL, localite_id INT NOT NULL, INDEX IDX_87379856CE430A85 (inventaire_id), INDEX IDX_87379856924DD2B5 (localite_id), PRIMARY KEY(inventaire_id, localite_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventaire_sous_zone (inventaire_id INT NOT NULL, sous_zone_id INT NOT NULL, INDEX IDX_39691BACE430A85 (inventaire_id), INDEX IDX_39691BABC2547E6 (sous_zone_id), PRIMARY KEY(inventaire_id, sous_zone_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inventaire_zone ADD CONSTRAINT FK_6FA79DC2CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_zone ADD CONSTRAINT FK_6FA79DC29F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_localite ADD CONSTRAINT FK_87379856CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_localite ADD CONSTRAINT FK_87379856924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_sous_zone ADD CONSTRAINT FK_39691BACE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_sous_zone ADD CONSTRAINT FK_39691BABC2547E6 FOREIGN KEY (sous_zone_id) REFERENCES sous_zone (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE inventaire_zone');
        $this->addSql('DROP TABLE inventaire_localite');
        $this->addSql('DROP TABLE inventaire_sous_zone');
    }
}
