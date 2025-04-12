import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";


function UserProfile() {

  const {name} = useParams();
  const {isAuthenticated, profile} = useContext(UserContext);
  const [profileAdat, setProfileAdat] = useState({});
  const [picPath, setPicPath] = useState("");
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
    }

  },[isAuthenticated]);

  useEffect(()=>{

    if(name == profile.usr_name){
      navigate('/profile');
    }


  },[]);


  useEffect(()=>{

    fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${profile.id}`)
            .then(res => res.json())
            .then(adat => setPicPath(adat))
            .catch(err => {console.log(err)});
    console.log("refreshed navbar")
  },[isAuthenticated])

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
        <div className="m-10 card rounded-md bg-slate-500 sm:w-[200px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
          <div className="card-body">
            <div className="flex justify-start">
              <img className="w-52" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`}/>
            </div>
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
        </div>
        )
      }
    </div>
  )
}

export default UserProfile