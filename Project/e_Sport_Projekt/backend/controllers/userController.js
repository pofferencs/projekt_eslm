const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const userList = async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        res.status(200).json(users);

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const userUpdate = async (req, res) => {
    const { id, inviteable, full_name, usr_name, usna_last_mod_date, usna_mod_num_remain, paswrd, school, clss, email_address, email_last_mod_date, phone_num, status, discord_name } = req.body;
    try {
        const user = await prisma.users.update({
            where: {
                id: id
            },
            data: {
                inviteable: inviteable,
                full_name: full_name,
                usr_name: usr_name,
                usna_last_mod_date: usna_last_mod_date,
                usna_mod_num_remain: usna_mod_num_remain,
                paswrd: paswrd,
                school: school,
                clss: clss,
                email_address: email_address,
                email_last_mod_date: email_last_mod_date,
                phone_num: phone_num,
                status: status,
                discord_name: discord_name
            }

        });
        res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Hiba a fetch során!" })
    }
}


//Login és Regisztráció

const tokenGen = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

//Todo: login, regisztráció ÉS middleware

const userReg = async (req, res)=>{

    const { full_name, date_of_birth , usr_name, paswrd, school, clss, email_address, phone_num, discord_name } = req.body;

    try {

        //1. Felhasználónév ellenőrzése

        const usernameCheck = await prisma.users.findFirst({
            where: {
                usr_name: usr_name
            }
        });

        if(usernameCheck){
            return res.status(400).json({message:"A felhasználói név foglalt!"})
        }

        //2. E-mail cím ellenőrzése
        const emailCheck = await prisma.users.findFirst({
            where: {
                email_address: email_address
            }
        });

        if(emailCheck){
            return res.status(400).json({message:"Ezzel az email címmel már regisztráltak!"});
        }

        //3. Adatok meglétének ellenőrzése

        if(!full_name || !usr_name || !paswrd || !date_of_birth || !school || !clss || !email_address || !phone_num || !discord_name){
            return res.status(400).json({message:"Hiányos adatok!"});
        }

        //4. Jelszó hash létrehozása

        const hashedPass = await bcrypt.hash(paswrd, 10);

        //Felhasználó regisztrálása a megfelelő adatokkal
            //Felhasználó felvétele a pictureLinks táblába

        const last_mod_date = new Date()

        const newUser = await prisma.users.create({
            data:{
                full_name: full_name,
                usr_name: usr_name,
                paswrd: hashedPass,
                date_of_birth: date_of_birth, 
                school: school,
                clss: clss,
                email_address: email_address,
                phone_num: phone_num,
                discord_name: discord_name,
                //email_last_mod_date:
                

            }
        })



        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Hiba a regisztráció során!"});
    }    
}

//let last_mod_date = new Date(Date.now())


// const paswrd = "sajtoskiflissafdfdsafdfds123123fkoppofwpofwwopfweopr9ö9ö234rö923kir3";
// const hashedPass = bcrypt.hashSync(paswrd, 10);

// console.log(paswrd)
// console.log(hashedPass)
// console.log(bcrypt.compareSync(paswrd, hashedPass))


//console.log(new Date(Date.now()))


const userLogin = async (req, res)=>{
    const {usr_name, paswrd} = req.body

    try {

        const user = await prisma.users.findFirst({
            where: {
                usr_name: usr_name
            }
        })

        if(!user){
            return res.status(400).json({message:"Nincs ilyen felhasználó!"});
        }
        //bcrypt.compare(paswrd, user.paswrd)
        if(paswrd != user.paswrd ){
            return res.status(400).json({message: "A jelszó nem megfelelő!"});
        }


        const token = tokenGen(user.id);

        res.cookie('token', token, {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            maxAge: 360000
        });

        return res.status(200).json(token);


        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error})
    }

}



module.exports = {
    userList,
    userUpdate,
    userLogin
}