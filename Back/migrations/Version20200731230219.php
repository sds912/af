<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200731230219 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inventaire_sous_zone DROP FOREIGN KEY FK_39691BABC2547E6');
        $this->addSql('ALTER TABLE user_sous_zone DROP FOREIGN KEY FK_2E0613AFBC2547E6');
        $this->addSql('ALTER TABLE inventaire_zone DROP FOREIGN KEY FK_6FA79DC29F2C3FAB');
        $this->addSql('ALTER TABLE sous_zone DROP FOREIGN KEY FK_2EE69E4B9F2C3FAB');
        $this->addSql('ALTER TABLE user_zone DROP FOREIGN KEY FK_DA6A8CCE9F2C3FAB');
        $this->addSql('DROP TABLE inventaire_sous_zone');
        $this->addSql('DROP TABLE inventaire_zone');
        $this->addSql('DROP TABLE sous_zone');
        $this->addSql('DROP TABLE user_sous_zone');
        $this->addSql('DROP TABLE user_zone');
        $this->addSql('DROP TABLE zone');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire_sous_zone (inventaire_id INT NOT NULL, sous_zone_id INT NOT NULL, INDEX IDX_39691BABC2547E6 (sous_zone_id), INDEX IDX_39691BACE430A85 (inventaire_id), PRIMARY KEY(inventaire_id, sous_zone_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE inventaire_zone (inventaire_id INT NOT NULL, zone_id INT NOT NULL, INDEX IDX_6FA79DC29F2C3FAB (zone_id), INDEX IDX_6FA79DC2CE430A85 (inventaire_id), PRIMARY KEY(inventaire_id, zone_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE sous_zone (id INT AUTO_INCREMENT NOT NULL, zone_id INT DEFAULT NULL, nom VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_2EE69E4B9F2C3FAB (zone_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user_sous_zone (user_id INT NOT NULL, sous_zone_id INT NOT NULL, INDEX IDX_2E0613AFBC2547E6 (sous_zone_id), INDEX IDX_2E0613AFA76ED395 (user_id), PRIMARY KEY(user_id, sous_zone_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE user_zone (user_id INT NOT NULL, zone_id INT NOT NULL, INDEX IDX_DA6A8CCE9F2C3FAB (zone_id), INDEX IDX_DA6A8CCEA76ED395 (user_id), PRIMARY KEY(user_id, zone_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE zone (id INT AUTO_INCREMENT NOT NULL, localite_id INT DEFAULT NULL, adresse VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, nom VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_A0EBC007924DD2B5 (localite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE inventaire_sous_zone ADD CONSTRAINT FK_39691BABC2547E6 FOREIGN KEY (sous_zone_id) REFERENCES sous_zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_sous_zone ADD CONSTRAINT FK_39691BACE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_zone ADD CONSTRAINT FK_6FA79DC29F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_zone ADD CONSTRAINT FK_6FA79DC2CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE sous_zone ADD CONSTRAINT FK_2EE69E4B9F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id)');
        $this->addSql('ALTER TABLE user_sous_zone ADD CONSTRAINT FK_2E0613AFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_sous_zone ADD CONSTRAINT FK_2E0613AFBC2547E6 FOREIGN KEY (sous_zone_id) REFERENCES sous_zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_zone ADD CONSTRAINT FK_DA6A8CCE9F2C3FAB FOREIGN KEY (zone_id) REFERENCES zone (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_zone ADD CONSTRAINT FK_DA6A8CCEA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE zone ADD CONSTRAINT FK_A0EBC007924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id)');
    }
}
