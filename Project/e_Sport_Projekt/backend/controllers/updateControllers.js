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

// HA ROSSZUL ADJUK ÁT A BODY-N KERESZTÜL AZ ADATOKAT, AKKOR 500 Internal Server Error-t kapunk!!!!
const picture_linkUpdate = async (req, res) => {
    const { id, uer_id, tem_id, tnt_id, evt_id, pte_id_get, pte_id_set } = req.body;

    try {
        if (uer_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        uer_id: uer_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, felahsználó kép!" });
        }

        if (tem_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        tem_id: tem_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, csapat kép!" });
        }

        if (tnt_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        tnt_id: tnt_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, tournament kép!" });
        }

        if (evt_id != null) {
            const picture_Link = await prisma.picture_Links.update({
                where: {
                    id_pte_id: {
                        id: id,
                        pte_id: pte_id_get
                    },
                    AND: {
                        evt_id: evt_id
                    }
                },
                data: {
                    pte_id: pte_id_set
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés, event kép!" });
        }

        return res.status(200).json({ message: "Nincs beállítva kép az adott entitáshoz!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
};

const matchUpdate = async (req,res) =>{
    const {id, tem1_id, tem2_id, tnt_id, status, place, dte, details, winner, rslt} = req.body;

    // státuszok: unstarted, started, ended, suspended
    try{
        
         if(status != "ended" || status !=="started"){
            // unstarted, suspended
                // dte, place, details

            


        }
        else if(status == "ended"){
            // ended
                // winner, rslt, details
            
        }
        else{
            // started
                // details
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
    
}

// const teamUpdate
// const team_membershipUpdate
// const tournamentUpdate

module.exports = {
    userUpdate,
    applicationUpdate,
    eventUpdate,
    gameUpdate,
    pictureUpdate,
    picture_linkUpdate,
    matchUpdate
    // teamUpdate
    //team_membershipUpdate
    //tournamentUpdate
};