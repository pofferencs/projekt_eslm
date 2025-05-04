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

const pictureInsert = async (req, res) => {
    try {
        const { type, id, deleteImage } = req.body;
        const file = req.file;

        if (!type || !id) return res.status(400).json({ message: "Hiányzó típus vagy azonosító." });

        
            // Ha törölni akarják a képet
        if (deleteImage) {

            if(type=="user"){
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
            }
           
            if(type == "organizer"){
            const existingLink = await prisma.picture_Links.findFirst({
                where: { ogr_id: parseInt(id) }
            });

            if (!existingLink) {
                return res.status(404).json({ message: "Nincs kép a szervezőhöz rendelve." });
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
                where: { ogr_id: parseInt(id) },
            });

            const defaultPicture = await prisma.pictures.findUnique({
                where: { id: 6 },
            });

            await prisma.picture_Links.create({
                data: {
                    ogr_id: parseInt(id),
                    pte_id: defaultPicture.id,
                },
            });

        }

        if(type == "event"){
            const existingLink = await prisma.picture_Links.findFirst({
                where: { evt_id: parseInt(id) }
            });

            if (!existingLink) {
                return res.status(404).json({ message: "Nincs kép az eseményhez rendelve." });
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
                where: { evt_id: parseInt(id) },
            });

            const defaultPicture = await prisma.pictures.findUnique({
                where: { id: 6 },
            });

            await prisma.picture_Links.create({
                data: {
                    evt_id: parseInt(id),
                    pte_id: defaultPicture.id,
                },
            });

        }

        if(type == "tournament"){
            const existingLink = await prisma.picture_Links.findFirst({
                where: { tnt_id: parseInt(id) }
            });

            if (!existingLink) {
                return res.status(404).json({ message: "Nincs kép a versenyhez rendelve." });
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
                where: { tnt_id: parseInt(id) },
            });

            const defaultPicture = await prisma.pictures.findUnique({
                where: { id: 6 },
            });

            await prisma.picture_Links.create({
                data: {
                    tnt_id: parseInt(id),
                    pte_id: defaultPicture.id,
                },
            });

        }

        if(type == "team"){
            const existingLink = await prisma.picture_Links.findFirst({
                where: { tem_id: parseInt(id) }
            });

            if (!existingLink) {
                return res.status(404).json({ message: "Nincs kép a csapathoz rendelve." });
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
                where: { tem_id: parseInt(id) },
            });

            const defaultPicture = await prisma.pictures.findUnique({
                where: { id: 6 },
            });

            await prisma.picture_Links.create({
                data: {
                    tem_id: parseInt(id),
                    pte_id: defaultPicture.id,
                },
            });

        }

        

            return res.status(200).json({ message: "A kép visszaállítva az alapértelmezett képre." });
        }

        // Ha új képet töltünk fel
        if (!file) return res.status(400).json({ message: "Hiányzó kép." });

        const newFileName = `${type}_${id}_${randomInt(1000,9999)}.png`;
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

            if(type == "user"){

                const existingLink = await prisma.picture_Links.findFirst({
                    where: { uer_id: parseInt(id) }
                });
    
                let oldPicture = null;
    
                if (existingLink) {
                    oldPicture = await prisma.pictures.findUnique({
                        where: { id: existingLink.pte_id }
                    });
    
                    if (oldPicture && oldPicture.id !== 1) {
                        const oldFilePath = path.join(__dirname, `../assets/pictures${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                            
                        }
    
                        await prisma.picture_Links.delete({
                            where: { uer_id: parseInt(id), 
                                id_pte_id: {
                                    id: existingLink.id,
                                    pte_id: oldPicture.id
                                } 
                            },
                        });
    
                        await prisma.pictures.delete({
                            where:{
                                id: oldPicture.id
                            }
                        })
                        
    
                        //fs.rmSync(oldFilePath, {force: true});
    
    
                    }else if(oldPicture && oldPicture.id == 1){
                        const oldFilePath = path.join(__dirname, `../assets/pictures/${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            //fs.unlinkSync(oldFilePath);
                        }
    
                        await prisma.picture_Links.delete({
                            where: { uer_id: parseInt(id), 
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
                        uer_id: parseInt(id),
                        pte_id: newPicture.id,
                    },
                });



            }
            
            if(type=="organizer"){


                const existingLink = await prisma.picture_Links.findFirst({
                    where: { ogr_id: parseInt(id) }
                });
    
                let oldPicture = null;
    
                if (existingLink) {
                    oldPicture = await prisma.pictures.findUnique({
                        where: { id: existingLink.pte_id }
                    });
    
                    if (oldPicture && oldPicture.id !== 6) {
                        const oldFilePath = path.join(__dirname, `../assets/pictures${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                            
                        }
    
                        await prisma.picture_Links.delete({
                            where: { ogr_id: parseInt(id), 
                                id_pte_id: {
                                    id: existingLink.id,
                                    pte_id: oldPicture.id
                                } 
                            },
                        });
    
                        await prisma.pictures.delete({
                            where:{
                                id: oldPicture.id
                            }
                        })
                        
    
                        //fs.rmSync(oldFilePath, {force: true});
    
    
                    }else if(oldPicture && oldPicture.id == 6){
                        const oldFilePath = path.join(__dirname, `../assets/pictures/${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            //fs.unlinkSync(oldFilePath);
                        }
    
                        await prisma.picture_Links.delete({
                            where: { ogr_id: parseInt(id), 
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
                        ogr_id: parseInt(id),
                        pte_id: newPicture.id,
                    },
                });


            }



            if(type=="event"){


                const existingLink = await prisma.picture_Links.findFirst({
                    where: { evt_id: parseInt(id) }
                });
    
                let oldPicture = null;
    
                if (existingLink) {
                    oldPicture = await prisma.pictures.findUnique({
                        where: { id: existingLink.pte_id }
                    });
    
                    if (oldPicture && oldPicture.id !== 4) {
                        const oldFilePath = path.join(__dirname, `../assets/pictures${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                            
                        }
    
                        await prisma.picture_Links.delete({
                            where: { evt_id: parseInt(id), 
                                id_pte_id: {
                                    id: existingLink.id,
                                    pte_id: oldPicture.id
                                } 
                            },
                        });
    
                        await prisma.pictures.delete({
                            where:{
                                id: oldPicture.id
                            }
                        })
                        
    
                        //fs.rmSync(oldFilePath, {force: true});
    
    
                    }else if(oldPicture && oldPicture.id == 4){
                        const oldFilePath = path.join(__dirname, `../assets/pictures/${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            //fs.unlinkSync(oldFilePath);
                        }
    
                        await prisma.picture_Links.delete({
                            where: { evt_id: parseInt(id), 
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
                        evt_id: parseInt(id),
                        pte_id: newPicture.id,
                    },
                });


            }




            if(type=="tournament"){


                const existingLink = await prisma.picture_Links.findFirst({
                    where: { tnt_id: parseInt(id) }
                });
    
                let oldPicture = null;
    
                if (existingLink) {
                    oldPicture = await prisma.pictures.findUnique({
                        where: { id: existingLink.pte_id }
                    });
    
                    if (oldPicture && oldPicture.id !== 5) {
                        const oldFilePath = path.join(__dirname, `../assets/pictures${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                            
                        }
    
                        await prisma.picture_Links.delete({
                            where: { tnt_id: parseInt(id), 
                                id_pte_id: {
                                    id: existingLink.id,
                                    pte_id: oldPicture.id
                                } 
                            },
                        });
    
                        await prisma.pictures.delete({
                            where:{
                                id: oldPicture.id
                            }
                        })
                        
    
                        //fs.rmSync(oldFilePath, {force: true});
    
    
                    }else if(oldPicture && oldPicture.id == 5){
                        const oldFilePath = path.join(__dirname, `../assets/pictures/${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            //fs.unlinkSync(oldFilePath);
                        }
    
                        await prisma.picture_Links.delete({
                            where: { tnt_id: parseInt(id), 
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
                        tnt_id: parseInt(id),
                        pte_id: newPicture.id,
                    },
                });


            }


            if(type=="team"){


                const existingLink = await prisma.picture_Links.findFirst({
                    where: { tem_id: parseInt(id) }
                });
    
                let oldPicture = null;
    
                if (existingLink) {
                    oldPicture = await prisma.pictures.findUnique({
                        where: { id: existingLink.pte_id }
                    });
    
                    if (oldPicture && oldPicture.id !== 3) {
                        const oldFilePath = path.join(__dirname, `../assets/pictures${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                            
                        }
    
                        await prisma.picture_Links.delete({
                            where: { tem_id: parseInt(id), 
                                id_pte_id: {
                                    id: existingLink.id,
                                    pte_id: oldPicture.id
                                } 
                            },
                        });
    
                        await prisma.pictures.delete({
                            where:{
                                id: oldPicture.id
                            }
                        })
                        
    
                        //fs.rmSync(oldFilePath, {force: true});
    
    
                    }else if(oldPicture && oldPicture.id == 3){
                        const oldFilePath = path.join(__dirname, `../assets/pictures/${oldPicture.img_path}`);
                        if (fs.existsSync(oldFilePath)) {
                            //fs.unlinkSync(oldFilePath);
                        }
    
                        await prisma.picture_Links.delete({
                            where: { tem_id: parseInt(id), 
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
                        tem_id: parseInt(id),
                        pte_id: newPicture.id,
                    },
                });


            }





            return res.status(200).json({ message: "Kép sikeresen feltöltve!", img_path });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Szerverhiba a kép mentése során." });
    }
};




const pictureDelete = async (req, res) => {
    try {
        const { id, type } = req.body;

        if(type == "user"){


            // Ha nincs beállított kép, akkor csak visszaállítjuk az alapértelmezettet
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
                // Töröljük a nem alapértelmezett képet
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                // Visszaállítjuk az alap képet

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


            // Ha nincs beállított kép, akkor csak visszaállítjuk az alapértelmezettet
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
                // Töröljük a nem alapértelmezett képet
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                // Visszaállítjuk az alap képet

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


            // Ha nincs beállított kép, akkor csak visszaállítjuk az alapértelmezettet
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
                // Töröljük a nem alapértelmezett képet
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                // Visszaállítjuk az alap képet

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


            // Ha nincs beállított kép, akkor csak visszaállítjuk az alapértelmezettet
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
                // Töröljük a nem alapértelmezett képet
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                // Visszaállítjuk az alap képet

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


            // Ha nincs beállított kép, akkor csak visszaállítjuk az alapértelmezettet
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
                // Töröljük a nem alapértelmezett képet
                const oldFilePath = path.join(__dirname, `../assets/pictures${picture.img_path}`);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }

                // Visszaállítjuk az alap képet

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
