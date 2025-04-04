const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validalasFuggveny, hianyzoAdatFuggveny } = require('../functions/conditions');


// const passch = async (paswrd)=>{

//     // const hashedPass = await bcrypt.hash(paswrd, 10);
//     // console.log(hashedPass)
//     const nemtitkos = "$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S"
//     console.log(bcrypt.compareSync(paswrd, nemtitkos))


// }



const userList = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select:{
                id: true,
                inviteable: true,
                full_name: true,
                usr_name: true,
                date_of_birth: true,
                school: true,
                clss: true,
                status: true,
                email_address: true,
                phone_num: true,
                om_identifier: true
            }
        });
        return res.status(200).json(users);

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const userSearchByName = async (req, res) => {
    const { usr_name } = req.params;

    if (!usr_name) return res.status(400).json({ message: "Hiányos adatok!" });

    try {
        const user = await prisma.users.findMany({
            where: {
                usr_name: {
                    contains: usr_name
                }
            },
            select:{
                id: true,
                inviteable: true,
                full_name: true,
                usr_name: true,
                date_of_birth: true,
                school: true,
                clss: true,
                status: true,
                email_address: true,
                phone_num: true,
                om_identifier: true
            }
        });
        if (user.length == 0 || usr_name == "") return res.status(400).json({ message: "Nincs ilyen felhasználó!" });
        else return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const userUpdate = async (req, res) => {
    const { id, full_name, new_usr_name, usr_name, paswrd, new_paswrd, school, new_email_address, phone_num, status } = req.body;
    try {

        let date = new Date();



        const user = await prisma.users.findFirst({
            where: {
                id: id
            }
        });

        const usrnameCheck = await prisma.users.findFirst({
            where: {
                usr_name: new_usr_name
            }
        });

        const emailCheck = await prisma.users.findFirst({
            where: {
                email_address: new_email_address
            }
        });



        //Megadott adatok vizsgálata és update

        //Email módosítás esetén:

        if (((new_email_address && paswrd) && !new_usr_name && !new_paswrd)) {


            if (validalasFuggveny(res, [
                { condition: emailCheck, message: "Ezzel az email címmel más már regisztrált!" }

            ])) {
                return;
            };


            let trim_email = new_email_address.replaceAll(" ", "");


            if (!bcrypt.compareSync(paswrd, user.paswrd)) {
                return res.status(400).json({ message: "A jelszó nem megfelelő!" });
            }

            console.log(new Date(new Date(date).setMonth(date.getMonth() - 1)));
            if (date > new Date(new Date(user.email_last_mod_date).setMonth(user.email_last_mod_date.getMonth() + 1))) {


                const modUser = await prisma.users.update({
                    where: {
                        id: id
                    },
                    data: {
                        full_name: full_name,
                        school: school,
                        email_address: trim_email,
                        email_last_mod_date: date,
                        phone_num: phone_num,
                        status: status
                    }

                });
                return res.status(200).json({ message: "Sikeres adatfrissítés!" });




            } else {
                return res.status(400).json({ message: "E-mail cím meváltoztatásra nincs lehetőséged!" });
            }


        }


        //Felhasználónév esetén:

        if ((usr_name && new_usr_name && paswrd) && !new_email_address && !new_paswrd) {

            if (validalasFuggveny(res, [
                { condition: /@/.test(new_usr_name), message: "A felhasználó név nem tartalmazhat '@' jelet!" },
                { condition: usrnameCheck, message: "Másnak is ez a neve! Adj meg újat!" }

            ])) {
                return;
            };

            if (user.usna_mod_num_remain > 0 && user.usna_last_mod_date < date) {

                const modUser = await prisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        full_name: full_name,
                        usr_name: new_usr_name,
                        usna_last_mod_date: date,
                        usna_mod_num_remain: user.usna_mod_num_remain - 1,
                        school: school,
                        phone_num: phone_num,
                        status: status
                    }
                });
                return res.status(200).json({ message: `Sikeres adatfrissítés! Remaining: ${user.usna_mod_num_remain}` });
            } else
                if (user.usna_mod_num_remain == 0 && !(date > new Date(new Date(user.email_last_mod_date).setMonth(user.email_last_mod_date.getMonth() + 3)))) {


                    return res.status(400.).json({ message: `Nem lehetséges a felhasználónév megváltoztatásra! (90 nap)` })
                } else {
                    return res.status(400.).json({ message: `Nem lehetséges a felhasználónév megváltoztatásra!` })
                }
        }

        //Jelszó esetén:
        if ((paswrd && new_paswrd) && !new_email_address && !usr_name) {

            console.log({ encrypted: paswrd == new_paswrd ? "true" : "false" })
            console.log({ encrypted: bcrypt.compareSync(paswrd, user.paswrd) == bcrypt.compareSync(new_paswrd, user.paswrd) ? "true" : "false" })


            if (paswrd == new_paswrd) {
                return res.status(400).json({ message: "Ugyanazt a jelszót nem adhatod meg!" });
            }

            if (bcrypt.compareSync(paswrd, user.paswrd) == bcrypt.compareSync(new_paswrd, user.paswrd)) {
                return res.status(400).json({ message: "Ugyanazt a jelszót nem adhatod meg!" });

            }

            if (!bcrypt.compareSync(paswrd, user.paswrd)) {
                return res.status(400).json({ message: "Nem megfelelő jelszó!" });
            }





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

            const hashedPass = await bcrypt.hash(paswrd, 10);

            const modUser = await prisma.users.update({
                where: {
                    id: id
                },
                data: {
                    full_name: full_name,
                    paswrd: hashedPass,
                    school: school,
                    phone_num: phone_num,
                    status: status
                }
            });
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });



        } else {
            return res.status(400.).json({ message: "Nem lehetséges a jelszó megváltoztatás!" })
        }

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
            where: {
                om_identifier: om_identifier
            }
        });

        if (validalasFuggveny(res, [
            { condition: !/^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,}(?:[-][A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,})*(\s+[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,}(?:[-][A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,})*)+$/.test(full_name), message: "Hibás névmegadás!" },
            { condition: full_name.length > 64, message: "Túl hosszú név (max 64 karakter)!" },
            { condition: /@/.test(usr_name), message: "A felhasználó név nem tartalmazhat '@' jelet!" },
            { condition: /[0-9]/.test(usr_name.charAt(0)), message: "Számmal nem kezdődhet a felhasználónév!" },
            { condition: usernameCheck, message: "A felhasználónév foglalt!" },
            { condition: omIdCheck, message: "Ezzel az OM-számmal regisztráltak már!" },
            { condition: teamNameCheck, message: "A felhasználónév, amit megadtál, megegyezik egy csapat teljes nevével. Adj meg újat!" },
            { condition: usr_name.length < 3 || usr_name.length > 17, message: "Minimum 3, maximum 16 karakterből állhat a felhasználóneved!" }

        ])) {
            return;
        };

        let trim_usr_name = usr_name.replaceAll(" ", "");

        //3. E-mail cím ellenőrzése
        const emailCheck = await prisma.users.findFirst({
            where: {
                email_address: email_address
            }
        });

        if (validalasFuggveny(res, [
            { condition: emailCheck, message: "Ezzel az email címmel már regisztráltak!" },
            { condition: om_identifier.length != 11 || om_identifier[0] != "7" || om_identifier.split("").some(num => !/[0-9]/.test(num)), message: "Rosszul adtad meg az OM-azonosítód!" },

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
        // const token = tokenGen(newUser.id);

        // res.cookie('tokenU', token, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: 'none',
        //     maxAge: 360000
        // });

        // console.log(`${newUser.usr_name} (ID: ${newUser.id}) tokenje: ${token}`);



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
            //maxAge: 360000 //6 perc
            maxAge: 360000 //fél perc
        });

        return res.status(200).json(token);



    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }

}

const userLogout = async (req, res) => {

    
    
    res.clearCookie('tokenU', {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        path:'/'
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
        //maxAge: 360000 //6 perc
        maxAge: 360000 //fél perc
    });

    res.json(token);
}


const isAuthenticated = async (req, res) => {
    res.json({ "authenticated": true, user: req.user });
};

const userGetPicturePath = async (req, res) => {
    const { uer_id } = req.params;

    try {

        const uerPic = await prisma.picture_Links.findFirst({
            where: {
                uer_id: Number(uer_id)
            }
        })        

        if (!uerPic || !uerPic.uer_id) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó!" });
        }
         
        const picPath = await prisma.pictures.findUnique({
            where: {
                id: uerPic.pte_id
            }
        });
        
        if (!picPath) {
            return res.status(400).json({ message: "Nincs ilyen kép!" });
        }
        
        return res.status(200).json(picPath.img_path);
    }

    catch (error) {
        return res.status(500).json(error)

    }
}


module.exports = {
    userList,
    userUpdate,
    userLogin,
    userReg,
    protected,
    isAuthenticated,
    userLogout,
    userSearchByName,
    userGetPicturePath
}