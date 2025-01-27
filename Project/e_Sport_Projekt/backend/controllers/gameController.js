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

    try {

        const existingGame = await prisma.games.findFirst({
            where: {
                name: name_get
            }
        });

        if (existingGame || existingGame.name == req.body.name_set) {
            return res.status(400).json({ message: "Ilyen nevű játék már létezik!" })
        };

        const game = await prisma.games.update({
            where: {
                id: id,
                name: name_get
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

const gameInsert = async (req,res)=>{
    const {name} = req.body;

    try{
        const existingGame = await prisma.games.findFirst({
            where: {
                name: name
            }
        });

        if(existingGame){
            return res.status(400).json({message: "Hiba! Ilyen nevű játék már létezik!"})
        }

        const game = await prisma.games.create({data:{name: name}})
        return res.status(200).json({message:"Sikeres adatfrissítés!"})

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}


module.exports = {
    gameList,
    gameUpdate,
    gameInsert
}