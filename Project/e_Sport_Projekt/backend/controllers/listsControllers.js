const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const userList = async (req,res) =>{
    try {
        const users = await prisma.users.findMany();
        res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

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
        const picture_links = await prisma.picture_links.findMany();
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
        const teamMemberships = await prisma.Team_Memberships.findMany();
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
        console.log('Error:', error.message);
        console.log('Stack:', error.stack);

        res.status(500).json({message: "Hiba a fetch során!"})
    }
}

module.exports = {
    userList,
    applicationList,
    eventList,
    gameList,
    matchList,
    pictureList,
    picture_linkList,
    teamList,
    teamMembershipList,
    tournamentList
};