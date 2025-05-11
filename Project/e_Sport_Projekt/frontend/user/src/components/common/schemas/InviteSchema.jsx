import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import UserContext from "../../../context/UserContext"

function InviteSchema({ team, creator }) {

    const { isAuthenticated, profile } = useContext(UserContext);

    const inviteDecideFetch = async (method, decision) => {

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/insert/inviteacceptorreject`, {
            method: method,
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                user_id: profile.id,
                accpetOrReject: decision,
                team_id: team.id
            })
        })

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Ismeretlen hiba");
        } else {
            toast.success(data.message)
            console.log(data.message)
            console.log(res.message)
        }
        return data;
    }

    const onSubmit = (decision) => {
        inviteDecideFetch("POST", decision)
            .then(res => res.json())
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <div className="card bg-neutral drop-shadow-lg text-stone-300 w-96 bg-gradient-to-br inline-block from-purple-900 to-orange-300 relative z-0">
            <div className="card-body items-left text-left">
                <div className="flex justify-between">
                    <h2 className="card-title drop-shadow-lg">{team.full_name}</h2>
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Rövid név:</p>
                    <p className="drop-shadow-lg">{`[ ${team.short_name} ]`}</p>
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Csapatkapitány:</p>
                    <div>
                        <div
                            className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1"
                        >
                            <Link to={`/profile/${creator.usr_name}`}>
                                {creator.usr_name}
                                <svg
                                    className="inline-block ml-2 w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 576 512"
                                    fill="currentColor"
                                >
                                    <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <div className="flex justify-end  space-x-2">
                        <button
                            onClick={() => onSubmit("reject")}
                            className="px-4 py-2 bg-red-600 rounded"
                        >
                            Elutasítás
                        </button>

                        <button
                            onClick={() => onSubmit("accept")}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Elfogadás
                        </button>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default InviteSchema