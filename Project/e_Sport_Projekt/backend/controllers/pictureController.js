const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const { randomInt } = require('crypto');

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

const defaultImageIds = {
    user: 1,
    team: 2,
    event: 3,
    tournament: 4,
    organizer: 5,
};

const fieldMap = {
    user: "uer_id",
    team: "tem_id",
    event: "evt_id",
    tournament: "tnt_id",
    organizer: "ogr_id",
};

const pictureInsert = async (req, res) => {
    try {
        const { type, id, deleteImage } = req.body;
        const file = req.file;

        if (!type || !id || !fieldMap[type]) {
            return res.status(400).json({ message: "Hiányzó vagy érvénytelen típus/azonosító." });
        }

        const typeField = fieldMap[type];
        const parsedId = parseInt(id);

        if (deleteImage) {
            const existingLink = await prisma.picture_Links.findFirst({
                where: { [typeField]: parsedId }
            });

            if (!existingLink) {
                return res.status(404).json({ message: `Nincs kép a(z) ${type} típushoz rendelve.` });
            }

            const oldPicture = await prisma.pictures.findUnique({
                where: { id: existingLink.pte_id }
            });

            const defaultId = defaultImageIds[type];
            if (!oldPicture || oldPicture.id === defaultId) {
                return res.status(400).json({ message: "Az alapértelmezett kép nem törölhető." });
            }

            const oldFilePath = path.join(__dirname, `../assets${oldPicture.img_path}`);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            await prisma.picture_Links.delete({
                where: { [typeField]: parsedId },
            });

            await prisma.picture_Links.create({
                data: {
                    [typeField]: parsedId,
                    pte_id: defaultId,
                },
            });

            return res.status(200).json({ message: "A kép visszaállítva az alapértelmezett képre." });
        }

        if (!file) return res.status(400).json({ message: "Hiányzó kép." });

        const newFileName = `${type}_${id}_${randomInt(1000, 9999)}.png`;
        const destDir = path.join(__dirname, `../assets/pictures/${type}`);
        const finalPath = path.join(destDir, newFileName);
        const img_path = `/${type}/${newFileName}`;

        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.rename(file.path, finalPath, async (err) => {
            if (err) {
                console.error("Fájl áthelyezési hiba:", err);
                return res.status(500).json({ message: "Nem sikerült a fájlt áthelyezni." });
            }

            const existingLink = await prisma.picture_Links.findFirst({
                where: { [typeField]: parsedId }
            });

            let oldPicture = null;

            if (existingLink) {
                oldPicture = await prisma.pictures.findUnique({
                    where: { id: existingLink.pte_id }
                });

                if (oldPicture && oldPicture.id !== defaultImageIds[type]) {
                    const oldFilePath = path.join(__dirname, `../assets/pictures${oldPicture.img_path}`);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }

                    await prisma.picture_Links.delete({
                        where: {
                            [typeField]: parsedId,
                            id_pte_id: {
                                id: existingLink.id,
                                pte_id: oldPicture.id
                            }
                        },
                    });

                    await prisma.pictures.delete({ where: { id: oldPicture.id } });

                } else if (oldPicture && oldPicture.id === defaultImageIds[type]) {
                    await prisma.picture_Links.delete({
                        where: {
                            [typeField]: parsedId,
                            id_pte_id: {
                                id: existingLink.id,
                                pte_id: oldPicture.id
                            }
                        },
                    });
                }
            }

            const newPicture = await prisma.pictures.create({
                data: { img_path },
            });

            await prisma.picture_Links.create({
                data: {
                    [typeField]: parsedId,
                    pte_id: newPicture.id,
                },
            });

            return res.status(200).json({ message: "Kép sikeresen frissítve." });
        });

    } catch (error) {
        console.error("Hiba történt a képkezelés során:", error);
        return res.status(500).json({ message: "Szerverhiba a kép feltöltésekor/törlésekor." });
    }
};





const pictureDelete = async (req, res) => {
    try {
        const { id, type } = req.body;

        if(type == "user"){


        const existingLink = await prisma.picture_Links.findFirst({
            where: { uer_id: id }
        });

        if (existingLink) {
            const picture = await prisma.pictures.findFirst({
                where: { id: existingLink.pte_id }
            });

            if(picture.img_path == "/user/user_0.png"){
                return res.status(400).json({message: "Alapértelmezett képet nem törölhetsz!"});
            }

            if (picture && picture.img_path !== "/user/user_0.png") {
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }


                const defaultImgPath = "/user/user_0.png";

                const alapPic = await prisma.pictures.findFirst({
                    where: {
                        img_path: defaultImgPath
                    }
                });
                
                const updatedPicture = await prisma.pictures.update({
                    where: { id: picture.id },
                    data: { img_path: defaultImgPath }
                });

                await prisma.picture_Links.update({
                    where:{
                        id_pte_id:{
                            id: existingLink.id,
                            pte_id: existingLink.pte_id
                        }
                    },
                    data:{
                        pte_id: alapPic.id
                    }
                });

                await prisma.pictures.delete({
                    where:{
                        id: existingLink.pte_id
                    }
                });



                return res.status(200).json({ message: "Kép sikeresen törölve, visszaállítva az alapértelmezett kép!" });
            }
        } else {
            return res.status(404).json({ message: "A felhasználóhoz nem tartozik kép." });
        }

        }
        
        
        if(type == "organizer"){


        const existingLink = await prisma.picture_Links.findFirst({
            where: { ogr_id: id }
        });

        if (existingLink) {
            const picture = await prisma.pictures.findFirst({
                where: { id: existingLink.pte_id }
            });

            if(picture.img_path == "/organizer/organizer_0.png"){
                return res.status(400).json({message: "Alapértelmezett képet nem törölhetsz!"});
            }

            if (picture && picture.img_path !== "/organizer/organizer_0.png") {
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }


                const defaultImgPath = "/organizer/organizer_0.png";

                const alapPic = await prisma.pictures.findFirst({
                    where: {
                        img_path: defaultImgPath
                    }
                });
                
                const updatedPicture = await prisma.pictures.update({
                    where: { id: picture.id },
                    data: { img_path: defaultImgPath }
                });

                await prisma.picture_Links.update({
                    where:{
                        id_pte_id:{
                            id: existingLink.id,
                            pte_id: existingLink.pte_id
                        }
                    },
                    data:{
                        pte_id: alapPic.id
                    }
                });

                await prisma.pictures.delete({
                    where:{
                        id: existingLink.pte_id
                    }
                });



                return res.status(200).json({ message: "Kép sikeresen törölve, visszaállítva az alapértelmezett kép!" });
            }
        } else {
            return res.status(404).json({ message: "Az eseményhez nem tartozik kép." });
        }



        }

        if(type == "event"){


        const existingLink = await prisma.picture_Links.findFirst({
            where: { evt_id: id }
        });

        if (existingLink) {
            const picture = await prisma.pictures.findFirst({
                where: { id: existingLink.pte_id }
            });

            if(picture.img_path == "/event/event_0.png"){
                return res.status(400).json({message: "Alapértelmezett képet nem törölhetsz!"});
            }

            if (picture && picture.img_path !== "/event/event_0.png") {
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }


                const defaultImgPath = "/event/event_0.png";

                const alapPic = await prisma.pictures.findFirst({
                    where: {
                        img_path: defaultImgPath
                    }
                });
                
                const updatedPicture = await prisma.pictures.update({
                    where: { id: picture.id },
                    data: { img_path: defaultImgPath }
                });

                await prisma.picture_Links.update({
                    where:{
                        id_pte_id:{
                            id: existingLink.id,
                            pte_id: existingLink.pte_id
                        }
                    },
                    data:{
                        pte_id: alapPic.id
                    }
                });

                await prisma.pictures.delete({
                    where:{
                        id: existingLink.pte_id
                    }
                });



                return res.status(200).json({ message: "Kép sikeresen törölve, visszaállítva az alapértelmezett kép!" });
            }
        } else {
            return res.status(404).json({ message: "Az eseményhez nem tartozik kép." });
        }



        }

        if(type == "tournament"){

        const existingLink = await prisma.picture_Links.findFirst({
            where: { tnt_id: id }
        });

        if (existingLink) {
            const picture = await prisma.pictures.findFirst({
                where: { id: existingLink.pte_id }
            });

            if(picture.img_path == "/tournament/tournament_0.png"){
                return res.status(400).json({message: "Alapértelmezett képet nem törölhetsz!"});
            }

            if (picture && picture.img_path !== "/tournament/tournament_0.png") {
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }


                const defaultImgPath = "/tournament/tournament_0.png";

                const alapPic = await prisma.pictures.findFirst({
                    where: {
                        img_path: defaultImgPath
                    }
                });
                
                const updatedPicture = await prisma.pictures.update({
                    where: { id: picture.id },
                    data: { img_path: defaultImgPath }
                });

                await prisma.picture_Links.update({
                    where:{
                        id_pte_id:{
                            id: existingLink.id,
                            pte_id: existingLink.pte_id
                        }
                    },
                    data:{
                        pte_id: alapPic.id
                    }
                });

                await prisma.pictures.delete({
                    where:{
                        id: existingLink.pte_id
                    }
                });



                return res.status(200).json({ message: "Kép sikeresen törölve, visszaállítva az alapértelmezett kép!" });
            }
        } else {
            return res.status(404).json({ message: "A versenyhez nem tartozik kép." });
        }



        }

        if(type == "team"){

        const existingLink = await prisma.picture_Links.findFirst({
            where: { tem_id: id }
        });

        if (existingLink) {
            const picture = await prisma.pictures.findFirst({
                where: { id: existingLink.pte_id }
            });

            if(picture.img_path == "/team/team_0.png"){
                return res.status(400).json({message: "Alapértelmezett képet nem törölhetsz!"});
            }

            if (picture && picture.img_path !== "/team/team_0.png") {
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                const defaultImgPath = "/team/team_0.png";

                const alapPic = await prisma.pictures.findFirst({
                    where: {
                        img_path: defaultImgPath
                    }
                });
                
                const updatedPicture = await prisma.pictures.update({
                    where: { id: picture.id },
                    data: { img_path: defaultImgPath }
                });

                await prisma.picture_Links.update({
                    where:{
                        id_pte_id:{
                            id: existingLink.id,
                            pte_id: existingLink.pte_id
                        }
                    },
                    data:{
                        pte_id: alapPic.id
                    }
                });

                await prisma.pictures.delete({
                    where:{
                        id: existingLink.pte_id
                    }
                });



                return res.status(200).json({ message: "Kép sikeresen törölve, visszaállítva az alapértelmezett kép!" });
            }
        } else {
            return res.status(404).json({ message: "A csapathoz nem tartozik kép." });
        }
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
