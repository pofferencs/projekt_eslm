import { useContext, useEffect } from "react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext"
import { useState } from "react";


function TeamEdit() {
    const { id } = useParams();
    const {isAuthenticated, refresh} = useContext(UserContext)
    

    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{

      
      
        if(!isAuthenticated){
            navigate('/')
        }

        setIsLoading(false)
        
        console.log(id)

    },[isLoading])
    
  return (
    <div>TeamEdit</div>
  )
}

export default TeamEdit