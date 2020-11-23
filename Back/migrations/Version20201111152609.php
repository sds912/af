<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201111152609 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE support DROP FOREIGN KEY FK_8004EBA560BB6FE6');
        $this->addSql('ALTER TABLE support DROP FOREIGN KEY FK_8004EBA5A4AEAFEA');
        $this->addSql('DROP INDEX IDX_8004EBA560BB6FE6 ON support');
        $this->addSql('DROP INDEX IDX_8004EBA5A4AEAFEA ON support');
        $this->addSql('ALTER TABLE support ADD entreprise JSON NOT NULL, ADD auteur JSON NOT NULL, ADD licence VARCHAR(255) NOT NULL, ADD client JSON NOT NULL, DROP entreprise_id, DROP auteur_id');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE support ADD entreprise_id INT NOT NULL, ADD auteur_id INT NOT NULL, DROP entreprise, DROP auteur, DROP licence, DROP client');
        $this->addSql('ALTER TABLE support ADD CONSTRAINT FK_8004EBA560BB6FE6 FOREIGN KEY (auteur_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE support ADD CONSTRAINT FK_8004EBA5A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_8004EBA560BB6FE6 ON support (auteur_id)');
        $this->addSql('CREATE INDEX IDX_8004EBA5A4AEAFEA ON support (entreprise_id)');
    }
}
