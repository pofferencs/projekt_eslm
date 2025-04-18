import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";


function UserProfile() {

  const { name } = useParams();
  const { logout, isAuthenticated, authStatus, update, pageRefresh, profile } = useContext(UserContext);
  const [profileAdat, setProfileAdat] = useState({});
  const navigate = useNavigate();

  const [userPicPath, setUserPicPath] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e")

  useEffect(() => {
    if (!profile?.id) return;

    fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${profile.id}`)
      .then(res => res.json())
      .then(adatok => setUserPicPath(adatok))
      .catch(err => console.log(err));
  }, [profile?.id]);

  useEffect(() => {

    if (isAuthenticated) {

      if (name != undefined) {
        fetch(`${import.meta.env.VITE_BASE_URL}/user/userprofilesearch/${name}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(adat => {
            console.log(adat);
            if (!adat.message) {
              setProfileAdat(adat[0]);
            } else {
              navigate('/')
            }
          })
          .catch(err => alert(err));
      }

    } else {
      //navigate('/');
    }

    console.log(profileAdat)

  }, [isAuthenticated]);

  const dateFormat = (date) => {

    if (date != undefined) {
      const [ev, honap, nap] = date.split('T')[0].split('-')

      return `${ev}. ${honap}. ${nap}.`;
    } else {
      return "";
    }

  }
  return (

    <div className="bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex items-center justify-center p-4">
      <div className="font-std mb-10 w-full rounded-2xl bg-gray-800 p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
        <div className="justify justify-center">

          <div>
            <div className="md:w-1/3 text-center mb-8 md:mb-0">
              <img src={import.meta.env.VITE_BASE_URL + `${import.meta.env.VITE_BASE_PIC}${userPicPath}`} alt={`${profileAdat.usr_name} profilképe`} title={`${profileAdat.usr_name} profilképe`} className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 transition-transform duration-300 hover:scale-105 ring ring-gray-300" />
              <button className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300">Szerkesztés</button>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <p className="text-slate-400">
                Felhasználónév
              </p>
              <h1 className="text-2xl font-bold  text-indigo-400 mb-5 ml-7">{profileAdat.usr_name}</h1>

              <p className="text-slate-400">
                Teljes név
              </p>
              <h2 className="text-xl italic font-bold text-indigo-400  ml-7 mb-5 ">{profileAdat.full_name}</h2>

              <p className="text-slate-400">
                Meghívhatóság
              </p>
              {
                (profile.status == "inactive" || profile.inviteable === false)
                  ?
                  (<p className="drop-shadow-lg italic text-red-500  mb-5 ml-7">Nem fogad meghívót</p>)
                  :
                  (<p className="drop-shadow-lg italic text-green-500  mb-5 ml-7">Fogad meghívót</p>)

              }

              <p className="text-slate-400">
                Iskola
              </p>
              <h2 className="text-xl italic font-bold text-indigo-400  ml-7 mb-5 ">{profileAdat.school}</h2>


              <p className="text-slate-400">
                Osztály
              </p>
              <h2 className="text-xl italic font-bold text-indigo-400  ml-7 mb-5 ">{profileAdat.clss}</h2>

              <p className="text-slate-400">
                Születési dátum
              </p>
              <h2 className="text-xl italic font-bold text-indigo-400  ml-7 mb-5 ">{dateFormat(profileAdat.date_of_birth)}</h2>

              <h2 className="text-xl font-semibold text-indigo-200 mb-4">Contact Information</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 " viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {profileAdat.email_address}
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {profileAdat.phone_num}
                </li>
              </ul>
            </div>
          </div>



        </div>

      </div>
    </div>
  )
}

export default UserProfile