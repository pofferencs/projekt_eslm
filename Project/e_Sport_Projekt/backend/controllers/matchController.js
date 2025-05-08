const { PrismaClient } = require('@prisma/client');
const { validalasFuggveny, hianyzoAdatFuggveny } = require('../functions/conditions');
const prisma = new PrismaClient();

const matchList = async (req, res) => {
    try {
        const matches = await prisma.matches.findMany();
        res.status(200).json(matches);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const matchUpdate = async (req, res) => {
    const { id, apn1_id, apn2_id, tnt_id, status, uj_status, place, dte, details, winner, rslt } = req.body;

    if (hianyzoAdatFuggveny(res, "Hiányos adatok!", id, apn1_id, apn2_id, tnt_id)) {
        return;
    }

    try {

        const tournament = await prisma.tournaments.findFirst({
            where: {
                id: parseInt(tnt_id)
            }
        });

        const apn1 = await prisma.applications.findFirst({
            where: {
                id: parseInt(apn1_id)
            }
        });

        const apn2 = await prisma.teams.findFirst({
            where: {
                id: parseInt(apn2_id)
            }
        });

        if (!tournament) {
            return res.status(400).json({ message: "A megadott verseny nem található!" });
        }

        const tStartDate = new Date(tournament.start_date);
        const tEndDate = new Date(tournament.end_date);
        const matchDate = new Date(dte);
               

        if (validalasFuggveny(res, [
            { condition: matchDate > tEndDate, message: `Az időpontot nem lehet megadni későbbre mint a verseny vége! (${tournament.apn_end})` },
            { condition: matchDate < tStartDate, message: `Az időpontot nem lehet megadni hamarabbra mint a verseny kezdete! (${tournament.apn_start})` },
            { condition: !apn1 || !apn2, message: "Jelentkezés nem található! (apn1 v. apn2)" }

        ])) {
            return;
        };

        if (status != "ended" && status != "started") {
            const match = await prisma.matches.update({
                where: {
                    id_apn1_id_apn2_id_tnt_id: {
                        id: parseInt(id),
                        apn1_id: parseInt(apn1_id),
                        apn2_id: parseInt(apn2_id),
                        tnt_id: parseInt(tnt_id)
                    },
                    AND: {
                        status: status
                    }
                },
                data: {
                    dte: matchDate,
                    place: place,
                    details: details,
                    status: uj_status
                }
            })
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }
        if (status == "ended") {
            const match = await prisma.matches.update({
                where: {
                    id_apn1_id_apn2_id_tnt_id: {
                        id: parseInt(id),
                        apn1_id: parseInt(apn1_id),
                        apn2_id: parseInt(apn2_id),
                        tnt_id: parseInt(tnt_id)
                    },
                    AND: {
                        status: status
                    }

                },
                data: {
                    winner: winner,
                    rslt: rslt,
                    details: details
                }
            })
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }
        if (status == "started") {
            const match = await prisma.matches.update({
                where: {
                    id_apn1_id_apn2_id_tnt_id: {
                        id: id,
                        apn1_id: parseInt(apn1_id),
                        apn2_id: parseInt(apn2_id),
                        tnt_id: parseInt(tnt_id)
                    },
                    AND: {
                        status: status
                    }
                },
                data: {
                    details: details,
                    status: uj_status
                }
            })
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Hiba a fetch során!" });
    }

}

const matchInsert = async (req, res) => {

    const { apn1_id, apn2_id, tnt_id, details } = req.body;

    try {

        if (hianyzoAdatFuggveny(res, "Hiányzó adat(ok)!", apn1_id, apn2_id, tnt_id)) {
            return;
        };

        //Két csapat keresés
        //tem1
        const apn1 = await prisma.applications.findFirst({
            where: {
                id: parseInt(apn1_id)
            }
        });

        //tem2
        const apn2 = await prisma.applications.findFirst({
            where: {
                id: parseInt(apn2_id)
            }
        });
        
        //Tournament keresése
        const tournament = await prisma.tournaments.findFirst({
            where: {
                id: parseInt(tnt_id)
            }
        });

        if (validalasFuggveny(res, [
            { condition: !apn1, message: "A csapat nem található! (team1)" },
            { condition: !apn2, message: "A csapat nem található! (team2)" },
            { condition: !tournament, message: "A verseny nem található!" }
        ])) {
            return;
        };

        const match = await prisma.matches.create({
            data: {
                status: "unstarted",
                details: details,
                apn1_id: apn1.id,
                apn2_id: apn2.id,
                tnt_id: tournament.id
            }
        });

        return res.status(200).json({ message: "Sikeres meccs létrehozás!" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a feltöltés során!" });
    }
}



    const matchesOfTournament = async (req, res) => {


        const { tnt_id } = req.params;

        if(!tnt_id){
            return res.status(400).json({message: "Hiányzó adat!"});
        }
        


        try {


            const tournament = await prisma.tournaments.findFirst({
                where: {
                    id: parseInt(tnt_id)
                }
            });

            if(!tournament){
                return res.status(400).json({message: "Nincs ilyen verseny!"});
            }


            const matches = await prisma.matches.findMany({
                where: {
                    tnt_id: tournament.id
                },
                select: {
                    id: true,
                    apn1_id: true,
                    apn2_id: true,
                    tnt_id: true,
                    rslt: true,
                    dte: true,
                    details: true,
                    tournament: {
                        select: {
                            id: true,
                            name: true,
                            game_mode: true,
                            evt_id: true,
                            gae_id: true
                        }
                    },
                    application1: {
                        select: {
                            team: true,
                            user1: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }
                            },
                            user2: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user3: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user4: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user5: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                        }
                    },                    
                    application2: {
                        select: {
                            team: true,
                            user1: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }
                            },
                            user2: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user3: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user4: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user5: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                        }
                    }
                    
            
                }
            });


            if(matches.length == 0 || !matches){
                return res.status(400).json({message: "Nincs még meccs!"});
            }


            return res.status(200).json({matches});


            
        } catch (error) {
            return res.status(500).json( error.message );
        }

    };


    
    
    const matchSearchById = async (req, res) => {


        const { id } = req.params;

        if(!id){
            return res.status(400).json({message: "Hiányzó adat!"});
        }
        


        try {

            const match = await prisma.matches.findFirst({
                where: {
                    id: parseInt(id)
                },
                select: {
                    id: true,
                    apn1_id: true,
                    place: true,
                    apn2_id: true,
                    tnt_id: true,
                    rslt: true,
                    dte: true,
                    details: true,
                    status: true,
                    tournament: {
                        select: {
                            id: true,
                            name: true,
                            game_mode: true,
                            evt_id: true,
                            gae_id: true,
                            event: {
                                select: {
                                    ogr_id: true
                                }
                            }
                        }
                    },
                    application1: {
                        select: {
                            id: true,
                            team: true,
                            user1: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }
                            },
                            user2: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user3: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user4: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user5: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                        }
                    },                    
                    application2: {
                        select: {
                            id: true,
                            team: true,
                            user1: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }
                            },
                            user2: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user3: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user4: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                            user5: {
                                select: {
                                    id: true,
                                    usr_name: true
                                }

                            },
                        }
                    }
                    
            
                }
            });


            if(!match){
                return res.status(400).json({message: "Nincs ilyen meccs!"});
            }


            return res.status(200).json({match});


            
        } catch (error) {
            return res.status(500).json( error.message );
        }

    };


    const matchDelete = async (req, res) => {

        const { id, apn1_id, apn2_id, tnt_id } = req.body;

        if(!id){
            return res.status(400).json({message: "Hiányzó adat!"});
        }

        try {

            const match = await prisma.matches.findFirst({
                where: {
                    id: parseInt(id)
                }
            });

            if(!match){
                return res.status(400).json({message: "Nincs ilyen meccs!"});
            }


            const deletedMatch = await prisma.matches.delete({
                where: {
                    id_apn1_id_apn2_id_tnt_id:{
                        id: parseInt(id),
                        apn1_id: parseInt(apn1_id),
                        apn2_id: parseInt(apn2_id),
                        tnt_id: parseInt(tnt_id)
                    }
                }
            });


            return res.status(200).json({message: "Meccs sikeresen törölve!"});




            
        } catch (error) {
            return res.status(500).json( error.message );
        }


    };








module.exports = {
    matchList,
    matchUpdate,
    matchInsert,
    matchesOfTournament,
    matchSearchById,
    matchDelete
}