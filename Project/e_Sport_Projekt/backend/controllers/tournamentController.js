const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tournamentList = async (req, res) => {
    try {
        const tournaments = await prisma.tournaments.findMany();
        res.status(200).json(tournaments);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
};

const tournamentUpdate = async (req, res) =>{

    const {id, name, num_participant, team_num, start_date, end_date, game_mode, max_participant, apn_start, apn_end, details, evt_id, gae_id} = req.body;

    try {
        const tournament = await prisma.tournaments.update({
            where:{
                id_evt_id_gae_id:{
                    id: id,
                    evt_id: evt_id,
                    gae_id: gae_id
                }
            },
            data:{
                name: name,
                num_participant: num_participant,
                team_num: team_num,
                start_date: start_date,
                end_date: end_date,
                game_mode: game_mode,
                max_participant: max_participant,
                apn_start: apn_start,
                apn_end: apn_end,
                details: details
            }
        });
        return res.status(200).json({ message: "Sikeres adatfrissítés, felahsználó kép!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }

};

module.exports = {
    tournamentList,
    tournamentUpdate
}