<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200716093625 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE membres_comite (inventaire_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_39CC58B8CE430A85 (inventaire_id), INDEX IDX_39CC58B8A76ED395 (user_id), PRIMARY KEY(inventaire_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE membres_comite ADD CONSTRAINT FK_39CC58B8CE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE membres_comite ADD CONSTRAINT FK_39CC58B8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE inventaire_user');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE inventaire_user (inventaire_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_42DF8B8CA76ED395 (user_id), INDEX IDX_42DF8B8CCE430A85 (inventaire_id), PRIMARY KEY(inventaire_id, user_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE inventaire_user ADD CONSTRAINT FK_42DF8B8CA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE inventaire_user ADD CONSTRAINT FK_42DF8B8CCE430A85 FOREIGN KEY (inventaire_id) REFERENCES inventaire (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('DROP TABLE membres_comite');
    }
}
