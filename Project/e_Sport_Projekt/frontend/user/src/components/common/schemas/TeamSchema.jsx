import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../../../context/UserContext";
import DeleteModal from "../../modals/DeleteModal";


function TeamSchema({ team }) {
    const { profile } = useContext(UserContext);

    const navigate = useNavigate();

    const [teamPicPath, setTeamPicPath] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const location = useLocation();
    const isProfilePage = location.pathname.startsWith("/profile");
    const teamSearchPage = location.pathname.startsWith("/team-search");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${team.id}`)
            .then(res => res.json())
            .then(pic => setTeamPicPath(pic))
            .catch(error => console.log(error));
    }, [team?.id]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/list/team/${team.id}/members`)
            .then(res => res.json())
            .then(members => {
                if (Array.isArray(members)) {
                    const captain = members.find(m => m.id === team.creator_id);
                    const others = members.filter(m => m.id !== team.creator_id);
                    setTeamMembers(captain ? [captain, ...others] : members);
                } else {
                    setTeamMembers([]);
                }
            })
            .catch(error => console.log(error));
    }, [team?.id, team?.creator_id]);

    const handleLeaveTeam = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/delete/teammembership`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: profile.id,
                    team_id: team.id
                }),
            });

            const adat = await res.json();

            if (!res.ok) {
                toast.error(adat.message || "Hiba a kilépéskor");
            } else {
                toast.success(adat.message || "Kiléptél a csapatból");
            }
        } catch (err) {
            console.error("Kilépési hiba:", err);
            toast.error("Hiba történt a kilépés során.");
        }
    };

    return (
        <div className="card bg-neutral drop-shadow-lg text-stone-300 w-96 bg-gradient-to-br inline-block from-purple-900 to-orange-300 relative z-0">
            <div className="card-body items-left text-left">
                <div className="flex justify-between">
                    <h2 className="card-title drop-shadow-lg cursor-pointer" onClick={() => navigate(`/teamedit/${team.id}`)}>{team.full_name}</h2>
                    <img
                        className="w-10 h-10 rounded-full drop-shadow-lg object-cover border-2 border-purple-900"
                        src={
                            import.meta.env.VITE_BASE_URL +
                            `${import.meta.env.VITE_BASE_PIC}${teamPicPath}`
                        }
                        alt={`Csapat profilkép`}
                        title={`${team.full_name} csapat profilképe`}
                    />
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Rövid név:</p>
                    <p className="drop-shadow-lg">{`[ ${team.short_name} ]`}</p>
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Csapat tagjai:</p>
                    <div>
                        {teamMembers.length === 0 ? (
                            <p className="text-rose-700 italic underline drop-shadow-lg">
                                Nincsenek aktív tagok
                            </p>
                        ) : (
                            teamMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1"
                                >
                                    <Link to={`/profile/${member.usr_name}`}>
                                        {member.usr_name}
                                        {index === 0 && member.id === team.creator_id && (
                                            <svg
                                                className="inline-block ml-2 w-4 h-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 576 512"
                                                fill="currentColor"
                                            >
                                                <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                                            </svg>
                                        )}
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {!isProfilePage && !teamSearchPage && (
                    <div className="border-t border-white pt-2 mt-2 flex justify-end gap-2">
                        {profile.id === team.creator_id ? (
                            <button className="btn btn-sm btn-warning" onClick={() => navigate(`/teamedit/${team.id}`)}>Módosítás</button>
                        ) : (
                            <button
                                className="btn btn-sm btn-error"
                                onClick={() => setShowModal(true)}
                            >
                                Kilépés
                            </button>
                        )}
                    </div>
                )}

                <DeleteModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleLeaveTeam}
                    question={"Biztosan ki akarsz lépni a csapatból?"}
                    yes={"Igen, kilépek"}
                />
            </div>
        </div>
    );
}

export default TeamSchema;

