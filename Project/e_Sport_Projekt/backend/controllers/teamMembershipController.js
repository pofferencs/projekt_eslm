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

// Route to fetch active team members
const activeMembersList = async (req, res) => {
    const { team_id } = req.params;

    try {
        const activeMembers = await prisma.team_Memberships.findMany({
            where: {
                tem_id: Number(team_id),
                status: "active" // Filter for active members
            },
            include: {
                user: true // Include user data in the response
            }
        });

        if (!activeMembers || activeMembers.length === 0) {
            return res.status(404).json({ message: "Nincs aktív tag a csapatban!" });
        }

        // Return the active members' data
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

// Route to fetch all teams where a user is an active member
const teamsForPlayer = async (req, res) => {
    const { user_name } = req.params;

    try {
        // 1. Felhasználó ID lekérdezése user_name alapján
        const user = await prisma.users.findFirst({
            where: { usr_name: user_name }
        });

        if (!user) {
            return res.status(404).json({ message: "Nincs ilyen nevű felhasználó." });
        }

        // 2. Aktív csapat tagságok keresése user_id alapján
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

        // 3. Csapatok kilistázása
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
    const { user_id, team_id } = req.body;

    if (!user_id || !team_id) {
        return res.status(400).json({ message: "Nincs ilyen játékos, ilyen csapatban!" })
    }

    try {
        const existMembership = await prisma.team_Memberships.delete({
            where: {
                uer_id_tem_id: {
                    uer_id: Number(user_id),
                    tem_id: Number(team_id),
                }
            }
        })

        return res.status(200).json({message: "Sikeres kilépés a cspatból!"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }


}



module.exports = {
    teamMembershipList,
    teamMembershipUpdate,
    teamMembershipInsert,
    activeMembersList,
    teamsForPlayer,
    teamMembershipDelete
}