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
    const { status, uer_id, tem_id} = req.body;

    try {
        const teamMembership = await prisma.team_Memberships.update({
            where: {
                uer_id_tem_id: {
                    uer_id: uer_id,
                    tem_id: tem_id
                }
            },
            data: {
                status: status
            }
        });
        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
};

const teamMembershipInsert = async (req, res)=>{
    const { uer_id, tem_id }= req.body;

    const alreadyInTeam = await prisma.team_Memberships.findFirst({
        where: {
            uer_id: uer_id,
            tem_id: tem_id
        }
    });

    const memberCounter = await prisma.team_Memberships.count({
        where:{
            tem_id : tem_id
        }
    })

    const teamIsFull = memberCounter == 7 ? true : false;

    if(alreadyInTeam){
        return res.status(400).json({message: "A játékos tagja már ennek a csapatnak!"})
    }
    else if(teamIsFull){
        return res.status(400).json({message: "A csapat már megtelt!"})
    }
    else{
        try{
            const teamMembership = await prisma.team_Memberships.create({
                data:{
                    status : "inactive",
                    uer_id: uer_id,
                    tem_id: tem_id
                }
            });
            return res.status(200).json({message:"Sikeres csapatba lépés!"})
        }catch(error){
            return res.status(500).json({error})
        }
    }
}

module.exports = {
    teamMembershipList,
    teamMembershipUpdate,
    teamMembershipInsert
}