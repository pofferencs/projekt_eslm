import { createContext, useEffect, useState } from "react"

const UserContext = createContext();

export const UserProvider = ({children})=>{

  const [refresh, setRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(false);
 

  const profileGet = () =>{

    fetch(`${import.meta.env.VITE_BASE_URL}/user/auth`,{
      method: 'GET',
      credentials: 'include',
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=> {res.json()})
    .then(adat=>setProfile(adat.authenticated))
    .catch(err=>{alert(err)});
  }


  const authStatus = () =>{

    
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('tokenU='));
    console.log({token: token})
    

    if (!token) {
      // sessionStorage.removeItem('tokenU');
      setIsAuthenticated(false);  // Ha a süti nem található, töröljük az autentikációs állapotot
    }

    fetch(`${import.meta.env.VITE_BASE_URL}/user/auth`,{
      method: 'GET',
      credentials: 'include',
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=> res.json())
    .then(auth=>{
      if(auth.authenticated){
        
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

  const logout = () =>{
   
    fetch(`${import.meta.env.VITE_BASE_URL}/user/logout`,{
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
    .then(data=> {console.log('Kijelentkezve', data);setIsAuthenticated(false); update(); pageRefresh()})
    .catch(err=>{alert(err)});

  }

  const login = (formData, method) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/user/login`, {
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
          pageRefresh();
        } else {
          alert(token.message);
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
    profileGet
  }}>{children}</UserContext.Provider>
}

export default UserContext;