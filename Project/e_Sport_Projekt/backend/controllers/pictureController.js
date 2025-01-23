const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pictureUpdate = async (req, res) => {
    const { id, img_path } = req.body;

    try {
        const picture = await prisma.pictures.update({
            where: {
                id: id
            },
            data: {
                img_path: img_path
            }
        });
        res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Hiba a fetch során!" })
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

module.exports = {
    pictureList,
    pictureUpdate
}