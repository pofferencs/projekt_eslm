import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import OrganizerContext from "../../../context/OrganizerContext";

function ApplicationCard({team, application}) {


    const [teamPicPath, setTeamPicPath] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const {authStatus} = useContext(OrganizerContext);


    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${team.id}`)
            .then(res => res.json())
            .then(pic => setTeamPicPath(pic))
            .catch(error => console.log(error));
    }, [team?.id]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/list/team/${team.id}/members`)
            .then(res => res.json())
            .then(members => {
                if (Array.isArray(members)) {
                    const captain = members.find(m => m.id === team.creator_id);
                    const others = members.filter(m => m.id !== team.creator_id);
                    setTeamMembers(captain ? [captain, ...others] : members);
                } else {
                    setTeamMembers([]);
                }
            })
            .catch(error => console.log(error));
    }, [team?.id, team?.creator_id]);

    const approve = () =>{

        fetch(`${import.meta.env.VITE_BASE_URL}/update/application/handle`,{
            method: "PATCH",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                id: application.id,
                tnt_id: application.tnt_id,
                tem_id: application.tem_id,
                new_status: "approved",
                uer1_id: application.user1.id,
                uer2_id: application.user2.id,
            })
        }).then(async res=>{
            const data = await res.json();
      
          if (!res.ok) {
            toast.error(data.message || "Hiba történt");
          } else {
            toast.success(data.message);
          }
          })
          .catch(err=>alert(err));

    };


    const torles = () => {

        fetch(`${import.meta.env.VITE_BASE_URL}/delete/application`,{
            method: "DELETE",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                id: application.id
            })
        }).then(async res=>{
            const data = await res.json();
      
          if (!res.ok) {
            toast.error(data.message || "Hiba történt");
          } else {
            toast.success(data.message);
          }
          })
          .catch(err=>alert(err));

        

    };

    const formatDateTime = (dateTime) => {
        if (dateTime) {
          const [date, time] = dateTime.split('T'); // Szétválasztjuk a dátumot és az időt
          const [ev, honap, nap] = date.split('-'); // A dátumot év, hónap, nap részekre bontjuk
          const [ora, perc] = time.split(':'); // Az időt óra és perc részekre bontjuk
      
          return `${ev}. ${honap}. ${nap}. ${ora}:${perc}`; // Formázott visszatérési érték
        } else {
          return '';
        }
      };



  return (
    <div className="card bg-neutral drop-shadow-lg text-stone-300 w-96 bg-gradient-to-br inline-block from-purple-900 to-orange-300 relative z-0">
            <div className="card-body items-left text-left">
                <div className="flex justify-between">
                    <h2 className="card-title drop-shadow-lg">{team.full_name}</h2>
                    <img
                        className="w-10 h-10 rounded-full drop-shadow-lg object-cover border-2 border-purple-900"
                        src={
                            import.meta.env.VITE_BASE_URL +
                            `${import.meta.env.VITE_BASE_PIC}${teamPicPath}`
                        }
                        alt="Team Profile"
                    />
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Rövid név:</p>
                    <p className="drop-shadow-lg">{`[ ${team.short_name} ]`}</p>
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-blue-200 font-extrabold">Csapat tagjai:</p>
                    <div>
                    <div>
                            <div className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1">
                                    <Link>
                                        {application.user1.usr_name}
                                        
                                            <svg
                                                className="inline-block ml-2 w-4 h-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 576 512"
                                                fill="currentColor"
                                            >
                                                <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
                                            </svg>
                                    </Link>
                                </div>

                                {
                                    (application.user2 != null)?(

                                        <div className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1">
                                        <Link>
                                            {application.user2.usr_name}
                                        </Link>
                                </div>

                                    ):(
                                        <></>
                                    )
                                }
                                {
                                    (application.user3 != null)?(

                                        <div className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1">
                                        <Link>
                                            {application.user3.usr_name}
                                        </Link>
                                </div>

                                    ):(
                                        <></>
                                    )
                                }
{
                                    (application.user4 != null)?(

                                        <div className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1">
                                        <Link>
                                            {application.user4.usr_name}
                                        </Link>
                                </div>

                                    ):(
                                        <></>
                                    )
                                }
{
                                    (application.user5 != null)?(

                                        <div className="drop-shadow-lg text-purple-800 hover:text-blue-200 flex items-center gap-1">
                                        <Link>
                                            {application.user5.usr_name}
                                        </Link>
                                </div>

                                    ):(
                                        <></>
                                    )
                                }
                        
                    </div>
                    </div>
                </div>
                <p className="text-center mb-3 mt-2 text-black">Jelentkezés leadva: <br/><b>{formatDateTime(application.dte)}</b></p>
                        <div className="flex flex-row justify-center gap-5">
                            
                            
                            
                            
                            {
                                (application.status == "pending")?
                                (
                                    <>
                                    <button onClick={()=>approve()} className="btn btn-success">Elfogad</button>
                                    <button onClick={()=>torles()} className="btn btn-error">Elutasít</button>
                                    </>
                            
                                ):
                                (
                                    <>
                                        <button onClick={()=>torles()} className="btn btn-error">Törlés</button>
                                    </>
                                )

                            }
                            
                        

                        </div>
                
            </div>
            

        </div>
  )
}

export default ApplicationCard