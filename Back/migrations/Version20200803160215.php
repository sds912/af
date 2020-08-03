<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200803160215 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, emetteur_id INT DEFAULT NULL, message LONGTEXT NOT NULL, icon VARCHAR(255) DEFAULT NULL, lien VARCHAR(255) NOT NULL, statut VARCHAR(255) DEFAULT NULL, date DATETIME NOT NULL, type VARCHAR(255) DEFAULT NULL, INDEX IDX_BF5476CA79E92E8C (emetteur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_notif (id INT AUTO_INCREMENT NOT NULL, notification_id INT DEFAULT NULL, recepteur_id INT DEFAULT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_22B1F633EF1A9D84 (notification_id), INDEX IDX_22B1F6333B49782D (recepteur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CA79E92E8C FOREIGN KEY (emetteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F633EF1A9D84 FOREIGN KEY (notification_id) REFERENCES notification (id)');
        $this->addSql('ALTER TABLE user_notif ADD CONSTRAINT FK_22B1F6333B49782D FOREIGN KEY (recepteur_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_notif DROP FOREIGN KEY FK_22B1F633EF1A9D84');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE user_notif');
    }
}
