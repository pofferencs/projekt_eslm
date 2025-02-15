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

    try {
        if (status != "ended" || status !== "started") {
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

    const { status, tem1_id, tem2_id, tnt_id } = req.body;

    try {

        



        
    } catch (error) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a feltöltés során!" });
    }



}



module.exports = {
    matchList,
    matchUpdate
}