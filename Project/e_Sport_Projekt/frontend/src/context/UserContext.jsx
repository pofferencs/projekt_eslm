import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const UserContext = createContext();

export const UserProvider = ({children})=>{

  const [refresh, setRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState([]);
  

  
  const authStatus = async () =>{

    await fetch(`${import.meta.env.VITE_BASE_URL}/user/auth`,{
      method: 'GET',
      credentials: 'include',
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=> res.json())
    .then(auth=>{
      if(auth.authenticated){
        
        setProfile(auth.user);
        setIsAuthenticated(true);
        update();
    
        
      } else {

        setIsAuthenticated(false);
        update();
        
      }
      
    })
    .catch(err=>{alert(err);setIsAuthenticated(false); update();});
   
    
    
  }

  useEffect(()=>{
    authStatus()
    
    
  },[])

  const update = ()=>{
    setRefresh(prev=>!prev);
  }

  const logout = async () =>{
   
    await fetch(`${import.meta.env.VITE_BASE_URL}/user/logout`,{
     method: 'POST',
     credentials: 'include',
     headers: {
      "Content-Type": "application/json"
     } 
    })
    .then(res=>{
      if(!res.ok){
        console.log('Hiba: ', res.statusText);
      }
      return res.json();
    })
    .then(data=> {console.log(data);setIsAuthenticated(false); update(); toast.success(data.message);})
    .catch(err=>{alert(err)});
  }


  const login = async (formData, method) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/user/login`, {
      method: method,
      credentials: 'include',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(token => {
        if (!token.message) {
          sessionStorage.setItem('tokenU', token);
          authStatus();
          toast.success('Sikeres belépés!');
          
          
        } else {
          toast.error(token.message);
        }
      })
      .catch(err => alert(err));

  }

  const pageRefresh = () =>{
    window.location.reload();
  }



  return<UserContext.Provider value={{
    refresh,
    update,
    logout,
    authStatus,
    isAuthenticated,
    login,
    pageRefresh,
    profile
  }}>{children}</UserContext.Provider>
}

export default UserContext;