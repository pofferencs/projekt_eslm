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

const teamUpdate = async (req,res)=>{
    const {id, short_name, full_name, creator_id} = req.body;

    const existingTeam = await prisma.teams.findFirst({
        where : {
            full_name: full_name
        }
    })

    if(existingTeam){
        return res.status(400).json({message: "Ez a csapatnév foglalt!"})
    }else{
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
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({message: "Hiba a fetch során!"})
        }
<<<<<<< Updated upstream
    }
}


const teamDelete = async (req, res) =>{
    const {id} = req.body;

    try {
        const team = await prisma.teams.delete({
            where:{
                id: id
            }
        });
        return res.status(200).json({message: "Sikeres törlés!"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const teamCreate =  async (req,res) =>{
    const {short_name, full_name, creator_id} = req.body;
    
=======
    }
}

const teamInsert = async (req,res) =>{
    const { short_name, full_name, creator_id} = req.body;


>>>>>>> Stashed changes
}

module.exports={
    teamList,
    teamUpdate,
    teamDelete
}