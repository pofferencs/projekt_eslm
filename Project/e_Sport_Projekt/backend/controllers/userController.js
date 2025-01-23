const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();






const userUpdate = async (req,res) =>{
    const {id, inviteable, full_name, usr_name, usna_last_mod_date, usna_mod_num_remain, paswrd, school, clss, email_address, email_last_mod_date, phone_num, status, discord_name}= req.body;
    try {
        const user = await prisma.users.update({
            where :{
                id:id
            },
            data:{
                inviteable : inviteable,
                full_name : full_name,
                usr_name : usr_name,
                usna_last_mod_date: usna_last_mod_date,
                usna_mod_num_remain: usna_mod_num_remain,
                paswrd : paswrd,
                school : school,
                clss : clss,
                email_address : email_address,
                email_last_mod_date : email_last_mod_date,
                phone_num : phone_num,
                status : status,
                discord_name : discord_name
            }
        });
        res.status(200).json({message: "Sikeres adatfrissítés!"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}


module.exports = {
    userUpdate
}