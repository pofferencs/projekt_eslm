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
    const { status, uer_id, tem_id, tnt_id } = req.body;

    try {

        if(res,"Hiányzó adat(ok)!",uer_id, tem_id, tnt_id, status){
            return;
        };

        const application = await prisma.applications.update({
            where: {
                uer_id_tem_id_tnt_id: {
                    uer_id: uer_id,
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
    const { dte, status, tem_id, tnt_id, uer_id } = req.body;

    try {

        if(res,"Hiányzó adat(ok)!",dte, status, tem_id, tnt_id, uer_id){
            return;
        };

        // Csapatos jelentkezés
        const applicatedTeam = await prisma.applications.findFirst({
            where: {
                uer_id: uer_id,
                tem_id: tem_id,
                tnt_id: tnt_id
            }
        });
        if (!applicatedTeam) {
            const application = await prisma.applications.create({
                data: {
                    dte: dte,
                    status: status,
                    uer_id: uer_id,
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            })
        } else {
            return res.status(400).json({ message: "Hiba! Már jelentkeztél!" })
        }

        // Egyéni jelentkezés
        const applicatedSolo = await prisma.applications.findFirst({
            where: {
                uer_id: uer_id,
                tem_id: null,
                tnt_id: tnt_id
            }
        });
        if (!applicatedSolo) {
            const application = await prisma.applications.create({
                data: {
                    dte: dte,
                    status: status,
                    uer_id: uer_id,
                    tem_id: tem_id,
                    tnt_id: tnt_id
                }
            })
        } else {
            return res.status(400).json({ message: "Hiba! Már jelentkeztél!" })
        }

        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }
}

const applicationDelete = async (req, res) => {

    const { tnt_id, uer_id, tem_id } = req.body;

    if(!tnt_id || !uer_id || !tem_id){
        return res.status(400).json({message: "Hiányos adatok!"});
    }

    try {

        const applications = await prisma.applications.delete({
            where: {
                uer_id_tem_id_tnt_id: {
                    tem_id: parseInt(tem_id),
                    tnt_id: parseInt(tnt_id),
                    uer_id: parseInt(uer_id)

                }
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
                }
            });


            if(applications.length==0){
                return res.status(200).json({message: "Nincs elfogadott jelentkezés a versenyre!"});
            }


            return res.status(200).json(applications);


            
        } catch (error) {
            res.status(500).json({ message: "Hiba a törlés során!" });
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

        const {tnt_id, tem_id} = req.body;


        if(!tnt_id || !tem_id){
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


            let date = new Date();


            const application = await prisma.applications.create({
                data:{
                    dte: date,
                    status: "pending",
                    tem_id: parseInt(tem_id),
                    tnt_id: parseInt(tnt_id)
                }
            });


            return res.status(200).json({message: "A jelentkezést sikeresen leadtad!"});


            
        } catch (error) {
            return res.status(500).json(error.message);
        }

    }





    const applicationHandle = async (req, res) => {


        const {tnt_id, tem_id, new_status, uer_id} = req.body;

        //Az "uer_id" itt a csapatkapitány id-jának kell lennie, és anélkül nem fut le!

        if(!tnt_id || !tem_id || !new_status || !uer_id){
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

            const user = await prisma.users.findFirst({
                where: {
                    id: parseInt(uer_id)
                }
            });

            if(!user){
                return res.status(400).json({message: "A megadott felhasználó nem található!"});
            }


            const application = await prisma.applications.update({
                where:{
                    uer_id_tem_id_tnt_id: {
                        tem_id: parseInt(tem_id),
                        tnt_id: parseInt(tnt_id),
                        uer_id: parseInt(uer_id)
                    }
                },
                data:{
                    status: new_status
                }
                
            });


            if(new_status == "approved"){
                return res.status(200).json({message: "Elfogadtad a jelentkezést!"});
            }

            if(new_status == "rejected"){
                return res.status(200).json({message: "Elutasítottad a jelentkezést!"});
            }
            
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
    applicationHandle
}