import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext"
import { toast } from "react-toastify";
import { useState } from "react";

function TeamEdit() {
    const navigate = useNavigate()
    const { isAuthenticated } = useContext(UserContext);
    const [teamData, setTeamData] = useState({})
    const {team_id} = useParams();


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        }

        fetch(`${import.meta.env.VITE_BASE_URL}/list/teamsearchbyid/${team_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(adat => setTeamData(adat))
            .catch(err => toast(err));


    }, [isAuthenticated, team_id])

    return (
        <>
            <p>{teamData.full_name}</p>
            <p>{teamData.short_name}</p>
            <p>{teamData.creatort_id}</p>
        </>

    )
}

export default TeamEdit