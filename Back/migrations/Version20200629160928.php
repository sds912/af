<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200629160928 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE entreprise (id INT AUTO_INCREMENT NOT NULL, denomination VARCHAR(255) DEFAULT NULL, ninea VARCHAR(255) DEFAULT NULL, adresse VARCHAR(255) DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, republique VARCHAR(255) DEFAULT NULL, ville VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entreprise_user (entreprise_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_606C16EA4AEAFEA (entreprise_id), INDEX IDX_606C16EA76ED395 (user_id), PRIMARY KEY(entreprise_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE localite (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT DEFAULT NULL, nom VARCHAR(255) NOT NULL, adresse VARCHAR(255) DEFAULT NULL, INDEX IDX_F5D7E4A9A4AEAFEA (entreprise_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE zone (id INT AUTO_INCREMENT NOT NULL, parent_id INT DEFAULT NULL, localite_id INT DEFAULT NULL, adresse VARCHAR(255) DEFAULT NULL, libelle VARCHAR(255) NOT NULL, INDEX IDX_A0EBC007727ACA70 (parent_id), INDEX IDX_A0EBC007924DD2B5 (localite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE entreprise_user ADD CONSTRAINT FK_606C16EA4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entreprise_user ADD CONSTRAINT FK_606C16EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE localite ADD CONSTRAINT FK_F5D7E4A9A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE zone ADD CONSTRAINT FK_A0EBC007727ACA70 FOREIGN KEY (parent_id) REFERENCES zone (id)');
        $this->addSql('ALTER TABLE zone ADD CONSTRAINT FK_A0EBC007924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entreprise_user DROP FOREIGN KEY FK_606C16EA4AEAFEA');
        $this->addSql('ALTER TABLE localite DROP FOREIGN KEY FK_F5D7E4A9A4AEAFEA');
        $this->addSql('ALTER TABLE zone DROP FOREIGN KEY FK_A0EBC007924DD2B5');
        $this->addSql('ALTER TABLE zone DROP FOREIGN KEY FK_A0EBC007727ACA70');
        $this->addSql('DROP TABLE entreprise');
        $this->addSql('DROP TABLE entreprise_user');
        $this->addSql('DROP TABLE localite');
        $this->addSql('DROP TABLE zone');
    }
}
