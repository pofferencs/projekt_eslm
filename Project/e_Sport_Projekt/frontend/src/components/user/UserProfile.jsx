import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";


function UserProfile() {

  const {name} = useParams();
  const {isAuthenticated, profile, isLoading, setIsLoading} = useContext(UserContext);
  const [profileAdat, setProfileAdat] = useState({});
  const [picPath, setPicPath] = useState("");
  const [isForm, setIsForm] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const navigate = useNavigate(); 

  let formObj = {
    full_name: "", //megvan
    paswrd: "", //megvan
    email_address: "",
    date_of_birth: "", //megvan
    school: "", //megvan
    clss: "", //megvan
    phone_num: "", // megvan
    om_identifier: "", //megvan
    discord_name: "", //megvan
};


  const [formData, setFormData] = useState(formObj);
  
  


  useEffect(() => {

    if (isAuthenticated) {

      if (name != undefined) {
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
            .then(adat => {setPicPath(adat); setIsLoading(false); setFormData(profile)})
            .catch(err => {console.log(err)})
          )
        }else{
          navigate('/')
        }
        })
        .catch(err=>alert(err));

      }}
      
    
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

  
 
  const modify = (formData, method) => {


    //1. vizsgálódás

    if(formData.paswrd != ""){
      formObj = {
        full_name: profile.full_name, //megvan
        paswrd: "a", //megvan
        date_of_birth: "", //megvan
        school: "", //megvan
        clss: "", //megvan
        phone_num: "", // megvan
        om_identifier: "", //megvan
        discord_name: "", //megvan
      }

      
      console.log(formObj)
      
    }

    
      
  };

  const onSubmit = (e) => {
    e.preventDefault();
    modify(formData, "POST");
  };

  const writeData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };



  

  




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
            
          
          <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-lg sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
            <div className="p-8 md:p-10">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div key={"full_name"}>
                  <label className="block text-sm font-medium text-white">
                      Teljes név
                  </label>
                  <input id="full_name" type="text" disabled={disabled} onChange={writeData} value={formData.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"date_of_birth"}>
                  <label className="block text-sm font-medium text-white">
                      Születési dátum
                  </label>
                  <input id="date_of_birth" type="date" disabled={disabled} onChange={writeData} value={dateFormat(formData.date_of_birth)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"/>
                </div>

                <div key={"full_name"}>
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

              </form>
            </div>
        </div>
          </div>
        </div>
        ): (
          <>
          {/* Itt lesz egy form kialakítású módosító felület*/}

          <form onSubmit={onSubmit}>
          
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
                ( profile.inviteable == false)? (
                  <p className="text-red-500 text-lg">Nem meghívható</p>
                  
                ): (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
              }
              <div className="flex flex-wrap gap-2">
              <button className="btn mt-3 text-white" type="submit">Módosítás</button>
              <button className="btn mt-3 text-white" onClick={()=> {setIsForm(false); setDisabled(true);}}>Mégse</button>
              </div>
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
                      <p>{profile.full_name}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold">
                        Születési dátum
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {
                    (<p>{dateFormat(profile.date_of_birth)}</p>)
                    }
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold">
                        E-mail cím
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.email_address}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm text-white font-bold">
                        Telefonszám
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.phone_num}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold"> 
                        Iskola
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.school}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold">
                        Osztály
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <p>{profile.clss}</p>
                    </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm text-white font-bold">
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
          
          
        </form>
          
          
          </>
        )
        )
      }

    </div>
    )
  )
}

export default UserProfile