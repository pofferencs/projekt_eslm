import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext"
import { toast } from "react-toastify";

function TeamEdit() {
    const navigate = useNavigate()
    const { isAuthenticated } = useContext(UserContext);
    const [teamData, setTeamData] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();


    useEffect(() => {


        if (!isAuthenticated) {
            navigate('/')
        }

        fetch(`${import.meta.env.VITE_BASE_URL}/list/teamsearchbyid/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(adat => {setTeamData(adat); setIsLoading(false);})
            .catch(err => toast(err));


            console.log(teamData)

    }, [isAuthenticated])

    return (
        <>
            {
              (isLoading)?(
                <>
                
                </>
              ):(
                <>
                    <p>{teamData.team.full_name}</p>
                    <p>{teamData.team.short_name}</p>
                    <p>{teamData.captain.full_name}</p>      
            
                </>
              )
            }
        </>

    )
}

export default TeamEdit