const { PrismaClient } = require('@prisma/client');
const { validalasFuggveny, hianyzoAdatFuggveny } = require('../functions/conditions');
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
    const { id, tem1_id, tem2_id, tnt_id, status, uj_status, place, dte, details, winner, rslt } = req.body;

    if (hianyzoAdatFuggveny(res, "Hiányos adatok!", id, tem1_id, tem2_id, tnt_id)) {
        return;
    }

    try {
        //Verseny aktív időszakához szükséges adatok

        const tournament = await prisma.tournaments.findFirst({
            where: {
                id: tnt_id
            }
        });

        const team1 = await prisma.teams.findFirst({
            where: {
                id: tem1_id
            }
        });

        const team2 = await prisma.teams.findFirst({
            where: {
                id: tem2_id
            }
        });

        if (!tournament) {
            return res.status(400).json({ message: "A megadott verseny nem található!" });
        }

        const tStartDate = new Date(tournament.start_date);
        const tEndDate = new Date(tournament.end_date);

        //Megadott dátum vizsgálata
        const matchDate = new Date(dte);
               

        if (validalasFuggveny(res, [
            { condition: matchDate > tEndDate, message: `Az időpontot nem lehet megadni későbbre mint a verseny vége! (${tournament.apn_end})` },
            { condition: matchDate < tStartDate, message: `Az időpontot nem lehet megadni hamarabbra mint a verseny kezdete! (${tournament.apn_start})` },
            { condition: !team1 || !team2, message: "A csapat nem található! (team1)" }

        ])) {
            return;
        };

        if (status != "ended" && status != "started") {
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
                    dte: matchDate,
                    place: place,
                    details: details,
                    status: uj_status
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
                    details: details,
                    status: uj_status
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

const matchInsert = async (req, res) => {

    const { tem1_id, tem2_id, tnt_id, details } = req.body;

    try {

        if (hianyzoAdatFuggveny(res, "Hiányzó adat(ok)!", tem1_id, tem2_id, tnt_id)) {
            return;
        };

        //Két csapat keresés
        //tem1
        const team1 = await prisma.teams.findFirst({
            where: {
                id: tem1_id
            }
        });

        //tem2
        const team2 = await prisma.teams.findFirst({
            where: {
                id: tem2_id
            }
        });
        
        //Tournament keresése
        const tournament = await prisma.tournaments.findFirst({
            where: {
                id: tnt_id
            }
        });

        if (validalasFuggveny(res, [
            { condition: !team1, message: "A csapat nem található! (team1)" },
            { condition: !team2, message: "A csapat nem található! (team2)" },
            { condition: !tournament, message: "A verseny nem található!" }
        ])) {
            return;
        };

        const match = await prisma.matches.create({
            data: {
                status: "unstarted",
                details: details,
                tem1_id: team1.id,
                tem2_id: team2.id,
                tnt_id: tournament.id
            }
        });

        return res.status(200).json({ message: "Sikeres meccs létrehozás!" })

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