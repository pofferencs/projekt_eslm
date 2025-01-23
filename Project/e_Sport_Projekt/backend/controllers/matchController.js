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

    // státuszok: unstarted, started, ended, suspended
    try {

        if (status != "ended" || status !== "started") {
            // unstarted, suspended
            // dte, place, details




        }
        else if (status == "ended") {
            // ended
            // winner, rslt, details

        }
        else {
            // started
            // details
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