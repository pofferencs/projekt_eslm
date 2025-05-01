import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";


function UserProfile() {

  const {name} = useParams();
  const {isAuthenticated, profile, isLoading, setIsLoading, authStatus} = useContext(UserContext);
  const [profileAdat, setProfileAdat] = useState({});
  const [picPath, setPicPath] = useState("");
  const [isForm, setIsForm] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const navigate = useNavigate(); 

  let formObj = {
    full_name: "", //megvan
    email_address: "",
    date_of_birth: "", //megvan
    school: "", //megvan
    clss: "", //megvan
    phone_num: "", // megvan
    om_identifier: "", //megvan
    discord_name: "", //megvan,
    usr_name: ""
};


  const [formData, setFormData] = useState(formObj);
  
  const formReset = () =>{
    formObj = {
      full_name: profile.full_name,
      email_address: profile.email_address,
      date_of_birth: profile.date_of_birth,
      school: profile.school,
      clss: profile.clss,
      phone_num: profile.phone_num,
      om_identifier: profile.om_identifier,
      discord_name: profile.discord_name,
      usr_name: profile.usr_name
    }

    setFormData(formObj);
  };


  useEffect(() => {

   

      if (name != undefined) {
        fetch(`${import.meta.env.VITE_BASE_URL}/user/userprofilesearchbyname/${name}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res=>res.json())
        .then(adat=>{console.log(adat); 
        if(!adat.message)
        {
          setProfileAdat(adat);
          setPicPath(
            fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${adat.id}`)
            .then(res => res.json())
            .then(adat => {setPicPath(adat); setIsLoading(false); setFormData(profile);})
            .catch(err => {console.log(err)})
          )
        }else{
          navigate('/')
        }
        })
        .catch(err=>alert(err));

      }
      
    
  },[isAuthenticated]);

  useEffect(()=>{

    if(!name){
      fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${profile.id}`)
            .then(res => res.json())
            .then(adat => {setPicPath(adat); setIsLoading(false);})
            .catch(err => {console.log(err)});

    }
   
    console.log("refreshed navbar")
  },[isAuthenticated])

  // useEffect(()=>{
  //   if(isAuthenticated==false && !name){
  //     navigate('/');
  //   }

  // },[profileAdat])


  const dateFormat = (date) => {

    if (date != undefined) {
      const [ev, honap, nap] = date.split('T')[0].split('-')

      return `${ev}-${honap}-${nap}`;
    }else{
      return ``;
    }

  }


  //Adatmódosító rész

  const kuldesEmail = (email, method) => {
        
    fetch(`${import.meta.env.VITE_BASE_URL}/user/password-reset`,{
        method: method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({email: email}),
    }).then((res) => res.json())
          .then((token) => {
            if(!token.ok) {
              
              toast.success(token.message)
            }
          })
          .catch((err) => alert(err));
  };




  console.log(formData);

  
 
  const modify = (method) => {

    let usr_modify = false;

    //Vizsgálás, hogy mi változott, és az alapján adjuk át az adatokat

    let sendingObj = {

    };

    if(formData.usr_name != profile.usr_name){
      sendingObj = {
        id: profile.id,
        usr_name: profile.usr_name,
        new_usr_name: formData.usr_name
      };
      usr_modify = true;

    }else if(formData.email_address != profile.email_address){
      sendingObj = {
        id: profile.id,
        email_address: profile.email_address,
        new_email_address: formData.email_address
      }
    }else{
      sendingObj = {
        id: profile.id,
        full_name: formData.full_name,
        clss: formData.clss,
        school: formData.school,
        phone_num: formData.phone_num,
        discord_name: formData.discord_name
      }
    }

    
    fetch(`${import.meta.env.VITE_BASE_URL}/update/user`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(sendingObj),
    })
    .then(async (res) => {
      const data = await res.json();
      if(!res.ok){
          
          toast.error(data.message);
      }else{
          toast.success(data.message);
          authStatus();
          if(usr_modify){
            navigate(`/profile/${sendingObj.new_usr_name}`)
          }else{
            setIsForm(false);
          }
          
      }

  }).catch(err=>alert(err));
 
  };

  const onSubmit = (e) => {
    e.preventDefault();
    modify("PATCH");
  };

  const writeData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };


  const inviteableModify = (invBool) => {

    fetch(`${import.meta.env.VITE_BASE_URL}/update/user`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({id: profile.id ,inviteable: invBool}),
    })
    .then(async (res) => {
      const data = await res.json();
      if(!res.ok){
          
          toast.error(data.message);
      }else{
          toast.success(data.message);
          authStatus();
      }

  }).catch(err=>alert(err));
  
  }
  




  return (

    (isLoading!=false)?
    (
      <></>

    ):(
      <div className="">
      {
        (name!=profile.usr_name)?(
          <>
          <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
          <div className="card-body">
            <div className="flex justify-center pb-8 gap-10">
              <img className="w-60" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`}/>
              <div className="card-title">
                <div className="pl-14">
                <p className="text-3xl pb-2 text-white">{profileAdat.usr_name}</p>
                {
                ( profileAdat.inviteable == true && profileAdat.status == "active") ? (
                  <div>
                  <p className="text-green-500 text-lg">Meghívható</p>
                  {(isAuthenticated==true && profileAdat.status == "active")?(
                    <button className="btn mt-3 text-white">Meghívás csapatba</button>
                  ):(
                    <p></p>
                  )}
                  </div>
                ):
                ( profileAdat.inviteable == false || (profileAdat.status == "inactive" || profileAdat.status == "banned") )? (
                  <div>
                  <p className="text-red-500 text-lg">Nem meghívható</p>
                  </div>
                ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
              }
                  </div>
              </div>
            </div>


          <div className="border-t border-b border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold">
                        Teljes név
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profileAdat.full_name}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold"> 
                        Iskola
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profileAdat.school}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold">
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
        </>
        ):
        (
        (!isForm)? (
          <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
          <div className="card-body">
            <div className="flex justify-center pb-8 gap-10">
              <img className="w-60" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`}/>
              <div className="card-title">
                <div className="pl-14">
                <p className="text-3xl pb-2 text-white">{profile.usr_name}</p>
                
                {
                ( profile.inviteable == true) ? (
                    <p className="text-green-500 text-lg">Meghívható</p>

                ):
                ( profile.inviteable == false || (profile.status == "banned" || profile.status == "inactive" ))? (
                    <p className="text-red-500 text-lg">Nem meghívható</p>
                  
                ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
              }
              
              <div className="flex flex-col">
              <button className="btn mt-3 text-white w-52" onClick={()=> {setIsForm(true); setDisabled(false);}}>Adatok módosítása</button>
              
              </div>
                  </div>
              </div>
            </div>

            {/* <button disabled={emailDisabled} className="btn mt-3 text-white w-52" onClick={()=> {kuldesEmail(profile.email_address, "POST"); setEmailDisabled(true)}}>Jelszó módosítás</button> */}

            {/* <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold">
                        Születési dátum
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {
                    (<p>{dateFormat(profile.date_of_birth)}</p>)
                    }
                    </dd>
                </div> */}
            
          
          <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-white">
                      Felhasználónév
                  </label>
                  <input id="usr_name" type="text" disabled={disabled} value={formData.usr_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      Teljes név
                  </label>
                  <input id="full_name" type="text" disabled={disabled} value={formData.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      Születési dátum
                  </label>
                  <input id="date_of_birth" type="date" disabled={disabled} value={dateFormat(formData.date_of_birth)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      E-mail cím
                  </label>
                  <input id="email_address" type="text" disabled={disabled} value={formData.email_address} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      Telefonszám
                  </label>
                  <input id="phone_num" type="text" disabled={disabled} value={formData.phone_num} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      Iskola
                  </label>
                  <input id="school" type="text" disabled={disabled} value={formData.school} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      Osztály
                  </label>
                  <input id="clss" type="text" disabled={disabled} value={formData.clss} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      Discord név
                  </label>
                  <input id="discord_name" type="text" disabled value={formData.discord_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      OM-azonosító (nem módosítható)
                  </label>
                  <input type="text" disabled value={formData.om_identifier} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

              </div>
            </div>
        </div>
          </div>
        </div>
        ): (
          <>
          {/* Itt lesz egy form kialakítású módosító felület*/}

          
          <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
          <div className="card-body">
            <div className="flex justify-center pb-8 gap-10">
              <img className="w-60" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`}/>
              <div className="card-title">
                <div className="pl-14">
                <p className="text-3xl pb-2 text-white">{profile.usr_name}</p>
                {
                ( profile.inviteable == true) ? (
                  <div className="flex flex-row items-center gap-5">
                    <p className="text-green-500 text-lg">Meghívható</p>
                    <button className="btn mt-3 bg-red-600 border-none hover:bg-red-800 text-white w-fit" onClick={()=> inviteableModify(false)}>
                      <img className="h-5" src="https://www.svgrepo.com/show/456677/envelope-xmark.svg"/>
                    </button>
                  </div>
                ):
                ( profile.inviteable == false)? (
                  <div className="flex flex-row items-center gap-5">
                    <p className="text-red-500 text-lg">Nem meghívható</p>
                    <button className="btn mt-3 bg-green-600 border-none hover:bg-green-800 text-white w-fit" onClick={()=> inviteableModify(true)}>
                      <img className="h-5" src="https://www.svgrepo.com/show/456671/envelope-check.svg"/>
                    </button>
                  </div>
                  
                ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
              }
              <form onSubmit={onSubmit}>
              <div className="flex flex-wrap gap-2">
              <button className="btn mt-3 text-white" type="submit">Módosítás</button>
              <button className="btn mt-3 text-white" type="button" onClick={()=> {setIsForm(false); setDisabled(true); formReset()}}>Mégse</button>
              </div>
              </form>
                  </div>
              </div>
            </div>            
          
            <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >

              <div key={"usr_name"}>
                  <label className="block text-sm font-medium text-white">
                      Felhasználónév
                  </label>
                  <input id="usr_name" type="text" disabled={disabled} onChange={writeData} value={formData.usr_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"full_name"}>
                  <label className="block text-sm font-medium text-white">
                      Teljes név
                  </label>
                  <input id="full_name" type="text" disabled={disabled} onChange={writeData} value={formData.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"date_of_birth"}>
                  <label className="block text-sm font-medium text-white">
                      Születési dátum (nem módosítható)
                  </label>
                  <input id="date_of_birth" type="date" disabled onChange={writeData} value={dateFormat(formData.date_of_birth)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>

                <div key={"email_address"}>
                  <label className="block text-sm font-medium text-white">
                      E-mail cím
                  </label>
                  <input id="email_address" type="text" disabled={disabled} onChange={writeData} value={formData.email_address} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"phone_num"}>
                  <label className="block text-sm font-medium text-white">
                      Telefonszám
                  </label>
                  <input id="phone_num" type="text" disabled={disabled} onChange={writeData} value={formData.phone_num} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"school"}>
                  <label className="block text-sm font-medium text-white">
                      Iskola
                  </label>
                  <input id="school" type="text" disabled={disabled} onChange={writeData} value={formData.school} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"clss"}>
                  <label className="block text-sm font-medium text-white">
                      Osztály
                  </label>
                  <input id="clss" type="text" disabled={disabled} onChange={writeData} value={formData.clss} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"discord_name"}>
                  <label className="block text-sm font-medium text-white">
                      Discord név
                  </label>
                  <input id="discord_name" type="text" disabled={disabled} onChange={writeData} value={formData.discord_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                      OM-azonosító (nem módosítható)
                  </label>
                  <input type="text" disabled value={formData.om_identifier} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm"/>
                </div>
                
              </div>
              
            </div>
            
        </div>
        
          </div>
          
        </div>          
        
          </>
        )
        )
      }

    </div>
    )
  )
}

export default UserProfile