const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validalasFuggveny, hianyzoAdatFuggveny } = require('../functions/conditions');


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
        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}


//Login és Regisztráció

const tokenGen = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

//Todo: login, regisztráció ÉS middleware   

const userReg = async (req, res) => {

    const { full_name, date_of_birth, usr_name, paswrd, school, clss, email_address, phone_num, discord_name, om_identifier } = req.body;

    try {

        //1. Adatok meglétének ellenőrzése

        if (hianyzoAdatFuggveny(res, "Hiányos adatok!", full_name, usr_name, paswrd, date_of_birth, school, clss, email_address, phone_num, discord_name, om_identifier)) {
            return;
        }

        //2. Felhasználónév ellenőrzése

        const usernameCheck = await prisma.users.findFirst({
            where: {
                usr_name: usr_name
            }
        });


        //Csapatnév ellenőrzés
        const teamNameCheck = await prisma.teams.findFirst({
            where: {
                full_name: usr_name
            }
        })

        //OM-szám ellenőrzés

        const omIdCheck = await prisma.users.findFirst({
            where:{
                om_identifier: om_identifier
            }
        });

        if (validalasFuggveny(res, [
            { condition: /[0-9]/.test(usr_name.charAt(0)), message: "Számmal nem kezdődhet a felhasználónév!" },
            { condition: usernameCheck, message: "A felhasználónév foglalt!" },
            { condition: omIdCheck, message: "Ezzel az OM-számmal regisztráltak már!"},
            { condition: teamNameCheck, message: "A felhasználónév, amit megadtál, megegyezik egy csapat teljes nevével. Adj meg újat!" },
            { condition: usr_name.length < 3 || usr_name.length > 17, message:  "Minimum 3, maximum 16 karakterből állhat a felhasználóneved!" }

        ])) {
            return;
        };

        let trim_usr_name  = usr_name.replaceAll(" ", "");

        //3. E-mail cím ellenőrzése
        const emailCheck = await prisma.users.findFirst({
            where: {
                email_address: email_address
            }
        });

        if (validalasFuggveny(res, [
            { condition: emailCheck, message: "Ezzel az email címmel már regisztráltak!" },
            { condition: om_identifier.length != 11 || om_identifier[0] != "7" || om_identifier.split("").some(num=> !/[0-9]/.test(num)), message: "Rosszul adtad meg az OM-azonosítód!" },

        ])) {
            return;
        };

        let trim_email = email_address.replaceAll(" ", "");
        

        //4. Jelszó ellenőrzése, utána a hash létrehozása

        // Jelszó min. hosszúságának ellenőrzése

        const specChars = /[*@_]/;
        const ekezetesRegex = /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/;
        const validCharsRegex = /^[a-zA-Z0-9*@_]*$/;

        if (validalasFuggveny(res, [
            { condition: paswrd.length < 8, message: "A jelszónak minimum 8 karakter hosszúnak kell lennie!" },
            { condition: !/[A-Z]/.test(paswrd), message: "Egy nagybetűt meg kell adni a jelszónál!" },
            { condition: !/[a-z]/.test(paswrd), message: "Kisbetűket meg kell adnod a jelszónál!" },
            { condition: !/[0-9]/.test(paswrd), message: "A jelszónak tartalmaznia kell számot!" },
            { condition: !specChars.test(paswrd), message: "A jelszónak tartalmaznia kell különleges karaktereket! ('*', '@', '_')" },
            { condition: /^[*@_]/.test(paswrd), message: "Különleges karakterekkel nem kezdődhet a jelszó!" },
            { condition: ekezetesRegex.test(paswrd), message: "Csak az angol ABC betűi elfogadottak a jelszónál, ékezetek nem!" },
            { condition: !validCharsRegex.test(paswrd), message: "A jelszónak csak angol ABC betűi és az engedélyezett karakterek (számok, '*', '@', '_') tartalmazhatók!" }

        ])) {
            return;
        };

        //Dátum átkonvertálása helyes adattípusra
        const szulDat = new Date(date_of_birth);

        //Discord név hosszának ellenőrzése (32 karakter hivatalosan a username)
        if (discord_name.length > 32) {
            return res.status(400).json({ message: "Túl hosszú a Discord felhasználóneved!" });
        }


        const hashedPass = await bcrypt.hash(paswrd, 10);

        //5. Felhasználó regisztrálása a megfelelő adatokkal
        //Felhasználó felvétele a pictureLinks táblába

        let date = new Date();
        let uname_last_mod_date = new Date(new Date(date).setMonth(date.getMonth() - 3));
        let mail_last_mod_date = new Date(new Date(date).setMonth(date.getMonth() - 1));

        const newUser = await prisma.users.create({
            data: {
                inviteable: true,
                full_name: full_name,
                usr_name: trim_usr_name,
                usna_last_mod_date: uname_last_mod_date,
                usna_mod_num_remain: 3,
                paswrd: hashedPass,
                date_of_birth: szulDat,
                school: school,
                clss: clss,
                email_address: trim_email,
                email_last_mod_date: mail_last_mod_date,
                phone_num: phone_num,
                om_identifier: om_identifier,
                status: "active",
                discord_name: discord_name,


            }
        })

        //Süti
        const token = tokenGen(newUser.id);

        res.cookie('tokenU', token, {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            maxAge: 360000
        });

        console.log(`${newUser.usr_name} (ID: ${newUser.id}) tokenje: ${token}`);

        //kép hozzárendelés a fiókhoz
        const newPicLink = await prisma.picture_Links.create({
            data: {
                uer_id: newUser.id,
                pte_id: 1 //vagy ami ide jön pteId
            }
        })

        return res.status(200).json({ message: "A regisztráció sikeres!" });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Hiba a regisztráció során!" });
    }
}

//Tesztelés a hash-jelszó összehasonlításhoz
// const passwrd = "valami"
// const hashedPass = bcrypt.hashSync(paswrd, 10);
// console.log(paswrd)
// console.log(hashedPass)
// console.log(bcrypt.compareSync(paswrd, hashedPass))


const userLogin = async (req, res) => {
    const { usr_name, email_address, paswrd } = req.body

    try {

        const userL = await prisma.users.findFirst({
            where: {
                usr_name: usr_name,
                email_address: email_address
            }
        })


        if ((!usr_name && !paswrd) || (!email_address && !paswrd)) {
            return res.status(400).json({ message: "Nincs megadott adat!" });
        }

        if (!userL) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó!" });
        }
        //!bcrypt.compare(paswrd, user.paswrd)
        if (!bcrypt.compareSync(paswrd, userL.paswrd)) {
            return res.status(400).json({ message: "A jelszó nem megfelelő!" });
        }


        const token = tokenGen(userL.id);

        res.cookie('tokenU', token, {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            maxAge: 360000
        });

        return res.status(200).json(token);



    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }

}

const userLogout = async (req, res) => {
    res.clearCookie('tokenU', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({ message: "Kijelentkezve." });
}



const protected = async (req, res) => {
    const { id } = req.body;
    const token = tokenGen(id);

    res.cookie('tokenU', token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 360000
    });

    res.json(token);
}


const isAuthenticated = async (req, res) => {
    res.json({ "authenticated": true, user: req.user });
};


module.exports = {
    userList,
    userUpdate,
    userLogin,
    userReg,
    protected,
    isAuthenticated,
    userLogout
}