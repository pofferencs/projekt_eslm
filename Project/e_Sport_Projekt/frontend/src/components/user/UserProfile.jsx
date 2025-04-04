import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";


function UserProfile() {

  const {name} = useParams();
  const {isAuthenticated, profile} = useContext(UserContext);
  const [profileAdat, setProfileAdat] = useState([]);
  const navigate = useNavigate();

  


  useEffect(()=>{

    console.log(name)

    if(name){
      fetch(`${import.meta.env.VITE_BASE_URL}/list/unamesearch/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res=>res.json())
      .then(adat=>{console.log(adat); setProfileAdat(adat)})
      .catch(err=>alert(err));

      

    }else{
      navigate('/profile')
    }

    


    // if(isAuthenticated == false && name != undefined){
    //   navigate('/');
    // }

  },[]);


  return (
    <div>
      {
        (name!=undefined)?(
        <p>{profileAdat.full_name}</p>
        ):
        (
        <p>{profile.usr_name}</p>
        )
      }
    </div>
  )
}

export default UserProfile