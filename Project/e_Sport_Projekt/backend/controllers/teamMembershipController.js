const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const teamMembershipList = async (req, res) => {
    try {
        const teamMemberships = await prisma.team_Memberships.findMany();
        res.status(200).json(teamMemberships);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
};

const teamMembershipUpdate = async (req, res) => {
    const { status, uer_id, tem_id } = req.body;

    try {
        const teamMembership = await prisma.team_Memberships.update({
            where: {
                uer_id_tem_id: {
                    uer_id: uer_id,
                    tem_id: tem_id
                }
            },
            data: {
                status: status
            }
        });
        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
};

const teamMembershipInsert = async (req, res) => {
    const { uer_id, tem_id } = req.body;

    const alreadyInTeam = await prisma.team_Memberships.findFirst({
        where: {
            uer_id: uer_id,
            tem_id: tem_id
        }
    });

    const memberCounter = await prisma.team_Memberships.count({
        where: {
            tem_id: tem_id
        }
    })

    const teamIsFull = memberCounter == 7 ? true : false;

    if (alreadyInTeam) {
        return res.status(400).json({ message: "A játékos tagja már ennek a csapatnak!" })
    }
    else if (teamIsFull) {
        return res.status(400).json({ message: "A csapat már megtelt!" })
    }
    else {
        try {
            const teamMembership = await prisma.team_Memberships.create({
                data: {
                    status: "pending",
                    uer_id: uer_id,
                    tem_id: tem_id
                }
            });
            return res.status(200).json({ message: "Sikeres csapatba lépés!" })
        } catch (error) {
            return res.status(500).json({ error })
        }
    }
}

const activeMembersList = async (req, res) => {
    const { team_id } = req.params;

    try {
        const activeMembers = await prisma.team_Memberships.findMany({
            where: {
                tem_id: parseInt(team_id),
                status: "active"
            },
            include: {
                user: true
            }
        });

        if (!activeMembers || activeMembers.length === 0) {
            return res.status(404).json({ message: "Nincs aktív tag a csapatban!" });
        }

        const membersData = activeMembers.map(member => ({
            id: member.user.id,
            full_name: member.user.full_name,
            usr_name: member.user.usr_name,
            discord_name: member.user.discord_name,
        }));

        return res.status(200).json(membersData);

    } catch (error) {
        return res.status(500).json({ message: "Hiba történt", error });
    }
};

const teamsForPlayer = async (req, res) => {
    const { user_name } = req.params;

    try {
        const user = await prisma.users.findFirst({
            where: { usr_name: user_name }
        });

        if (!user) {
            return res.status(404).json({ message: "Nincs ilyen nevű felhasználó." });
        }

        const activeMemberships = await prisma.team_Memberships.findMany({
            where: {
                uer_id: user.id,
                status: "active"
            },
            include: {
                team: true
            }
        });

        if (!activeMemberships || activeMemberships.length === 0) {
            return res.status(404).json({ message: "A felhasználó nem aktív tag egyetlen csapatban sem." });
        }

        const teams = activeMemberships.map(membership => membership.team);

        return res.status(200).json(teams);

    } catch (error) {
        return res.status(500).json({
            message: "Hiba történt a csapatok lekérdezése során.",
            error: error.message
        });
    }
};

const teamMembershipDelete = async (req, res) => {
    const { user_id, user_name, team_id, team_name, profileId } = req.body;

    if (!user_id || !team_id) {
        return res.status(400).json({ message: "Nincs ilyen játékos, ilyen csapatban!" })
    }

    const existMembership = await prisma.team_Memberships.findUnique({
        where: {
            uer_id_tem_id: {
                uer_id: parseInt(user_id),
                tem_id: parseInt(team_id),
            },
            status: "active"
        }
    })

    if(existMembership >! 0){
        return res.status(400).json({message: "Nincs ilyen csapattagság!"})
    }

    const existApplications = await prisma.applications.findMany({
        where: {
            OR: [
                { uer1_id: parseInt(user_id) },
                { uer2_id: parseInt(user_id) },
                { uer3_id: parseInt(user_id) },
                { uer4_id: parseInt(user_id) },
                { uer5_id: parseInt(user_id) }
            ],
            AND:{
                tem_id: parseInt(team_id),
                status: "approved"
            }
        }
    })
      
      if (existApplications) {
        return res.status(400).json({
          message: "Nem léphet(sz) ki a csapatból, ameddig van aktív jelentkezése annak, vagy versenyen vesz részt!"
        });
      }      

    try {

        const memberShipDElete = await prisma.team_Memberships.delete({
            where: {
                uer_id_tem_id: {
                    uer_id: parseInt(user_id),
                    tem_id: parseInt(team_id),
                },
                status: "active"
            }
        })

        if (parseInt(user_id) === parseInt(profileId) && parseInt(profileId) !== -1) { // -1 a profileId, ha kickelünk másik játékost a csapatból
            return res.status(200).json({ message: `Sikeresen kiléptél a "${team_name}" nevű csapatból!` })
        }
        else if (parseInt(user_id) !== parseInt(profileId) && parseInt(profileId) === -1) {
            return res.status(200).json({ message: `Kickelted "${user_name}" nevű játékost a "${team_name}" nevű csapatból!` })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }


};

const invite = async (req, res) => {
    const { team_id, user_id } = req.body;

    const existMembership = await prisma.team_Memberships.findUnique({
        where: {
            uer_id_tem_id: {
                uer_id: parseInt(user_id),
                tem_id: parseInt(team_id),
            }
        }
    })


    const userInviteability = await prisma.users.findFirst({
        where: {
            id: parseInt(user_id)
        },
        select: {
            inviteable: true
        }
    })

    const membershipCounter = await prisma.team_Memberships.count({
        where: {
            tem_id: parseInt(team_id),
            status:"active"
        }
    })

    if (parseInt(userInviteability.inviteable) === 0) {
        return res.status(400).json({ message: "A játékos nem fogad meghívót." })
    }
    else if (membershipCounter == 7) {
        return res.status(400).json({ message: "A csapat már megtelt! (max 7 fő)" })
    } else if (existMembership && existMembership.status == "pending") {
        return res.status(400).json({ message: "A játékosnak már van elfogadásra váró meghívója a csapatba." })
    } else if (existMembership && existMembership.status == "active") {
        return res.status(400).json({ message: "A játékos már tagja ennek a csapatnak." })
    }
    else {

        try {
            await prisma.team_Memberships.create({
                data: {
                    uer_id: parseInt(user_id),
                    tem_id: parseInt(team_id),
                    status: "pending"
                }
            })

            return res.status(200).json({ message: "Meghívó elküldve" })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Hiba a fetch során!" })
        }
    }
}

const inviteAcceptOrReject = async (req, res) => {
    const { user_id, accpetOrReject, team_id } = req.body;

    const existInvite = await prisma.team_Memberships.findUnique({
        where: {
            uer_id_tem_id: {
                uer_id: parseInt(user_id),
                tem_id: parseInt(team_id),
            },
            status: "pending"
        }
    })

    const existMembership = await prisma.team_Memberships.findUnique({
        where: {
            uer_id_tem_id: {
                uer_id: parseInt(user_id),
                tem_id: parseInt(team_id),
            },
            status: "active"
        }
    })

    if (String(accpetOrReject) !== "accept" && String(accpetOrReject) !== "reject") {
        return res.status(400).json({ message: "Érvénytelen meghívó kezelés" })
    }

    else if (!existInvite) {
        return res.status(400).json({ message: "Nincs meghívód ebbe a csapatba" })
    }

    else if (existMembership) {
        return res.status(400).json({ message: "Már tagja vagy ennak a csapatnak." })

    } else {

        try {

            if (String(accpetOrReject) === "reject") {
                await prisma.team_Memberships.delete({
                    where: {
                        uer_id_tem_id: {
                            uer_id: parseInt(user_id),
                            tem_id: parseInt(team_id),
                        },
                        status: "pending"
                    }
                })
                return res.status(200).json({ message: "Sikeresen elutasítottad a meghívót" })
            }

            else if (String(accpetOrReject) === "accept") {
                await prisma.team_Memberships.update({
                    where: {
                        uer_id_tem_id: {
                            uer_id: parseInt(user_id),
                            tem_id: parseInt(team_id),
                        }
                    },
                    data: {
                        status: "active"
                    }
                })
                return res.status(200).json({ message: "Sikeresen elfogadtad a meghívót" })

            }

        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Hiba a fetch során!" })
        }
    }
}

const myInvites = async (req, res) => {
    const { user_id } = req.body;
    try {
        const myInvites = await prisma.team_Memberships.findMany({
            where: {
                uer_id: parseInt(user_id),
                status: "pending"
            }
        })

        const teamDataByInvites = await prisma.teams.findMany({
            where: {
                id: {
                    in: myInvites.map((invite) => invite.tem_id)
                }
            }
        });

        const creatorByTeamInvite = await prisma.users.findMany({
            where: {
                id: {
                    in: teamDataByInvites.map((creator => creator.creator_id))
                }
            },
            select: {
                id: true,
                usr_name: true
            }
        })

        // console.log("myInvites:", myInvites); // Logoljuk a kapott eredményt

        if (myInvites.length > 0) {
            return res.status(200).json({ 'invites': myInvites, "teams": teamDataByInvites, 'creator_name': creatorByTeamInvite });
        } else {
            return res.status(400).json({ message: "Nincsenek meghívóid." });
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Hiba a lekérdezés során" })
    }

}



module.exports = {
    teamMembershipList,
    teamMembershipUpdate,
    teamMembershipInsert,
    activeMembersList,
    teamsForPlayer,
    teamMembershipDelete,
    invite,
    inviteAcceptOrReject,
    myInvites
}