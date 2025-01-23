const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const applicationList = async (req,res) =>{
    try {
        const applications = await prisma.applications.findMany();
        res.status(200).json(applications);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}


const applicationUpdate = async (req,res)=>{
    const {id, dte, status, uer_id, tem_id, tnt_id} = req.body;

    try{
        const applications = await prisma.applications.update({
            where:{
                id_tnt_id:{
                    id: id,
                    tnt_id: tnt_id
                }
            },
            data:{
                dte: dte,
                status : status,
                uer_id : uer_id,
                tem_id : tem_id
            }
        });
        res.status(200).json({message: "Sikeres adatfrissítés!"});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"});
    }
}


module.exports = {
    applicationList,
    applicationUpdate
}