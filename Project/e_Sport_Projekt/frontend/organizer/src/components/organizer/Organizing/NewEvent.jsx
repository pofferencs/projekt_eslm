import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import OrganizerContext from "../../../context/OrganizerContext";
import { toast } from "react-toastify";

function NewEvent() {


  const {isAuthenticated, authStatus, profile} = useContext(OrganizerContext);
  const [isloading, setIsLoading] = useState(true);
  const [detailsNum, setDetailsNum] = useState(0);
  const navigate = useNavigate();
  const [dateData, setDateData] = useState({
    apn_start: "",
    apn_end: ""
    
  })


  useEffect(()=>{

    window.scroll(0,0)

    if(!isAuthenticated){
      navigate('/');
    }


  }, [isAuthenticated])




  const [formData, setFormData] = useState({
    name: "",
    place: "",
    details: "",
    ogr_id: profile.id
  });



  const dateFormat = (date) => {
    console.log(date);
  
    if (date != undefined) {
      const localDate = new Date(date); // Konvertálás Date objektummá
      const ev = localDate.getFullYear();
      const honap = String(localDate.getMonth() + 1).padStart(2, '0'); // Hónap 0-alapú
      const nap = String(localDate.getDate()).padStart(2, '0');
      const ora = String(localDate.getHours()).padStart(2, '0');
      const perc = String(localDate.getMinutes()).padStart(2, '0');
  
      return `${ev}-${honap}-${nap}T${ora}:${perc}`;
    } else {
      return ``;
    }
  };


  const kuldes = (method, formData) => {

    fetch(`${import.meta.env.VITE_BASE_URL}/insert/event`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        details: formData.details,
        end_date: dateData.end_date,
        name: formData.name,
        place: formData.place,
        start_date: dateData.start_date,
        ogr_id: profile.id
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {

          toast.error(data.message);
        } else {
          toast.success(data.message);
          authStatus();
          navigate('/');
          

        }

      }).catch(err => alert(err));

  };


  const onSubmit = (e) => {
    e.preventDefault();
    kuldes('POST', formData);
  };

  const writeData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };


  const handleInput = () => {
    const textarea = document.getElementById('details');
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setDetailsNum(textarea.value.length)

  };


  return (
    <>
    
            <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                    <div className="card-body">
                    <div className="flex justify-center pb-8 gap-10">
                          <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}/event/event_0.png`} />
                          <div className="card-title">
                            <div className="pl-14">
                              <p className="text-3xl pb-2 text-indigo-500 font-bold">{"Esemény felvitele"}</p>
                              
                            </div>
                          </div>
                        </div>


                    <form onSubmit={onSubmit}>
                      <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                        <div className="p-8 md:p-10">
                        
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                            <div key={'name'}>
                              <label className="block text-sm font-medium text-white">
                                Név(*)
                              </label>
                              <input id="name" type="text" onChange={writeData} value={formData.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'place'}>
                              <label className="block text-sm font-medium text-white">
                                Hely(*)
                              </label>
                              <input id="place" onChange={writeData} type="text" value={formData.place} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'start_date'}>
                              <label className="block text-sm font-medium text-white">
                                Kezdés(*)
                              </label>
                              <input id="start_date" onChange={(time)=> {
                                setDateData((prevState) => ({
                                  ...prevState,
                                  start_date: time.target.value,}));}
                                }
                               type="datetime-local" value={dateFormat(dateData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'end_date'}>
                              <label className="block text-sm font-medium text-white">
                                Vége(*)
                              </label>
                              <input id="end_date" onChange={(time)=> {
                                setDateData((prevState) => ({
                                  ...prevState,
                                  end_date: time.target.value,}));}
                                
                                } type="datetime-local" value={dateFormat(dateData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-white">
                                Szervező(*)
                              </label>
                              <input type="text" disabled value={profile.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                            </div>

                          </div>
                          <div key={'details'} className="mt-6">
                              <label className="block text-sm font-medium text-white">
                                {`Leírás (${detailsNum}/512)`}
                              </label>
                              <textarea maxLength={512} onInput={handleInput} id="details" type="text" onChange={writeData} value={formData.details} className="mt-1 block w-full h-auto hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>
                        </div>
                        <div className="flex flex-row justify-center">
                          <button className="btn mt-3 text-white w-32 m-5" type="submit">Létrehozás</button>
                        </div>
                        
                      </div>
                    </form>
                      


                    </div>
                    

                  </div>
                  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    </>
  )
}

export default NewEvent