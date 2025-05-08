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
    const teams = await prisma.teams.findMany({
      where: {
        full_name: {
          contains: full_name,
          // lte: "insensitive"
        }
      }
    });

    if (teams.length === 0) {
      return res.status(404).json({ message: "Nincs ilyen csapat!" });
    }

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
  const { id, short_name, full_name, creator_id, profileId } = req.body;

  try {

    const existingTeam = await prisma.teams.findFirst({
      where: {
        full_name: full_name
      }
    });

    if (existingTeam && existingTeam.id !== id) {
      return res.status(400).json({ message: "Ez a csapatnév foglalt!" });
    }

    const existApplications = await prisma.applications.findMany({
      where: {
        OR: [
          { uer1_id: parseInt(creator_id) },
          { uer2_id: parseInt(creator_id) },
          { uer3_id: parseInt(creator_id) },
          { uer4_id: parseInt(creator_id) },
          { uer5_id: parseInt(creator_id) }
        ],
        AND: {
          tem_id: parseInt(id),
          status: "approved"
        }
      }
    , })

    if (existApplications.length > 0 && parseInt(creator_id) != parseInt(profileId)) {
      return res.status(400).json({
        message: "Nem válthatsz csapatkapitányt, ameddig van aktív jelentkezése a csapatnak, vagy versenyen vesz részt!"
      });
    }

    const team = await prisma.teams.update({
      where: {
        id: parseInt(id)
      },
      data: {
        full_name: full_name,
        short_name: short_name,
        creator_id: parseInt(creator_id)
      }
    });

    return res.status(200).json({ message: "Sikeres adatfrissítés!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Hiba a fetch során!" });
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
          creator_id: Number(creator_id)
        }
      });


      const newPicLink = await prisma.picture_Links.create({
        data: {
          tem_id: team.id,
          pte_id: 2
        }
      })

      const newMembership = await prisma.team_Memberships.create({
        data: {
          tem_id: Number(team.id),
          uer_id: Number(creator_id),
          status: "active"
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
  const { id, picture_id, user_id } = req.body;

  try {

    const membershipCounter = await prisma.team_Memberships.count({
      where: {
        tem_id: parseInt(id),
        status: "active"
      }
    })

    if (membershipCounter > 1) {
      return res.status(400).json({ message: "A csapat nem törölhető, mert 1-nél több tag van még benne!" })
    } else {
      const pictureGetId = await prisma.picture_Links.findFirst({
        where: {
          tem_id: parseInt(id)
        }
      })

      const picture_link = await prisma.picture_Links.delete({
        where: {
          id_pte_id: {
            id: pictureGetId.id,
            pte_id: parseInt(picture_id)
          },
          tem_id: parseInt(id)
        }
      })

      const membership = await prisma.team_Memberships.deleteMany({
        where: {
          tem_id: parseInt(id)
        }
      }
      )

      // const membership = await prisma.team_Memberships.delete({
      //   where: {
      //     uer_id_tem_id:{
      //       uer_id: user_id,
      //       tem_id: parseInt(id)
      //     }
      //   }
      // })


      const team = await prisma.teams.delete({
        where: {
          id: id
        }
      });
      return res.status(200).json({ message: "Sikeres törlés!" })
    }
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


const teamSearchByID = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Hiányos adatok!" });
  }

  try {
    const team = await prisma.teams.findFirst({
      where: {
        id: Number(id)
      }
    });

    if (team.length === 0) {
      return res.status(404).json({ message: "Nincs ilyen csapat!" });
    }

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

    const result = {
      team,
      captain
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Hiba történt", error });
  }
};


const myTeams = async (req, res) => {

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Hiányos adat!" });
  }

  try {

    const teams = await prisma.teams.findMany({
      where: {
        creator_id: parseInt(id)
      }
    });

    if (!teams) {
      return res.status(400).json({ message: "Nincsenek csapataid!" });
    }

    return res.status(200).json(teams)



  } catch (error) {
    return res.status(500).json({ message: "Hiba történt", error });
  }


}






module.exports = {
  teamList,
  teamUpdate,
  teamInsert,
  teamDelete,
  teamSearchByName,
  teamGetPicPath,
  teamSearchByID,
  myTeams
}