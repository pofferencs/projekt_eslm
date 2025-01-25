# Iskolai Esport Szervezési Felület Asztali-Mobil- és Web platformra

Szervezési Felület.

Jelenlegi teendők:
    - OPTIMALIZÁLNI BACKENDEN A CONTROLLEREKET:
        - UPDATE és INSERT finomítása, hogy ne legyenek ismétlődő sorok:
            - UPDATE:
                ✔ events
                ✔ games
                - applications: user, team, tournament alapján
                - pictures: img_path alapján
                - picture_links: user, team csak egyszer
                - teames: full_name alapján
                - team_memberships: user és team egyszerre nem szerepelhet többször
                - tournaments: name alapján
                - users: user_name, email_address, OM_identifier, discord_name
        - INSERT, DELETE megírása
    - regisztráció, belépés, kijelentkezés, token/cookie megvalósítás

Kész dolgok:
    ✔ ötletelés
    ✔ adatbázis tervezés
    ✔ adatbázis - ERD
    ✔ adatbázis - Fizikai modell
    ✔ CRUD
    ✔ Üzleti szabályok
    ✔ Adatbázist létrehozó sql script
    ✔ Adatbázis feltöltése példasorokkal, példasorok scriptje
    ✔ Prisma importálása, táblák megvalósítása a "schema.prisma" fájlban
    ✔ Backend - Táblák adatainak lekérdezése
    ✔ Backend - Táblák - UPDATE
