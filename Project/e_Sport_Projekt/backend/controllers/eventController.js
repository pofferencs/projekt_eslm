const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const eventList = async (req, res) => {
    try {
        const events = await prisma.events.findMany();
        res.status(200).json(events);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const eventUpdate = async (req, res) => {
    const { id, name, start_date, end_date, place, details } = req.body;

    try {
        const event = await prisma.events.update({
            where: {
                id: id
            },
            data: {
                name: name,
                start_date: start_date,
                end_date: end_date,
                place: place,
                details: details
            }
        });
        res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}


module.exports = {
    eventList,
    eventUpdate

}
