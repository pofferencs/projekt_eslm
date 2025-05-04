import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import TeamSchema from "../common/schemas/TeamSchema";
import UserContext from "../../context/UserContext";

function UserTeams() {
  const {
    isAuthenticated,
    profile,
    isLoading,
    setIsLoading,
  } = useContext(UserContext);

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Ha nincs profil, nem megyünk tovább
    if (!profile || !profile.usr_name) return;

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BASE_URL}/list/userteammemberships/${profile.usr_name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(async (csapatok) => {
        if (Array.isArray(csapatok)) {
          // Minden csapathoz lekérjük a tagokat
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
  }, [profile, isAuthenticated]);

  return (
    <div className="p-8 md:p-10" id="myteams">
      {isLoading ? (
        <p className="text-center text-white">Loading...</p>
      ) : (
        <>
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center mt-10">
              {teams.map((team) => (
                <TeamSchema key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Nem vagy tagja egy csapatnak sem.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default UserTeams;
