<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200714083622 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire (id INT AUTO_INCREMENT NOT NULL, presi_comite_id INT DEFAULT NULL, debut DATE DEFAULT NULL, fin DATE DEFAULT NULL, instruction VARCHAR(255) DEFAULT NULL, decision_creation_com VARCHAR(255) DEFAULT NULL, lieu_reunion VARCHAR(255) DEFAULT NULL, date_reunion DATETIME DEFAULT NULL, presents_reunion JSON DEFAULT NULL, pv_reunion VARCHAR(255) DEFAULT NULL, INDEX IDX_338920E0C915C04F (presi_comite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventaire_user (inventaire_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_42DF8B8CCE430A85 (inventaire_id), INDEX IDX_42DF8B8CA76ED395 (user_id), PRIMARY KEY(inventaire_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE inventaire ADD CONSTRAINT FK_338920E0C915C04F FOREIGN KEY (presi_comite_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE inventaire_user ADD CONSTRAINT FK_42DF8B8CCE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_user ADD CONSTRAINT FK_42DF8B8CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE inventaire_user DROP FOREIGN KEY FK_42DF8B8CCE430A85');
        $this->addSql('DROP TABLE inventaire');
        $this->addSql('DROP TABLE inventaire_user');
    }
}
