const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const userList = async (req,res) =>{
    try {
        const users = await prisma.users.findMany();
        res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

module.exports = {userList};