import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import OrganizerContext from "../../context/OrganizerContext";
import { toast } from "react-toastify";


function UserProfile() {

  const { name } = useParams();
  const { isAuthenticated, isLoading, setIsLoading, authStatus } = useContext(OrganizerContext);
  const [profileAdat, setProfileAdat] = useState({});
  const [refresh, setRefresh] = useState(true);
  const [picPath, setPicPath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    if (name != undefined) {
      fetch(`${import.meta.env.VITE_BASE_URL}/user/userprofilesearchbyname/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(adat => {
          //console.log(adat);
          if (!adat.message) {
            setProfileAdat(adat);
            setPicPath(
              fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${adat.id}`,
              )
                .then(res => res.json())
                .then(adat => { setPicPath(adat); setIsLoading(false); setRefresh(false)}) //; console.log(adat)
                .catch(err => { console.log(err) })
            )

          } else {
            navigate('/')
          }
        })
        .catch(err => alert(err));

    }


  }, [isAuthenticated, refresh]);



  const userBan = (id, status) => {

    fetch(`${import.meta.env.VITE_BASE_URL}/update/banuser`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ uer_id: id, uer_status: status }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {

          toast.error(data.message);
        } else {
          toast.success(data.message);
          authStatus();
          setRefresh(true);
        }

      }).catch(err => alert(err));

  }



  const dateFormat = (date) => {

    if (date != undefined) {
      const [ev, honap, nap] = date.split('T')[0].split('-')

      return `${ev}. ${honap}. ${nap}.`;
    } else {
      return ``;
    }

  }




  return (

    (isLoading != false) ?
      (
        <></>

      ) : (
        <div className="">
          {
            (isAuthenticated) ? (
              <>
                <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                  <div className="card-body">
                    <div className="flex justify-center pb-8 gap-10">
                      <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={`${name} profilképe`} title={`${name} profilképe`} />
                      <div className="card-title">
                        <div className="pl-14">
                          <p className="text-3xl pb-2 text-white">{profileAdat.usr_name}</p>
                          {
                            (profileAdat.inviteable == true && profileAdat.status == "active") ? (
                              <div>
                                <p className="text-green-500 text-lg">Meghívható</p>
                                <button onClick={()=> userBan(profileAdat.id, profileAdat.status)} className="btn mt-3">Kitiltás</button>
                              </div>
                            ) :
                              (profileAdat.inviteable == false || (profileAdat.status == "inactive" || profileAdat.status == "banned")) ? (
                                <div>

                                    {
                                    (profileAdat.status == "banned" ) ? (
                                      <>
                                        <p className="text-red-500 text-lg">Nem meghívható (Kitiltva)</p>
                                        <button onClick={()=> userBan(profileAdat.id, profileAdat.status)} className="btn mt-3">Kitiltás feloldása</button>
                                        </>
                                    ):(
                                        <>
                                        <p className="text-red-500 text-lg">Nem meghívható</p>
                                          <button onClick={()=> userBan(profileAdat.id, profileAdat.status)} className="btn mt-3">Kitiltás</button>
                                        </>
                                    )
                                  }
                                </div>
                              ) : (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
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
                            Születési dátum
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{dateFormat(profileAdat.date_of_birth)}</p>
                          </dd>
                        </div>

                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            E-mail cím
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.email_address}</p>
                          </dd>
                        </div>

                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Telefonszám
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.phone_num}</p>
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

                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Discord név
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.discord_name}</p>
                          </dd>
                        </div>

                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            OM-azonosító
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.om_identifier}</p>
                          </dd>
                        </div>

                      </dl>
                    </div>
                  </div>
                </div>
              </>
            ) :
              (

                <>
                <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                  <div className="card-body">
                    <div className="flex justify-center pb-8 gap-10">
                      <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={`${name} profilképe`} title={`${name} profilképe`} />
                      <div className="card-title">
                        <div className="pl-14">
                          <p className="text-3xl pb-2 text-white">{profileAdat.usr_name}</p>
                          {
                            (profileAdat.inviteable == true && profileAdat.status == "active") ? (
                              <div>
                                <p className="text-green-500 text-lg">Meghívható</p>
                              </div>
                            ) :
                              (profileAdat.inviteable == false || (profileAdat.status == "inactive" || profileAdat.status == "banned")) ? (
                                <div>
                                  <p className="text-red-500 text-lg">Nem meghívható</p>
                                </div>
                              ) : (<p>{/*ez itt egy üres sor, amivel megakadályozzuk, hogy a komponens betöltődésekor ne jelenjen még meg semmi, hanem majd akkor, ha lesz is adat*/}</p>)
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

               
              )
          }

        </div>
      )
  )
}

export default UserProfile