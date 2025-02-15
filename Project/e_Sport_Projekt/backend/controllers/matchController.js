const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const matchList = async (req, res) => {
    try {
        const matches = await prisma.matches.findMany();
        res.status(200).json(matches);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const matchUpdate = async (req, res) => {
    const { id, tem1_id, tem2_id, tnt_id, status, place, dte, details, winner, rslt } = req.body;

    if(!id || !tem1_id || !tem2_id || !tnt_id){
        return res.status(400).json({message: "Hiányos adatok!"});
    }

    try {

        //Verseny aktív időszakához szükséges adatok

        const tournament = await prisma.tournaments.findFirst({
            where: {
                id: tnt_id
            }
        });

        if(!tournament){
            return res.status(400).json({message: "A megadott verseny nem található!"});
        }

        const tStartDate = new Date(tournament.start_date);
        const tEndDate = new Date(tournament.end_date);

        //Megadott dátum vizsgálata
        const matchDate = new Date(dte);

        const idoChecks = [
            {condition: matchDate > tEndDate, message: "Az időpontot nem lehet megadni későbbre mint a verseny vége!"},
            {condition: matchDate < tStartDate, message: "Az időpontot nem lehet megadni hamarabbra mint a verseny kezdete!"}
        ]
        
        for (let validation of idoChecks) {
            if (validation.condition) {
                return res.status(400).json({ message: validation.message });
            }
        }


        if (status != "ended" || status != "started") {
            const match = await prisma.matches.update({
                where: {
                    id_tem1_id_tem2_id_tnt_id: {
                        id: id,
                        tem1_id: tem1_id,
                        tem2_id: tem2_id,
                        tnt_id: tnt_id
                    },
                    AND: {
                        status: status
                    }
                },
                data: {
                    dte: dte,
                    place: place,
                    details: details
                }
            })

            return res.status(200).json({ message: "Sikeres adatfrissítés!" });

        }
        if (status == "ended") {
            const match = await prisma.matches.update({
                where: {
                    id_tem1_id_tem2_id_tnt_id: {
                        id: id,
                        tem1_id: tem1_id,
                        tem2_id: tem2_id,
                        tnt_id: tnt_id
                    },
                    AND: {
                        status: status
                    }

                },
                data: {
                    winner: winner,
                    rslt: rslt,
                    details: details
                }
            })
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }
        if (status == "started") {
            const match = await prisma.matches.update({
                where: {
                    id_tem1_id_tem2_id_tnt_id: {
                        id: id,
                        tem1_id: tem1_id,
                        tem2_id: tem2_id,
                        tnt_id: tnt_id
                    },
                    AND: {
                        status: status
                    }
                },
                data: {
                    details: details
                }
            })

            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }

}


const matchInsert = async (req, res)=>{

    const { tem1_id, tem2_id, tnt_id, details } = req.body;

    if(!tem1_id || !tem2_id || !tnt_id){
        return res.status(400).json({message: "Hiányos adatok!"});
    }


    try {

        //Tournament keresése
        const tournament = await prisma.tournaments.findFirst({
            where:{
                id: tnt_id
            }
        });

        //Két csapat keresés
            //tem1
        const team1 = await prisma.teams.findFirst({
            where:{
                id: tem1_id
            }
        });


            //tem2
            const team2 = await prisma.teams.findFirst({
                where:{
                    id: tem2_id
                }
            });

        const findResults = [
            {condition: !team1 && !team2, message: "Egyik csapat sem található!"},
            {condition: !team1, message: "A csapat nem található! (team1)"},
            {condition: !team2, message: "A csapat nem található! (team2)"},
            {condition: !tournament, message: "A megadott verseny nem található!"},
        ]

        for (let validation of findResults) {
            if (validation.condition) {
                return res.status(400).json({ message: validation.message });
            }
        }
        
        const match = await prisma.matches.create({
            data:{
                status: "unstarted",
                details: details,
                tem1_id: team1.id,
                tem2_id: team2.id,
                tnt_id: tournament.id
            }
        });



        return res.status(200).json({message: "Sikeres meccs létrehozás!"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a feltöltés során!" });
    }



}



module.exports = {
    matchList,
    matchUpdate,
    matchInsert
}