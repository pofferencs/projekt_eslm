import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TeamSchema({ team }) {
    const [teamPicPath, setTeamPicPath] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);

    // Fetch team picture
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${team.id}`)
            .then(res => res.json())
            .then(pic => setTeamPicPath(pic))
            .catch(error => console.log(error));
    }, [team?.id]);

    // Fetch team members + captain
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/list/team/${team.id}/members`)
            .then(res => res.json())
            .then(members => {
                if (Array.isArray(members)) {
                    // Válaszd külön a kapitányt (creator_id) és rendezd előre
                    const captain = members.find(m => m.id === team.creator_id);
                    const others = members.filter(m => m.id !== team.creator_id);
                    setTeamMembers(captain ? [captain, ...others] : members);
                } else {
                    setTeamMembers([]);
                    console.warn("Hibás válasz:", members);
                }
            })
            .catch(error => console.log(error));
    }, [team?.id, team?.creator_id]);

    return (
        <div className="card bg-neutral drop-shadow-lg text-stone-300 w-96 bg-gradient-to-br inline-block from-purple-900 to-orange-300">
            <div className="card-body items-left text-left">
                <div className="flex justify-between">
                    <h2 className="card-title drop-shadow-lg">{team.full_name}</h2>
                    <img className="w-10 h-10 rounded-full drop-shadow-lg object-cover border-2 border-purple-900" src={import.meta.env.VITE_BASE_URL + `${import.meta.env.VITE_BASE_PIC}${teamPicPath}`} alt="Team Profile" />
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Rövid név:</p>
                    <p className="drop-shadow-lg">{`[ ${team.short_name} ]`}</p>
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Csapat tagjai:</p>
                    <div>
                        {teamMembers.length === 0 ? (
                            <p className="text-rose-700 italic underline drop-shadow-lg">Nincsenek aktív tagok</p>
                        ) : (
                            teamMembers.map((member, index) => (
                                <div key={member.id} className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1">
                                    <Link to={`/profile/${member.usr_name}`}>
                                        {index === 0 && member.id === team.creator_id ? `${member.usr_name} 👑 ` : `${member.usr_name} `}
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamSchema;