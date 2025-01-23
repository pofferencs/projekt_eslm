const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const picture_linkList = async (req,res) =>{
    try {
        const picture_links = await prisma.picture_Links.findMany();
        res.status(200).json(picture_links);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const picture_linkUpdate = async (req, res) => {
    const { id, uer_id, tem_id, tnt_id, evt_id, pte_id_get, pte_id_set } = req.body;

    try {
        if (uer_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        uer_id: uer_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, felahsználó kép!" });
        }

        if (tem_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        tem_id: tem_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, csapat kép!" });
        }

        if (tnt_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        tnt_id: tnt_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, tournament kép!" });
        }

        if (evt_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        evt_id: evt_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, event kép!" });
        }

        return res.status(200).json({ message: "Nincs beállítva kép az adott entitáshoz!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
};

module.exports={
    picture_linkList,
    picture_linkUpdate
}