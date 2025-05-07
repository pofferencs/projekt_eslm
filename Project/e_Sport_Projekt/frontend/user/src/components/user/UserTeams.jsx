import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TeamSchema from "../common/schemas/TeamSchema";
import UserContext from "../../context/UserContext";

function UserTeams() {
  const { isAuthenticated, profile, isLoading, setIsLoading } = useContext(UserContext);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile || !profile.usr_name) return;

    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BASE_URL}/list/userteammemberships/${profile.usr_name}`, {
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
                console.error("Error fetching members:", err);
                return { ...team, members: [] };
              }
            })
          );

          setTeams(csapatokTagokkal);
        } else {
          toast.error("Egy csapatban se vagy benne.");
          setTeams([]);
        }
      })
      .catch(err => {
        console.error("Error occurred:", err);
        toast.error("Hiba az adatok betöltése közben.");
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
                <div key={team.id}>
                  <TeamSchema team={team} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              Nem vagy egy csapat tagja sem.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default UserTeams;
