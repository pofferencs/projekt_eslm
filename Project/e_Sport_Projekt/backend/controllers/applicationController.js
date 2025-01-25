const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const applicationList = async (req, res) => {
    try {
        const applications = await prisma.applications.findMany();
        res.status(200).json(applications);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}


const applicationUpdate = async (req, res) => {
    const { status, uer_id, tem_id, tnt_id } = req.body;

    try {
        const application = await prisma.applications.update({
            where: {
                uer_id_tem_id_tnt_id: {
                    uer_id: uer_id,
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            },
            data: {
                status: status
            }
        });
        res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" });
    }
}

const applicationInsert = async (req, res) => {
    const { dte, status, tem_id, tnt_id, uer_id } = req.body;

    try {
        const applicated = await prisma.applications.findFirst({
            where: {
                uer_id: uer_id,
                tem_id:tem_id,
                tnt_id:tnt_id
            }
        })

        if (!applicated) {
            const application = await prisma.applications.create({
                data: {
                    dte: dte,
                    status: status,
                    uer_id: uer_id,                    
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            });
            res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }else{
            res.status(400).json({message: "Nem létező creator_id, vagy már jelentkeztél!"})
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" });
    }
}

module.exports = {
    applicationList,
    applicationUpdate,
    applicationInsert
}