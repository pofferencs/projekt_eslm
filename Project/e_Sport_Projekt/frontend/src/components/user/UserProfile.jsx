import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";


function UserProfile() {

  const {name} = useParams();
  const {isAuthenticated, profile, isLoading} = useContext(UserContext);
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
          setPicPath(
            fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${adat[0].id}`)
            .then(res => res.json())
            .then(adat => setPicPath(adat))
            .catch(err => {console.log(err)})
          )
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

    if(!isAuthenticated && isLoading == false){
      navigate('/');
    }

  },[]);


  useEffect(()=>{

    if(!name){
      fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${profile.id}`)
            .then(res => res.json())
            .then(adat => setPicPath(adat))
            .catch(err => {console.log(err)});
    }

    
    console.log("refreshed navbar")
  },[profileAdat])

  const dateFormat = (date) =>{

    if(date != undefined){
      const [ev, honap, nap] = date.split('T')[0].split('-')

      return `${ev}. ${honap}. ${nap}.`;
    }else{
      return "";
    }

  }

  return (
    <div className="">
      {
        (name!=undefined)?(
          <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
          <div className="card-body">
            <div className="flex justify-center pb-8 gap-10">
              <img className="w-60" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`}/>
              <div className="card-title">
                <div className="pl-14">
                <p className="text-3xl pb-2">{profileAdat.usr_name}</p>
                {
                ( profileAdat.inviteable == true) ? (
                  <p className="text-green-500 text-lg text-center">Meghívható</p>
                ):
                ( profileAdat.inviteable == false)? (
                  <p className="text-red-500 text-lg text-center">Nem meghívható</p>

                ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
              }
                  </div>
              </div>
            </div>


          <div className="border-t border-b border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        Teljes név
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profileAdat.full_name}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        Születési dátum
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {
                    (<p>{dateFormat(profileAdat.date_of_birth)}</p>)
                    }
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm text-black font-bold">
                        Telefonszám
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profileAdat.phone_num}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold"> 
                        Iskola
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profileAdat.school}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        Osztály
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profileAdat.clss}</p>
                    </dd>
                </div>
            </dl>
        </div>
          </div>
        </div>
        ):
        (
        <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
          <div className="card-body">
            <div className="flex justify-center pb-8 gap-10">
              <img className="w-60" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`}/>
              <div className="card-title">
                <div className="pl-14">
                <p className="text-3xl pb-2">{profile.usr_name}</p>
                {
                ( profile.inviteable == true) ? (
                  <p className="text-green-500 text-lg text-center">Meghívható</p>
                ):
                ( profile.inviteable == false)? (
                  <p className="text-red-500 text-lg text-center">Nem meghívható</p>

                ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
              }
                  </div>
              </div>
            </div>
            
          
          <div className="border-t border-b border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        Teljes név
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.full_name}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        Születési dátum
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {
                    (<p>{dateFormat(profile.date_of_birth)}</p>)
                    }
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        E-mail cím
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.email_address}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm text-black font-bold">
                        Telefonszám
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.phone_num}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold"> 
                        Iskola
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.school}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        Osztály
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.clss}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-black font-bold">
                        OM-azonosító
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.om_identifier}</p>
                    </dd>
                </div>
            </dl>
        </div>
          </div>
        </div>
        )
      }
    </div>
  )
}

export default UserProfile