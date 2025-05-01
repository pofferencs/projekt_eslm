const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pictureUpdate = async (req, res) => {
    const { id, img_path } = req.body;

    try {
        const existingPicture = await prisma.pictures.findFirst({
            where: {
                img_path: img_path
            }
        })

        if (existingPicture) {
            return res.status(404).json({ message: "Hiba! Ez a kép már létezik az adatbázisban!" })
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

const pictureDelete = async (req, res) => {

    const { id } = req.body;

    try {
        const picture = await prisma.pictures.delete({
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


const pictureInsert = async (req, res) => {
    const { img_path } = req.body;

    try {
        const existPicture = await prisma.pictures.findFirst({
            where: {
                img_path: img_path
            }
        });

        if (existPicture) {
            return res.status(400).json({ message: "Ez a kép már létezik" });
        }

        const newPicture = await prisma.pictures.create({
            data: { img_path }
        });

        const lowerPath = img_path.toLowerCase();

        const pathId = lowerPath.match(/\/\w+\/(\d+)\.png$/);
        const parsedId = parseInt(pathId[1], 10)

        if (lowerPath.includes("user")) {
            await prisma.picture_Links.create({
                data: {
                    uer_id: parsedId,
                    pte_id: newPicture.id
                }
            })
        } else if (lowerPath.includes("team")) {
            await prisma.picture_Links.create({
                data: {
                    tem_id: parsedId,
                    pte_id: newPicture.id
                }
            })
        } else if (lowerPath.includes("tournament")) {
            await prisma.picture_Links.create({
                data: {
                    tnt_id: parsedId,
                    pte_id: newPicture.id
                }
            })
        } else if (lowerPath.includes("event")) {
            await prisma.picture_Links.create({
                data: {
                    evt_id: parsedId,
                    pte_id: newPicture.id
                }
            })
        } else if (lowerPath.includes("organizer")) {
            await prisma.picture_Links.create({
                data: {
                    ogr_id: parsedId,
                    pte_id: newPicture.id
                }
            })
        }

        return res.status(200).json({ message: "Kép sikeresen hozzáadva!", img_path });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a hozzáadás során!" });
    }
};



module.exports = {
    pictureList,
    pictureUpdate,
    pictureDelete,
    pictureInsert
}