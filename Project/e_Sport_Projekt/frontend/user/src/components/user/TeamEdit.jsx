import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext"
import { toast } from "react-toastify";

function TeamEdit() {
    const navigate = useNavigate()
    const { isAuthenticated, isLoading, setIsLoading } = useContext(UserContext);
    const [teamData, setTeamData] = useState({})
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMemberID, setSelectedMemberID] = useState("");
    const [teamPicPath, setTeamPicPath] = useState("");
    const { id } = useParams();
    const [isForm, setIsForm] = useState(false);
    const [disabled, setDisabled] = useState(true);

    let teamFormObj = {
        id: teamData.id,
        full_name: "",
        short_name: "",
        creator_id: "",
    }

    let memberShipFormObj = {
        user_id: "",
        team_id: teamData.id
    }

    const [teamFormData, setTeamFormData] = useState(teamFormObj);
    const [memberShipFormData, setMemberShipFormData] = useState(memberShipFormObj);

    const teamFormReset = () => {
        teamFormObj = {
            id: teamData.id,
            full_name: teamData.full_name,
            short_name: teamData.short_name,
            creator_id: teamData.captain.id
        }

        setTeamData(teamFormObj)
    }

    const memberFormReset = () => {
        memberShipFormObj = {
            user_id: "",
            team_id: teamData.id
        }

        setMemberShipFormData(memberShipFormObj)
    }


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }

        fetch(`${import.meta.env.VITE_BASE_URL}/list/teamsearchbyid/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(adat => {
                if (!adat.message) {
                    setTeamData(adat);
                    setTeamFormData({
                        id: adat.team.id,
                        full_name: adat.team.full_name,
                        short_name: adat.team.short_name,
                        creator_id: adat.captain.id
                    });
                    setTeamPicPath(
                        fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${id}`,)
                            .then(res => res.json())
                            .then(pic => setTeamPicPath(pic))
                            .catch(error => { console.log(error) })
                    )
                    fetch(`${import.meta.env.VITE_BASE_URL}/list/team/${id}/members`)
                        .then(res => res.json())
                        .then(data => setTeamMembers(data))
                        .catch(error => console.log(error));

                } else {
                    navigate('/')
                }
            })
            .catch(err => toast(err))
            .finally(() => setIsLoading(false))




    }, [isAuthenticated])

    const teamModify = (method) => {

        let sendingObj = {

        };

        if (teamFormData.full_name != teamData.full_name) {
            sendingObj = {
                id: teamFormData.id,
                full_name: teamFormData.full_name,
                short_name: teamData.short_name,
                creator_id: teamData.creator_id
            }
        } else if (teamFormData.short_name != teamData.short_name) {
            sendingObj = {
                id: teamFormData.id,
                ull_name: teamData.full_name,
                short_name: teamFormData.short_name,
                creator_id: teamData.creator_id
            }
        } else if (teamFormData.creator_id != teamData.creator_id) {
            sendingObj = {
                id: teamFormData.id,
                ull_name: teamData.full_name,
                short_name: teamData.short_name,
                creator_id: teamFormData.creator_id
            }
        }

        fetch(`${import.meta.env.VITE_BASE_URL}/update/team`, {
            method: method,
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(sendingObj)
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.message);
                } else {
                    toast.success(data.message);
                    setIsForm(false);
                }
            })
            .catch(err => alert(err));
    }

    const memberShipModify = (method) => {
        let sendingObj = {
            user_id: selectedMemberID.id,
            team_id: teamData.id
        }

        fetch(`${import.meta.env.VITE_BASE_URL}/update/teamMembership`, {
            method: method,
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(sendingObj)
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.message);
                } else {
                    toast.success(data.message);
                    setIsForm(false);
                }
            })
            .catch(err => alert(err));
    };

    const onSubmitTeam = (e) => {
        e.preventDefault();
        teamModify("PATCH");
    }

    const onSubmitMembership = (e) => {
        e.preventDefault();
        memberShipModify("PATCH");
    }

    const writeData = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const sendImage = async (file, type, id) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type); // pl. 'user'
        formData.append("id", id);     // pl. 0

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/insert/upload`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                // Ha a fájl túl nagy (413), vagy más hiba van
                const errorMsg = data?.error || data?.message || "Ismeretlen hiba történt a feltöltés során.";

                if (res.status === 413) {
                    toast.error("Túl nagy fájl: Maximum 2 MB és 512x512 felbontás engedélyezett.");
                } else {
                    toast.error(errorMsg);
                }
            } else {
                toast.success(data.message || "Feltöltés sikeres!");
            }
        } catch (error) {
            toast.error("Hiba a kép feltöltése során: " + error.message);
        }
    };

    const deleteImage = async (id, type) => {

        fetch(`${import.meta.env.VITE_BASE_URL}/delete/picture`, {
            method: "DELETE",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ id: id, type: type })
        })
            .then(async res => {
                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message || "Hiba történt");
                } else {
                    toast.success(data.message);
                }
            })
            .catch(err => alert(err));
    };

    return (
        <>
            {
                (isLoading) ? (
                    <>
                        Töltés...
                    </>
                ) : (
                    <>
                        <form onSubmit={onSubmitTeam} className="flex flex-col gap-2 max-w-md mx-auto p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Csapat szerkesztése</h2>

                            <label htmlFor="full_name">Teljes név</label>
                            <input
                                type="text"
                                id="full_name"
                                value={teamFormData.full_name}
                                onChange={(e) => setTeamFormData({ ...teamFormData, full_name: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />

                            <label htmlFor="short_name">Rövid név</label>
                            <input
                                type="text"
                                id="short_name"
                                value={teamFormData.short_name}
                                onChange={(e) => setTeamFormData({ ...teamFormData, short_name: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />

                            <label htmlFor="creator_id">Kapitány (ID)</label>
                            <input
                                type="text"
                                id="creator_id"
                                value={teamFormData.creator_id}
                                onChange={(e) => setTeamFormData({ ...teamFormData, creator_id: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />

                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Mentés
                            </button>
                        </form>

                        <hr className="my-4" />

                        <form onSubmit={onSubmitMembership} className="flex flex-col gap-2 max-w-md mx-auto p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Tag módosítása</h2>

                            <label htmlFor="user_id">Tag ID kiválasztása</label>
                            <select
                                id="user_id"
                                value={selectedMemberID.id}
                                onChange={(e) => setSelectedMemberID({ id: e.target.value })}
                                className="border px-2 py-1 rounded"
                            >
                                <option value="">Válassz egy tagot</option>
                                {teamMembers.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.usr_name} (ID: {member.id})
                                    </option>
                                ))}
                            </select>

                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                Mentés
                            </button>
                        </form>

                        <hr className="my-4" />

                        <div className="flex flex-col gap-2 max-w-md mx-auto p-4 border rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">Kép kezelése</h2>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) sendImage(file, "team", teamData.id);
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => deleteImage(teamData.id, "team")}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Kép törlése
                            </button>

                            {teamPicPath && <img src={teamPicPath.path} alt="Team" className="w-32 h-32 object-cover rounded" />}
                        </div>


                    </>
                )
            }
        </>

    )
}

export default TeamEdit