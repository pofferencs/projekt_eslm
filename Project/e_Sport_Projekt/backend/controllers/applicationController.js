const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const applicationList = async (req, res) => {
    try {
        const applications = await prisma.applications.findMany();
        res.status(200).json(applications);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}


const applicationUpdate = async (req, res) => {
    const { status, uer1_id, uer2_id, uer3_id, uer4_id, uer5_id, tem_id, tnt_id } = req.body;

    try {

        if(res,"Hiányzó adat(ok)!",uer1_id, uer2_id, uer3_id, uer4_id, uer5_id, tem_id, tnt_id, status){
            return;
        };

        const application = await prisma.applications.update({
            where: {
                uer1_id_uer2_id_uer3_id_uer4_id_uer5_id_tem_id_tnt_id: {
                    uer1_id: uer1_id,
                    uer2_id: uer2_id,
                    uer3_id: uer3_id,
                    uer4_id: uer4_id,
                    uer5_id: uer5_id,
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            },
            data: {
                status: status
            }
        });
        res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" });
    }
}

const applicationInsert = async (req, res) => {
    const { dte, status, tem_id, tnt_id, uer1_id, uer2_id, uer3_id, uer4_id, uer5_id } = req.body;

    try {

        if(res,"Hiányzó adat(ok)!",dte, status, tem_id, tnt_id, uer1_id, uer2_id, uer3_id, uer4_id, uer5_id){
            return;
        };

        const applicatedTeam = await prisma.applications.findFirst({
            where: {
                uer1_id: uer1_id,
                uer2_id: uer2_id,
                uer3_id: uer3_id,
                uer4_id: uer4_id,
                uer5_id: uer5_id,
                tem_id: tem_id,
                tnt_id: tnt_id
            }
        });

        if (!applicatedTeam) {
            const application = await prisma.applications.create({
                data: {
                    dte: dte,
                    status: status,
                    uer1_id: uer1_id,
                    uer2_id: uer2_id,
                    uer3_id: uer3_id,
                    uer4_id: uer4_id,
                    uer5_id: uer5_id,
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            })
        } else {
            return res.status(400).json({ message: "Hiba! Már jelentkeztél!" })
        }

        
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
}

const applicationDelete = async (req, res) => {

    const { id } = req.body;

    if(!id){
        return res.status(400).json({message: "Hiányos adat!"});
    }

    try {

        const applicationSearch = await prisma.applications.findFirst({
            where: {
                id: parseInt(id),
            }
        });

        if(!applicationSearch){
            return res.status(400).json({message: "Nem található ilyen jelentkezés!"});
        }

        const applications = await prisma.applications.delete({
            where: {
                id: parseInt(id)
            }
        })
        return res.status(200).json({ message: "Sikeres törlés!" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Hiba a törlés során!" });
    }
}

    const approvedApplicationsList = async (req, res) => {

        const { tnt_id } = req.params;

        if(!tnt_id){
            return res.status(400).json({message: "Hiányos adat!"});
        }

        
        try {

            const tournament = await prisma.tournaments.findFirst({
                where: {
                    id: parseInt(tnt_id)
                }
            });


            if(!tournament){
                return res.status(400).json({message: "Nincsen ilyen verseny!"});
            }

            const applications = await prisma.applications.findMany({
                where: {
                    tnt_id: parseInt(tnt_id),
                    status: "approved"
                },
                include:{
                    team: true,
                    user1: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user2: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user3: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user4: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user5: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                }
            });

            if(applications.length==0){
                return res.status(200).json({message: "Nincs elfogadott jelentkezés a versenyre!"});
            }

            return res.status(200).json(applications);
            
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    const pendingApplicationsList = async (req, res) => {

        const { tnt_id } = req.params;


        if(!tnt_id){
            return res.status(400).json({message: "Hiányos adat!"});
        }

        
        try {

            const tournament = await prisma.tournaments.findFirst({
                where: {
                    id: parseInt(tnt_id)
                }
            });


            if(!tournament){
                return res.status(400).json({message: "Nincsen ilyen verseny!"});
            }


            const applications = await prisma.applications.findMany({
                where: {
                    tnt_id: parseInt(tnt_id),
                    status: "pending"
                },
                include:{
                    team: true,
                    user1: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user2: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user3: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user4: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user5: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                }
            });


            if(applications.length==0){
                return res.status(200).json({message: "Nincs függőben lévő jelentkezés a versenyre!"});
            }


            return res.status(200).json(applications);


            
        } catch (error) {
            return res.status(500).json(error.message);
        }

    }


    
    const applicationSubmit = async (req, res) => {

        const {tnt_id, tem_id, uer1_id, uer2_id, uer3_id, uer4_id, uer5_id} = req.body;


        if(!tnt_id || !tem_id || !uer1_id || !uer2_id){
            return res.status(400).json({message: "Hiányos adatok!"});
        }

        try {

            const team = await prisma.teams.findFirst({
                where: {
                    id: parseInt(tem_id)
                }
            });

            if(!team){
                return res.status(400).json({message: "A megadott csapat nem található!"});
            }

            const tournament = await prisma.tournaments.findFirst({
                where: {
                    id: parseInt(tnt_id)
                }
            });

            if(!tournament){
                return res.status(400).json({message: "A megadott verseny nem található!"});
            }


            const findApplication = await prisma.applications.findFirst({
                where: {
                    tnt_id: parseInt(tnt_id),
                    tem_id: parseInt(tem_id),
                    uer1_id: parseInt(uer1_id)
                }
            });

            if(findApplication){
                return res.status(400).json({message: "Ezzel a csapattal már leadtál jelentkezést erre a versenyre!"});
            }

            const user = await prisma.users.findFirst({
                where: {
                    id: parseInt(uer1_id)
                }
            });

            if(!user){
                return res.status(400).json({message: "A megadott felhasználó nem található!"});
            }

            let date = new Date(Date.now());

            const application = await prisma.applications.create({
                data:{
                    dte: date,
                    status: "pending",
                    tem_id: parseInt(tem_id),
                    tnt_id: parseInt(tnt_id),
                    uer1_id: user.id,
                    uer2_id: parseInt(uer2_id),
                    uer3_id: parseInt(uer3_id),
                    uer4_id: parseInt(uer4_id),
                    uer5_id: parseInt(uer5_id),
                }
            });

            return res.status(200).json({message: "A jelentkezést sikeresen leadtad!"});
            
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


    const applicationHandle = async (req, res) => {


        const {id, tnt_id, tem_id, new_status, uer1_id, uer2_id, uer3_id, uer4_id, uer5_id} = req.body;

        //Az "uer_id" itt a csapatkapitány id-jának kell lennie, és anélkül nem fut le!

        if(!id, !tnt_id || !tem_id || !new_status || !uer1_id){
            return res.status(400).json({message: "Hiányos adatok!"});
        }

        try {


            const applicationSearch = await prisma.applications.findFirst({
                where: {
                    id: parseInt(id),
                    tnt_id: parseInt(tnt_id),
                    tem_id: parseInt(tem_id)
                }
            });

            if(!applicationSearch){
                return res.status(400).json({message: "Nem található ilyen jelentkezés!"});
            }

            if(applicationSearch.status == "approved"){
                return res.status(400).json({message: "Ezt a jelentkezést már elfogadtad!"});
            }

            const team = await prisma.teams.findFirst({
                where: {
                    id: parseInt(tem_id)
                }
            });

            if(!team){
                return res.status(400).json({message: "A megadott csapat nem található!"});
            }


            const tournament = await prisma.tournaments.findFirst({
                where: {
                    id: parseInt(tnt_id)
                }
            });

            if(!tournament){
                return res.status(400).json({message: "A megadott verseny nem található!"});
            }

            const user = await prisma.users.findFirst({
                where: {
                    id: parseInt(uer1_id)
                }
            });

            if(!user){
                return res.status(400).json({message: "A megadott felhasználó nem található!"});
            }
            

            const application = await prisma.applications.update({
                where: {
                    id_tnt_id:{
                        id: parseInt(id),
                        tnt_id: parseInt(tnt_id)
                    }
                    },
                    data: {
                        status: new_status
                    }
                }
            );


            if(application.status == "approved"){
                return res.status(200).json({message: "Elfogadtad a jelentkezést!"});
            }

            if(application.status == "rejected"){
                return res.status(200).json({message: "Elutasítottad a jelentkezést!"});
            }
            
        } catch (error) {
            return res.status(500).json(error.message);
        }

    }


    const tntApplicationList = async (req, res)=>{

        const {tnt_id, uer1_id, uer2_id, uer3_id, uer4_id, uer5_id} = req.body;

        if(!tnt_id || !uer1_id ){
            return res.status(400).json({message: "Hiányos adatok!"});
        }


        try {


            const applications = await prisma.applications.findMany({
                where: {
                    uer1_id: parseInt(uer1_id),
                    team: {
                        creator_id: parseInt(uer1_id)
                    },
                    tnt_id: parseInt(tnt_id)
                },
                select:{
                    dte: true,
                    id: true,
                    status: true,
                    tem_id: true,
                    tnt_id: true,
                    team: true,
                    tournament: true,
                    user1: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user2: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user3: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user4: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },
                    user5: {
                        select:{
                            id: true,
                            full_name: true,
                            usr_name: true
                        }
                    },

                }
            });

            if(!applications || applications.length == 0){
                return res.status(400).json({message: "Nem adtál le jelentkezést, vagy nincs ilyen verseny!"});
            }

            return res.status(200).json(applications);


            
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }



    const tournamentApplications = async (req, res)=>{

        const {tnt_id} = req.body;

        if(!tnt_id){
            return res.status(400).json({message: "Hiányos adatok!"});
        }


        try {


            const applications = await prisma.applications.findMany({
                where: {
                    tnt_id: parseInt(tnt_id)
                },
                select:{
                    id: true,
                    team: true,

                }
            });

            if(!applications || applications.length == 0){
                return res.status(400).json({message: "Nem adtál le jelentkezést, vagy nincs ilyen verseny!"});
            }

            return res.status(200).json(applications);


            
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


module.exports = {
    applicationList,
    applicationUpdate,
    applicationInsert,
    applicationDelete,
    approvedApplicationsList,
    pendingApplicationsList,
    applicationSubmit,
    applicationHandle,
    tntApplicationList,
    tournamentApplications
}