<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200707141654 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_localite (user_id INT NOT NULL, localite_id INT NOT NULL, INDEX IDX_155A00A9A76ED395 (user_id), INDEX IDX_155A00A9924DD2B5 (localite_id), PRIMARY KEY(user_id, localite_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_zone (user_id INT NOT NULL, zone_id INT NOT NULL, INDEX IDX_DA6A8CCEA76ED395 (user_id), INDEX IDX_DA6A8CCE9F2C3FAB (zone_id), PRIMARY KEY(user_id, zone_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_sous_zone (user_id INT NOT NULL, sous_zone_id INT NOT NULL, INDEX IDX_2E0613AFA76ED395 (user_id), INDEX IDX_2E0613AFBC2547E6 (sous_zone_id), PRIMARY KEY(user_id, sous_zone_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_localite ADD CONSTRAINT FK_155A00A9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_localite ADD CONSTRAINT FK_155A00A9924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_zone ADD CONSTRAINT FK_DA6A8CCEA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_zone ADD CONSTRAINT FK_DA6A8CCE9F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_sous_zone ADD CONSTRAINT FK_2E0613AFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_sous_zone ADD CONSTRAINT FK_2E0613AFBC2547E6 FOREIGN KEY (sous_zone_id) REFERENCES sous_zone (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE user_localite');
        $this->addSql('DROP TABLE user_zone');
        $this->addSql('DROP TABLE user_sous_zone');
    }
}
