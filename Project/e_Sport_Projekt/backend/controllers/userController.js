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
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//Todo: login, regisztráció ÉS middleware   

const userReg = async (req, res)=>{

    const { full_name, date_of_birth , usr_name, paswrd, school, clss, email_address, phone_num, discord_name, om_identifier } = req.body;

    try {

            //Vizsgáláshoz szükséges adatok (tömbben)
        const angolABC = [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ];
        const specChars = ["*", "@", "_"];
        const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

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

        if(!full_name || !usr_name || !paswrd || !date_of_birth || !school || !clss || !email_address || !phone_num || !discord_name || !om_identifier){
            return res.status(400).json({message:"Hiányos adatok!"});
        }
        if(om_identifier.length() != 11){
            return res.status(400).json({message: "Rosszul adtad meg az OM-azonosítód!"})
        }

        //4. Jelszó ellenőrzése, utána a hash létrehozása

            //Jelszó min. hosszúságának ellenőrzése
        if(paswrd.length() < 8){
            return res.status(400).json({message: "Túl rövid a jelszó!"});
        }

            //Különleges karakterrel való kezdődés
        if(specChars.includes(paswrd.charAt(0))){
            return res.status(400).json({message: "Különleges karakterekkel nem kezdődhet a jelszó!"});
        }
        
            //Van-e szám a jelszóban
        if(!paswrd.split("").some(szam=> nums.includes(szam))){
            return res.status(400).json({message: "A jelszónak tartalmaznia kell számot!"});
        }

            //Nagybetű ellenőrzés
        if(!paswrd.match(/[A-Z]/)){
            return res.status(400).json({message: "Egy nagybetűt meg kell adj a jelszónál!"});
        }

            //Ékezetek ellenőrzése
        if(!paswrd.split("").some(betu=> angolABC.includes(betu))){
            return res.status(400).json({message: "Csak az angol ABC betűi elfogadottak a jelszónál!"});
        }


        
        const hashedPass = await bcrypt.hash(paswrd, 10);

        //Felhasználó regisztrálása a megfelelő adatokkal
            //Felhasználó felvétele a pictureLinks táblába

            let date = new Date();
            let usna_last_mod_date = new Date(new Date(date).setMonth(date.getMonth()- 3));
            let email_last_mod_date = new Date(new Date(date).setMonth(date.getMonth()- 1));

        const newUser = await prisma.users.create({
            data:{
                inviteable: 0,
                full_name: full_name,
                usr_name: usr_name,
                usna_last_mod_date: usna_last_mod_date,
                usna_mod_num_remain: 3,
                paswrd: hashedPass,
                date_of_birth: date_of_birth, 
                school: school,
                clss: clss,
                email_address: email_address,
                phone_num: phone_num,
                discord_name: discord_name,
                email_last_mod_date: email_last_mod_date,
                
                status: "active",
                om_identifier: om_identifier,
                               

            }
        })



        
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Hiba a regisztráció során!"});
    }    
}




const paswrd = "asd";
const specChars = ["*", "@", "_"];
const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        
// const hashedPass = bcrypt.hashSync(paswrd, 10);

// console.log(paswrd)
// console.log(hashedPass)
// console.log(bcrypt.compareSync(paswrd, hashedPass))





const userLogin = async (req, res)=>{
    const {usr_name, paswrd} = req.body

    try {

        const userL = await prisma.users.findFirst({
            where: {
                usr_name: usr_name
            }
        })


        if(usr_name == null || paswrd == null){
            return res.status(400).json({message: "Nincs megadott adat!"})
        }

        
        if(!userL){
            return res.status(400).json({message:"Nincs ilyen felhasználó!"});
        }
        //!bcrypt.compare(paswrd, user.paswrd)
        if(!bcrypt.compareSync(paswrd, userL.paswrd)){
            return res.status(400).json({message: "A jelszó nem megfelelő!"});
        }
        

        const token = tokenGen(userL.id);

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