import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../../context/UserContext"
import { toast } from "react-toastify";


function NewTeam() {
    const navigate = useNavigate()
    const { isAuthenticated, isLoading, profile } = useContext(UserContext);

    const [teamFormData, setTeamFormData] = useState({
        full_name: "",
        short_name: "",
        status: "active"
    });

    useEffect(() => {
        if (!isLoading && profile?.id) {
            setTeamFormData((prev) => ({
                ...prev,
                creator_id: profile.id
            }));
        }
    }, [isLoading, profile]);
    

    const writeDataTeam = (e) => {
        setTeamFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/insert/team`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(teamFormData)
            });

            if (!response.ok) {
                // console.log(response)
                throw new Error("Sikertelen csapatlétrehozás");
            }

            // const data = await response.json();
            // console.log("Létrehozott csapat:", data);

            navigate("/myteams");
        } catch (error) {
            console.error("Hiba a csapat létrehozása során:", error);
            toast(error.message);
        }
    };


    const onCancel = () => {
        setTeamFormData({ full_name: "", short_name: "",creator_id : profile.id,
            status: "active" });
        navigate("/");
    };

    return (
        isLoading ? (
            <>Töltés...</>
        ) : (
            <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                <div className="card-body">
                    <div className="flex justify-center pb-8 gap-10">
                        <img
                            className="w-56 h-56"
                            alt="Alap csapat profilképe"
                            title="Alap csapat profilképe"
                            src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}/team/team_0.png`}
                        />
                        <div className="card-title pl-14">
                            <p className="text-3xl pb-2 text-white">{teamFormData.full_name || "Új csapat"}</p>
                            <p className="text-xl pb-2 text-gray-400">{teamFormData.short_name ? `[${teamFormData.short_name}]` : "[----]"}</p>

                            <form onSubmit={onSubmit}>
                                <div className="flex flex-wrap gap-2">
                                    <button className="btn mt-3 text-white" type="submit">Mentés</button>
                                    <button className="btn mt-3 text-white" type="button" onClick={onCancel}>Visszavonás</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                        <div className="p-8 md:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-white">Csapatnév</label>
                                    <input
                                        id="full_name"
                                        type="text"
                                        maxLength={16}
                                        onChange={writeDataTeam}
                                        value={teamFormData.full_name}
                                        className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white">Csapat rövid neve</label>
                                    <input
                                        id="short_name"
                                        type="text"
                                        maxLength={4}
                                        onChange={writeDataTeam}
                                        value={teamFormData.short_name}
                                        className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default NewTeam;
