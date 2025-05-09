-- Adatok törlése (opcionális, szükség esetén kommenteld ki)
DELETE FROM `Picture_Links`;
DELETE FROM `Matches`;
DELETE FROM `Applications`;
DELETE FROM `Team_Memberships`;
DELETE FROM `Tournaments`;
DELETE FROM `Games`;
DELETE FROM `Events`;
DELETE FROM `Teams`;
DELETE FROM `Users`;
DELETE FROM `Organizers`;
DELETE FROM `Pictures`;

-- Pictures
INSERT INTO `Pictures` (`id`, `img_path`) VALUES
(1, '/user/user_0.png'),
(2, '/team/team_0.png'),
(3, '/event/event_0.png'),
(4, '/tournament/tournament_0.png'),
(5, '/organizer/organizer_0.png'),
(6, '/tournament/cs2.png'),
(7, '/tournament/rl_1v1.png'),
(8, '/tournament/lol_2v2.png'),
(9, '/tournament/rl_3v3.png'),
(10, '/tournament/valorant.png'),
(11, '/tournament/sf6.png'),
(12, '/tournament/tekken8.png'),
(13, '/tournament/dota2.png'),
(14, '/tournament/overwatch2.png'),
(15, '/tournament/fifa25.png');

-- Organizers
INSERT INTO `Organizers` (`id`, `full_name`, `usr_name`, `usna_last_mod_date`, `usna_mod_num_remain`, `paswrd`, `date_of_birth`, `school`, `email_address`, `email_last_mod_date`, `phone_num`, `om_identifier`, `status`) VALUES
(1, 'Szervező Elemér', 'szervezo1', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1980-01-01', 'Szervező Iskola', 'szervezo1@example.com', NOW(), '111000111', '72300000001', 'active'),
(2, 'Szervező Béla', 'szervezo2', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1982-02-02', 'Szervező Iskola', 'szervezo2@example.com', NOW(), '111000222', '72300000002', 'active'),
(3, 'Szervező Cecil', 'szervezo3', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1984-03-03', 'Szervező Iskola', 'szervezo3@example.com', NOW(), '111000333', '72300000003', 'active'),
(4, 'Szervező Dénes', 'szervezo4', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1986-04-04', 'Szervező Iskola', 'szervezo4@example.com', NOW(), '111000444', '72300000004', 'active'),
(5, 'Szervező Fanni', 'szervezo5', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '1988-05-05', 'Szervező Iskola', 'szervezo5@example.com', NOW(), '111000555', '72300000005', 'active');

-- Users
INSERT INTO `Users` (`id`, `inviteable`, `full_name`, `usr_name`, `usna_last_mod_date`, `usna_mod_num_remain`, `paswrd`, `date_of_birth`, `school`, `clss`, `email_address`, `email_last_mod_date`, `phone_num`, `om_identifier`, `status`, `discord_name`) VALUES

-- Csapatban lévő userek
(1, 1, 'Csapat Tag Egy', 'csapattag1', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-01', 'Iskola A', '10A', 'cs1@example.com', NOW(), '123456701', '72310000001', 'active', 'cs1#0001'),
(2, 1, 'Csapat Tag Kettő', 'csapattag2', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-02', 'Iskola A', '10A', 'cs2@example.com', NOW(), '123456702', '72310000002', 'active', 'cs2#0002'),
(3, 1, 'Csapat Tag Három', 'csapattag3', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-03', 'Iskola B', '10B', 'cs3@example.com', NOW(), '123456703', '72310000003', 'active', 'cs3#0003'),
(4, 1, 'Csapat Tag Négy', 'csapattag4', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-04', 'Iskola B', '10B', 'cs4@example.com', NOW(), '123456704', '72310000004', 'active', 'cs4#0004'),
(5, 1, 'Csapat Tag Öt', 'csapattag5', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-05', 'Iskola C', '11A', 'cs5@example.com', NOW(), '123456705', '72310000005', 'active', 'cs5#0005'),
(6, 1, 'Csapat Tag Hat', 'csapattag6', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-06', 'Iskola C', '11A', 'cs6@example.com', NOW(), '123456706', '72310000006', 'active', 'cs6#0006'),
(7, 1, 'Csapat Tag Hét', 'csapattag7', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-07', 'Iskola D', '11B', 'cs7@example.com', NOW(), '123456707', '72310000007', 'active', 'cs7#0007'),
(8, 1, 'Csapat Tag Nyolc', 'csapattag8', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-08', 'Iskola D', '11B', 'cs8@example.com', NOW(), '123456708', '72310000008', 'active', 'cs8#0008'),
(9, 1, 'Csapat Tag Kilenc', 'csapattag9', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-09', 'Iskola E', '12A', 'cs9@example.com', NOW(), '123456709', '72310000009', 'active', 'cs9#0009'),
(10, 1, 'Csapat Tag Tíz', 'csapattag10', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-10', 'Iskola E', '12A', 'cs10@example.com', NOW(), '123456710', '72310000010', 'active', 'cs10#0010'),
(11, 1, 'Csapat Tag Tizenegy', 'csapattag11', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-11', 'Iskola F', '12B', 'cs11@example.com', NOW(), '123456711', '72310000011', 'active', 'cs11#0011'),
(12, 1, 'Csapat Tag Tizenkettő', 'csapattag12', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-12', 'Iskola F', '12B', 'cs12@example.com', NOW(), '123456712', '72310000012', 'active', 'cs12#0012'),
(13, 1, 'Csapat Tag Tizenhárom', 'csapattag13', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-13', 'Iskola G', '9A', 'cs13@example.com', NOW(), '123456713', '72310000013', 'active', 'cs13#0013'),
(14, 1, 'Csapat Tag Tizennégy', 'csapattag14', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-14', 'Iskola G', '9A', 'cs14@example.com', NOW(), '123456714', '72310000014', 'active', 'cs14#0014'),
(15, 1, 'Csapat Tag Tizenöt', 'csapattag15', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-15', 'Iskola H', '9B', 'cs15@example.com', NOW(), '123456715', '72310000015', 'active', 'cs15#0015'),
(16, 1, 'Csapat Tag Tizenhat', 'csapattag16', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-16', 'Iskola H', '9B', 'cs16@example.com', NOW(), '123456716', '72310000016', 'active', 'cs16#0016'),
(17, 1, 'Csapat Tag Tizenhét', 'csapattag17', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-17', 'Iskola I', '10C', 'cs17@example.com', NOW(), '123456717', '72310000017', 'active', 'cs17#0017'),
(18, 1, 'Csapat Tag Tizennyolc', 'csapattag18', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-18', 'Iskola I', '10C', 'cs18@example.com', NOW(), '123456718', '72310000018', 'active', 'cs18#0018'),
(19, 1, 'Csapat Tag Tizenkilenc', 'csapattag19', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-19', 'Iskola J', '11C', 'cs19@example.com', NOW(), '123456719', '72310000019', 'active', 'cs19#0019'),
(20, 1, 'Csapat Tag Húsz', 'csapattag20', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-20', 'Iskola J', '11C', 'cs20@example.com', NOW(), '123456720', '72310000020', 'active', 'cs20#0020'),
(21, 1, 'Csapat Tag Huszonegy', 'csapattag21', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-21', 'Iskola K', '12C', 'cs21@example.com', NOW(), '123456721', '72310000021', 'active', 'cs21#0021'),
(22, 1, 'Csapat Tag Huszonkettő', 'csapattag22', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-22', 'Iskola K', '12C', 'cs22@example.com', NOW(), '123456722', '72310000022', 'active', 'cs22#0022'),
(23, 1, 'Csapat Tag Huszonhárom', 'csapattag23', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-23', 'Iskola L', '10D', 'cs23@example.com', NOW(), '123456723', '72310000023', 'active', 'cs23#0023'),
(24, 1, 'Csapat Tag Huszonnégy', 'csapattag24', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-24', 'Iskola L', '10D', 'cs24@example.com', NOW(), '123456724', '72310000024', 'active', 'cs24#0024'),
(25, 1, 'Csapat Tag Huszonöt', 'csapattag25', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-25', 'Iskola M', '11D', 'cs25@example.com', NOW(), '123456725', '72310000025', 'active', 'cs25#0025'),
(26, 1, 'Csapat Tag Huszonhat', 'csapattag26', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-26', 'Iskola M', '11D', 'cs26@example.com', NOW(), '123456726', '72310000026', 'active', 'cs26#0026'),
(27, 1, 'Csapat Tag Huszonhét', 'csapattag27', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-27', 'Iskola N', '12D', 'cs27@example.com', NOW(), '123456727', '72310000027', 'active', 'cs27#0027'),
(28, 1, 'Csapat Tag Huszonnyolc', 'csapattag28', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-28', 'Iskola N', '12D', 'cs28@example.com', NOW(), '123456728', '72310000028', 'active', 'cs28#0028'),
(29, 1, 'Csapat Tag Huszonkilenc', 'csapattag29', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-29', 'Iskola O', '9C', 'cs29@example.com', NOW(), '123456729', '72310000029', 'active', 'cs29#0029'),
(30, 1, 'Csapat Tag Harminc', 'csapattag30', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-01-30', 'Iskola O', '9C', 'cs30@example.com', NOW(), '123456730', '72310000030', 'active', 'cs30#0030'),
(31, 1, 'Csapat Tag Harmincegy', 'csapattag31', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-01', 'Iskola P', '10E', 'cs31@example.com', NOW(), '123456731', '72310000031', 'active', 'cs31#0031'),
(32, 1, 'Csapat Tag Harminckettő', 'csapattag32', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-02', 'Iskola P', '10E', 'cs32@example.com', NOW(), '123456732', '72310000032', 'active', 'cs32#0032'),
(33, 1, 'Csapat Tag Harminchárom', 'csapattag33', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-03', 'Iskola Q', '11E', 'cs33@example.com', NOW(), '123456733', '72330000033', 'active', 'cs33#0033'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(34, 1, 'Csapat Tag Harmincnégy', 'csapattag34', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-04', 'Iskola Q', '11E', 'cs34@example.com', NOW(), '123456734', '72330000034', 'active', 'cs34#0034'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(35, 1, 'Csapat Tag Harmincöt', 'csapattag35', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-05', 'Iskola R', '12E', 'cs35@example.com', NOW(), '123456735', '72330000035', 'active', 'cs35#0035'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(36, 1, 'Csapat Tag Harminchat', 'csapattag36', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-06', 'Iskola R', '12E', 'cs36@example.com', NOW(), '123456736', '72330000036', 'active', 'cs36#0036'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(37, 1, 'Csapat Tag Harminchét', 'csapattag37', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-07', 'Iskola S', '9D', 'cs37@example.com', NOW(), '123456737', '72330000037', 'active', 'cs37#0037'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(38, 1, 'Csapat Tag Harmincnyolc', 'csapattag38', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-08', 'Iskola S', '9D', 'cs38@example.com', NOW(), '123456738', '72330000038', 'active', 'cs38#0038'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(39, 1, 'Csapat Tag Harminckilenc', 'csapattag39', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-09', 'Iskola T', '10F', 'cs39@example.com', NOW(), '123456739', '72330000039', 'active', 'cs39#0039'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(40, 1, 'Csapat Tag Negyven', 'csapattag40', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-10', 'Iskola T', '10F', 'cs40@example.com', NOW(), '123456740', '72330000040', 'active', 'cs40#0040'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(41, 1, 'Csapat Tag Negyvenegy', 'csapattag41', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-11', 'Iskola U', '11F', 'cs41@example.com', NOW(), '123456741', '72330000041', 'active', 'cs41#0041'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához
(42, 1, 'Csapat Tag Negyvenkettő', 'csapattag42', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2000-02-12', 'Iskola U', '11F', 'cs42@example.com', NOW(), '123456742', '72330000042', 'active', 'cs42#0042'), -- Előzőleg 7231 volt itt, javítva 7233-ra a mintához

-- inaktív, nem csapatban
(43, 0, 'Inaktív User Egy', 'inactive1', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2001-03-01', 'Iskola V', '10G', 'inactive1@example.com', NOW(), '123456743', '72320000001', 'inactive', 'inactive1#0001'),
(44, 0, 'Inaktív User Kettő', 'inactive2', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2001-03-02', 'Iskola V', '10G', 'inactive2@example.com', NOW(), '123456744', '72320000002', 'inactive', 'inactive2#0002'),

-- aktív és meghívható
(45, 1, 'Aktív Meghívható Egy', 'activeinvite1', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2002-04-01', 'Iskola W', '11G', 'activeinvite1@example.com', NOW(), '123456745', '72330000001', 'active', 'activeinvite1#0001'),
(46, 1, 'Aktív Meghívható Kettő', 'activeinvite2', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2002-04-02', 'Iskola W', '11G', 'activeinvite2@example.com', NOW(), '123456746', '72330000002', 'active', 'activeinvite2#0002'),

-- aktív és nem meghívható
(47, 0, 'Aktív NemMeghívható Egy', 'activenoinvite1', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2003-05-01', 'Iskola X', '12G', 'activenoinvite1@example.com', NOW(), '123456747', '72340000001', 'active', 'activenoinvite1#0001'),
(48, 0, 'Aktív NemMeghívható Kettő', 'activenoinvite2', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2003-05-02', 'Iskola X', '12G', 'activenoinvite2@example.com', NOW(), '123456748', '72340000002', 'active', 'activenoinvite2#0002'),

-- bannolt
(49, 0, 'Bannolt User Egy', 'banned1', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2004-06-01', 'Iskola Y', '9G', 'banned1@example.com', NOW(), '123456749', '72350000001', 'banned', 'banned1#0001'),
(50, 0, 'Bannolt User Kettő', 'banned2', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2004-06-02', 'Iskola Y', '9G', 'banned2@example.com', NOW(), '123456750', '72350000002', 'banned', 'banned2#0002'),

-- függőben lévő csapattagságra váró (ezeket a Team_Memberships táblában 'pending' státusszal kezeljük)
(51, 1, 'Függő User Egy', 'pending1', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2005-07-01', 'Iskola Z', '10H', 'pending1@example.com', NOW(), '123456751', '72360000001', 'active', 'pending1#0001'),
(52, 1, 'Függő User Kettő', 'pending2', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2005-07-02', 'Iskola Z', '10H', 'pending2@example.com', NOW(), '123456752', '72360000002', 'active', 'pending2#0002'),
(53, 1, 'Függő User Három', 'pending3', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2005-07-03', 'Iskola Z', '10H', 'pending3@example.com', NOW(), '123456753', '72360000003', 'active', 'pending3#0003'),
(54, 1, 'Függő User Négy', 'pending4', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2005-07-04', 'Iskola AA', '11H', 'pending4@example.com', NOW(), '123456754', '72360000004', 'active', 'pending4#0004'),
(55, 1, 'Függő User Öt', 'pending5', NOW(), 3, '$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S', '2005-07-05', 'Iskola AA', '11H', 'pending5@example.com', NOW(), '123456755', '72360000005', 'active', 'pending5#0005');

-- Teams
INSERT INTO `teams` (`id`, `short_name`, `full_name`, `creator_id`) VALUES
(1, 'T01', 'Team One Alpha', 1),(2, 'T02', 'Team Two Bravo', 6),(3, 'T03', 'Team Three Charl', 11),
(4, 'T04', 'Team Four Delta', 16),(5, 'T05', 'Team Five Echo', 21),(6, 'T06', 'Team Six Foxtrot', 22),
(7, 'T07', 'Team Seven Golf', 23),(8, 'T08', 'Team Eight Hotel', 24),(9, 'T09', 'Team Nine India', 25),
(10, 'T10', 'Team Ten Juliett', 27),(11, 'T11', 'Team Eleven Kilo', 29),(12, 'T12', 'Team Twelve Lima', 31),
(13, 'T13', 'Team Thirteen Mi', 33),(14, 'T14', 'Team Fourteen No', 36),(15, 'T15', 'Team Fifteen Osc', 39), (16, 'T16', 'Team Sixteen Pap', 42);

-- Team Memberships
INSERT INTO `Team_Memberships` (`status`, `uer_id`, `tem_id`) VALUES
('active', 1, 1), ('active', 2, 1), ('active', 3, 1), ('active', 4, 1), ('active', 5, 1),
('active', 6, 2), ('active', 7, 2), ('active', 8, 2), ('active', 9, 2), ('active', 10, 2),
('active', 11, 3), ('active', 12, 3), ('active', 13, 3), ('active', 14, 3), ('active', 15, 3),
('active', 16, 4), ('active', 17, 4), ('active', 18, 4), ('active', 19, 4), ('active', 20, 4);

INSERT INTO `Team_Memberships` (`status`, `uer_id`, `tem_id`) VALUES
('active', 21, 5), ('active', 22, 6), ('active', 23, 7), ('active', 24, 8);

INSERT INTO `Team_Memberships` (`status`, `uer_id`, `tem_id`) VALUES
('active', 25, 9), ('active', 26, 9), ('active', 27, 10), ('active', 28, 10),
('active', 29, 11), ('active', 30, 11), ('active', 31, 12), ('active', 32, 12);

INSERT INTO `Team_Memberships` (`status`, `uer_id`, `tem_id`) VALUES
('active', 33, 13), ('active', 34, 13), ('active', 35, 13),
('active', 36, 14), ('active', 37, 14), ('active', 38, 14),
('active', 39, 15), ('active', 40, 15), ('active', 41, 15),
('active', 42, 16), ('active', 45, 16), ('active', 46, 16); 

-- függőben lévő tagság 
INSERT INTO `Team_Memberships` (`status`, `uer_id`, `tem_id`) VALUES
('pending', 51, 1), ('pending', 52, 2), ('pending', 53, 5), ('pending', 54, 9), ('pending', 55, 13);

-- Events
INSERT INTO `Events` (`id`, `name`, `start_date`, `end_date`, `place`, `details`, `ogr_id`) VALUES
(1, 'Nagy E-sport Bajnokság 2025', '2025-07-15 10:00:00', '2025-07-20 22:00:00', 'Budapest Aréna', 'Az év legnagyobb e-sport eseménye, több játékkal.', 1),
(2, 'Őszi Kupa 2023', '2023-10-15 09:00:00', '2023-10-20 20:00:00', 'Debrecen Főnix Csarnok', '2023-as őszi regionális verseny.', 2),
(3, 'Tavaszi Fesztivál 2025', '2025-05-01 10:00:00', '2025-06-01 22:00:00', 'Szeged Sportcsarnok', 'Tavaszi e-sport ünnep.', 3),
(4, 'Nyárindító Bajnokság 2025', '2025-08-01 10:00:00', '2025-09-01 22:00:00', 'Pécs Expo Center', 'Nyári szezonkezdő megmérettetés.', 4);

-- Games
INSERT INTO `Games` (`id`, `name`) VALUES
(1, 'CS2'),
(2, 'Rocket League 1v1'),
(3, 'LoL 2v2'),
(4, 'Rocket League 3v3'),
(5, 'Valorant'),
(6, 'Street Fighter 6'),
(7, 'Tekken 8'),
(8, 'Dota 2'),
(9, 'Overwatch 2'),
(10, 'EA Sports FC 25');

-- Tournaments
-- `num_participant`: játékosok száma egy csapatban 
-- `team_num`: résztvevő csapatok száma
-- `max_participant`: a versenyre jelentkezhető maximális csapatok száma
INSERT INTO `Tournaments` (`id`, `name`, `num_participant`, `team_num`, `start_date`, `end_date`, `game_mode`, `max_participant`, `apn_start`, `apn_end`, `details`, `evt_id`, `gae_id`) VALUES

(1, '5v5 Bajnokság (CS2)', 5, 4, '2025-07-15 12:00:00', '2025-07-15 20:00:00', '5v5', 16, '2025-06-01 00:00:00', '2025-07-01 00:00:00', 'Csapatok 5 fővel.', 1, 1),
(2, '1v1 Bajnokság (RL)', 1, 4, '2025-07-16 12:00:00', '2025-07-16 20:00:00', '1v1', 32, '2025-06-01 00:00:00', '2025-07-01 00:00:00', 'Egyéni küzdelmek.', 1, 2),
(3, '2v2 Bajnokság (LoL)', 2, 4, '2025-07-17 12:00:00', '2025-07-17 20:00:00', '2v2', 16, '2025-06-01 00:00:00', '2025-07-01 00:00:00', 'Páros mérkőzések.', 1, 3),
(4, '3v3 Bajnokság (RL)', 3, 4, '2025-07-18 12:00:00', '2025-07-18 20:00:00', '3v3', 16, '2025-06-01 00:00:00', '2025-07-01 00:00:00', 'Háromfős csapatok versenye.', 1, 4),

(5, 'Valorant Kupa 2023', 5, 4, '2023-10-15 10:00:00', '2023-10-17 18:00:00', '5v5', 16, '2023-10-05 00:00:00', '2023-10-13 23:59:59', 'Valorant verseny az Őszi Kupán.', 2, 5),
(6, 'SF6 Tavaszi Kihívás', 1, 4, '2025-05-01 12:00:00', '2025-05-03 20:00:00', '1v1', 32, '2025-04-21 00:00:00', '2025-04-29 23:59:59', 'Street Fighter 6 egyéni verseny.', 3, 6),
(7, 'Tekken Nyárindító Pofonparti', 1, 4, '2025-08-01 12:00:00', '2025-08-03 20:00:00', '1v1', 32, '2025-07-22 00:00:00', '2025-07-30 23:59:59', 'Tekken 8 egyéni bajnokság.', 4, 7),
(8, 'Dota 2 Aréna Bajnokság', 5, 4, '2025-07-19 10:00:00', '2025-07-20 18:00:00', '5v5', 16, '2025-07-09 00:00:00', '2025-07-17 23:59:59', 'Dota 2 csapatverseny a Nagy E-sport Bajnokságon.', 1, 8),
(9, 'Overwatch Őszi Csetepaté', 5, 4, '2023-10-18 10:00:00', '2023-10-20 18:00:00', '5v5', 16, '2023-10-08 00:00:00', '2023-10-16 23:59:59', 'Overwatch 2 csapatverseny az Őszi Kupán.', 2, 9),
(10, 'FC25 Tavaszi Foci Kupa', 1, 4, '2025-05-12 10:00:00', '2025-05-14 18:00:00', '1v1', 32, '2025-05-02 00:00:00', '2025-05-10 23:59:59', 'EA Sports FC 25 egyéni labdarúgó torna.', 3, 10);

-- Applications
-- Tournament 1 (5v5, CS2)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`, `uer2_id`, `uer3_id`, `uer4_id`, `uer5_id`) VALUES
(1, NOW(), 'approved', 1, 1, 1, 2, 3, 4, 5), (2, NOW(), 'approved', 2, 1, 6, 7, 8, 9, 10),
(3, NOW(), 'approved', 3, 1, 11, 12, 13, 14, 15), (4, NOW(), 'approved', 4, 1, 16, 17, 18, 19, 20);

-- Tournament 2 (1v1, RL 1v1)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`) VALUES
(5, NOW(), 'approved', 5, 2, 21), (6, NOW(), 'approved', 6, 2, 22),
(7, NOW(), 'approved', 7, 2, 23), (8, NOW(), 'approved', 8, 2, 24);

-- Tournament 3 (2v2, LoL)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`, `uer2_id`) VALUES
(9, NOW(), 'approved', 9, 3, 25, 26), (10, NOW(), 'approved', 10, 3, 27, 28),
(11, NOW(), 'approved', 11, 3, 29, 30), (12, NOW(), 'approved', 12, 3, 31, 32);

-- Tournament 4 (3v3, RL 3v3)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`, `uer2_id`, `uer3_id`) VALUES
(13, NOW(), 'approved', 13, 4, 33, 34, 35), (14, NOW(), 'approved', 14, 4, 36, 37, 38),
(15, NOW(), 'approved', 15, 4, 39, 40, 41), (16, NOW(), 'approved', 16, 4, 42, 45, 46);

-- Tournament 5 (Valorant 5v5)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`, `uer2_id`, `uer3_id`, `uer4_id`, `uer5_id`) VALUES
(17, '2023-10-10 10:00:00', 'approved', 1, 5, 1, 2, 3, 4, 5), (18, '2023-10-10 10:00:00', 'approved', 2, 5, 6, 7, 8, 9, 10),
(19, '2023-10-10 10:00:00', 'approved', 3, 5, 11, 12, 13, 14, 15), (20, '2023-10-10 10:00:00', 'approved', 4, 5, 16, 17, 18, 19, 20);

-- Tournament 6 (SF6 1v1)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`) VALUES
(21, '2025-04-25 10:00:00', 'approved', 5, 6, 21), (22, '2025-04-25 10:00:00', 'approved', 6, 6, 22),
(23, '2025-04-25 10:00:00', 'approved', 7, 6, 23), (24, '2025-04-25 10:00:00', 'approved', 8, 6, 24);

-- Tournament 7 (Tekken 1v1)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`) VALUES
(25, '2025-07-28 10:00:00', 'approved', 5, 7, 21), (26, '2025-07-28 10:00:00', 'approved', 6, 7, 22),
(27, '2025-07-28 10:00:00', 'approved', 7, 7, 23), (28, '2025-07-28 10:00:00', 'approved', 8, 7, 24);

-- Tournament 8 (Dota2 5v5)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`, `uer2_id`, `uer3_id`, `uer4_id`, `uer5_id`) VALUES
(29, '2025-07-12 10:00:00', 'approved', 1, 8, 1, 2, 3, 4, 5), (30, '2025-07-12 10:00:00', 'approved', 2, 8, 6, 7, 8, 9, 10),
(31, '2025-07-12 10:00:00', 'approved', 3, 8, 11, 12, 13, 14, 15), (32, '2025-07-12 10:00:00', 'approved', 4, 8, 16, 17, 18, 19, 20);

-- Tournament 9 (Overwatch2 5v5)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`, `uer2_id`, `uer3_id`, `uer4_id`, `uer5_id`) VALUES
(33, '2023-10-12 10:00:00', 'approved', 1, 9, 1, 2, 3, 4, 5), (34, '2023-10-12 10:00:00', 'approved', 2, 9, 6, 7, 8, 9, 10),
(35, '2023-10-12 10:00:00', 'approved', 3, 9, 11, 12, 13, 14, 15), (36, '2023-10-12 10:00:00', 'approved', 4, 9, 16, 17, 18, 19, 20);

-- Tournament 10 (FC25 1v1)
INSERT INTO `Applications` (`id`, `dte`, `status`, `tem_id`, `tnt_id`, `uer1_id`) VALUES
(37, '2025-05-05 10:00:00', 'approved', 5, 10, 21), (38, '2025-05-05 10:00:00', 'approved', 6, 10, 22),
(39, '2025-05-05 10:00:00', 'approved', 7, 10, 23), (40, '2025-05-05 10:00:00', 'approved', 8, 10, 24);

-- Matches
-- Tournament 1 (CS2)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(1, 'unstarted', 'Aréna 1', '2025-07-15 13:00:00', 'T1 Elődöntő 1', 1, 2, 1), (2, 'unstarted', 'Aréna 1', '2025-07-15 15:00:00', 'T1 Elődöntő 2', 3, 4, 1),
(3, 'unstarted', 'Aréna 1', '2025-07-15 17:00:00', 'T1 Bronzmérkőzés', 1, 3, 1), (4, 'unstarted', 'Aréna 1', '2025-07-15 19:00:00', 'T1 Döntő', 2, 4, 1);

-- Tournament 2 (RL 1v1)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(5, 'unstarted', 'Aréna 2', '2025-07-16 13:00:00', 'T2 Elődöntő 1', 5, 6, 2), (6, 'unstarted', 'Aréna 2', '2025-07-16 15:00:00', 'T2 Elődöntő 2', 7, 8, 2),
(7, 'unstarted', 'Aréna 2', '2025-07-16 17:00:00', 'T2 Bronzmérkőzés', 5, 7, 2), (8, 'unstarted', 'Aréna 2', '2025-07-16 19:00:00', 'T2 Döntő', 6, 8, 2);

-- Tournament 3 (LoL 2v2)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(9, 'unstarted', 'Aréna 3', '2025-07-17 13:00:00', 'T3 Elődöntő 1', 9, 10, 3), (10, 'unstarted', 'Aréna 3', '2025-07-17 15:00:00', 'T3 Elődöntő 2', 11, 12, 3),
(11, 'unstarted', 'Aréna 3', '2025-07-17 17:00:00', 'T3 Bronzmérkőzés', 9, 11, 3), (12, 'unstarted', 'Aréna 3', '2025-07-17 19:00:00', 'T3 Döntő', 10, 12, 3);

-- Tournament 4 (RL 3v3)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(13, 'unstarted', 'Aréna 4', '2025-07-18 13:00:00', 'T4 Elődöntő 1', 13, 14, 4), (14, 'unstarted', 'Aréna 4', '2025-07-18 15:00:00', 'T4 Elődöntő 2', 15, 16, 4),
(15, 'unstarted', 'Aréna 4', '2025-07-18 17:00:00', 'T4 Bronzmérkőzés', 13, 15, 4), (16, 'unstarted', 'Aréna 4', '2025-07-18 19:00:00', 'T4 Döntő', 14, 16, 4);

-- Tournament 5 (Valorant)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(17, 'ended', 'Debrecen LAN1', '2023-10-15 11:00:00', 'T5 Elődöntő 1', 17, 18, 5), (18, 'ended', 'Debrecen LAN1', '2023-10-15 13:00:00', 'T5 Elődöntő 2', 19, 20, 5),
(19, 'ended', 'Debrecen LAN1', '2023-10-15 15:00:00', 'T5 Bronzmérkőzés', 17, 19, 5), (20, 'ended', 'Debrecen LAN1', '2023-10-15 17:00:00', 'T5 Döntő', 18, 20, 5);

-- Tournament 6 (SF6)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(21, 'ended', 'Szeged Ring1', '2025-05-01 13:00:00', 'T6 Elődöntő 1', 21, 22, 6), (22, 'ended', 'Szeged Ring1', '2025-05-01 15:00:00', 'T6 Elődöntő 2', 23, 24, 6),
(23, 'ended', 'Szeged Ring1', '2025-05-01 17:00:00', 'T6 Bronzmérkőzés', 21, 23, 6), (24, 'ended', 'Szeged Ring1', '2025-05-01 19:00:00', 'T6 Döntő', 22, 24, 6);

-- Tournament 7 (Tekken)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(25, 'unstarted', 'Pécs Dojo1', '2025-08-01 13:00:00', 'T7 Elődöntő 1', 25, 26, 7), (26, 'unstarted', 'Pécs Dojo1', '2025-08-01 15:00:00', 'T7 Elődöntő 2', 27, 28, 7),
(27, 'unstarted', 'Pécs Dojo1', '2025-08-01 17:00:00', 'T7 Bronzmérkőzés', 25, 27, 7), (28, 'unstarted', 'Pécs Dojo1', '2025-08-01 19:00:00', 'T7 Döntő', 26, 28, 7);

-- Tournament 8 (Dota2)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(29, 'unstarted', 'Aréna 1', '2025-07-19 11:00:00', 'T8 Elődöntő 1', 29, 30, 8), (30, 'unstarted', 'Aréna 1', '2025-07-19 13:00:00', 'T8 Elődöntő 2', 31, 32, 8),
(31, 'unstarted', 'Aréna 1', '2025-07-19 15:00:00', 'T8 Bronzmérkőzés', 29, 31, 8), (32, 'unstarted', 'Aréna 1', '2025-07-19 17:00:00', 'T8 Döntő', 30, 32, 8);

-- Tournament 9 (Overwatch2)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(33, 'ended', 'Debrecen LAN2', '2023-10-18 11:00:00', 'T9 Elődöntő 1', 33, 34, 9), (34, 'ended', 'Debrecen LAN2', '2023-10-18 13:00:00', 'T9 Elődöntő 2', 35, 36, 9),
(35, 'ended', 'Debrecen LAN2', '2023-10-18 15:00:00', 'T9 Bronzmérkőzés', 33, 35, 9), (36, 'ended', 'Debrecen LAN2', '2023-10-18 17:00:00', 'T9 Döntő', 34, 36, 9);

-- Tournament 10 (FC25)
INSERT INTO `Matches` (`id`, `status`, `place`, `dte`, `details`, `apn1_id`, `apn2_id`, `tnt_id`) VALUES
(37, 'unstarted', 'Szeged Pálya1', '2025-05-12 11:00:00', 'T10 Elődöntő 1', 37, 38, 10), (38, 'unstarted', 'Szeged Pálya1', '2025-05-12 13:00:00', 'T10 Elődöntő 2', 39, 40, 10),
(39, 'unstarted', 'Szeged Pálya1', '2025-05-12 15:00:00', 'T10 Bronzmérkőzés', 37, 39, 10), (40, 'unstarted', 'Szeged Pálya1', '2025-05-12 17:00:00', 'T10 Döntő', 38, 40, 10);

-- Picture Links
-- Felhasználói képek: minden user kapja az 1-es ID-jű képet ('/user/user_0.png')
INSERT INTO `Picture_Links` (`uer_id`, `pte_id`) SELECT `id`, 1 FROM `Users`;
-- Csapat képek: minden csapat kapja a 2-es ID-jű képet ('/team/team_0.png')
INSERT INTO `Picture_Links` (`tem_id`, `pte_id`) SELECT `id`, 2 FROM `Teams`;
-- Esemény képek: minden esemény kapja a 3-as ID-jű képet ('/event/event_0.png')
INSERT INTO `Picture_Links` (`evt_id`, `pte_id`) SELECT `id`, 3 FROM `Events`;
-- Szervezői képek: minden szervező kapja az 5-ös ID-jű képet ('/organizer/organizer_0.png')
INSERT INTO `Picture_Links` (`ogr_id`, `pte_id`) SELECT `id`, 5 FROM `Organizers`;
-- Verseny specifikus képek
INSERT INTO `Picture_Links` (`tnt_id`, `pte_id`) VALUES
(1, 6), (2, 7), (3, 8), (4, 9), (5, 10),
(6, 11), (7, 12), (8, 13), (9, 14), (10, 15);