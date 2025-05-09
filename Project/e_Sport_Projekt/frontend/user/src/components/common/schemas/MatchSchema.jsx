import { useEffect } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";


function MatchSchema({match}) {


    const [team1, setTeam1] = useState(match.application1);
    const [team2, setTeam2] = useState(match.application2);
    const [isLoading, setIsLoading] = useState(true);
    const [team1Pic, setTeam1Pics] = useState("");
    const [team2Pic, setTeam2Pics] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        setIsLoading(true);

        teamPics1Fetch();
        teamPics2Fetch();

        setIsLoading(false);

    },[isLoading]);

  
    const teamPics1Fetch = () =>{
        
            fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${match.application1.team.id}`)
                .then(res => res.json())
                .then(pic => {
                    setTeam1Pics(pic);
                })
                .catch(error => console.log(error));

        
        
    };

    const teamPics2Fetch = () =>{
        
        fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${match.application2.team.id}`)
            .then(res => res.json())
            .then(pic => {
                setTeam2Pics(pic);
            })
            .catch(error => console.log(error));
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
    <div className="w-full rounded-xl py-16 bg-gradient-to-br from-purple-900 to-orange-300">
        <div className="">
            <div className="grid grid-rows-1 grid-cols-5 gap-4 justify-items-center items-center p-5">
        
                <div className="row-span-2">
                    <img className="w-32" src={
                            import.meta.env.VITE_BASE_URL +
                            `${import.meta.env.VITE_BASE_PIC}${team1Pic}`
                        }/>
                </div>

                <div className="text-center">
                    <div className="font-bold">
                        {match.application1.team.full_name}
                    </div>
                    <div className="text-center font-bold">
                        [{match.application1.team.short_name}]
                    </div>
                    
                </div>

                <div className="row-span-2 p-2">

                    <div className="text-center">
                        {
                            (match.rslt!=null)?(
                                <p className="text-3xl">{match.rslt}</p>
                            ):(
                                <p className="text-lg font-bold">Nincs még eredmény.</p>
                            )
                        }
                    </div>

                    <div className="text-center">
                        <p className="">{formatDateTime(match.dte)}</p>
                        
                    </div>

                    <div className="text-center">
                        <button className="btn mt-5 bg-indigo-600 hover:bg-indigo-800 border-none text-white" onClick={()=> {navigate(`/match/${match.id}`)}}>További adatok</button>
                        
                    </div>
                
                </div>

                <div className="text-center">
                    <div className="font-bold">
                        {match.application2.team.full_name}
                    </div>
                    <div className="text-center font-bold">
                        [{match.application2.team.short_name}]
                    </div>
                    
                </div>

                <div className="row-span-2">
                    <img className="w-32" src={
                            import.meta.env.VITE_BASE_URL +
                            `${import.meta.env.VITE_BASE_PIC}${team2Pic}`
                        }/>
                </div>
            
            </div>
        </div>
    </div>
  )
}

export default MatchSchema