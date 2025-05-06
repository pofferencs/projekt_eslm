import { useContext, useState, useEffect } from "react";
import UserContext from "../../../context/UserContext";
import InviteModal from "../../modals/InviteModal";
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
                console.log("Fetched data:", data); // Ellenőrizzük, hogy a válaszban tényleg jön-e adat
                if (data.invites && Array.isArray(data.invites)) {
                    setMyInvites(data);
                } else {
                    setMyInvites({ invites: [], teams: [], creator_name: [] });
                }
            })
            .catch(err => {
                console.error("Fetch error:", err); // Hibaüzenet a fetch esetén
                setMyInvites({ invites: [], teams: [], creator_name: [] });
            });

    }, [isAuthenticated, profile.id]);

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {myInvites.invites.length > 0 &&
                myInvites.invites.map((invite) => {
                    const team = myInvites.teams.find((t) => t.id === invite.tem_id);
                    const creator = myInvites.creator_name.find((c) => c.id === team?.creator_id);

                    return (
                        <InviteModal
                            key={`${invite.uer_id}-${invite.tem_id}`}
                            team={team}
                            creator={creator}
                        />
                    );
                })}
        </div>
    );
}

export default MyInvites;
