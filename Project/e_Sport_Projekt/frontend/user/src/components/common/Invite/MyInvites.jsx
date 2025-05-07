import { useContext, useState, useEffect } from "react";
import UserContext from "../../../context/UserContext";
import InviteSchema from "../schemas/InviteSchema";
import { toast } from "react-toastify";

function MyInvites() {
    const { isAuthenticated, profile } = useContext(UserContext);
    const [myInvites, setMyInvites] = useState({
        invites: [],
        teams: [],
        creator_name: []
    });


    useEffect(() => {
        if (!isAuthenticated || !profile.id) return;

        fetch(`${import.meta.env.VITE_BASE_URL}/insert/myinvites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id: profile.id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.invites && Array.isArray(data.invites)) {
                    setMyInvites(data);
                } else {
                    setMyInvites({ invites: [], teams: [], creator_name: [] });
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setMyInvites({ invites: [], teams: [], creator_name: [] });
            });

    }, [isAuthenticated, profile.id]);

    return (
        <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700 pt-10">
            <h2 id="myteams" className="mt-10 block text-center text-4xl font-bold text-indigo-500 p-5">
                <span className="bg-gradient-to-tr from-indigo-500 to-amber-500 text-transparent bg-clip-text">
                    Csapatok, amelyekbe meghívást kaptál
                </span>
            </h2>
            <div className="mx-auto mt-2 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />

            <div className="p-8 md:p-10">
                {myInvites.invites.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center mt-10">
                        {myInvites.invites.map((invite) => {
                            const team = myInvites.teams.find((t) => t.id === invite.tem_id);
                            if (!team) return null;

                            const creator = myInvites.creator_name.find((c) => c.id === team.creator_id);
                            if (!creator) return null;

                            return (
                                <InviteSchema
                                    key={`${invite.uer_id}-${invite.tem_id}`}
                                    team={team}
                                    creator={creator}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

    )
}

export default MyInvites;
