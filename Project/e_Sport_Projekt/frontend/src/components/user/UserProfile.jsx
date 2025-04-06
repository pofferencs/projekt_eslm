import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";


function UserProfile() {

  const {name} = useParams();
  const {isAuthenticated, profile} = useContext(UserContext);
  const [profileAdat, setProfileAdat] = useState({});
  const navigate = useNavigate(); 


  useEffect(()=>{

    if(isAuthenticated){

      if(name != undefined){
        fetch(`${import.meta.env.VITE_BASE_URL}/list/unamesearch/${name}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res=>res.json())
        .then(adat=>{console.log(adat); 
        if(!adat.message)
        {
          setProfileAdat(adat[0]);
        }else{
          navigate('/')
        }
        })
        .catch(err=>alert(err));
      }

    }else{
      navigate('/');
    }

  },[isAuthenticated]);

  const dateFormat = (date) =>{

    if(date != undefined){
      const [ev, honap, nap] = date.split('T')[0].split('-')

      return `${ev}. ${honap}. ${nap}.`;
    }else{
      return "";
    }

  }

  return (
    <div>
      {
        (name!=undefined)?(
        <div>
          {
            ( profileAdat.inviteable == true) ? (
              <p>Meghívható</p>
            ):
            ( profileAdat.inviteable == false)? (
              <p>Nem meghívható</p>

            ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)

          }
          <p>{profileAdat.full_name}</p>
          <p>{profileAdat.usr_name}</p>
          {
           (<p>{dateFormat(profileAdat.date_of_birth)}</p>)
          }
        </div>
        
        ):
        (
        <div>
          {
            ( profile.inviteable == true) ? (
              <p>Meghívható</p>
            ):
            ( profile.inviteable == false)? (
              <p>Nem meghívható</p>

            ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)

          }
          <p>{profile.full_name}</p>
          <p>{profile.usr_name}</p>
          {
           (<p>{dateFormat(profile.date_of_birth)}</p>)
          }
        </div>
        )
      }
    </div>
  )
}

export default UserProfile