<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201111123658 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE support DROP FOREIGN KEY FK_8004EBA519EB6921');
        $this->addSql('DROP INDEX IDX_8004EBA519EB6921 ON support');
        $this->addSql('ALTER TABLE support CHANGE client_id entreprise_id INT NOT NULL');
        $this->addSql('ALTER TABLE support ADD CONSTRAINT FK_8004EBA5A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES entreprise (id)');
        $this->addSql('CREATE INDEX IDX_8004EBA5A4AEAFEA ON support (entreprise_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE support DROP FOREIGN KEY FK_8004EBA5A4AEAFEA');
        $this->addSql('DROP INDEX IDX_8004EBA5A4AEAFEA ON support');
        $this->addSql('ALTER TABLE support CHANGE entreprise_id client_id INT NOT NULL');
        $this->addSql('ALTER TABLE support ADD CONSTRAINT FK_8004EBA519EB6921 FOREIGN KEY (client_id) REFERENCES client (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_8004EBA519EB6921 ON support (client_id)');
    }
}
