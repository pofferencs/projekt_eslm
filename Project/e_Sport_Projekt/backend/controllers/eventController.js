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

const eventInsert = async (req, res) => {
    const { name, place, details } = req.body;

    try {
        /* Az esemény kezdetét az adott naptól legalább 14,
        maximum 60 napra rá lehet beállítani. - B.R. */
        const now = new Date()
        const minStartDate = new Date(now);
        minStartDate.setDate(now.getDate() + 14);

        const maxStartDate = new Date(now);
        maxStartDate.setDate(now.getDate() + 60);

        const startDate = new Date(req.body.start_date);
        const endDate = new Date(req.body.end_date);

        // Validációk és üzenetek
        const validations = [
            { condition: startDate < now, message: "Az esemény kezdetét nem lehet múltbeli időpontra rakni!" },
            { condition: startDate < minStartDate, message: "Az esemény kezdetét az adott naptól legalább 14. napra kell állítani!" },
            { condition: startDate > endDate, message: "Az esemény kezdete nem lehet később mint a vége!" }
        ];

        // Validációs ciklus
        for (let validation of validations) {
            if (validation.condition) {
                return res.status(400).json({ message: validation.message });
            }
        }

        // Megnézzük, hogy az esemény már létezik-e, ...
        const existingEvent = await prisma.events.findFirst({
            where: {
                start_date: startDate,
                end_date: endDate,
                place: place,
                details: details,
            }
        });

        // ... és ha létezik, akkor 400-as státuszt adunk
        if (existingEvent) {
            res.status(400).json({ message: "Az adott esemény már létezik!" });
        }

        // Ha minden validáció rendben van, insertálás
        const event = await prisma.events.create({
            data: {
                name: name,
                start_date: startDate,
                end_date: endDate,
                place: place,
                details: details
            }
        });
        res.status(200).json({ message: "Sikeres adatfrissítés!" });

        // Ez ugyan az a megoldás, csak hosszabban és olvashatatlanabbul
        //-------------------------------------------------------------------------------------------------------------------------------
        // let eventInsertAvailable = false;

        // if( startDate < now){
        //     res.status(400).json({message:"Az esemény kezdetét nem lehet múltbeli időpontra rakni!"});
        //     eventInsertAvailable = false;
        // }
        // else if( startDate < minStartDate){
        //     res.status(400).json({message:"Az esemény kezdetét az adott naptól legalább 14. napra kell állítani!"});
        //     eventInsertAvailable = false;
        // }
        // else if(startDate > endDate){
        //     res.status(400).json({message:"Az esemény kezdete nem lehet később mint a vége!"});
        //     eventInsertAvailable = false;
        // }else{
        //     eventInsertAvailable = true;
        // }

        // if(eventInsertAvailable){
        //     const event = await prisma.events.create({
        //         data : {
        //             name: name,
        //             start_date: start_date,
        //             end_date: end_date,
        //             place: place,
        //             details: details
        //         }
        //     });
        //     res.status(200).json({ message: "Sikeres adatfrissítés!" });
        // }
        //-------------------------------------------------------------------------------------------------------------------------------

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}


module.exports = {
    eventList,
    eventUpdate,
    eventInsert
}
