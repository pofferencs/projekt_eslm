import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";


function UserProfile() {

  const {name} = useParams();
  const {profileGet, isAuthenticated, profile} = useContext(UserContext);
  const navigate = useNavigate();

  //console.log(profileGet())


  useEffect(()=>{

    if(isAuthenticated==false){
      // navigate('/');
    }

  },[]);


  return (
    <div>
      {
        (name!=undefined)?(
        <p>{name}</p>
        ):
        (
        <p>UserProfile</p>
        )
      }
    </div>
  )
}

export default UserProfile