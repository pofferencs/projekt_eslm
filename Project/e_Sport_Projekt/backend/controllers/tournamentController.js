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

const tournamentSearchByEvent = async (req, res) =>{

    const {name} = req.body;

    if(!name) return res.status(400).json({message: "Hiányos adatok!"});

    try {

        const tournaments = await prisma.tournaments.findMany({
            where:{
                event:{
                    name: name
                }
            }
        })

        if(tournaments.length == 0 || name == "") return res.status(400).json({message : "Nincs ilyen verseny!"});
        else return res.status(200).json(tournaments);


        
    } catch (error) {
        return res.status(500).json(error);
    }
}

const tntSearchById = async (req, res) =>{

        const { id } = req.params;

        if(!id){
            return res.status(400).json({message: "Hiányos adat!"});
        }

        try {

            const tournament = await prisma.tournaments.findFirst({
                where: {
                    id: parseInt(id)
                }
            });


            if(!tournament) return res.status(400).json({message : "Nincs ilyen verseny!"});
            else return res.status(200).json(tournament);


            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Hiba a fetch során!" });            
        }

    };



const tournamentSearchByName = async (req,res) =>{

    const { name } = req.params;

    if(!name) return res.status(400).json({message: "Hiányos adatok!"});

    try {
        const tournaments = await prisma.tournaments.findMany({
            where: {
                name:{
                    contains: name
                }
            }
        });
        if(tournaments.length == 0 || name == "") return res.status(400).json({message : "Nincs ilyen verseny!"});
        else return res.status(200).json(tournaments);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const tournamentUpdate = async (req, res) => {

    const { id, name, num_participant, team_num, start_date, end_date, game_mode, max_participant, apn_start, apn_end, details, evt_id, gae_id } = req.body;

  
    if(!id || !name || !start_date || !end_date || !game_mode || !max_participant || !apn_start || !apn_end || !evt_id || !gae_id){

        return res.status(400).json({message: "Hiányos adatok!"});
    };

    const existingTournament = await prisma.tournaments.findFirst({
        where: {
            id: id
        }
    })

    if (!existingTournament) {
        return res.status(400).json({ message: "Ez a verseny nem létezik az adott eseményen!"});
    } 

    //Event és game kikeresése a többi adat vizsgálásához
    const event = await prisma.events.findFirst({
        where: {
            id: evt_id
        }
    });

    const game = await prisma.games.findFirst({
        where: {
            id: gae_id
        }
    });

    const tableValidations = [
        {condition: !event, message: "Az esemény nem található!"},
        {condition: !game, message: "A játék nem található!"}
    ];

    // Validációs ciklus
    for (let validation of tableValidations) {
        if (validation.condition) {
            return res.status(400).json({ message: validation.message });
        }
    }

    //Verseny kezdeti és végidőpont

    const tStartDate = new Date(start_date);
    const tEndDate = new Date(end_date);

    const idopontCheck = [
        {condition: tStartDate < event.start_date, message: "A verseny kezdete nem lehet hamarabb mint az esemény kezdete!"},
        {condition: tStartDate > event.end_date, message: "A verseny vége után nem kezdődhet verseny!"},
        {condition: tEndDate > event.end_date, message: "A verseny vége nem lehet később mint az esemény vége!"},
        {condition: tStartDate > tEndDate, message: "Az verseny kezdete nem lehet később mint a vége!"}

    ];

    // Validációs ciklus
    for (let validation of idopontCheck) {
        if (validation.condition) {
            return res.status(400).json({ message: validation.message });
        }
    }
    
    //Jelentkezés kezdeti és végidőpont

    const aStartDate = new Date(apn_start);
    const aEndDate = new Date(apn_end);

    const aEndDateChk = new Date(apn_end);
    aEndDateChk.setTime(tStartDate.getTime()-7 * 24 * 60 * 60 * 1000);


    const jIdopontCheck = [
        {condition: aStartDate > aEndDate, message: "A jelentkezés kezdete nem lehet később mint a vége!"},
        {condition: aStartDate > tStartDate, message: "A jelentkezés kezdete nem lehet később a verseny kezdetétől!"},
        {condition: aEndDate > tEndDate, message: "A jelentkezés vége nem lehet később a verseny végénél!"},
        {condition: aEndDate > aEndDateChk, message: "A jelentkezésnek legalább 7 nappal a verseny kezdete előtt kell véget érnie!"},
        
    ];

    // Validációs ciklus
    for (let validation of jIdopontCheck) {
        if (validation.condition) {
            return res.status(400).json({ message: validation.message });
        }
    }
        try {
            const tournament = await prisma.tournaments.update({
                where: {
                    id_evt_id_gae_id: {
                        id: id,
                        evt_id: evt_id,
                        gae_id: gae_id
                    }
                },
                data: {
                    name: name,
                    num_participant: parseInt(num_participant),
                    team_num: parseInt(team_num),
                    start_date: tStartDate,
                    end_date: tEndDate,
                    game_mode: game_mode,
                    max_participant: parseInt(max_participant),
                    apn_start: aStartDate,
                    apn_end: aEndDate,
                    details: details
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Hiba a fetch során!" })
        }
    };


const tournamentDelete = async (req, res) => {

    const { id, evt_id, gae_id } = req.body;

    try {

        const tournaments = await prisma.tournaments.delete({
            where: {
                id_evt_id_gae_id: {
                    id: id,
                    evt_id: evt_id,
                    gae_id: gae_id
                }
            }
        });
        res.status(200).json({ message: "Sikeres törlés!" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Hiba a törlés során!" })
    }
}


const tournamentInsert = async (req, res) => {

    const { name, num_participant, team_num, start_date, end_date, game_mode, max_participant, apn_start, apn_end, details, evt_id, gae_id } = req.body;

    try {

        //Adatok megléte
        if(!name || !start_date || !end_date || !game_mode || !max_participant || !apn_start || !apn_end || !evt_id || !gae_id){
            return res.status(400).json({message: "Hiányos adatok!"});
        }

        if(max_participant < 0 || num_participant < 0 || team_num < 0){
            return res.status(400).json({message: "Csak pozitív számot adhatsz meg!"});
        }

        //Event és game kikeresése a többi adat vizsgálásához
        const event = await prisma.events.findFirst({
            where: {
                id: evt_id
            }
        });

        const game = await prisma.games.findFirst({
            where: {
                id: gae_id
            }
        });

        const tableValidations = [
            {condition: !event, message: "Az esemény nem található!"},
            {condition: !game, message: "A játék nem található!"}
        ];

        // Validációs ciklus
        for (let validation of tableValidations) {
            if (validation.condition) {
                return res.status(400).json({ message: validation.message });
            }
        }


        //Verseny kezdeti és végidőpont

        const tStartDate = new Date(start_date);
        const tEndDate = new Date(end_date);

        const idopontCheck = [
            {condition: tStartDate < event.start_date, message: "A verseny kezdete nem lehet hamarabb mint az esemény kezdete!"},
            {condition: tStartDate > event.end_date, message: "A verseny vége után nem kezdődhet verseny!"},
            {condition: tEndDate > event.end_date, message: "A verseny vége nem lehet később mint az esemény vége!"},
            {condition: tStartDate > tEndDate, message: "Az verseny kezdete nem lehet később mint a vége!"}

        ];

        // Validációs ciklus
        for (let validation of idopontCheck) {
            if (validation.condition) {
                return res.status(400).json({ message: validation.message });
            }
        }
        
        //Jelentkezés kezdeti és végidőpont

        const aStartDate = new Date(apn_start);
        const aEndDate = new Date(apn_end);

        const aEndDateChk = new Date(apn_end);
        //console.log(aEndDateChk);
        aEndDateChk.setTime(tStartDate.getTime()-7 * 24 * 60 * 60 * 1000);
        //console.log(aEndDateChk);

        const jIdopontCheck = [
            {condition: aStartDate > aEndDate, message: "A jelentkezés kezdete nem lehet később mint a vége!"},
            {condition: aStartDate > tStartDate, message: "A jelentkezés kezdete nem lehet később a verseny kezdetétől!"},
            {condition: aEndDate > tEndDate, message: "A jelentkezés vége nem lehet később a verseny végénél!"},
            {condition: aEndDate > aEndDateChk, message: "A jelentkezésnek legalább 7 nappal a verseny kezdete előtt kell véget érnie!"},
            
        ];

        // Validációs ciklus
        for (let validation of jIdopontCheck) {
            if (validation.condition) {
                return res.status(400).json({ message: validation.message });
            }
        }


        //Tournament és Picture Link létrehozás

        const tournament = await prisma.tournaments.create({
            data:{
                name: name,
                num_participant: parseInt(num_participant),
                team_num: parseInt(team_num),
                start_date: tStartDate,
                end_date: tEndDate,
                game_mode: game_mode,
                max_participant: parseInt(max_participant),
                apn_start: aStartDate,
                apn_end: aEndDate,
                details: details,
                evt_id: event.id,
                gae_id: game.id
            }
        });

        const picLink = await prisma.picture_Links.create({
            data: {
                tnt_id: tournament.id,
                pte_id: 5
            }
        });

        return res.status(200).json({message: "A verseny sikeresen feltöltésre került!"})

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a feltöltés során!" })
    }

}

const tournamentGetPicPath = async (req,res)=>{
    const { tournament_id } = req.params;

    try {
        const tournamentPic = await prisma.picture_Links.findFirst({
            where: {
                tnt_id: Number(tournament_id)
            }
        });

        if (!tournamentPic || !tournamentPic.tnt_id) {
            return res.status(400).json({ message: "Nincs ilyen verseny!" });
        }

        const picPath = await prisma.pictures.findUnique({
            where: {
                id: tournamentPic.pte_id
            }
        });

        if (!picPath) {
            return res.status(400).json({ message: "Nincs ilyen kép!" });
        }

        return res.status(200).json(picPath.img_path);

    } catch (error) {
        return res.status(500).json(error);
    }

}

module.exports = {
    tournamentList,
    tournamentUpdate,
    tournamentDelete,
    tournamentInsert,
    tournamentGetPicPath,
    tournamentSearchByName,
    tournamentSearchByEvent,
    tntSearchById
}