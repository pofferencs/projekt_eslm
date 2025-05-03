import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const OrganizerContext = createContext();

export const OrganizerProvider = ({children})=>{

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [oPicPath, setOPicPath] = useState("");


  const authStatus = async () =>{

    await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/auth`,{
      method: 'GET',
      credentials: 'include',
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=> res.json())
    .then(auth=>{
      if(auth.authenticated){


        fetch(`${import.meta.env.VITE_BASE_URL}/organizer/organizerpic/${profile.id}`,
        )
            .then(res => res.json())
            .then(adat => {setOPicPath(adat);})
            .catch(err => {console.log(err)});

        setProfile(auth.organizer);
        setIsAuthenticated(true);
        setIsLoading(false);
        update();
        
    
        
      } else {
        
        setIsAuthenticated(false);
        setIsLoading(false);
        logout();
        update();
       
      }
      
      
    })
    .catch(err=>{console.log(err); setIsAuthenticated(false); setIsLoading(false); logout(); update();});
   
    
    
  }

  const update = ()=>{
    setRefresh(prev=>!prev);
  }

  const logout = async () =>{
   
    await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/logout`,{
     method: 'POST',
     credentials: 'include',
     headers: {
      "Content-Type": "application/json"
     } 
    })
    .then(res=>{
      
      return res.json();
    })
    .then(data=> {setIsAuthenticated(false); setIsLoading(false); update(); })
    .catch(err=>{alert(err)});
  }


  const login = async (formData, method) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/login`, {
      method: method,
      credentials: 'include',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(token => {
        if (!token.message) {
          toast.success('Sikeres belépés! Oldalfrissítés 5 másodperc múlva!');
          setTimeout(()=>{navigate('/'); pageRefresh()},5000)
          
        } else {
          toast.error(token.message);
        }
      })
      .catch(err => alert(err));

  }

  const pageRefresh = () =>{
    window.location.reload();
    window.scroll(0,0);
  }



  return<OrganizerContext.Provider value={{
    refresh,
    update,
    logout,
    authStatus,
    isAuthenticated,
    login,
    pageRefresh,
    profile,
    isLoading,
    setIsLoading,
    oPicPath,
    setOPicPath,
    
  }}>{children}</OrganizerContext.Provider>
}

export default OrganizerContext;