import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import InviteModal from "../../modals/InviteModal";


function UserSchema({ user }) {
    const navigate = useNavigate();
    const [userPicPath, setUserPicPath] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e")
    const { isAuthenticated, profile } = useContext(UserContext);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/user/userpic/${user.id}`)
            .then(res => res.json())
            .then(adatok => setUserPicPath(adatok))
            .catch(err => console.log(err));
    }, [user?.id]);


    //Ezzel teszteltem, hogy a backend végpontja által szolgáltatott elérési útja a képnek jó-e
    //.env fájlban: a 'VITE_BASE_PIC' változó tartalmazza az elérési út egy részét
    // console.log(import.meta.env.VITE_BASE_URL + `${import.meta.env.VITE_BASE_PIC}${userPicPath}`)


    return (
        <div className="card bg-neutral drop-shadow-lg text-white w-96 bg-gradient-to-br inline-block from-indigo-700 to-amber-700">
            <div className="card-body items-left text-left">
                <div className="flex justify-between">
                    <h2 className="card-title drop-shadow-lg">{user.usr_name}</h2>
                    <p className={`drop-shadow-lg font-extrabold ml-2 ${user.status == "inactive" || user.status == "banned" ? "text-red-500" : "text-green-500"}`}>
                        {user.status}
                    </p>
                    <img className="w-10 h-10 rounded-full drop-shadow-lg object-cover" src={import.meta.env.VITE_BASE_URL + `${import.meta.env.VITE_BASE_PIC}${userPicPath}`} alt={`${user.usr_name} profilképe`} title={`${user.usr_name} profilképe`} onClick={() => { navigate(`/profile/${user.usr_name}`); window.scroll(0, 0) }} />

                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    {
                        ((user.status == "inactive" || user.status == "banned") || user.inviteable === false)
                            ?
                            (<p className="drop-shadow-lg italic text-red-500">Nem fogad meghívót</p>)
                            :
                            (<p className="drop-shadow-lg italic text-green-500">Fogad meghívót</p>)
                    }
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2 break-words">
                    <p className="drop-shadow-lg text-yellow-400 font-semibold flex-none">Iskola:</p>
                    <p className="drop-shadow-lg ml-2 break-words ">{user.school}</p>
                </div>

                <div className="flex justify-evenly">
                    <p className="drop-shadow-lg text-yellow-400 font-semibold flex-none">Osztály:</p>
                    <p className="drop-shadow-lg ml-2">{user.clss}</p>
                </div>

                <div className="card-actions justify-start drop-shadow-lg border-t border-white my-2 pt-2">
                    {
                        ((user.status == "inactive" || user.inviteable === false)) ? (

                            <button className="btn btn-ghost" onClick={() => { navigate(`/profile/${user.usr_name}`); window.scroll(0, 0) }}>További adatok...</button>) :

                            (
                                <>
                                    <button className="btn btn-ghost" onClick={() => { navigate(`/profile/${user.usr_name}`); window.scroll(0, 0) }}>További adatok...</button>
                                    {
                                        (isAuthenticated && user.inviteable === true && user.usr_name != profile.usr_name) ?

                                            (
                                                <>
                                                    <button onClick={() => setModalOpen(true)} className="btn btn-primary">Meghívás csapatba</button>
                                                    <InviteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} user={user} />
                                                </>
                                            ) :
                                            (<p></p>)

                                    }

                                </>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default UserSchema