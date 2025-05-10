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

    const user = await prisma.users.findFirst({
        where: {
            email_address: email
        }
    });

    if (!user) {
        return res.status(500).json({ message: "Ilyen felhasználó nem regisztrált!" });
    }

    if(!validator.isEmail(user.email_address)){
        return res.status(400).json({message: "A megadott e-mail cím nem e-mail cím!"});
    }
    

    if (verifyTokens.find(x => x.email == user.email_address)) {
        const token = jwt.sign({ email: user.email_address }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const index = verifyTokens.findIndex(x => x.email == user.email_address);

        verifyTokens[index].token = token;

        //console.log("Cserélve!", verifyTokens);
    } else {
        const token = jwt.sign({ email: user.email_address }, process.env.JWT_SECRET, { expiresIn: "15m" });
        verifyTokens.push({ "token": token, "email": user.email_address });

        //console.log("Új felvéve!", verifyTokens)
    }

    const token = verifyTokens.find(x => x.email == user.email_address);

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
        to: user.email_address,
        subject: "Jelszó visszaállítás",
        text: `Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár. Ezen a linken tudod a jelszavadat visszaállítani: ${process.env.VITE_USR_PASS_RESET_URL}?token=${token.token}`,
        html: `
        <h1>Jelszó visszaállítás</h1>
        <p>Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár.</p>
        <p>Ezen a linken tudod a jelszavadat visszaállítani:</p>
        <p>${process.env.VITE_USR_PASS_RESET_URL}?token=${token.token}</p>
        <p>Vedd figyelembe, hogy a fenti link 15 percig érvényes, így újra kell kérned, ha lejár.</p>
        `,
    };

    try {


        const decoded = jwt.verify(token.token, process.env.JWT_SECRET);
        // console.log(Boolean(decoded.email == user.email_address));

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

        const user = await prisma.users.findFirst({
            where: {
                email_address: decoded.email
            }
        })

        return res.status(200).json({ verified: true, data: decoded, id: user.id });

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

    const user = await prisma.users.findFirst({
        where: {
            email_address: email
        }
    });

    if (!user) {
        return res.status(500).json({ message: "Ilyen felhasználó nem regisztrált!" });
    }

    


    const token = jwt.sign({ email: user.email_address }, process.env.JWT_SECRET, { expiresIn: "15m" });


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
        to: user.email_address,
        subject: "Regisztráció megerősítő levél",
        text: `Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár. Ezen a linken tudod a regisztrációd megerősíteni: ${process.env.VITE_USR_EMAIL_VERIFY_URL}?token=${token}`,
        html: `
        <h1>Regisztráció megerősítő levél</h1>
        <p>Szia! Az alábbi link 15 percig érvényes, így újra kell kérned, ha lejár.</p>
        <p>Ezen a linken tudod a regisztrációd megerősíteni:</p>
        <p>${process.env.VITE_USR_EMAIL_VERIFY_URL}?token=${token}</p>
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

        const user = await prisma.users.findFirst({
            where: {
                email_address: decoded.email
            }
        })

        if (user.status == "active" || user.status == "inactive") {
            return res.status(400).json({ status: user.status, verified: true, message: "Ennek a fióknak megerősítése már van!" });
        }

        //A megtalált felhasználó adatával módosítunk
        const modUser = await prisma.users.update({
            where: {
                id: user.id
            },
            data: {
                status: "active"
            }
        });

        return res.status(200).json({ status: user.status, verified: true, message: "A fiók megerősítése sikeres! Bejelentkezhetsz!" });

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
        DELETE FROM pl USING picture_links pl, users u WHERE pl.uer_id = (SELECT id FROM users WHERE status="pending")
        `;

        const delPendingUsers = await prisma.users.deleteMany({
            where: {
                status: "pending"
            }
        });

        return console.log("A megerősítésre váró fiókok törlésre kerültek! (Felhasználók)")

    } catch (error) {
        return console.log({ error: error })
    }
})


const userList = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                discord_name: true,
                inviteable: true,
                full_name: true,
                usr_name: true,
                date_of_birth: true,
                school: true,
                clss: true,
                status: true,
                email_address: true,
                phone_num: true,
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
    const { status, classNum, classLetter } = req.query;
  
    if (!usr_name) return res.status(400).json({ message: "Hiányos név!" });
  
    const filters = {
      usr_name: {
        contains: usr_name,
      },
    };
  
    // Osztály szűrés
    if (classNum && classLetter) {
      // Ha mindkettő van, összefűzzük
      filters.clss = `${classNum}${classLetter.toUpperCase()}`;
    } else if (classNum) {
      // Ha csak a szám van, akkor csak a számot keressük
      filters.clss = {
        startsWith: classNum,
      };
    } else if (classLetter) {
      // Ha csak a betű van, akkor csak a betűt keressük
      filters.clss = {
        endsWith: classLetter.toUpperCase(),
      };
    }
  
    // Státusz szűrés
    if (status && status !== "all") {
      filters.status = status;
    }
  
    try {
      const users = await prisma.users.findMany({
        where: filters,
        select: {
          id: true,
          inviteable: true,
          discord_name: true,
          full_name: true,
          usr_name: true,
          date_of_birth: true,
          school: true,
          clss: true,
          status: true,
          email_address: true,
          phone_num: true,
        },
      });
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "Nincs ilyen felhasználó!" });
      }
  
      return res.status(200).json(users);
    } catch (error) {
      console.error("Prisma error:", error);
      return res.status(500).json({ message: "Szerverhiba!", error });
    }
  };
  
  
  
  
  

const userProfileSearchByName = async (req, res) => {
    const { usr_name } = req.params;

    if (!usr_name) return res.status(400).json({ message: "Hiányos adatok!" });

    try {
        const user = await prisma.users.findFirst({
            where: {
                usr_name: usr_name
            },
            select: {
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
                om_identifier: true,
                discord_name: true
            }
        });
        if (!user || usr_name === "") return res.status(404).json({ message: "Nincs ilyen felhasználó!" });
        else return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const userUpdate = async (req, res) => {
    const { id, full_name, new_usr_name, usr_name, paswrd, new_paswrd, school, new_email_address, phone_num, status, discord_name, inviteable, clss } = req.body;
    try {

        let date = new Date();

        // console.log(req.body);

        if(!validator.isEmail(new_email_address)){
            return res.status(400).json({message: "A megadott e-mail cím nem e-mail cím!"});
        }



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



        //Meghívhatóság módosítás esetén: (azért kell ez, mert a felhasználó mindentől függetlenül beállíthatja ezt)

        // if(inviteable && id){

        //     const modUser = await prisma.users.update({
        //         where: {
        //             id: id
        //         },
        //         data: {
        //             inviteable: inviteable
        //         }

        //     });
        //     return res.status(200).json({ message: "A meghívhatóságod sikeresen beállítottad!" });

        // }


        //Egyéb adat módosítás esetén:

        if (!new_email_address && !paswrd && !new_usr_name && !usr_name && !new_paswrd) {


            const modUser = await prisma.users.update({
                where: {
                    id: id
                },
                data: {
                    full_name: full_name,
                    school: school,
                    phone_num: phone_num,
                    status: status,
                    discord_name: discord_name,
                    inviteable: inviteable,
                    clss: clss

                }

            });
            return res.status(200).json({ message: "Sikeres adatfrissítés!" });
        }


        //Email módosítás esetén: előző -> (((new_email_address && paswrd) && !new_usr_name && !new_paswrd))

        if (((new_email_address) && !new_usr_name && !new_paswrd)) {


            if (validalasFuggveny(res, [
                { condition: emailCheck, message: "Ezzel az email címmel más már regisztrált!" }

            ])) {
                return;
            };


            let trim_email = new_email_address.replaceAll(" ", "");


            //Ha a jelszó kell, akkor ezt ki kell kommentelni

            // if (!bcrypt.compareSync(paswrd, user.paswrd)) {
            //     return res.status(400).json({ message: "A jelszó nem megfelelő!" });
            // }

            // console.log(new Date(new Date(date).setMonth(date.getMonth() - 1)));
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
                        status: status,
                        discord_name: discord_name
                    }

                });
                return res.status(200).json({ message: "Sikeres email frissítés!" });




            } else {
                return res.status(400).json({ message: "E-mail cím meváltoztatásra nincs lehetőséged!" });
            }


        }


        //Felhasználónév esetén: előző -> ((usr_name && new_usr_name && paswrd) && !new_email_address && !new_paswrd)

        if ((usr_name && new_usr_name) && !new_email_address && !new_paswrd) {

            if (validalasFuggveny(res, [
                { condition: /@/.test(new_usr_name), message: "A felhasználó név nem tartalmazhat '@' jelet!" },
                { condition: usrnameCheck, message: "Másnak is ez a neve! Adj meg újat!" }

            ])) {
                return;
            };

            if (user.usna_mod_num_remain > 0 && user.usna_last_mod_date < date) {

                const modUser = await prisma.users.update({
                    where: {
                        id: id
                    },
                    data: {
                        full_name: full_name,
                        usr_name: new_usr_name,
                        usna_last_mod_date: date,
                        usna_mod_num_remain: user.usna_mod_num_remain - 1,
                        school: school,
                        discord_name: discord_name,
                        phone_num: phone_num,
                        status: status
                    }
                });
                return res.status(200).json({ message: `Sikeres felhasználónév frissítés! Hátralévő módosítások száma: ${user.usna_mod_num_remain - 1}` });
            } else
                if (user.usna_mod_num_remain == 0 && !(date > new Date(new Date(user.email_last_mod_date).setMonth(user.email_last_mod_date.getMonth() + 3)))) {


                    return res.status(400.).json({ message: `Nem lehetséges a felhasználónév megváltoztatásra! (90 nap)` })
                } else {
                    return res.status(400.).json({ message: `Nem lehetséges a felhasználónév megváltoztatásra!` })
                }
        }


        //Jelszó esetén:

        if ((id && new_paswrd) || ((paswrd && new_paswrd)) && !new_email_address && !new_usr_name) {

            //console.log({ encrypted: paswrd == new_paswrd ? "true" : "false" })
            //console.log({ encrypted: bcrypt.compareSync(paswrd, user.paswrd) == bcrypt.compareSync(new_paswrd, user.paswrd) ? "true" : "false" })




            if (paswrd && new_paswrd) {

                if (paswrd == new_paswrd) {
                    return res.status(400).json({ message: "Ugyanazt a jelszót nem adhatod meg!" });
                }

                if (bcrypt.compareSync(paswrd, user.paswrd) == bcrypt.compareSync(new_paswrd, user.paswrd)) {
                    return res.status(400).json({ message: "Ugyanazt a jelszót nem adhatod meg!" });

                }

                if (!bcrypt.compareSync(paswrd, user.paswrd)) {
                    return res.status(400).json({ message: "Nem megfelelő jelszó!" });
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

            const modUser = await prisma.users.update({
                where: {
                    id: id
                },
                data: {
                    full_name: full_name,
                    paswrd: hashedPass,
                    school: school,
                    phone_num: phone_num,
                    discord_name: discord_name,
                    status: status
                }
            });
            return res.status(200).json({ message: "Sikeres jelszó megváltoztatás!" });



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

        if(!validator.isEmail(email_address)){
            return res.status(400).json({message: "A megadott e-mail cím nem e-mail cím!"});
        }

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
                status: "pending",
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
        if (userL.status == "pending") {
            return res.status(400).json({ message: "A fiókod nincs megerősítve!" })
        }
        if (userL.status == "banned") {
            return res.status(400).json({ message: "A fiókod tiltásra került! :(" })
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
            maxAge: 3600000 //60 perc
            //maxAge: 360000 //6 perc
            //maxAge: 120000 //2 perc
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
        path: '/'
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
        maxAge: 3600000 //60 perc
        //maxAge: 360000 //6 perc
        //maxAge: 120000 //2 perc
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
    userGetPicturePath,
    passEmailSend,
    passEmailVerify,
    verifyEmailSend,
    emailVerifiedMod,
    userProfileSearchByName
}