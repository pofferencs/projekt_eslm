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

        //Vizsgáláshoz szükséges adatok (tömbben)
        const angolABC = [
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ];
        const specChars = ["*", "@", "_"];
        const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


        //1. Adatok meglétének ellenőrzése

        if (!full_name || !usr_name || !paswrd || !date_of_birth || !school || !clss || !email_address || !phone_num || !discord_name || !om_identifier) {
            return res.status(400).json({ message: "Hiányos adatok!" });
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

        const numCheck = nums.includes(usr_name.charAt(0));

        if (numCheck) {
            //Számmal kezdődés
            return res.status(400).json({ message: "Számmal nem kezdődhet a felhasználónév!" });

        } else if (usernameCheck) {

            return res.status(400).json({ message: "A felhasználónév foglalt!" })

        } else if (teamNameCheck) {
            return res.status(400).json({ message: "A felhasználónév, amit megadtál, megegyezik egy csapat teljes nevével. Adj meg újat!" })
        }

        //Név hosszának ellenőrzése
        if (usr_name.length < 3 || usr_name.length > 17) {
            return res.status(400).json({ message: "Minimum 3, maximum 16 karakterből állhat a felhasználóneved!" });
        }

        //3. E-mail cím ellenőrzése
        const emailCheck = await prisma.users.findFirst({
            where: {
                email_address: email_address
            }
        });

        if (emailCheck) {
            return res.status(400).json({ message: "Ezzel az email címmel már regisztráltak!" });
        }

        if (om_identifier.length != 11) {
            return res.status(400).json({ message: "Rosszul adtad meg az OM-azonosítód!" })
        }

        //4. Jelszó ellenőrzése, utána a hash létrehozása

        const upperCheck = paswrd.match(/[A-Z]/);
        const lowerCheck = paswrd.match(/[a-z]/);
        const alphabet = paswrd.match(/^[A-Za-z]+$/);



        //Jelszó min. hosszúságának ellenőrzése
        if (paswrd.length < 9) {
            return res.status(400).json({ message: "Túl rövid a jelszó!" });
        } else
            //Nagybetű ellenőrzés
            if (!upperCheck) {
                return res.status(400).json({ message: "Egy nagybetűt meg kell adj a jelszónál!" });
            } else
                if (!lowerCheck) {
                    return res.status(400).json({ message: "Kisbetűket meg kell adnod a jelszónál!" });
                } else
                    //Előző: 
                    if (!paswrd.split("").some(szam => nums.includes(szam))) {
                        //Van-e szám a jelszóban (kötelező)
                        return res.status(400).json({ message: "A jelszónak tartalmaznia kell számot!" });
                    }
        if (!paswrd.split("").some(betu => angolABC.includes(betu)) && paswrd.split("").some(szam => nums.includes(szam))) {
            //Ékezetek ellenőrzése
            //Előző: 
            return res.status(400).json({ message: "Csak az angol ABC betűi elfogadottak a jelszónál!" });
        } else
            //Előző: 
            if (!paswrd.split("").some(specCh => specChars.includes(specCh))) {
                //Van-e különleges karakter a jelszóban (kötelező)
                return res.status(400).json({ message: "A jelszónak tartalmaznia kell különleges karaktereket! ('*', '@', '_')" });
            } else
                //Különleges karakterrel való kezdődés
                if (specChars.includes(paswrd.charAt(0))) {
                    return res.status(400).json({ message: "Különleges karakterekkel nem kezdődhet a jelszó!" });
                }


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
                usr_name: usr_name,
                usna_last_mod_date: uname_last_mod_date,
                usna_mod_num_remain: 3,
                paswrd: hashedPass,
                date_of_birth: szulDat,
                school: school,
                clss: clss,
                email_address: email_address,
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
    const { usr_name } = req.body;
    const token = tokenGen(usr_name);

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