-- Players
INSERT INTO Players (inviteable, full_name, usr_name, usna_last_mod_date, usna_mod_num_remain, paswrd, date_of_birth, school, clss, email_address, email_last_mod_date, phone_num, om_identifier, status, discord_name) 
VALUES
(1, 'John Doe', 'johndoe', NOW(), 3, 'password123', '2000-01-01', 'School A', '12A', 'johndoe@example.com', NOW(), '1234567890', 'OM12345678', 'active', 'johndoe#1234'),
(0, 'Jane Smith', 'janesmith', NOW(), 5, 'password321', '1999-05-15', 'School B', '11B', 'janesmith@example.com', NOW(), '0987654321', 'OM23456789', 'inactive', 'janesmith#5678'),
(1, 'Alice Johnson', 'alicej', NOW(), 1, 'alicepass', '2001-03-23', 'School C', '10C', 'alice@example.com', NOW(), '1122334455', 'OM34567890', 'active', 'alicej#9101'),
(1, 'Bob Brown', 'bobbrown', NOW(), 2, 'bobpass', '2000-07-12', 'School D', '12D', 'bobbrown@example.com', NOW(), '5566778899', 'OM45678901', 'active', 'bobbrown#2345'),
(0, 'Charlie Green', 'charlieg', NOW(), 0, 'charliepass', '2002-11-05', 'School E', '9A', 'charlie@example.com', NOW(), '6677889900', 'OM56789012', 'inactive', 'charlieg#3456');

-- Teams
INSERT INTO Teams (short_name, full_name, creator_id)
VALUES
('ABCD', 'Alpha Bravo Charlie Delta', 1),
('XYZ', 'Xeno Yellow Zeta', 2),
('DEF', 'Delta Echo Foxtrot', 3),
('GHIJ', 'Gamma Hotel India Juliett', 4),
('LMN', 'Lima Mike November', 5);

-- Events
INSERT INTO Events (name, start_date, end_date, place, details)
VALUES
('Summer Tournament', '2024-06-01 10:00:00', '2024-06-05 20:00:00', 'New York Arena', 'A large summer esports event'),
('Fall Championship', '2024-09-01 12:00:00', '2024-09-03 18:00:00', 'Los Angeles Expo', 'Fall season grand championship'),
('Winter Invitational', '2024-12-10 09:00:00', '2024-12-12 17:00:00', 'Chicago Dome', 'Exclusive winter invitational'),
('Spring Cup', '2024-03-15 11:00:00', '2024-03-17 16:00:00', 'Dallas Convention Center', 'Spring esports showdown'),
('Global Finals', '2024-11-05 08:00:00', '2024-11-10 22:00:00', 'London Arena', 'The final event of the global esports season');

-- Games
INSERT INTO Games (name)
VALUES
('League of Legends'),
('Dota 2'),
('Valorant'),
('Fortnite'),
('Counter-Strike');

-- Tournaments
INSERT INTO Tournaments (name, num_participant, team_num, start_date, end_date, game_mode, max_participant, apn_start, apn_end, details, evt_id, gae_id)
VALUES
('Summer Cup', 16, 4, '2024-06-01 10:00:00', '2024-06-05 20:00:00', 'Single Elimination', 64, '2024-05-01 00:00:00', '2024-05-30 23:59:59', 'Summer esports competition', 1, 1),
('Fall Clash', 8, 2, '2024-09-01 12:00:00', '2024-09-03 18:00:00', 'Double Elimination', 32, '2024-08-01 00:00:00', '2024-08-30 23:59:59', 'Fall season clash', 2, 2),
('Winter Royale', 12, 3, '2024-12-10 09:00:00', '2024-12-12 17:00:00', 'Best of 3', 48, '2024-11-01 00:00:00', '2024-11-30 23:59:59', 'Exclusive winter royale', 3, 3),
('Spring Showdown', 16, 4, '2024-03-15 11:00:00', '2024-03-17 16:00:00', 'Round Robin', 64, '2024-02-01 00:00:00', '2024-02-28 23:59:59', 'Spring season showdown', 4, 4),
('Global Challenge', 32, 8, '2024-11-05 08:00:00', '2024-11-10 22:00:00', 'Single Elimination', 128, '2024-10-01 00:00:00', '2024-10-30 23:59:59', 'Global esports challenge', 5, 5);

-- Pictures
INSERT INTO Pictures (img_path)
VALUES
('/images/player1.png'),
('/images/player2.png'),
('/images/team1_logo.png'),
('/images/event1_poster.jpg'),
('/images/tournament1_banner.png');

-- Team_Memberships
INSERT INTO Team_Memberships (status, per_id, tem_id)
VALUES
('active', 1, 1),
('inactive', 2, 2),
('active', 3, 3),
('inactive', 4, 4),
('active', 5, 5);

-- Matches
INSERT INTO Matches (status, place, dte, details, winner, rslt, tem1_id, tem2_id, tnt_id)
VALUES
('completed', 'New York Arena', '2024-06-01 12:00:00', 'Match 1 details', 'Alpha Bravo', '2-1', 1, 2, 1),
('completed', 'Los Angeles Expo', '2024-09-01 14:00:00', 'Match 2 details', 'Xeno Yellow', '3-0', 2, 3, 2),
('ongoing', 'Chicago Dome', '2024-12-10 10:00:00', 'Match 3 details', '', '', 3, 4, 3),
('completed', 'Dallas Convention Center', '2024-03-15 13:00:00', 'Match 4 details', 'Delta Echo', '2-2', 4, 5, 4),
('completed', 'London Arena', '2024-11-05 09:00:00', 'Match 5 details', 'Lima Mike', '1-0', 5, 1, 5);

-- Applications
INSERT INTO Applications (dte, status, per_id, tem_id, tnt_id)
VALUES
('2024-05-01 12:00:00', 'pending', 1, 1, 1),
('2024-06-01 14:00:00', 'approved', 2, 2, 2),
('2024-07-01 16:00:00', 'rejected', 3, 3, 3),
('2024-08-01 18:00:00', 'pending', 4, 4, 4),
('2024-09-01 20:00:00', 'approved', 5, 5, 5);

-- Picture_Links
INSERT INTO Picture_Links (per_id, tem_id, tnt_id, evt_id, pte_id)
VALUES
(1, 1, 1, 1, 1),
(2, 2, 2, 2, 2),
(3, 3, 3, 3, 3),
(4, 4, 4, 4, 4),
(5, 5, 5, 5, 5);
