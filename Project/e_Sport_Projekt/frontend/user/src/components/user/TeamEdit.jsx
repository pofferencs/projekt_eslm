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
    const [isFormTeam, setIsFormTeam] = useState(false);
    const [isFormMember, setIsFormMember] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [tpFile, setTpFile] = useState({});



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
            id: teamData?.team?.id ?? "",
            full_name: teamData.team.full_name,
            short_name: teamData.team.short_name,
            creator_id: teamData.captain.id
        }

        setTeamFormData(teamFormObj)
    }

    const memberFormReset = () => {
        memberShipFormObj = {
            user_id: "",
            team_id: teamData?.team?.id ?? ""
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
                        fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${id}`,)
                            .then(res => res.json())
                            .then(pic => setTeamPicPath(pic))
                            .catch(error => { console.log(error) })
                    

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
        const sendingObj = {
            id: teamFormData.id,
            full_name: teamFormData.full_name,
            short_name: teamFormData.short_name,
            creator_id: teamFormData.creator_id
        };
    
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
                setIsFormTeam(false);
            }
        })
        .catch(err => alert(err));
    };
    

    const memberShipModify = (method) => {
        let sendingObj = {
            user_id: selectedMemberID.id,
            team_id: teamData?.team?.id ?? ""
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
                    setIsFormTeam(false);
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

    const writeDataTeam = (e) => {
        setTeamData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const writeDataMember = (e) => {
        setMemberShipFormData((prevState) => ({
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


        (isLoading) ? (
            <>
                Töltés...
            </>
        ) : (
            <div>
                {
                    (!isFormTeam && !isFormMember) ? (
                        <>
                            <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                                <div className="card-body">
                                    <div className="flex justify-center pb-8 gap-10">
                                        <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${teamPicPath}`} alt={`${teamFormData.short_name} csapat profilképe`} title={`${teamData.short_name} profilképe`} />
                                        <div className="card-title">
                                            <div className="pl-14">
                                                <p className="text-3xl pb-2 text-white">{teamFormData.full_name}</p>
                                                <p className="text-xl pb-2 text-gray-400">{`[${teamFormData.short_name}]`}</p>
                                                <div className="flex flex-col">
                                                    <button
                                                        className="btn mt-3 text-white w-52"
                                                        onClick={() => {
                                                            setIsFormTeam(true);
                                                            setDisabled(false);
                                                        }}
                                                    >
                                                        Adatok módosítása
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                                    <div className="p-8 md:p-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-white">Csapatnév</label>
                                                <input
                                                    id="usr_name"
                                                    type="text"
                                                    disabled={disabled}
                                                    value={teamFormData.full_name}
                                                    className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-white">Csapat tag</label>
                                                <input
                                                    id="short_name"
                                                    type="text"
                                                    disabled={disabled}
                                                    value={teamFormData.short_name}
                                                    className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) :
                        (
                            (isFormTeam && !isFormMember) ? (
                                <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                                    <div className="card-body">
                                        <div className="flex justify-center pb-8 gap-10">
                                            <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${teamPicPath}`} />
                                            <div className="card-title">
                                                <div className="pl-14">
                                                    <p className="text-3xl pb-2 text-white">{teamFormData.full_name}</p>
                                                    <p className="text-xl pb-2 text-gray-400">{`[${teamFormData.short_name}]`}</p>

                                                    <form onSubmit={onSubmitTeam}>
                                                        <div className="flex flex-wrap gap-2">
                                                            <button className="btn mt-3 text-white" type="submit">Módosítás</button>
                                                            <button className="btn mt-3 text-white" type="button" onClick={() => { deleteImage(teamData.team.id, "team") }} >Fénykép törlés</button>

                                                            <button className="btn mt-3 text-white" type="button" onClick={() => { setIsFormTeam(false); setDisabled(true); teamFormReset() }}>Mégse</button>

                                                        </div>

                                                    </form>
                                                    {/* Fénykép feltöltés */}
                                                    <form encType="multipart/form-data">
                                                        <div className="mt-3">
                                                            <label className="block text-sm font-medium text-white" htmlFor="image">
                                                                Fénykép cseréje
                                                            </label>
                                                            <input
                                                                className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-1"
                                                                id="image"
                                                                name="image"
                                                                type="file"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        if (file.size > 2 * 1024 * 1024) {
                                                                            toast.error("A kiválasztott fájl túl nagy. Legfeljebb 2 MB lehet.");
                                                                            return;
                                                                        }

                                                                        const reader = new FileReader();
                                                                        reader.onload = (event) => {
                                                                            const img = new Image();
                                                                            img.onload = () => {
                                                                                if (img.width > 512 || img.height > 512) {
                                                                                    toast.error("A kép túl nagy felbontású. Maximum 512x512 engedélyezett.");
                                                                                } else {
                                                                                    setTpFile(file); // csak ha minden OK
                                                                                }
                                                                            };
                                                                            img.src = event.target.result;
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                            />
                                                            <button className="btn mt-3 text-white" type="button" onClick={() => { sendImage(tpFile, "team", teamFormData.id); }}>Feltöltés</button>
                                                        </div>
                                                    </form>



                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                                            <div className="p-8 md:p-10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >

                                                    <div key={"full_name"}>
                                                        <label className="block text-sm font-medium text-white">
                                                            Csapatnév
                                                        </label>
                                                        <input id="usr_name" type="text" disabled={disabled} onChange={writeDataTeam} value={teamFormData.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                                                    </div>

                                                    <div key={"short_name"}>
                                                        <label className="block text-sm font-medium text-white">
                                                            Csapat tag
                                                        </label>
                                                        <input id="full_name" type="text" disabled={disabled} onChange={writeDataTeam} value={teamFormData.short_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (!isFormTeam && isFormMember) (
                                <p>Tagság módosítás</p>
                            )
                        )

                }
            </div>
        )
    )




}

export default TeamEdit