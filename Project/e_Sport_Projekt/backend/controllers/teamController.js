const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const teamList = async (req, res) => {
    try {
        const teams = await prisma.teams.findMany();
        res.status(200).json(teams);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const teamUpdate = async (req,res)=>{
    const {id, short_name, full_name, creator_id} = req.body
    try{
        const team = await prisma.teams.update({
            where:{
                id: id
            },
            data:{
                short_name: short_name,
                full_name : full_name,
                creator_id :creator_id
            }
        });
        res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

module.exports = {
    teamList,
    teamUpdate
}