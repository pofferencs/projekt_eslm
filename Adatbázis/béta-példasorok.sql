-- Felhasználók létrehozása (15 fő)
INSERT INTO Users (inviteable, full_name, usr_name, usna_last_mod_date, usna_mod_num_remain, paswrd, date_of_birth, school, clss, email_address, email_last_mod_date, phone_num, om_identifier, status, discord_name)
VALUES 
(1, 'Péter Kovács', 'peterk', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1995-04-15', 'School A', 'A1', 'peter.k@domain.com', NOW(), '+36123456789', 'OM1234567', 'active', 'peterK'),
(1, 'László Németh', 'laszlon', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1994-05-10', 'School B', 'B2', 'laszlo.n@domain.com', NOW(), '+36123456790', 'OM2345678', 'active', 'laszloN'),
(1, 'Anna Kiss', 'annak', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1993-07-20', 'School C', 'C3', 'anna.k@domain.com', NOW(), '+36123456791', 'OM3456789', 'active', 'annaK'),
(1, 'József Horváth', 'jozsefh', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1992-08-30', 'School D', 'D4', 'jozsef.h@domain.com', NOW(), '+36123456792', 'OM4567890', 'active', 'jozsefH'),
(1, 'Zsófia Szabó', 'zsofiak', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1996-03-12', 'School E', 'E5', 'zsofia.s@domain.com', NOW(), '+36123456793', 'OM5678901', 'active', 'zsofiaS'),
(1, 'Gábor Varga', 'gaborv', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1997-02-14', 'School F', 'F6', 'gabor.v@domain.com', NOW(), '+36123456794', 'OM6789012', 'active', 'gaborV'),
(1, 'Katalin Tóth', 'katalint', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1998-01-22', 'School G', 'G7', 'katalin.t@domain.com', NOW(), '+36123456795', 'OM7890123', 'active', 'katalinT'),
(1, 'Róbert Takács', 'robertt', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1991-05-17', 'School H', 'H8', 'robert.t@domain.com', NOW(), '+36123456796', 'OM8901234', 'active', 'robertT'),
(1, 'Beáta Farkas', 'beataf', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1990-09-29', 'School I', 'I9', 'beata.f@domain.com', NOW(), '+36123456797', 'OM9012345', 'active', 'beataF'),
(1, 'Miklós Kárpáti', 'miklosk', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1995-11-12', 'School J', 'J10', 'miklos.k@domain.com', NOW(), '+36123456798', 'OM1230987', 'active', 'miklosK'),
(1, 'Tamás Nagy', 'tamasn', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1994-06-05', 'School K', 'K11', 'tamas.n@domain.com', NOW(), '+36123456799', 'OM9876543', 'active', 'tamasN'),
(1, 'Éva Tóth', 'evat', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1993-12-20', 'School L', 'L12', 'eva.t@domain.com', NOW(), '+36123456800', 'OM2345678', 'active', 'evaT'),
(1, 'Gergő Csaba', 'gergoc', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1992-04-22', 'School M', 'M13', 'gergo.c@domain.com', NOW(), '+36123456801', 'OM3456789', 'active', 'gergoC'),
(1, 'Judit Fodor', 'juditf', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1997-07-10', 'School N', 'N14', 'judit.f@domain.com', NOW(), '+36123456802', 'OM4567890', 'active', 'juditF'),
(1, 'István Balogh', 'istvanb', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1996-02-17', 'School O', 'O15', 'istvan.b@domain.com', NOW(), '+36123456803', 'OM5678901', 'active', 'istvanB');

-- Szervezők létrehozása (3 fő)
INSERT INTO Organizers (full_name, usr_name, usna_last_mod_date, usna_mod_num_remain, paswrd, date_of_birth, school, email_address, email_last_mod_date, phone_num, om_identifier, status)
VALUES
('László Székely', 'laszlosz', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1985-03-25', 'School Z', 'laszlo.sz@organizer.com', NOW(), '+36123456704', 'OM5432101', 'active'),
('Mária Horváth', 'mariah', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1984-11-30', 'School Y', 'maria.h@organizer.com', NOW(), '+36123456705', 'OM6543210', 'active'),
('Ádám Kovács', 'adamik', NOW(), 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1987-06-17', 'School X', 'adam.k@organizer.com', NOW(), '+36123456706', 'OM7654321', 'active');

-- Csapatok létrehozása (3 csapat)
INSERT INTO Teams (short_name, full_name, creator_id)
VALUES
('TMT', 'Team Magyar', 1),
('GCR', 'Green Cats', 2),
('BLC', 'Blue Lions', 3);

-- Események létrehozása (1 esemény)
INSERT INTO Events (name, start_date, end_date, place, details, ogr_id)
VALUES
('Példakupa', '2025-06-01 10:00:00', '2025-06-05 18:00:00', 'Budapesti Aréna', 'A nagy verseny mindenki számára!', 1);

-- Játékok létrehozása (1 játék)
INSERT INTO Games (name)
VALUES
('Counter Strike');

-- Tornák létrehozása (1 torna)
INSERT INTO Tournaments (name, num_participant, team_num, start_date, end_date, game_mode, max_participant, apn_start, apn_end, details, evt_id, gae_id)
VALUES
('Counter Strike Bajnokság', 12, 5, '2025-06-01 10:00:00', '2025-06-05 18:00:00', '5v5', 60, '2025-05-01 09:00:00', '2025-05-31 23:59:59', 'Legnagyobb éves verseny', 1, 1);

-- Csapattagok hozzárendelése (példa)
INSERT INTO Team_Memberships (status, uer_id, tem_id)
VALUES
('active', 1, 1), -- Péter Kovács a Team Magyar-ban
('active', 2, 1), -- László Németh a Team Magyar-ban
('active', 3, 1), -- Anna Kiss a Team Magyar-ban
('active', 4, 2), -- József Horváth a Green Cats-ban
('active', 5, 2), -- Zsófia Szabó a Green Cats-ban
('active', 6, 3), -- Gábor Varga a Blue Lions-ban
('active', 7, 3); -- Katalin Tóth a Blue Lions-ban

-- Csöves Picture Links
INSERT INTO `picture_links` (`id`, `uer_id`, `tem_id`, `tnt_id`, `evt_id`, `ogr_id`, `pte_id`) VALUES 
(NULL, NULL, NULL, '1', NULL, NULL, '5'), 
(NULL, NULL, NULL, NULL, '1', NULL, '4');