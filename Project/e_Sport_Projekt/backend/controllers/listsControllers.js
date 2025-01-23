const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
exports.prisma = prisma;

const applicationList = async (req,res) =>{
    try {
        const applications = await prisma.applications.findMany();
        res.status(200).json(applications);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const eventList = async (req,res) =>{
    try {
        const events = await prisma.events.findMany();
        res.status(200).json(events);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const gameList = async (req,res) =>{
    try {
        const games = await prisma.games.findMany();
        res.status(200).json(games);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const matchList = async (req,res) =>{
    try {
        const matches = await prisma.matches.findMany();
        res.status(200).json(matches);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const pictureList = async (req,res) =>{
    try {
        const pictures = await prisma.pictures.findMany();
        res.status(200).json(pictures);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const picture_linkList = async (req,res) =>{
    try {
        const picture_links = await prisma.picture_Links.findMany();
        res.status(200).json(picture_links);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const teamList = async (req,res) =>{
    try {
        const teams = await prisma.teams.findMany();
        res.status(200).json(teams);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const teamMembershipList = async (req,res) =>{
    try {
        const teamMemberships = await prisma.team_Memberships.findMany();
        res.status(200).json(teamMemberships);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

const tournamentList = async (req,res) =>{
    try {
        const tournaments = await prisma.tournaments.findMany();
        res.status(200).json(tournaments);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

module.exports = {
    /* Kész */ applicationList,
    /* Kész */ gameList,
    /* Kész */ matchList,
    /* Kész */ pictureList,
    /* Kész */ picture_linkList,
    /* Kész */ teamList,
    /* Kész */ teamMembershipList,
    /* Kész */ tournamentList
};