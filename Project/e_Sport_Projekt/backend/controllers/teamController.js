const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const teamList = async (req, res) => {
    try {
        const teams = await prisma.teams.findMany();
        res.status(200).json(teams);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const teamSearchByName = async (req, res) => {
    const { full_name } = req.params;
  
    if (!full_name) {
      return res.status(400).json({ message: "Hiányos adatok!" });
    }
  
    try {
      // 1. Csapatok keresése név alapján
      const teams = await prisma.teams.findMany({
        where: {
          full_name: {
            contains: full_name,
            lte: "insensitive"
          }
        }
      });
  
      if (teams.length === 0) {
        return res.status(404).json({ message: "Nincs ilyen csapat!" });
      }
  
      // 2. Kapitány adatok lekérése minden csapat creator_id alapján
      const result = await Promise.all(
        teams.map(async (team) => {
          const captain = await prisma.users.findUnique({
            where: { id: team.creator_id },
            select: {
              id: true,
              full_name: true,
              usr_name: true,
              discord_name: true,
              email_address: true
            }
          });
  
          return {
            ...team,
            captain
          };
        })
      );
  
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Hiba történt", error });
    }
  };
  



const teamUpdate = async (req, res) => {
    const { id, short_name, full_name, creator_id } = req.body;

    const existingTeam = await prisma.teams.findFirst({
        where: {
            full_name: full_name
        }
    })

    if (existingTeam) {
        return res.status(400).json({ message: "Ez a csapatnév foglalt!" })
    } else {
        try {
            const team = await prisma.teams.update({
                where: {
                    id: id
                },
                data: {
                    short_name: short_name,
                    full_name: full_name,
                    creator_id: creator_id
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Hiba a fetch során!" })
        }
    }
}

const teamInsert = async (req, res) => {
    const { short_name, full_name, creator_id } = req.body;

    if (!short_name || !full_name || !creator_id) {
        return res.status(400).json({ message: "Hiányos adatok!" });
    }

    const existingTeam = await prisma.teams.findFirst({
        where: {
            full_name: full_name
        }
    })

    if (full_name.length > 16 || full_name.length < 3) {
        return res.status(400).json({ message: "Túl hosszú vagy rövid csapatnevet adtál meg! (Minimum 3, maximum 16 karakter!)" });
    }

    if (existingTeam) {
        return res.status(400).json({ message: "Ez a csapatnév foglalt!" })
    } else {
        try {
            const team = await prisma.teams.create({
                data: {
                    short_name: short_name,
                    full_name: full_name,
                    creator_id: creator_id
                }
            });


            const newPicLink = await prisma.picture_Links.create({
                data: {
                    tem_id: team.id,
                    pte_id: 3 //vagy ami ide jön pteId
                }
            })

            return res.status(200).json({ message: "Sikeres csapat létrehozás!" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Hiba a fetch során!" })
        }
    }
}

const teamDelete = async (req, res) => {
    const { id } = req.body;

    try {
        const team = await prisma.teams.delete({
            where: {
                id: id
            }
        });
        return res.status(200).json({ message: "Sikeres törlés!" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const teamGetPicPath = async (req, res) => {
    const { team_id } = req.params;

    try {
        const teamPic = await prisma.picture_Links.findFirst({
            where: {
                tem_id: Number(team_id)
            }
        });

        if (!teamPic || !teamPic.tem_id) {
            return res.status(400).json({ message: "Nincs ilyen csapat!" });
        }

        const picPath = await prisma.pictures.findUnique({
            where: {
                id: teamPic.pte_id
            }
        });

        if (!picPath) {
            return res.status(400).json({ message: "Nincs ilyen kép!" });
        }

        return res.status(200).json(picPath.img_path);

    } catch (error) {
        return res.status(500).json(error);
    }

}

module.exports = {
    teamList,
    teamUpdate,
    teamInsert,
    teamDelete,
    teamSearchByName,
    teamGetPicPath
}