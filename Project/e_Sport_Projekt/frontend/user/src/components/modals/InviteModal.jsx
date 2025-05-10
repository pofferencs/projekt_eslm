import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserContext from "../../context/UserContext";

function InviteModal({ isOpen, onClose, user }) {
    const { isAuthenticated, profile } = useContext(UserContext);
    const [selectedTeamID, setSelectedTeamID] = useState("");
    const [teams, setTeams] = useState([])


    useEffect(() => {
        if (isOpen) {
            fetch(`${import.meta.env.VITE_BASE_URL}/list/userteammemberships/${profile.usr_name}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setTeams(data);
                    } else {
                        setTeams([]);
                    }
                })
                .catch(err => {
                    console.log(err);
                    setTeams([]);
                });
        }
    }, [isOpen, profile.usr_name]);


    if (!isOpen) return null;


    const inviteDone = async (method) => {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/insert/invite`, {
            method: method,
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                team_id: selectedTeamID
            })
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || "Ismeretlen hiba");
        }else{
            toast.success(data.message || "Sikeres meghívó")
        }

        return data;
    };

    const inviteSubmit = () => {
        inviteDone("POST")
            .then((res) => {
                if (res.ok) {
                    toast.success(res.message);
                }
                onClose();
            })
            .catch((err) => {
                console.log(err);
                toast.error("Hiba történt a meghíváskor");
                onClose();
            });
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500">
            <div className="bg-gray-500 p-4 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-bold mb-2">Válassz csapatot</h2>
                <select
                    value={selectedTeamID}
                    onChange={(e) => setSelectedTeamID(parseInt(e.target.value))}
                    className="w-full border p-2 rounded mb-4"
                >
                    <option value="">-- Válassz csapatot --</option>
                    {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.full_name}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end bg-gray-500 space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-red-600 rounded">Mégse</button>
                    <button
                        onClick={inviteSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                        disabled={!selectedTeamID}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>


    );
}

export default InviteModal
