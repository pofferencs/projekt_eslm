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

module.exports = {
    tournamentList
}