import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/logo.png';
import { toast } from 'react-toastify';

function Navbar() {
  // Állapotok a mobil és profil menü megnyitásához
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();


  const { logout, isAuthenticated, authStatus, update, pageRefresh, profile, uPicPath } = useContext(UserContext);

  useEffect(() => {

    authStatus()

  }, [isAuthenticated])

  useEffect(() => {

    //console.log("refreshed navbar")

    const interval = setInterval(() => {
      authStatus();
    }, 60000); // 1 percenként

    return () => clearInterval(interval);

  }, [isAuthenticated]);

  return (
    <div>
      <nav className="bg-gray-800 overflow-y-visible">
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

              <div className="hidden sm:ml-6 md:block">
                <div className="flex space-x-4">
                  <Link to="/" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Főoldal</Link>
                  {(isAuthenticated) && (
                    <Link to="/myteams" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapattagságaim</Link>
                  )}

                  <div className='dropdown [z-999]'>
                    <div tabIndex={0} role='button' className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>Keresők...</div>
                    <ul tabIndex={0} className='dropdown-content menu bg-slate-500 rounded-box z-[999] w-52 p-2 shadow-sm'>
                      <li><Link to="/player-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Játékos kereső</Link></li>
                      <li><Link to="/team-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapat kereső</Link></li>
                      <li><Link to="/tournament-search" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Verseny kereső</Link></li>
                      <li><Link to="/event-search" className="overflow-y-visible y-[999] rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Esemény kereső</Link></li>
                    </ul>

                  </div>

                </div>
              </div>
            </div>

            {(isAuthenticated) ? (

              <div className="dropdown dropdown-bottom dropdown-left">
                <div tabIndex={0} role="button">
                  {
                    (uPicPath != undefined) ? (
                      <img className="w-10 h-10 rounded-full object-cover" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${uPicPath}`} alt={profile.usr_name} />
                    ) :
                      (
                        <></>
                      )
                  }
                </div>
                <ul tabIndex={0} className="dropdown-content bg-slate-500 rounded-box z-[999] w-52 p-2 shadow-sm">
                  <p className='flex justify-center text-white font-bold pb-2'>{profile.usr_name}</p>
                  <li>
                    <Link to={`/profile/${profile.usr_name}`} onClick={() => { window.scroll(0, 0) }} className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">Profiladatok</Link>
                  </li>

                  {(isAuthenticated) && (
                    <li>   
                      <Link to="/myinvites" className="block rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Meghívóim</Link>
                    </li>
                  )}

                  {isAuthenticated && (
                    <li>
                      <Link to={`/profile/${profile.usr_name}#myteams`} onClick={() => { window.scroll(0, 0) }} className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                        Csapataim
                      </Link>
                    </li>
                  )}

                  {isAuthenticated && (
                    <li>
                      <Link to={`/newteam`} onClick={() => { window.scroll(0, 0) }} className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                        Új csapat létrehozása
                      </Link>
                    </li>
                  )}

                  {(isAuthenticated) && (
                    <li><button onClick={() => { toast.success("Kijelentkeztél! Oldalfrissítés 5 másodperc múlva!"); logout(); setTimeout(() => { navigate('/'); pageRefresh() }, 5000) }} className="block px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full text-start rounded-lg">Kijelentkezés</button></li>
                  )}
                </ul>
              </div>


            ) : (
              <div>
                <Link to="/register" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Regisztráció</Link>
                <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Bejelentkezés</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobil menü */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Link to="/" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">Főoldal</Link>
              {(isAuthenticated) && (
                <Link to="/myteams" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapattagságaim</Link>
              )}{(isAuthenticated) && (
                <Link to="/myinvites" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Meghívóim</Link>
              )}
              <Link to="/player-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Játékos kereső</Link>
              <Link to="/team-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapat kereső</Link>
              <Link to="/tournament-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Verseny kereső</Link>
              <Link to="/event-search" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Esemény kereső</Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
