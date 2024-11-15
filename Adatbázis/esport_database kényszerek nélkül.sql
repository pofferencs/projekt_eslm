CREATE DATABASE db_esport
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE db_esport;

CREATE TABLE Players(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	inviteable tinyint(1) NOT NULL,
	full_name varchar(64) NOT NULL,
	usr_name varchar(16) NOT NULL,
    usna_last_mod_date datetime NOT NULL,
	usna_mod_num_remain int NOT NULL,
    paswrd varchar(32) NOT NULL,
    date_of_birth date NOT NULL,
    school varchar(100) NOT NULL,
    clss varchar(10) NOT NULL,
    email_address varchar(64) NOT NULL,
	email_last_mod_date datetime NOT NULL,
	phone_num varchar(15) NOT NULL,
	om_identifier varchar(11) NOT NULL,
	status varchar(12) NOT NULL,
	discord_name varchar(32) NOT NULL
);
	
CREATE TABLE Teams(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	short_name varchar(4) NOT NULL,
	full_name varchar(16) NOT NULL,
	creator_id int NOT NULL
);
	
CREATE TABLE Events(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL,
	start_date datetime NOT NULL,
	end_date datetime NOT NULL,
	place varchar(255) NOT NULL,
	details varchar(512)
);
	
CREATE TABLE Games(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL
);

CREATE TABLE Tournaments(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(32) NOT NULL,
	num_participant int NOT NULL,
	team_num int,
	start_date datetime NOT NULL,
	end_date datetime NOT NULL,
	game_mode varchar(32) NOT NULL,
	max_participant int NOT NULL,
	apn_start datetime NOT NULL,
	apn_end datetime NOT NULL,
	details varchar(512),
	evt_id int NOT NULL,
	gae_id int NOT NULL,
	CONSTRAINT FK_Evt_Tnt FOREIGN KEY (evt_id) REFERENCES Events(id),
	CONSTRAINT FK_Gae_Tnt FOREIGN KEY (gae_id) REFERENCES Games(id),
	CONSTRAINT PK_Tnt PRIMARY KEY (id, evt_id, gae_id)
);
	
CREATE TABLE Pictures(
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
	img_path varchar(16384) NOT NULL
);


CREATE TABLE Team_Memberships(
	id int NOT NULL AUTO_INCREMENT,
	status varchar(12) NOT NULL,
	per_id int NOT NULL,
	tem_id int NOT NULL,
	CONSTRAINT FK_Per_Tmp FOREIGN KEY (per_id) REFERENCES Players(id),
	CONSTRAINT FK_Tem_Tmp FOREIGN KEY (tem_id) REFERENCES Teams(id),
	CONSTRAINT PK_Tmp PRIMARY KEY (id, per_id, tem_id)
);

CREATE TABLE Matches(
	id int NOT NULL AUTO_INCREMENT,
	status varchar(12) NOT NULL,
	place varchar(255),
	dte datetime,
	details	varchar(512),
	winner varchar(16),
	rslt varchar(10),
	tem1_id int NOT NULL,
	tem2_id int NOT NULL,
	tnt_id int NOT NULL,
	CONSTRAINT FK_Tem1_Mah FOREIGN KEY (tem1_id) REFERENCES Teams(id),
	CONSTRAINT FK_Tem2_Mah FOREIGN KEY (tem2_id) REFERENCES Teams(id),
	CONSTRAINT FK_Tnt_Mah FOREIGN KEY (tnt_id) REFERENCES Tournaments(id),
	CONSTRAINT PK_Mah PRIMARY KEY (id, tem1_id, tem2_id, tnt_id)
);

CREATE TABLE Applications(
	id int NOT NULL AUTO_INCREMENT,
	dte datetime NOT NULL,
	status varchar(12) NOT NULL,
	per_id int,
	tem_id int,
	tnt_id int NOT NULL,
	CONSTRAINT FK_Per_Apn FOREIGN KEY (per_id) REFERENCES Players(id),
	CONSTRAINT FK_Tem_Apn FOREIGN KEY (tem_id) REFERENCES Teams(id),
	CONSTRAINT FK_Tnt_Apn FOREIGN KEY (tnt_id) REFERENCES Tournaments(id),
	CONSTRAINT PK_Apn PRIMARY KEY (id, tnt_id)
);

CREATE TABLE Picture_Links(
	id int NOT NULL AUTO_INCREMENT,
	per_id int,
	tem_id int,
	tnt_id int,
	evt_id int,
	pte_id int NOT NULL,
	CONSTRAINT FK_Per_Plk FOREIGN KEY (per_id) REFERENCES Players(id),
	CONSTRAINT FK_Tem_Plk FOREIGN KEY (tem_id) REFERENCES Teams(id),
	CONSTRAINT FK_Tnt_Plk FOREIGN KEY (tnt_id) REFERENCES Tournaments(id),
	CONSTRAINT FK_Evt_Plk FOREIGN KEY (evt_id) REFERENCES Events(id),
	CONSTRAINT FK_Pte_Plk FOREIGN KEY (pte_id) REFERENCES Pictures(id),
	CONSTRAINT PK_Plk PRIMARY KEY (id, pte_id)
);