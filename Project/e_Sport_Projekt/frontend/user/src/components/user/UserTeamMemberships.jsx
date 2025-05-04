import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { toast } from 'react-toastify';

function UserTeamMemberships() {
  const { setIsLoading, profile, isAuthenticated } = useContext(UserContext); // A profile itt van
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [profileAdat, setProfileAdat] = useState(null);  // Új állapot hozzáadása

  // Ha nincs bejelentkezett felhasználó, navigáljunk a login oldalra
  useEffect(() => {
    if (!isAuthenticated || !profile) {
      toast.error("Nincs bejelentkezve felhasználó.");
      navigate("/login");  // Vagy más oldalra irányíthatod
      return;  // Ha nincs felhasználó, ne folytassuk a fetch-et
    }

    const name = profile.user_name; // A név most a profile-ból jön

    // Fetch a felhasználói profil adatainak lekéréséhez
    if (name !== undefined) {
      fetch(`${import.meta.env.VITE_BASE_URL}/user/userprofilesearchbyname/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(adat => {
          if (!adat.message) {
            setProfileAdat(adat); // Beállítjuk a profil adatokat
          } else {
            toast.error("Felhasználói adatokat nem található.");
          }
        })
        .catch(err => {
          console.log(err);
          toast.error("Hiba történt a profil lekérése során.");
        });
    }

    setIsLoading(true);

    // Fetch a felhasználó csapatainak lekéréséhez
    fetch(`${import.meta.env.VITE_BASE_URL}/list/userteammemberships/${name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(async (csapatok) => {
        if (Array.isArray(csapatok)) {
          const csapatokTagokkal = await Promise.all(
            csapatok.map(async (team) => {
              try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/list/team/${team.id}/members`);
                const members = await res.json();
                return { ...team, members };
              } catch (err) {
                console.error("Hiba a tagok lekérésekor:", err);
                return { ...team, members: [] };
              }
            })
          );

          setTeams(csapatokTagokkal);
        } else {
          toast.error("Nem találhatók csapatok.");
          setTeams([]);
        }
      })
      .catch(err => {
        console.error("Hiba történt:", err);
        toast.error("Hiba a csapatok lekérése során.");
      })
      .finally(() => setIsLoading(false));
  }, [profile, setIsLoading, isAuthenticated, navigate]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Felhasználó csapatai</h2>
      {teams.length === 0 ? (
        <p>Nincs megjeleníthető csapat.</p>
      ) : (
        <ul className="space-y-4">
          {teams.map(team => (
            <li key={team.id} className="border p-4 rounded-lg shadow">
              <p className="font-bold">{team.full_name}</p>
              <p>Tagok:</p>
              <ul className="list-disc list-inside">
                {(team.members.length > 0) ? (
                  team.members.map(member => (
                    <li key={member.id}>{member.user_name}</li>  /* Itt javítottam elírást */
                  ))
                ) : (
                  <li>Nem találhatóak tagok a csapatban.</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
      {profileAdat && (
        <div className="mt-4">
          <h3>Profil információk:</h3>
          <p><strong>Név:</strong> {profileAdat.user_name}</p>
          <p><strong>Email:</strong> {profileAdat.email}</p>
          <p><strong>Profil kép:</strong> <img src={profileAdat.profile_pic} alt="Profil" /></p>
        </div>
      )}
    </div>
  );
}

export default UserTeamMemberships;
