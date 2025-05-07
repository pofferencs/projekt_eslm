const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const gameList = async (req, res) => {
    try {
        const games = await prisma.games.findMany();
        res.status(200).json(games);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const gameUpdate = async (req, res) => {
    const { id, name_get, name_set } = req.body;

    if(!id || !name_get || !name_set){
        return res.status(400).json({message: "Hiányos adat!"});
    }

    try {

        const existingGame = await prisma.games.findFirst({
            where: {
                name: name_get
            }
        });

        if(!existingGame){
            return res.status(400).json({message: "Nincs ilyen játék!"});
        }

        if (existingGame.name == name_set) {
            return res.status(400).json({ message: "Ilyen nevű játék már létezik!" })
        };

        const game = await prisma.games.update({
            where: {
                id: existingGame.id,
                name: existingGame.name
                
            },
            data: {
                name: name_set
            }
        });
        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const gameInsert = async (req, res) => {
    const { name } = req.body;

    if(!name || name==""){
        return res.status(400).json({message: "Hiányos adat!"})
    }

    try {
        const existingGame = await prisma.games.findFirst({
            where: {
                name: name
            }
        });

        
        if (existingGame) {
            return res.status(400).json({ message: "Hiba! Ilyen nevű játék már létezik!" })
        }

        const game = await prisma.games.create({ data: { name: name } })
        return res.status(200).json({ message: "Játék felvéve!" })

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const gameDelete = async (req, res) => {

    const { id } = req.body;

    try {

        const tournaments = await prisma.tournaments.findFirst({
            where:{
                gae_id: id
            }
        })

        if(tournaments){
            return res.status(400).json({message: "Nem törölhetsz olyan játékot, amihez van verseny hozzárendelve!"});
        }


        const game = await prisma.games.delete({
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
    gameList,
    gameUpdate,
    gameInsert,
    gameDelete
}