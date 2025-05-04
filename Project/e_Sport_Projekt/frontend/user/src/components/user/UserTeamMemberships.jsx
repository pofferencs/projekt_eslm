import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { toast } from 'react-toastify';

function UserTeamMemberships() {
  const { name } = useParams();
  const { setIsLoading, profile } = useContext(UserContext); // feltételezve, hogy itt van
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!name) return;

    setIsLoading(true);

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
  }, [name, profileAdat]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Felhasználó csapatai</h2>
      {teams.length === 0 ? (
        <p>Nincs megjeleníthető csapat.</p>
      ) : (
        <ul className="space-y-4">
          {teams.map(team => (
            <li key={team.id} className="border p-4 rounded-lg shadow">
              <p className="font-bold">{team.name}</p>
              <p>Tagok:</p>
              <ul className="list-disc list-inside">
                {team.members.map(member => (
                  <li key={member.id}>{member.username}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserTeamMemberships;
