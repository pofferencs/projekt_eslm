const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const teamList = async (req,res) =>{
    try {
        const teams = await prisma.teams.findMany();
        res.status(200).json(teams);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

module.exports={
    teamList
}