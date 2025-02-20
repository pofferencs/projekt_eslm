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


    if(!id || !name || !place || !details || !start_date || !end_date){
        return res.status(400).json({message: "Hiányos adatok!"});
    }
    
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

    try {

        const existingEvent = await prisma.events.findFirst({
            where: {
                id: id
            }
        });

        if (!existingEvent) {
            return res.status(400).json({ message: "Az adott esemény nem létezik!" });
        }

        const event = await prisma.events.update({
            where: {
                id: id
            },
            data: {
                name: name,
                start_date: startDate,
                end_date: endDate,
                place: place,
                details: details
            }
        });

        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const eventInsert = async (req, res) => {
    const { name, place, details, start_date, end_date } = req.body;

    if(!name || !place || !details || !start_date || !end_date){
        return res.status(400).json({message: "Hiányos adatok!"});
    }

    try {
        /* Az esemény kezdetét az adott naptól legalább 14,
        maximum 60 napra rá lehet beállítani. - B.R. */
        const now = new Date()
        const minStartDate = new Date(now);
        minStartDate.setDate(now.getDate() + 14);

        const maxStartDate = new Date(now);
        maxStartDate.setDate(now.getDate() + 60);

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

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
                name: name,
                start_date: startDate,
                end_date: endDate,
                place: place
            }
        });

        // ... és ha létezik, akkor 400-as státuszt adunk
        if (existingEvent) {
            return res.status(400).json({ message: "Az adott esemény már létezik!" });
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

        const picLink = await prisma.picture_Links.create({
            data: {
                evt_id: event.id,
                pte_id: 5
            }
        });

        return res.status(200).json({ message: "Az esemény sikeresen létrehozva!" });

        // Ez ugyan az a megoldás, csak hosszabban és olvashatatlanabbul
        //-------------------------------------------------------------------------------------------------------------------------------
        // let eventInsertAvailable = false;

        // if( startDate < now){
        //     eventInsertAvailable = false;
        //     return res.status(400).json({message:"Az esemény kezdetét nem lehet múltbeli időpontra rakni!"});
        // }
        // else if( startDate < minStartDate){
        //     eventInsertAvailable = false;
        //     return res.status(400).json({message:"Az esemény kezdetét az adott naptól legalább 14. napra kell állítani!"});
        // }
        // else if(startDate > endDate){
        //     eventInsertAvailable = false;
        //     return res.status(400).json({message:"Az esemény kezdete nem lehet később mint a vége!"});
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
        //     return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        // }
        //-------------------------------------------------------------------------------------------------------------------------------

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const eventDelete = async (req, res) => {

    const { id } = req.body;

    try {
        const event = await prisma.events.delete({
            where: {
                id: id
            }
        })
        res.status(200).json({ message: "Sikeres törlés!" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Hiba a törlés során!" });
    }

}

module.exports = {
    eventList,
    eventUpdate,
    eventInsert,
    eventDelete
}
