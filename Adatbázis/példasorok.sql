--Jelszó: $2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S (Titkosjelszo1@)
INSERT INTO `users` (`id`, `inviteable`, `full_name`, `usr_name`, `usna_last_mod_date`, `usna_mod_num_remain`, `paswrd`, `date_of_birth`, `school`, `clss`, `email_address`, `email_last_mod_date`, `phone_num`, `om_identifier`, `status`, `discord_name`) VALUES
(1, 1, 'John Doe', 'johndoe', '2024-12-17 09:06:23', 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-01', 'School A', '12A', 'johndoe@example.com', '2024-12-17 09:06:23', '1234567890', 'OM12345678', 'active', 'johndoe#1234'),
(2, 0, 'Jane Smith', 'janesmith', '2024-12-17 09:06:23', 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1999-05-15', 'School B', '11B', 'janesmith@example.com', '2024-12-17 09:06:23', '0987654321', 'OM23456789', 'inactive', 'janesmith#5678'),
(3, 1, 'Alice Johnson', 'alicej', '2024-12-17 09:06:23', 1, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2001-03-23', 'School C', '10C', 'alice@example.com', '2024-12-17 09:06:23', '1122334455', 'OM34567890', 'active', 'alicej#9101'),
(4, 1, 'Bob Brown', 'bobbrown', '2024-12-17 09:06:23', 2, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-07-12', 'School D', '12D', 'bobbrown@example.com', '2024-12-17 09:06:23', '5566778899', 'OM45678901', 'active', 'bobbrown#2345'),
(5, 0, 'Charlie Green', 'charlieg', '2024-12-17 09:06:23', 0, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2002-11-05', 'School E', '9A', 'charlie@example.com', '2024-12-17 09:06:23', '6677889900', 'OM56789012', 'inactive', 'charlieg#3456'),
(6, 1, 'David White', 'davidw', '2024-12-17 09:06:23', 4, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1998-08-30', 'School F', '12B', 'davidw@example.com', '2024-12-17 09:06:23', '7788990011', 'OM67890123', 'active', 'davidw#5678'),
(7, 0, 'Emma Black', 'emmab', '2024-12-17 09:06:23', 2, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2003-06-21', 'School G', '10B', 'emmab@example.com', '2024-12-17 09:06:23', '8899001122', 'OM78901234', 'inactive', 'emmab#6789'),
(8, 1, 'Frank Harris', 'frankh', '2024-12-17 09:06:23', 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2001-02-14', 'School H', '11A', 'frankh@example.com', '2024-12-17 09:06:23', '9900112233', 'OM89012345', 'active', 'frankh#7890'),
(9, 1, 'Grace Adams', 'gracea', '2024-12-17 09:06:23', 1, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-09-09', 'School I', '12C', 'gracea@example.com', '2024-12-17 09:06:23', '1122334455', 'OM90123456', 'active', 'gracea#8901'),
(10, 0, 'Henry Wilson', 'henryw', '2024-12-17 09:06:23', 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1999-12-03', 'School J', '11C', 'henryw@example.com', '2024-12-17 09:06:23', '2233445566', 'OM01234567', 'inactive', 'henryw#9012');

INSERT INTO `organizers` (`full_name`, `usr_name`, `usna_last_mod_date`, `usna_mod_num_remain`, `paswrd`, `date_of_birth`, `school`, `email_address`, `email_last_mod_date`, `phone_num`, `om_identifier`, `status`) VALUES
('Kovács Péter', 'kovi_p', '2025-02-20 08:30:00', 5, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1980-04-15', 'Műszaki Egyetem', 'kovacspeter@email.com', '2025-02-19 16:45:00', '+36301234567', 'OM123456789', 'Aktív'),
('Szabó Anna', 'szabo_anna', '2025-02-20 09:00:00', 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1992-08-30', 'Pécsi Egyetem', 'szaboanna@email.com', '2025-02-19 14:20:00', '+36201234568', 'OM987654321', 'Aktív'),
('Tóth Márk', 'toth_mark', '2025-02-20 09:30:00', 4, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1995-03-12', 'Debreceni Egyetem', 'tothmark@email.com', '2025-02-19 13:15:00', '+36301234569', 'OM112233445', 'Aktív'),
('Németh Gábor', 'nemeth_g', '2025-02-20 10:00:00', 6, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1988-11-22', 'Szegedi Tudományegyetem', 'nemethgabor@email.com', '2025-02-19 11:45:00', '+36301234570', 'OM44332211', 'Aktív'),
('Bíró Laura', 'biro_laura', '2025-02-20 10:30:00', 2, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1990-07-07', 'Budapesti Corvinus Egyetem', 'birolaura@email.com', '2025-02-19 12:00:00', '+36301234571', 'OM55667788', 'Aktív');

INSERT INTO `teams` (`id`, `short_name`, `full_name`, `creator_id`) VALUES
(1, 'ABCD', 'Alpha Bravo Char', 1),
(2, 'XYZ', 'Xeno Yellow Zeta', 2),
(3, 'DEF', 'Delta Echo Foxtr', 3),
(4, 'GHIJ', 'Gamma Hotel Indi', 4),
(5, 'LMN', 'Lima Mike Novemb', 5);

INSERT INTO `events` (`id`, `name`, `start_date`, `end_date`, `place`, `details`,`ogr_id`) VALUES
(1, 'Summer Tournament', '2024-06-01 10:00:00', '2024-06-05 20:00:00', 'New York Arena', 'A large summer esports event',2),
(2, 'Fall Championship', '2024-09-01 12:00:00', '2024-09-03 18:00:00', 'Los Angeles Expo', 'Fall season grand championship',2),
(3, 'Winter Invitational', '2024-12-10 09:00:00', '2024-12-12 17:00:00', 'Chicago Dome', 'Exclusive winter invitational',3),
(4, 'Spring Cup', '2024-03-15 11:00:00', '2024-03-17 16:00:00', 'Dallas Convention Center', 'Spring esports showdown',4),
(5, 'Global Finals', '2024-11-05 08:00:00', '2024-11-10 22:00:00', 'London Arena', 'The final event of the global esports season',5);

INSERT INTO `games` (`id`, `name`) VALUES
(1, 'League of Legends'),
(2, 'Dota 2'),
(3, 'Valorant'),
(4, 'Fortnite'),
(5, 'Counter-Strike');

INSERT INTO `tournaments` (`id`, `name`, `num_participant`, `team_num`, `start_date`, `end_date`, `game_mode`, `max_participant`, `apn_start`, `apn_end`, `details`, `evt_id`, `gae_id`) VALUES
(1, 'Summer Cup', 16, 4, '2024-06-01 10:00:00', '2024-06-05 20:00:00', 'Single Elimination', 64, '2024-05-01 00:00:00', '2024-05-30 23:59:59', 'Summer esports competition', 1, 1),
(2, 'Fall Clash', 8, 2, '2024-09-01 12:00:00', '2024-09-03 18:00:00', 'Double Elimination', 32, '2024-08-01 00:00:00', '2024-08-30 23:59:59', 'Fall season clash', 2, 2),
(3, 'Winter Royale', 12, 3, '2024-12-10 09:00:00', '2024-12-12 17:00:00', 'Best of 3', 48, '2024-11-01 00:00:00', '2024-11-30 23:59:59', 'Exclusive winter royale', 3, 3),
(4, 'Spring Showdown', 16, 4, '2024-03-15 11:00:00', '2024-03-17 16:00:00', 'Round Robin', 64, '2024-02-01 00:00:00', '2024-02-28 23:59:59', 'Spring season showdown', 4, 4),
(5, 'Global Challenge', 32, 8, '2024-11-05 08:00:00', '2024-11-10 22:00:00', 'Single Elimination', 128, '2024-10-01 00:00:00', '2024-10-30 23:59:59', 'Global esports challenge', 5, 5);

INSERT INTO `pictures` (`id`, `img_path`) VALUES
(1, '/user/1.png'),
(2, '/user/2.png'),
(3, '/team/1.png'),
(4, '/event/1.png'),
(5, '/tournament/1.png'),
(6, '/organizer/1.png');

INSERT INTO `team_memberships` (`status`, `uer_id`, `tem_id`) VALUES
('active', 1, 1),
('inactive', 2, 2),
('active', 3, 3),
('inactive', 4, 4),
('active', 5, 5);

INSERT INTO `matches` (`id`, `status`, `place`, `dte`, `details`, `winner`, `rslt`, `tem1_id`, `tem2_id`, `tnt_id`) VALUES
(1, 'completed', 'New York Arena', '2024-06-01 12:00:00', 'Match 1 details', 'Alpha Bravo', '2-1', 1, 2, 1),
(2, 'completed', 'Los Angeles Expo', '2024-09-01 14:00:00', 'Match 2 details', 'Xeno Yellow', '3-0', 2, 3, 2),
(3, 'ongoing', 'Chicago Dome', '2024-12-10 10:00:00', 'Match 3 details', '', '', 3, 4, 3),
(4, 'completed', 'Dallas Convention Center', '2024-03-15 13:00:00', 'Match 4 details', 'Delta Echo', '2-2', 4, 5, 4),
(5, 'completed', 'London Arena', '2024-11-05 09:00:00', 'Match 5 details', 'Lima Mike', '1-0', 5, 1, 5);

INSERT INTO `applications` (`id`, `dte`, `status`, `uer_id`, `tem_id`, `tnt_id`) VALUES
(1, '2024-05-01 12:00:00', 'pending', 1, 1, 1),
(2, '2024-06-01 14:00:00', 'approved', 2, 2, 2),
(3, '2024-07-01 16:00:00', 'rejected', 3, 3, 3),
(4, '2024-08-01 18:00:00', 'pending', 4, 4, 4),
(5, '2024-09-01 20:00:00', 'approved', 5, 5, 5);

--Képhozzárendelések (sorbéli sorrend az alábbi insertnél-> user, ogr, tem, evt, tnt )
INSERT INTO `picture_links` (`id`, `uer_id`, `tem_id`, `tnt_id`, `evt_id`, `ogr_id` ,`pte_id`) VALUES
(1, 1, NULL, NULL, NULL, NULL, 1),
(2, 2, NULL, NULL, NULL, NULL, 1),
(3, 3, NULL, NULL, NULL, NULL, 1),
(4, 4, NULL, NULL, NULL, NULL, 1),
(5, 5, NULL, NULL, NULL, NULL, 1),
(6, 6, NULL, NULL, NULL, NULL, 1),
(7, 7, NULL, NULL, NULL, NULL, 1),
(8, 8, NULL, NULL, NULL, NULL, 1),
(9, 9, NULL, NULL, NULL, NULL, 1),
(10, 10, NULL, NULL, NULL, NULL, 1),
(11, NULL, NULL, NULL, NULL, 1, 1),
(12, NULL, NULL, NULL, NULL, 2, 1),
(13, NULL, NULL, NULL, NULL, 3, 1),
(14, NULL, NULL, NULL, NULL, 4, 1),
(15, NULL, NULL, NULL, NULL, 5, 1),
(16, NULL, 1, NULL, NULL, NULL, 1),
(17, NULL, 2, NULL, NULL, NULL, 1),
(18, NULL, 3, NULL, NULL, NULL, 1),
(19, NULL, 4, NULL, NULL, NULL, 1),
(20, NULL, 5, NULL, NULL, NULL, 1);
