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
        // Csapatos jelentkezés
        const applicatedTeam = await prisma.applications.findFirst({
            where: {
                uer_id: uer_id,
                tem_id: tem_id,
                tnt_id: tnt_id
            }
        });
        if (!applicatedTeam) {
            const application = await prisma.applications.create({
                data: {
                    dte: dte,
                    status: status,
                    uer_id: uer_id,                    
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            })
        }else{
            return res.status(400).json({message: "Hiba! Már jelentkeztél!"})
        }

        // Egyéni jelentkezés
        const applicatedSolo = await prisma.applications.findFirst({
            where: {
                uer_id: uer_id,
                tem_id: null,
                tnt_id:tnt_id
            }
        });
        if (!applicatedSolo) {
            const application = await prisma.applications.create({
                data: {
                    dte: dte,
                    status: status,
                    uer_id: uer_id,                    
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            })
        }else{
            return res.status(400).json({message: "Hiba! Már jelentkeztél!"})
        }
        
        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
}

module.exports = {
    applicationList,
    applicationUpdate,
    applicationInsert
}