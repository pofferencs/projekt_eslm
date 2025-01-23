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

// ??? - Meccs státusz update külön vagy egybe a matchUpdate-hez

const matchUpdate = async (req, res) => {
    const { id, tem1_id, tem2_id, tnt_id, status, place, dte, details, winner, rslt } = req.body;

    // státuszok: unstarted, started, ended, suspended
    try {

        if (status != "ended" || status !== "started") {
            // unstarted, suspended
            // dte, place, details

            const match = await prisma.matches.update({
                where: {
                    id_tem1_id_tem2_id_tnt_id:{
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
            // ended
            // winner, rslt, details

            const match = await prisma.matches.update({
                where: {
                    id_tem1_id_tem2_id_tnt_id:{
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
        if(status == "started") {
            // started
            // details

            const match = await prisma.matches.update({
                where: {
                    id_tem1_id_tem2_id_tnt_id:{
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


module.exports = {
    matchList,
    matchUpdate
}