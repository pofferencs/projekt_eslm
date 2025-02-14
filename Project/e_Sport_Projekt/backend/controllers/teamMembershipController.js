const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const teamMembershipList = async (req, res) => {
    try {
        const teamMemberships = await prisma.team_Memberships.findMany();
        res.status(200).json(teamMemberships);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
};

const teamMembershipUpdate = async (req, res) => {
    const { status, uer_id, tem_id_get, tem_id_set } = req.body;

    try {
        const teamMembership = await prisma.team_Memberships.update({
            where: {
                uer_id_tem_id: {
                    uer_id: uer_id,
                    tem_id: tem_id_get
                }
            },
            data: {
                tem_id: tem_id_set,
                status: status
            }
        });
        return res.status(200).json({ message: "Sikeres adatfrissítés, felahsználó kép!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
};

module.exports = {
    teamMembershipList,
    teamMembershipUpdate
}