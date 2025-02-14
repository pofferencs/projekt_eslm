const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pictureUpdate = async (req, res) => {
    const { id, img_path } = req.body;

    try {
        const existingPicture = await prisma.pictures.findFirst({
            where:{
                img_path : img_path
            }
        })

        if(existingPicture){
           return res.status(404).json({message: "Hiba! Ez a kép már létezik az adatbázisban!"})
        }

        const picture = await prisma.pictures.update({
            where: {
                id: id
            },
            data: {
                img_path: img_path
            }
        });
        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const pictureList = async (req, res) => {
    try {
        const pictures = await prisma.pictures.findMany();
        res.status(200).json(pictures);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const pictureDelete = async (req, res) =>{

    const { id } = req.body;

    try {
        const picture = await prisma.pictures.delete({
            where:{
                id: id
            }
        })
        res.status(200).json({message: "Sikeres törlés!"})
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Hiba a törlés során!" });
    }
}

module.exports = {
    pictureList,
    pictureUpdate,
    pictureDelete
}