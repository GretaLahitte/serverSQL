
--
-- mysql syntax
--

/**

Commencer par créer la base de données:
$mysql -u root -p
Enter password:
mysql> CREATE database serverSQL;

Création de l'utilisateur admin :
mysql> GRANT ALL PRIVILEGES ON serverSQL.* TO admin@localhost IDENTIFIED BY 'vulpecula';
mysql> GRANT FILE ON *.* TO admin@localhost IDENTIFIED BY 'vulpecula';

Connexion à la db avec l’utilisateur admin :
$mysql –u admin –p
Enter password :   // le mot de passe est: vulpecula
mysql>USE serverSQL;

Il ne reste plus qu’à utiliser le script pour créer les tables et leurs relations.
mysql> source /path/to/this/script/file

**/


CREATE TABLE users (
   id    integer  PRIMARY KEY ,
   firstname    character varying(96)  NOT NULL ,
   lastname    character varying(100)  NOT NULL ,
   role    ENUM('SADMIN','ADMIN','USER')   NOT NULL ,
   login    character varying(100)  ,
   password    character varying(255)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='liste des utilisateurs';


-- create first user (mdp:lolo)

INSERT INTO users VALUES (0, 'toto', 'lolo', 'SADMIN', 'toto','$2a$06$dpdxvi0V2oN/9yUrv36fOOrbl.YuhX4aGnUL4Yryxs.fE57Sxq91K');



-- Generated with Greta SQLTool on Tue Jun 27 2017 17:45:33 GMT+0200 (CEST)
-- Visit us at https://seraphita.freeboxos.fr/gretaSQLTool
-- git: https://github.com/GretaLahitte/appDatabase.git

