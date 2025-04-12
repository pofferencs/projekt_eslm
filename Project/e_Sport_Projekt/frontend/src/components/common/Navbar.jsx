import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useContext, useEffect } from 'react';
import Logo from '../../assets/logo.png';

import { useState } from 'react';
import { toast } from 'react-toastify';

function Navbar() {
  // Állapotok a mobil és profil menü megnyitásához
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [picPath, setPicPath] = useState("");
  const navigate = useNavigate();
   

  const { logout, isAuthenticated, authStatus, update, pageRefresh, profile } = useContext(UserContext);
  const token = sessionStorage.getItem('tokenU');
  
  useEffect(()=>{

    authStatus()
    
    if(isAuthenticated === false) return;

    const interval = setInterval(()=>{
      console.log(isAuthenticated)
      authStatus()
      //console.log(isAuthenticated)
    }, 5000) //egyperces vizsgálat
      
    return ()=> clearInterval(interval);
    

  },[isAuthenticated])

  useEffect(()=>{

    fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${profile.id}`)
            .then(res => res.json())
            .then(adat => setPicPath(adat))
            .catch(err => {console.log(err)});
    console.log("refreshed navbar")
  },[isAuthenticated])


  return (
    <div>
      {/* <ToastContainer /> */}
      {/* Fő navigációs sáv */}
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobil menü gomb */}
            <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {/* Menü ikon, állapot alapján változik */}
                {mobileMenuOpen ? (
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>

            {/* Logó és menüelemek */}
            <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
              <div className="flex shrink-0 items-center">
                <img className="h-12 w-auto" src={Logo} alt="Your Company" />
              </div>
              {/* Asztali nézetben látható menüpontok */}
              <div className="hidden sm:ml-6 md:block">
                <div className="flex space-x-4">
                  <Link to="/" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Főoldal</Link>
                  <Link to="/events" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Események</Link>

                <div className='dropdown dropdown-start'>
                  <div tabIndex={0} role='button' className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>Keresők...</div>
                  <ul tabIndex={0} className='dropdown-content menu bg-slate-500 rounded-box z-1 w-52 p-2 shadow-sm'>

                  {
                  (isAuthenticated)?(
                    <li><Link to="/player-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Játékos kereső</Link></li>
                  ):
                  (<></>)
                }
                  
                  <li><Link to="/team-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapat kereső</Link></li>
                  <li><Link to="/tournament-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Verseny kereső</Link></li>
                  <li><Link to="/event-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Esemény kereső</Link></li>
                  </ul>
                  </div>

                  <Link to="/contact" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Névjegy</Link>
                </div>
              </div>


            </div>

            {(isAuthenticated || !(token==null)) ? (

              /* Profil ikon */
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/* Profil gomb és lenyíló menü */}
                <div className="relative ml-3">
                  <button className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                    <span className="sr-only">Open user menu</span>
                    {
                      (picPath != undefined)? (
                        <img className="w-10 h-10 rounded-full object-cover" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={profile.usr_name} />
                      ):
                      (
                        <></>
                      )
                    }
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                      <p className='flex justify-center text-black font-bold'>{profile.usr_name}</p>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700">Profiladatok</Link>
                      <Link to="/teams" className="block px-4 py-2 text-sm text-gray-700">Csapataim</Link>
                      {(isAuthenticated || token) && (
                        <button onClick={() => { toast.success("Kijelentkeztél! Oldalfrissítés 5 másodperc múlva!"); logout(); setTimeout(()=>{navigate('/'); pageRefresh()},5000) }} className="block px-4 py-2 text-sm text-gray-700">Kijelentkezés</button>
                      )}

                    </div>
                  )}
                </div>
              </div>

            ) : (
              <div>
                <Link to="/register" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Regisztráció</Link>
                <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Bejelentkezés</Link>
              </div>
            )



            }

          </div>
        </div>

        {/* Mobil menü, ha nyitva van */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Link to="/" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">Főoldal </Link>
              <Link to="/events" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Események</Link>
              <Link to="/player-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Játékos kereső</Link>
              <Link to="/team-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapat kereső</Link>

              <Link to="/tournament-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Meccs kereső</Link>
              <Link to="/event-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Esemény   kereső</Link>
              <Link to="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Névjegy</Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
