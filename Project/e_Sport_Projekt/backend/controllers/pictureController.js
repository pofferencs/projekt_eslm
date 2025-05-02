const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../assets/pictures/tmp"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});





const pictureUpdate = async (req, res) => {
    const { id, img_path } = req.body;

    try {
        const existingPicture = await prisma.pictures.findFirst({
            where: { img_path }
        });

        if (existingPicture) {
            return res.status(404).json({ message: "Hiba! Ez a kép már létezik az adatbázisban!" });
        }

        const picture = await prisma.pictures.update({
            where: { id },
            data: { img_path }
        });

        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
};

const pictureList = async (req, res) => {
    try {
        const pictures = await prisma.pictures.findMany();
        res.status(200).json(pictures);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" });
    }
};

const pictureInsert = async (req, res) => {
    try {
        const { type, id, deleteImage } = req.body;
        const file = req.file;

        if (!type || !id) return res.status(400).json({ message: "Hiányzó típus vagy azonosító." });

        // Ha törölni akarják a képet
        if (deleteImage) {
            const existingLink = await prisma.picture_Links.findFirst({
                where: { uer_id: parseInt(id) }
            });

            if (!existingLink) {
                return res.status(404).json({ message: "Nincs kép a felhasználóhoz rendelve." });
            }

            const oldPicture = await prisma.pictures.findUnique({
                where: { id: existingLink.pte_id }
            });

            if (!oldPicture || oldPicture.id === 1) {
                return res.status(400).json({ message: "Az alapértelmezett kép nem törölhető." });
            }

            const oldFilePath = path.join(__dirname, `../assets${oldPicture.img_path}`);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            await prisma.picture_Links.delete({
                where: { uer_id: parseInt(id) },
            });

            const defaultPicture = await prisma.pictures.findUnique({
                where: { id: 1 },
            });

            await prisma.picture_Links.create({
                data: {
                    uer_id: parseInt(id),
                    pte_id: defaultPicture.id,
                },
            });

            return res.status(200).json({ message: "A kép visszaállítva az alapértelmezett képre." });
        }

        // Ha új képet töltünk fel
        if (!file) return res.status(400).json({ message: "Hiányzó kép." });

        const newFileName = `${type}_${id}.png`;
        const destDir = path.join(__dirname, `../assets/pictures/${type}`);
        const finalPath = path.join(destDir, newFileName);

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.rename(file.path, finalPath, async (err) => {
            if (err) {
                console.error("Fájl áthelyezési hiba:", err);
                return res.status(500).json({ message: "Nem sikerült a fájlt áthelyezni." });
            }

            const img_path = `/${type}/${newFileName}`;

            const existingLink = await prisma.picture_Links.findFirst({
                where: { uer_id: parseInt(id) }
            });

            let oldPicture = null;

            if (existingLink) {
                oldPicture = await prisma.pictures.findUnique({
                    where: { id: existingLink.pte_id }
                });

                if (oldPicture && oldPicture.id !== 1) {
                    const oldFilePath = path.join(__dirname, `../assets${oldPicture.img_path}`);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }

                    await prisma.picture_Links.delete({
                        where: { uer_id: parseInt(id) },
                    });
                }
            }

            const newPicture = await prisma.pictures.create({
                data: { img_path },
            });

            await prisma.picture_Links.create({
                data: {
                    uer_id: parseInt(id),
                    pte_id: newPicture.id,
                },
            });

            return res.status(200).json({ message: "Kép sikeresen feltöltve!", img_path });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Szerverhiba a kép mentése során." });
    }
};




const pictureDelete = async (req, res) => {
    try {
        const { id } = req.body;

        // Ha nincs beállított kép, akkor csak visszaállítjuk az alapértelmezettet
        const existingLink = await prisma.picture_Links.findFirst({
            where: { uer_id: id }
        });

        if (existingLink) {
            const picture = await prisma.pictures.findFirst({
                where: { id: existingLink.pte_id }
            });

            if (picture && picture.img_path !== "/pictures/user/user_0.png") {
                // Töröljük a nem alapértelmezett képet
                const oldFilePath = path.join(__dirname, `../assets${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                // Visszaállítjuk az alap képet
                const defaultImgPath = "/pictures/user/user_0.png";
                const updatedPicture = await prisma.pictures.update({
                    where: { id: picture.id },
                    data: { img_path: defaultImgPath }
                });

                await prisma.picture_Links.update({
                    where: { uer_id: id },
                    data: { pte_id: updatedPicture.id }
                });

                return res.status(200).json({ message: "Kép sikeresen törölve, visszaállítva az alapértelmezett kép." });
            }
        } else {
            return res.status(404).json({ message: "A felhasználóhoz nem tartozik kép." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Szerverhiba a kép törlése során." });
    }
};


const upload = multer({ storage });

module.exports = {
    pictureList,
    pictureUpdate,
    pictureDelete,
    pictureInsert,
    upload
};
