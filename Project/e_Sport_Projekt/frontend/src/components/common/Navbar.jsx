import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useContext } from 'react';
import Logo from '../../assets/logo.png';

import { useState } from 'react';

function Navbar() {
  // Állapotok a mobil és profil menü megnyitásához
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { logout, isAuthenticated, authStatus, update } = useContext(UserContext);
  const token = sessionStorage.getItem('tokenU');

  

  return (
    <div>
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
                  <Link to="/player-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Játékos kereső</Link>
                  <Link to="/team-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapat kereső</Link>
                  <Link to="/contact" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Névjegy</Link>              
                </div>
              </div>
            </div>

            {(isAuthenticated || token) ? (
             
             /* Profil ikon */
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {/* Profil gomb és lenyíló menü */}
            <div className="relative ml-3">
              <button className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                <span className="sr-only">Open user menu</span>
                <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" alt="User Profile" />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700">Profiladatok</Link>
                  <Link to="/teams" className="block px-4 py-2 text-sm text-gray-700">Csapataim</Link>
                  { (isAuthenticated || token) && (
                    <button onClick={()=> {logout(token); sessionStorage.removeItem('tokenU'); navigate('/'); window.location.reload();}} className="block px-4 py-2 text-sm text-gray-700">Kijelentkezés</button>
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
              <Link to="/contact" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Névjegy</Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
