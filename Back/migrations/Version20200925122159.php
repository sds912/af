<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200925122159 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE affectation (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, inventaire_id INT DEFAULT NULL, localite_id INT DEFAULT NULL, debut DATETIME DEFAULT NULL, fin DATETIME DEFAULT NULL, INDEX IDX_F4DD61D3A76ED395 (user_id), INDEX IDX_F4DD61D3CE430A85 (inventaire_id), INDEX IDX_F4DD61D3924DD2B5 (localite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE approve_inst (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, inventaire_id INT NOT NULL, status TINYINT(1) NOT NULL, INDEX IDX_2D088A76A76ED395 (user_id), INDEX IDX_2D088A76CE430A85 (inventaire_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE device (id INT AUTO_INCREMENT NOT NULL, imei VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entreprise (id INT AUTO_INCREMENT NOT NULL, denomination VARCHAR(255) DEFAULT NULL, ninea VARCHAR(255) DEFAULT NULL, adresse VARCHAR(255) DEFAULT NULL, image LONGTEXT DEFAULT NULL, republique VARCHAR(255) DEFAULT NULL, ville VARCHAR(255) DEFAULT NULL, sigle_usuel VARCHAR(255) DEFAULT NULL, capital DOUBLE PRECISION DEFAULT NULL, subdivisions LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE entreprise_user (entreprise_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_606C16EA4AEAFEA (entreprise_id), INDEX IDX_606C16EA76ED395 (user_id), PRIMARY KEY(entreprise_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE immobilisation (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT DEFAULT NULL, inventaire_id INT DEFAULT NULL, lecteur_id INT DEFAULT NULL, localite_id INT DEFAULT NULL, libelle VARCHAR(255) NOT NULL, code VARCHAR(255) DEFAULT NULL, compte_immo VARCHAR(255) DEFAULT NULL, compte_amort VARCHAR(255) DEFAULT NULL, emplacement VARCHAR(255) DEFAULT NULL, date_acquisition DATE DEFAULT NULL, date_mise_serv DATE DEFAULT NULL, date_sortie DATE DEFAULT NULL, duree_utilite VARCHAR(255) DEFAULT NULL, taux DOUBLE PRECISION DEFAULT NULL, val_origine DOUBLE PRECISION DEFAULT NULL, dotation DOUBLE PRECISION DEFAULT NULL, cumul_amortiss DOUBLE PRECISION DEFAULT NULL, vnc DOUBLE PRECISION DEFAULT NULL, etat VARCHAR(255) DEFAULT NULL, description LONGTEXT DEFAULT NULL, numero_ordre VARCHAR(255) DEFAULT NULL, end_etat VARCHAR(255) DEFAULT NULL, status VARCHAR(255) DEFAULT NULL, image LONGTEXT DEFAULT NULL, date_lecture DATETIME DEFAULT NULL, INDEX IDX_B1563E27A4AEAFEA (entreprise_id), INDEX IDX_B1563E27CE430A85 (inventaire_id), INDEX IDX_B1563E2749DB9E60 (lecteur_id), INDEX IDX_B1563E27924DD2B5 (localite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventaire (id INT AUTO_INCREMENT NOT NULL, presi_comite_id INT DEFAULT NULL, entreprise_id INT NOT NULL, debut DATE DEFAULT NULL, fin DATE DEFAULT NULL, instruction LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', lieu_reunion VARCHAR(255) DEFAULT NULL, date_reunion DATETIME DEFAULT NULL, presents_reunion_out LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', pv_reunion LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', decision_cc LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', local_instruction_pv LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', date_inv DATE DEFAULT NULL, status VARCHAR(255) DEFAULT NULL, INDEX IDX_338920E0C915C04F (presi_comite_id), INDEX IDX_338920E0A4AEAFEA (entreprise_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE membres_comite (inventaire_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_39CC58B8CE430A85 (inventaire_id), INDEX IDX_39CC58B8A76ED395 (user_id), PRIMARY KEY(inventaire_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventaire_localite (inventaire_id INT NOT NULL, localite_id INT NOT NULL, INDEX IDX_87379856CE430A85 (inventaire_id), INDEX IDX_87379856924DD2B5 (localite_id), PRIMARY KEY(inventaire_id, localite_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE presents_reunion (inventaire_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_5CF2843DCE430A85 (inventaire_id), INDEX IDX_5CF2843DA76ED395 (user_id), PRIMARY KEY(inventaire_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE localite (id INT AUTO_INCREMENT NOT NULL, entreprise_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, createur_id INT DEFAULT NULL, nom VARCHAR(255) NOT NULL, position LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', id_tampon LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', INDEX IDX_F5D7E4A9A4AEAFEA (entreprise_id), INDEX IDX_F5D7E4A9727ACA70 (parent_id), INDEX IDX_F5D7E4A973A201E5 (createur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE mobile_token (id INT AUTO_INCREMENT NOT NULL, token VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, emetteur_id INT DEFAULT NULL, message LONGTEXT NOT NULL, lien VARCHAR(255) NOT NULL, date DATETIME NOT NULL, type VARCHAR(255) DEFAULT NULL, INDEX IDX_BF5476CA79E92E8C (emetteur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE refresh_tokens (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, current_ese_id INT DEFAULT NULL, username VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, nom VARCHAR(255) DEFAULT NULL, poste VARCHAR(255) DEFAULT NULL, departement VARCHAR(255) DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, status VARCHAR(255) DEFAULT NULL, menu LONGTEXT DEFAULT NULL COMMENT \'(DC2Type:json)\', matricule VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), INDEX IDX_8D93D649C5B86428 (current_ese_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_localite (user_id INT NOT NULL, localite_id INT NOT NULL, INDEX IDX_155A00A9A76ED395 (user_id), INDEX IDX_155A00A9924DD2B5 (localite_id), PRIMARY KEY(user_id, localite_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_notif (id INT AUTO_INCREMENT NOT NULL, notification_id INT DEFAULT NULL, recepteur_id INT DEFAULT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_22B1F633EF1A9D84 (notification_id), INDEX IDX_22B1F6333B49782D (recepteur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE affectation ADD CONSTRAINT FK_F4DD61D3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE affectation ADD CONSTRAINT FK_F4DD61D3CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id)');
        $this->addSql('ALTER TABLE affectation ADD CONSTRAINT FK_F4DD61D3924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id)');
        $this->addSql('ALTER TABLE approve_inst ADD CONSTRAINT FK_2D088A76A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE approve_inst ADD CONSTRAINT FK_2D088A76CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id)');
        $this->addSql('ALTER TABLE entreprise_user ADD CONSTRAINT FK_606C16EA4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE entreprise_user ADD CONSTRAINT FK_606C16EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E27A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E27CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id)');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E2749DB9E60 FOREIGN KEY (lecteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E27924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id)');
        $this->addSql('ALTER TABLE inventaire ADD CONSTRAINT FK_338920E0C915C04F FOREIGN KEY (presi_comite_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE inventaire ADD CONSTRAINT FK_338920E0A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE membres_comite ADD CONSTRAINT FK_39CC58B8CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE membres_comite ADD CONSTRAINT FK_39CC58B8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_localite ADD CONSTRAINT FK_87379856CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_localite ADD CONSTRAINT FK_87379856924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE presents_reunion ADD CONSTRAINT FK_5CF2843DCE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE presents_reunion ADD CONSTRAINT FK_5CF2843DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE localite ADD CONSTRAINT FK_F5D7E4A9A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE localite ADD CONSTRAINT FK_F5D7E4A9727ACA70 FOREIGN KEY (parent_id) REFERENCES localite (id)');
        $this->addSql('ALTER TABLE localite ADD CONSTRAINT FK_F5D7E4A973A201E5 FOREIGN KEY (createur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA79E92E8C FOREIGN KEY (emetteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649C5B86428 FOREIGN KEY (current_ese_id) REFERENCES entreprise (id)');
        $this->addSql('ALTER TABLE user_localite ADD CONSTRAINT FK_155A00A9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_localite ADD CONSTRAINT FK_155A00A9924DD2B5 FOREIGN KEY (localite_id) REFERENCES localite (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F633EF1A9D84 FOREIGN KEY (notification_id) REFERENCES notification (id)');
        $this->addSql('ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F6333B49782D FOREIGN KEY (recepteur_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entreprise_user DROP FOREIGN KEY FK_606C16EA4AEAFEA');
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E27A4AEAFEA');
        $this->addSql('ALTER TABLE inventaire DROP FOREIGN KEY FK_338920E0A4AEAFEA');
        $this->addSql('ALTER TABLE localite DROP FOREIGN KEY FK_F5D7E4A9A4AEAFEA');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649C5B86428');
        $this->addSql('ALTER TABLE affectation DROP FOREIGN KEY FK_F4DD61D3CE430A85');
        $this->addSql('ALTER TABLE approve_inst DROP FOREIGN KEY FK_2D088A76CE430A85');
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E27CE430A85');
        $this->addSql('ALTER TABLE membres_comite DROP FOREIGN KEY FK_39CC58B8CE430A85');
        $this->addSql('ALTER TABLE inventaire_localite DROP FOREIGN KEY FK_87379856CE430A85');
        $this->addSql('ALTER TABLE presents_reunion DROP FOREIGN KEY FK_5CF2843DCE430A85');
        $this->addSql('ALTER TABLE affectation DROP FOREIGN KEY FK_F4DD61D3924DD2B5');
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E27924DD2B5');
        $this->addSql('ALTER TABLE inventaire_localite DROP FOREIGN KEY FK_87379856924DD2B5');
        $this->addSql('ALTER TABLE localite DROP FOREIGN KEY FK_F5D7E4A9727ACA70');
        $this->addSql('ALTER TABLE user_localite DROP FOREIGN KEY FK_155A00A9924DD2B5');
        $this->addSql('ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F633EF1A9D84');
        $this->addSql('ALTER TABLE affectation DROP FOREIGN KEY FK_F4DD61D3A76ED395');
        $this->addSql('ALTER TABLE approve_inst DROP FOREIGN KEY FK_2D088A76A76ED395');
        $this->addSql('ALTER TABLE entreprise_user DROP FOREIGN KEY FK_606C16EA76ED395');
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E2749DB9E60');
        $this->addSql('ALTER TABLE inventaire DROP FOREIGN KEY FK_338920E0C915C04F');
        $this->addSql('ALTER TABLE membres_comite DROP FOREIGN KEY FK_39CC58B8A76ED395');
        $this->addSql('ALTER TABLE presents_reunion DROP FOREIGN KEY FK_5CF2843DA76ED395');
        $this->addSql('ALTER TABLE localite DROP FOREIGN KEY FK_F5D7E4A973A201E5');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CA79E92E8C');
        $this->addSql('ALTER TABLE user_localite DROP FOREIGN KEY FK_155A00A9A76ED395');
        $this->addSql('ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F6333B49782D');
        $this->addSql('DROP TABLE affectation');
        $this->addSql('DROP TABLE approve_inst');
        $this->addSql('DROP TABLE device');
        $this->addSql('DROP TABLE entreprise');
        $this->addSql('DROP TABLE entreprise_user');
        $this->addSql('DROP TABLE immobilisation');
        $this->addSql('DROP TABLE inventaire');
        $this->addSql('DROP TABLE membres_comite');
        $this->addSql('DROP TABLE inventaire_localite');
        $this->addSql('DROP TABLE presents_reunion');
        $this->addSql('DROP TABLE localite');
        $this->addSql('DROP TABLE mobile_token');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_localite');
        $this->addSql('DROP TABLE user_notif');
    }
}
