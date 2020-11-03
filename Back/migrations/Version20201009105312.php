<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201009105312 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE immobilisation ADD matched_immo_id INT DEFAULT NULL, ADD ajusteur_id INT DEFAULT NULL, ADD is_matched TINYINT(1) DEFAULT NULL, ADD approv_status INT DEFAULT NULL');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E273C43260F FOREIGN KEY (matched_immo_id) REFERENCES immobilisation (id)');
        $this->addSql('ALTER TABLE immobilisation ADD CONSTRAINT FK_B1563E278DE90D1F FOREIGN KEY (ajusteur_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_B1563E273C43260F ON immobilisation (matched_immo_id)');
        $this->addSql('CREATE INDEX IDX_B1563E278DE90D1F ON immobilisation (ajusteur_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E273C43260F');
        $this->addSql('ALTER TABLE immobilisation DROP FOREIGN KEY FK_B1563E278DE90D1F');
        $this->addSql('DROP INDEX IDX_B1563E273C43260F ON immobilisation');
        $this->addSql('DROP INDEX IDX_B1563E278DE90D1F ON immobilisation');
        $this->addSql('ALTER TABLE immobilisation DROP matched_immo_id, DROP ajusteur_id, DROP is_matched, DROP approv_status');
    }
}
