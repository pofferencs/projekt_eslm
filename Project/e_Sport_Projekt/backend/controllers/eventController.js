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

    const eventSearchById = async (req, res) =>{

        const { id } = req.params;

        if(!id){
            return res.status(400).json({message: "Hiányos adat!"});
        }

        try {

            //itt valamiért azt írja, hogy "id is missing", de lefut attól függetlenül
            const event = await prisma.events.findFirst({
                where: {
                    id: parseInt(id)
                }
            });


            if(!event) return res.status(400).json({message : "Nincs ilyen esemény!"});
            else return res.status(200).json(event);


            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Hiba a fetch során!" });            
        }

    };


    const eventSearchByOrganizer = async (req, res) =>{

        const {id} = req.body;

        if(!id){
            return res.status(400).json({message: "Hiányos adat!"});
        }

        try {

            const events = await prisma.events.findMany({
                where: {
                    ogr_id: id
                }
            })


            if(!events){
                return res.status(400).json({message: "Ez a szervező nem hozott létre eseményt!"});
            }


            return res.status(200).json(events);

            
        } catch (error) {
            return res.status(500).json(error);
        }


    };


    const eventSearchByName = async (req, res) =>{
        const { name } = req.params;

        if(!name) return res.status(400).json({message: "Hiányos adatok!"});

        try {
            const events = await prisma.events.findMany({
                where:{
                    name:{
                        contains: name
                    }
                }
            })
            if(events.length == 0 || name == "") return res.status(400).json({message : "Nincs ilyen esemény!"});
            else return res.status(200).json(events);

            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Hiba a fetch során!" })
        }
    }

const eventUpdate = async (req, res) => {
    const { id, name, start_date, end_date, place, details, ogr_id } = req.body;


    if(!id || !name || !place || !details || !start_date || !end_date ){
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
    const { name, place, details, start_date, end_date, ogr_id } = req.body;

    if(!name || !place || !details || !start_date || !end_date || !ogr_id){
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

        
        const validations = [
            { condition: startDate < now, message: "Az esemény kezdetét nem lehet múltbeli időpontra rakni!" },
            { condition: startDate < minStartDate, message: "Az esemény kezdetét az adott naptól legalább 14. napra kell állítani!" },
            { condition: startDate > endDate, message: "Az esemény kezdete nem lehet később mint a vége!" }
        ];        
        for (let validation of validations) {
            if (validation.condition) {
                return res.status(400).json({ message: validation.message });
            }
        }

        const existingEvent = await prisma.events.findFirst({
            where: {
                name: name,
                start_date: startDate,
                end_date: endDate,
                place: place
            }
        });

        if (existingEvent) {
            return res.status(400).json({ message: "Az adott esemény már létezik!" });
        }

        const event = await prisma.events.create({
            data: {
                name: name,
                start_date: startDate,
                end_date: endDate,
                place: place,
                details: details,
                ogr_id: ogr_id
            }
        });

        const picLink = await prisma.picture_Links.create({
            data: {
                evt_id: event.id,
                pte_id: 4
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

const eventGetPicPath = async (req,res)=>{
    const { evt_id } = req.params;

    try {

        const evtPic = await prisma.picture_Links.findFirst({
            where: {
                evt_id: Number(evt_id)
            }
        });
        
        if (!evtPic || !evtPic.evt_id) {
            return res.status(400).json({ message: "Ilyen esemény nem található!" }); 
        }   
        
        const picPath = await prisma.pictures.findUnique({
            where: {
                id: evtPic.pte_id
            }
        });
        
        if (!picPath) {
            return res.status(400).json({ message: "Nincs ilyen kép!" });
        }
        
        return res.status(200).json(picPath.img_path);        
    }

    catch (error) {
        return res.status(500).json(error)

    }

}

module.exports = {
    eventList,
    eventUpdate,
    eventInsert,
    eventDelete,
    eventSearchByName,
    eventGetPicPath,
    eventSearchById,
    eventSearchByOrganizer
}
