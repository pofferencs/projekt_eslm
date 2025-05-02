const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const picture_linkList = async (req, res) => {
    try {
        const picture_links = await prisma.picture_Links.findMany();
        res.status(200).json(picture_links);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const picture_linkUpdate = async (req, res) => {
    const { id, uer_id, tem_id, tnt_id, evt_id, ogr_id, pte_id_get, pte_id_set } = req.body;

    try {
        // Képhez tartozó id típusok és értékek
        const idTypes = [
            { id: uer_id, message: "Sikeres adatfrissítés, felhasználó kép!", condition: "uer_id" },
            { id: tem_id, message: "Sikeres adatfrissítés, csapat kép!", condition: "tem_id" },
            { id: tnt_id, message: "Sikeres adatfrissítés, tournament kép!", condition: "tnt_id" },
            { id: evt_id, message: "Sikeres adatfrissítés, event kép!", condition: "evt_id" },
            { id: ogr_id, message: "Sikeres adatfrissítés, szervező kép!", condition: "ogr_id" }
        ];

        /*
        For ciklussal megkeresi hol nem null az id,
        az idTypes tömb alapján és ott végrehajtja az updatet */
        for (let { id: entityId, message, condition } of idTypes) {
            if (entityId != null) {
                const picture_Link = await prisma.picture_Links.update({
                    where: {
                        id_pte_id: {
                            id: id,
                            pte_id: pte_id_get
                        },
                        AND: {
                            // https://hackmamba.io/blog/2020/11/dynamic-javascript-object-keys/
                            [condition]: entityId
                        }
                    },
                    data: {
                        pte_id: pte_id_set
                    }
                });
                return res.status(200).json({ message });
            }
        }
        return res.status(200).json({ message: "Nincs beállítva kép az adott entitáshoz!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
};

module.exports = {
    picture_linkList,
    picture_linkUpdate
}