import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"



function OrganizerProfile() {

    const { name } = useParams();
    const [profileAdat, setProfileAdat] = useState({});
    const [picPath, setPicPath] = useState("");
    const [isloading, setIsLoading] = useState(true);




    useEffect(() => {
    
        if (name != undefined) {
          fetch(`${import.meta.env.VITE_BASE_URL}/organizer/organizerprofilesearchbyname/${name}`, {
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
                  fetch(`${import.meta.env.VITE_BASE_URL}/organizer/organizerpic/${adat.id}`,
                  )
                    .then(res => res.json())
                    .then(adat => { setPicPath(adat); setIsLoading(false); }) // ;console.log(adat)
                    .catch(err => { console.log(err) })
                )
    
              }
            })
            .catch(err => alert(err));
    
        }
    
    
      }, [isloading]);


  return (
    
    (isloading != false)? (
        <></>
    ):(

        <>
                <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                  <div className="card-body">
                    <div className="flex justify-center pb-8 gap-10">
                      <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={`${name} profilképe`} title={`${name} profilképe`} />
                      <div className="card-title">
                        <div className="pl-14">
                          <p className="text-3xl pb-2 text-white">{profileAdat.usr_name}</p>
                        </div>
                      </div>
                    </div>


                    <div className="border-t border-b border-gray-200 px-4 py-5 sm:p-0">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Teljes név
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.full_name}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Iskola
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.school}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            E-mail
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.email_address}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Telefonszám
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{profileAdat.phone_num}</p>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </>



    )


  )
}

export default OrganizerProfile