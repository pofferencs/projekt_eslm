import { useContext, useEffect } from "react"
import { Navigate, useLocation, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext"


function TeamEdit() {
    const {isAuthenticated, isLoading, refresh} = useContext(UserContext)
    const teamId = useParams();

    useEffect(()=>{
        if(!isAuthenticated){
            Navigate('/')
        }
        
        


    },[teamId, isAuthenticated])
    
  return (
    <div>TeamEdit</div>
  )
}

export default TeamEdit