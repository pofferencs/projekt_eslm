const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validalasFuggveny, hianyzoAdatFuggveny } = require('../functions/conditions');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cron = require('node-cron');
const validator = require('validator');

let verifyTokens = [];


// const passch = async (paswrd)=>{

//     const hashedPass = await bcrypt.hash(paswrd, 10);
//     console.log(hashedPass)
//     const nemtitkos = "$2a$10$tRn.12E7m4FSl22.NbeQp.rNMaqlSdwQjupC0Zkolk.oSD3AMUz.S"
//     console.log(bcrypt.compareSync(paswrd, nemtitkos))
// }

// passch("Titkosjelszo1@")


// //Példa tokenizálásra
// const signing = (adat)=>{


//     const token = jwt.sign(adat, process.env.JWT_SECRET, {expiresIn: '2m'});
//     console.log(token);

// }

// //signing({email: "emailecske@gmail.com", jelszo: "Nagyontitkosjelszo1@"})


//Email küldés jelszó visszaállításra
const passEmailSend = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(500).json({ message: "Add meg az e-mail címet!" });
    }

    if(!validator.isEmail(email)){
            return res.status(400).json({message: "A megadott e-mail cím nem e-mail cím!"});
    }

    //Létezik-e a felhasználó?

    const organizer = await prisma.organizers.findFirst({
        where: {
            email_address: email
        }
    });

    if (!organizer) {
        return res.status(500).json({ message: "Ilyen felhasználó nem regisztrált!" });
    }
    

    if (verifyTokens.find(x => x.email == organizer.email_address)) {
        const token = jwt.sign({ email: organizer.email_address }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const index = verifyTokens.findIndex(x => x.email == organizer.email_address);

        verifyTokens[index].token = token;

        //console.log("Cserélve!", verifyTokens);
    } else {
        const token = jwt.sign({ email: organizer.email_address }, process.env.JWT_SECRET, { expiresIn: "15m" });
        verifyTokens.push({ "token": token, "email": organizer.email_address });

        //console.log("Új felvéve!", verifyTokens)
    }

    const token = verifyTokens.find(x => x.email == organizer.email_address);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: organizer.email_address,
        subject: "Jelszó visszaállítás",
        text: `Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár. Ezen a linken tudod a jelszavadat visszaállítani: ${process.env.VITE_ORG_PASS_RESET_URL}?token=${token.token}`,
        html: `
        <h1>Jelszó visszaállítás</h1>
        <p>Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár.</p>
        <p>Ezen a linken tudod a jelszavadat visszaállítani:</p>
        <p>${process.env.VITE_ORG_PASS_RESET_URL}?token=${token.token}</p>
        <p>Vedd figyelembe, hogy a fenti link 15 percig érvényes, így újra kell kérned, ha lejár.</p>
        `,
    };

    try {


        const decoded = jwt.verify(token.token, process.env.JWT_SECRET);
        // console.log(Boolean(decoded.email == organizer.email_address));

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Kiküldtük az e-mailt a megadott címre!" })


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const passEmailVerify = async (req, res) => {

    const { token } = req.body;

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);



        if (!verifyTokens.find(e => e.token == token)) {
            return res.status(400).json({ verified: false, message: 'A token lejárt!' });
        }

        const organizer = await prisma.organizers.findFirst({
            where: {
                email_address: decoded.email
            }
        })

        return res.status(200).json({ verified: true, data: decoded, id: organizer.id });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ verified: false, message: 'A token lejárt!' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ verified: false, message: 'Érvénytelen token!' });
        } else {
            return res.status(500).json('Hiba a token ellenőrzésekor:', error.message);
        }
    }

};


//Email verifikációhoz email küldés

const verifyEmailSend = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(500).json({ message: "Add meg az e-mail címet!" });
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({message: "A megadott e-mail cím nem e-mail cím!"});
}

    //Létezik-e a felhasználó?

    const organizers = await prisma.organizers.findFirst({
        where: {
            email_address: email
        }
    });

    if (!organizers) {
        return res.status(500).json({ message: "Ilyen felhasználó nem regisztrált!" });
    }


    const token = jwt.sign({ email: organizers.email_address }, process.env.JWT_SECRET, { expiresIn: "15m" });


    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: organizers.email_address,
        subject: "Regisztráció megerősítő levél",
        text: `Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár. Ezen a linken tudod a regisztrációd megerősíteni: ${process.env.VITE_ORG_EMAIL_VERIFY_URL}?token=${token}`,
        html: `
        <h1>Regisztráció megerősítő levél</h1>
        <p>Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár.</p>
        <p>Ezen a linken tudod a regisztrációd megerősíteni:</p>
        <p>${process.env.VITE_ORG_EMAIL_VERIFY_URL}?token=${token}</p>
        <p>Vedd figyelembe, hogy a fenti link 15 percig érvényes, így újra kell kérned, ha lejár.</p>
        `,
    };

    try {

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "E-mail címedre megerősítő levelet küldtünk!" })



    } catch (error) {
        return res.status(500).json({ message: error.message });
    }


};

//Email verifikált függvény hívás


const emailVerifiedMod = async (req, res) => {

    const { token } = req.body;

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const organizers = await prisma.organizers.findFirst({
            where: {
                email_address: decoded.email
            }
        })

        if (organizers.status == "active" || organizers.status == "inactive") {
            return res.status(400).json({ status: organizers.status, verified: true, message: "Ennek a fióknak megerősítése már van!" });
        }

        //A megtalált felhasználó adatával módosítunk
        const modOrganizer = await prisma.organizers.update({
            where: {
                id: organizers.id
            },
            data: {
                status: "active"
            }
        });

        return res.status(200).json({ status: organizers.status, verified: true, message: "A fiók megerősítése sikeres! Bejelentkezhetsz!" });

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ verified: false, message: 'A token lejárt!' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ verified: false, message: 'Érvénytelen token!' });
        } else {
            return res.status(500).json('Hiba a token ellenőrzésekor:', error.message);
        }
    }

};


// Ő itt cron, félóránként törli automatikusan a "pending" (regisztráció megerősítésre váró) felhasználókat az adatbázisból, hogy ne foglaljanak feleslegesen helyet.
cron.schedule('*/30 * * * *', async () => {
    try {

        const delPicLinks = await prisma.$queryRaw
            `
        DELETE FROM pl USING picture_links pl, organizers o WHERE pl.ogr_id = (SELECT id FROM organizers WHERE status="pending")
        `;

        const delPendingOrganizers = await prisma.organizers.deleteMany({
            where: {
                status: "pending"
            }
        });

        return console.log("A megerősítésre váró fiókok törlésre kerültek! (Szervezők)")

    } catch (error) {
        return console.log({ error: error })
    }
})



const organizerList = async (req, res) => {
    try {
        const organizers = await prisma.organizers.findMany({
            select: {
                id: true,
                full_name: true,
                usr_name: true,
                date_of_birth: true,
                school: true,
                status: true,
                email_address: true,
                phone_num: true,
            }
        });
        return res.status(200).json(organizers);

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba a fetch során!" })
    }
}

const organizerSearchByName = async (req, res) => {
    const { usr_name } = req.params;

    if (!usr_name) return res.status(400).json({ message: "Hiányos adatok!" });

    try {
        const organizer = await prisma.organizers.findMany({
            where: {
                usr_name: {
                    contains: usr_name
                }
            },
            select: {
                id: true,
                full_name: true,
                usr_name: true,
                date_of_birth: true,
                school: true,
                status: true,
                email_address: true,
                phone_num: true,
            }
        });
        if (organizer.length == 0 || usr_name == "") return res.status(400).json({ message: "Nincs ilyen szervező!" });
        else return res.status(200).json(organizer);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const organizerSearchById = async (req, res) => {

    const { id } = req.body;

    if(!id){
        return res.status(400).json({message: "Hiányos adatok!"});
    }

    try {

        const organizer = await prisma.organizers.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                full_name: true,
                usr_name: true

            }
        })

        if(!organizer){
            return res.status(400).json({message: "Nincs ilyen szervező!"});
        }

        return res.status(200).json(organizer)

    } catch (error) {
        return res.status(500).json(error);
    }   
    
}


const organizerProfileSearchByName = async (req, res) => {
    const { usr_name } = req.params;

    if (!usr_name) return res.status(400).json({ message: "Hiányos adatok!" });

    try {
        const organizer = await prisma.organizers.findFirst({
            where: {
                usr_name: usr_name
            },
            select: {
                id: true,
                full_name: true,
                usr_name: true,
                date_of_birth: true,
                school: true,
                status: true,
                email_address: true,
                phone_num: true,
            }
        });
        if (!organizer || usr_name === "") return res.status(404).json({ message: "Nincs ilyen szervező!" });
        else return res.status(200).json(organizer);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const organizerUpdate = async (req, res) => {
    const { id, full_name, new_usr_name, usr_name, paswrd, new_paswrd, school, new_email_address, phone_num, status } = req.body;

    try {

        let date = new Date();

        if(!validator.isEmail(new_email_address)){
            return res.status(400).json({message: "A megadott e-mail cím nem e-mail cím!"});
        }

        

        const organizer = await prisma.organizers.findFirst({
            where: {
                id: id
            }
        });

        const usrnameCheck = await prisma.organizers.findFirst({
            where:{
                usr_name: new_usr_name
            }
        });

        const emailCheck = await prisma.organizers.findFirst({
            where:{
                email_address: new_email_address
            }
        });

    //Megadott adatok vizsgálata és update

    //Egyéb adat módosítás esetén:

    if (!new_email_address && !paswrd && !new_usr_name && !usr_name && !new_paswrd) {


        const modOrganizer = await prisma.organizers.update({
            where: {
                id: id
            },
            data: {
                full_name: full_name,
                school: school,
                phone_num: phone_num,
                status: status

            }

        });
        return res.status(200).json({ message: "Sikeres adatfrissítés!" });
    }

        //Email módosítás esetén:

        if(((new_email_address) && !new_usr_name && !new_paswrd)){


            if(validalasFuggveny(res, [
                { condition: emailCheck, message: "Ezzel az email címmel más már regisztrált!"}
                
            ]))
            {
                return;
            };


                let trim_email = new_email_address.replaceAll(" ", "");

                // if(!bcrypt.compareSync(paswrd, organizer.paswrd)){
                //     return res.status(400).json({message: "A jelszó nem megfelelő!"});
                // }
                
                // console.log(new Date(new Date(date).setMonth(date.getMonth() - 1)));
                if(date > new Date(new Date(organizer.email_last_mod_date).setMonth(organizer.email_last_mod_date.getMonth() + 1))){
                

                    const modOrganizer = await prisma.organizers.update({
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




            }else{
                return res.status(400).json({ message: "E-mail cím meváltoztatásra nincs lehetőséged!" });
            }           
            
        }


        //Felhasználónév esetén:

        if((usr_name && new_usr_name) && !new_email_address && !new_paswrd){

            if(validalasFuggveny(res, [
                { condition: /@/.test(new_usr_name), message: "A felhasználó név nem tartalmazhat '@' jelet!" },
                { condition: usrnameCheck, message: "Másnak is ez a neve! Adj meg újat!"}
                
            ]))
            {
                return;
            };

            if(organizer.usna_mod_num_remain > 0  && organizer.usna_last_mod_date < date){

                const modOrganizer = await prisma.organizers.update({
                    where: {
                        id: id
                    },
                    data: {
                        full_name: full_name,
                        usr_name: new_usr_name,
                        usna_last_mod_date: date,
                        usna_mod_num_remain: organizer.usna_mod_num_remain - 1,
                        school: school,
                        phone_num: phone_num,
                        status: status
                    }
                });
                return res.status(200).json({ message: `Sikeres adatfrissítés! Remaining: ${organizer.usna_mod_num_remain}` });
            }else
            if(organizer.usna_mod_num_remain == 0 && !(date > new Date(new Date(organizer.email_last_mod_date).setMonth(organizer.email_last_mod_date.getMonth() + 3)))){


                return res.status(400.).json({ message: `Nem lehetséges a felhasználónév megváltoztatásra! (90 nap)`})
            }else{
                return res.status(400.).json({ message: `Nem lehetséges a felhasználónév megváltoztatásra!`})
            }
        }

        //Jelszó esetén:
        if((id && new_paswrd) || ((paswrd && new_paswrd)) && !new_email_address && !new_usr_name){

            // console.log({encrypted: paswrd == new_paswrd ? "true" : "false"})
            // console.log({encrypted: bcrypt.compareSync(paswrd, organizer.paswrd) == bcrypt.compareSync(new_paswrd, organizer.paswrd) ? "true" : "false"})
            
            if(paswrd == new_paswrd){

                if(paswrd == new_paswrd){
                    return res.status(400).json({message: "Ugyanazt a jelszót nem adhatod meg!"});
                }
    
                if(bcrypt.compareSync(paswrd, organizer.paswrd) == bcrypt.compareSync(new_paswrd, organizer.paswrd)){
                    return res.status(400).json({message: "Ugyanazt a jelszót nem adhatod meg!"});
    
                }   
    
                if(!bcrypt.compareSync(paswrd, organizer.paswrd)){
                    return res.status(400).json({message: "Nem megfelelő jelszó!"});
                }
            }                                  
             
                
            const specChars = /[*@_]/;
            const ekezetesRegex = /[áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/;
            const validCharsRegex = /^[a-zA-Z0-9*@_]*$/;

            if (validalasFuggveny(res, [
                { condition: new_paswrd.length < 8, message: "A jelszónak minimum 8 karakter hosszúnak kell lennie!" },
                { condition: !/[A-Z]/.test(new_paswrd), message: "Egy nagybetűt meg kell adni a jelszónál!" },
                { condition: !/[a-z]/.test(new_paswrd), message: "Kisbetűket meg kell adnod a jelszónál!" },
                { condition: !/[0-9]/.test(new_paswrd), message: "A jelszónak tartalmaznia kell számot!" },
                { condition: !specChars.test(new_paswrd), message: "A jelszónak tartalmaznia kell különleges karaktereket! ('*', '@', '_')" },
                { condition: /^[*@_]/.test(new_paswrd), message: "Különleges karakterekkel nem kezdődhet a jelszó!" },
                { condition: ekezetesRegex.test(new_paswrd), message: "Csak az angol ABC betűi elfogadottak a jelszónál, ékezetek nem!" },
                { condition: !validCharsRegex.test(new_paswrd), message: "A jelszónak csak angol ABC betűi és az engedélyezett karakterek (számok, '*', '@', '_') tartalmazhatók!" }

            ])) {
                return;
            };

            const hashedPass = await bcrypt.hash(new_paswrd, 10);
        
            const modOrganizer = await prisma.organizers.update({
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
            
            
            
            }else{
                return res.status(400.).json({ message: "Nem lehetséges a jelszó megváltoztatás!"})
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

const organizerReg = async (req, res) => {

    const { full_name, date_of_birth, usr_name, paswrd, school, email_address, phone_num, om_identifier } = req.body;

    try {

        //1. Adatok meglétének ellenőrzése

        if (hianyzoAdatFuggveny(res, "Hiányos adatok!", full_name, usr_name, paswrd, date_of_birth, school, email_address, phone_num, om_identifier)) {
            return;
        }

        //2. Felhasználónév ellenőrzése

        const organizernameCheck = await prisma.organizers.findFirst({
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
        const omIdCheck = await prisma.organizers.findFirst({
            where:{
                om_identifier: om_identifier
            }
        });
        if (validalasFuggveny(res, [
            { condition: !/^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,}(?:[-][A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,})*(\s+[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,}(?:[-][A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]{1,})*)+$/.test(full_name), message: "Hibás névmegadás!" },
            { condition: full_name.length > 64, message: "Túl hosszú név (max 64 karakter)!" },
            { condition: /@/.test(usr_name), message: "A felhasználó név nem tartalmazhat '@' jelet!" },
            { condition: /[0-9]/.test(usr_name.charAt(0)), message: "Számmal nem kezdődhet a felhasználónév!" },
            { condition: organizernameCheck, message: "A felhasználónév foglalt!" },
            { condition: omIdCheck, message: "Ezzel az OM-számmal regisztráltak már!" },
            { condition: teamNameCheck, message: "A felhasználónév, amit megadtál, megegyezik egy csapat teljes nevével. Adj meg újat!" },
            { condition: usr_name.length < 3 || usr_name.length > 17, message: "Minimum 3, maximum 16 karakterből állhat a felhasználóneved!" }

        ])) {
            return;
        };

        let trim_usr_name  = usr_name.replaceAll(" ", "");

        if(!validator.isEmail(email_address)){
            return res.status(400).json({message: "A megadott e-mail cím nem e-mail cím!"});
        }

        //3. E-mail cím ellenőrzése
        const emailCheck = await prisma.organizers.findFirst({
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

        const hashedPass = await bcrypt.hash(paswrd, 10);

        //5. Felhasználó regisztrálása a megfelelő adatokkal
        //Felhasználó felvétele a pictureLinks táblába

        let date = new Date();
        let uname_last_mod_date = new Date(new Date(date).setMonth(date.getMonth() - 3));
        let mail_last_mod_date = new Date(new Date(date).setMonth(date.getMonth() - 1));

        const neworganizer = await prisma.organizers.create({
            data: {
                full_name: full_name,
                usr_name: trim_usr_name,
                usna_last_mod_date: uname_last_mod_date,
                usna_mod_num_remain: 3,
                paswrd: hashedPass,
                date_of_birth: szulDat,
                school: school,
                email_address: trim_email,
                email_last_mod_date: mail_last_mod_date,
                phone_num: phone_num,
                om_identifier: om_identifier,
                status: "pending"
            }
        })

        //Süti
        // const token = tokenGen(neworganizer.id);

        // res.cookie('tokenO', token, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: 'none',
        //     maxAge: 360000
        // });

        // console.log(`${neworganizer.usr_name} (ID: ${neworganizer.id}) tokenje: ${token}`);

        //kép hozzárendelés a fiókhoz
        

        const newPicLink = await prisma.picture_Links.create({
            data: {
                ogr_id: neworganizer.id,
                pte_id: 6
            }
        })

        return res.status(200).json({ message: "A regisztráció sikeres!" });

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Hiba a regisztráció során!" });
    }
}

//Tesztelés a hash-jelszó összehasonlításhoz
// const passwrd = "valami"
// const hashedPass = bcrypt.hashSync(paswrd, 10);
// console.log(paswrd)
// console.log(hashedPass)
// console.log(bcrypt.compareSync(paswrd, hashedPass))


const organizerLogin = async (req, res) => {
    const { usr_name, email_address, paswrd } = req.body

    try {

        const organizerL = await prisma.organizers.findFirst({
            where: {
                usr_name: usr_name,
                email_address: email_address
            }
        })


        if ((!usr_name && !paswrd) || (!email_address && !paswrd)) {
            return res.status(400).json({ message: "Nincs megadott adat!" });
        }


        if (!organizerL) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó!" });
        }
        if (organizerL.status == "pending") {
            return res.status(400).json({ message: "A fiókod nincs megerősítve!" })
        }
        if (organizerL.status == "banned") {
            return res.status(400).json({ message: "A fiókod tiltásra került! :(" })
        }
        //!bcrypt.compare(paswrd, organizer.paswrd)
        if (!bcrypt.compareSync(paswrd, organizerL.paswrd)) {
            return res.status(400).json({ message: "A jelszó nem megfelelő!" });
        }


        const token = tokenGen(organizerL.id);

        res.cookie('tokenO', token, {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            maxAge: 3600000 //60 perc
            //maxAge: 360000 //6 perc
            //maxAge: 120000 //2 perc
        });

        return res.status(200).json(token);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }

}

const organizerLogout = async (req, res) => {
    res.clearCookie('tokenO', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });
    res.status(200).json({ message: "Kijelentkezve." });
}

const protected = async (req, res) => {
    const { ogr_name } = req.body;
    const token = tokenGen(ogr_name);

    res.cookie('tokenO', token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 3600000 //60 perc
        //maxAge: 360000 //6 perc
        //maxAge: 120000 //2 perc
    });

    res.json(token);
}


const isAuthenticated = async (req, res) => {
    res.json({ "authenticated": true, organizer: req.organizer });
};

const organizerGetPicturePath = async (req, res) => {
    const { ogr_id } = req.params;

    try {

        const ogrPic = await prisma.picture_Links.findFirst({
            where: {
                ogr_id: Number(ogr_id)
            }
        })

        if (!ogrPic || !ogrPic.ogr_id) {
            return res.status(400).json({ message: "Nincs ilyen felhasználó!" });
        }

        const picPath = await prisma.pictures.findUnique({
            where: {
                id: ogrPic.pte_id
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

    const userBanByOrg = async (req, res) => {

        const { uer_id, uer_status } = req.body;

        let tmp_status;
        let end_message;
        let tmp_inviteable;

        if(!uer_status){
            return res.status(400).json({message: "Hiányos adat!"});
        }

        if(uer_status == "active" || uer_status == "inactive"){
            tmp_status = "banned";
            end_message = "Játékos kitiltva!"
            tmp_inviteable = false;
            
        }

        if(uer_status == "banned"){
            tmp_status = "active";
            end_message = "Játékos kitiltása feloldva!"
            tmp_inviteable = false;
        }

        try {

            const user = await prisma.users.findFirst({
                where: {
                    id: uer_id
                }
            });

            if(!user){
                return res.status(400).json({message: "Nincs ilyen játékos!"});
            }


            const modUserStatus = await prisma.users.update({
                where: {
                    id: uer_id
                },
                data: {
                    status: tmp_status,
                    inviteable: false
                }
            });

            

            return res.status(200).json({message: end_message})


            
        } catch (error) {
            return res.status(500).json(error);
        }


    }


module.exports = {
    organizerList,
    organizerUpdate,
    organizerLogin,
    organizerReg,
    protected,
    isAuthenticated,
    organizerLogout,
    emailVerifiedMod,
    verifyEmailSend,
    passEmailSend,
    passEmailVerify,
    organizerSearchByName,
    organizerGetPicturePath,
    organizerProfileSearchByName,
    organizerSearchById,
    userBanByOrg
    
}