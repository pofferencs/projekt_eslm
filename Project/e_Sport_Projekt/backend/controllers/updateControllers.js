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

const applicationsUpdate = async (req,res)=>{
    const {id, dte, status, uer_id, tem_id, tnt_id} = req.body;

    try{
        const application = await prisma.applications.update({
            where:{
                id : id
            },
            data:{
                dte: dte,
                status : status,
                uer_id : uer_id,
                tem_id : tem_id,
                tnt_id : tnt_id
            }
        });
        res.status(200).json({message: "Sikeres adatfrissítés!"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const eventUpdate = async (req,res)=>{
    const {id,name,start_date,end_date,place,details}= req.body;

    try{
        const event = await prisma.events.update({
            where :{
                id : id
            },
            data: {
                name: name,
                start_date: start_date,
                end_date : end_date,
                place : place,
                details : details
            }
        });
        res.status(200).json({message: "Sikeres adatfrissítés!"});
    }
    catch(err){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const gameUpdate = async (req,res)=>{
    const {id, name} = req.body;

    try{
        const game = await prisma.games.update({
            where :{
                id : id
            },
            data: {
                name: name
            }
        });
        res.status(200).json({message: "Sikeres adatfrissítés!"});
    }
    catch(err){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const pictureUpdate = async (req,res)=>{
    const {id,img_path} = req.body;

    try{
        const picture = await prisma.pictures.update({
            where :{
                id : id
            },
            data: {
                img_path : img_path
            }
        });
        res.status(200).json({message: "Sikeres adatfrissítés!"});
    }
    catch(err){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

// A picture_links update kérdéses, mert egy kép egyszerre csak 1 dologhoz tartozhat, emiatt a példa sorban rosszul van a képhozzá rendelés
// Legalábbis ez kérdéses nekem, de a mostani példa sorokra ez egy  működőképes változat
const picture_linksUpdate = async (req,res)=>{
    const {id,uer_id, tem_id, tnt_id, evt_id, pte_id} = req.body;

    try{
        const picture_Link = await prisma.picture_Links.update({
            where :{
                id : id
            },
            data: {
                uer_id : uer_id,
                tem_id : tem_id,
                tnt_id : tnt_id,
                evt_id : evt_id,
                pte_id : pte_id
            }
        });
        res.status(200).json({message: "Sikeres adatfrissítés!"});
    }
    catch(err){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

// const matchUpdate
// const real_picture_linkUpdate
// const teamUpdate
// const team_membershipUpdate
// const tournamentUpdate

module.exports = {
    userUpdate,
    applicationsUpdate,
    eventUpdate,
    gameUpdate,
    pictureUpdate,
    picture_linksUpdate
    // matchUpdate
    // real_picture_linkUpdate
    // teamUpdate
    //team_membershipUpdate
    //tournamentUpdate
};