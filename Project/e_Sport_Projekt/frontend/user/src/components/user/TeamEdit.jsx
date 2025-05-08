import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext"
import { toast } from "react-toastify";
import DeleteModal from "../modals/DeleteModal";


function TeamEdit() {

  const navigate = useNavigate()

  const { isAuthenticated, isLoading, setIsLoading, profile } = useContext(UserContext);

  const [teamData, setTeamData] = useState({})
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamPicPath, setTeamPicPath] = useState("");
  const [teamPicId, setTeamPicId] = useState(null);
  const { id } = useParams();
  const [isFormTeam, setIsFormTeam] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [tpFile, setTpFile] = useState({});

  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedMember_user_name, setSelectedMember_user_name] = useState("");

  // Modal-ök
  const [showModalTeamDelete, setShowModalTeamDelete] = useState(false);
  const [showModalKick, setShowModalKick] = useState(false);
  const [showModalLeave, setShowModalLeave] = useState(false);

  // regex, hogy a picPath-ből kinyerjük az id-t
  const regex = /_(\d+)_/;

  const handleLeaveTeam = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/delete/teammembership`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: profile.id,
          user_name: profile.full_name,
          team_id: teamFormData.id,
          team_name: teamFormData.full_name,
          profileId: profile.id
          // user_id, user_name, team_id, team_name, profileId
        }),
      });

      if (!res.ok) {
        toast.error(res.message || "Nem sikerült kilépni a csapatból.looool");
        setShowModalLeave(false);
      } else {        
        toast.success(res.message || "Sikeresen kiléptél a csapatból!");
        setShowModalLeave(false);
      }
    } catch (err) {
      console.error("Kilépési hiba:", err);
      toast.error("Hiba történt a kilépés során.");
    }
  };

  let teamFormObj = {
    id: teamData.id,
    full_name: "",
    short_name: "",
    creator_id: "",
  }

  const [teamFormData, setTeamFormData] = useState(teamFormObj);

  const teamFormReset = () => {
    setTeamFormData({
      id: teamData?.team?.id ?? "",
      full_name: teamData?.team?.full_name ?? "",
      short_name: teamData?.team?.short_name ?? "",
      creator_id: teamData?.captain?.id ?? ""
    });
  }

  useEffect(() => {

    if (!isAuthenticated) {
      navigate('/')
    }

    fetch(`${import.meta.env.VITE_BASE_URL}/list/teamsearchbyid/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(adat => {
        if (!adat.message) {
          setTeamData(adat);
          setTeamFormData({
            id: adat.team.id,
            full_name: adat.team.full_name,
            short_name: adat.team.short_name,
            creator_id: adat.captain.id
          });
          fetch(`${import.meta.env.VITE_BASE_URL}/list/teampic/${id}`,)
            .then(res => res.json())
            .then(pic => {
              setTeamPicPath(pic);
              const match = regex.exec(pic);
              if (match) {
                console.log("Kép ID regex alapján:", match[1]);
                setTeamPicId(match[1]);
              } else {
                console.log("Nem talált ID-t, alapértelmezett xy.");
                setTeamPicId(2);
              }
            })
            .catch(error => { console.log(error) })


          fetch(`${import.meta.env.VITE_BASE_URL}/list/team/${id}/members`)
            .then(res => res.json())
            .then(data => setTeamMembers(data)) //, console.log(teamMembers)
            .catch(error => console.log(error));

        } else {
          navigate('/')
        }
      })
      .catch(err => toast(err))
      .finally(() => setIsLoading(false))



  }, [isAuthenticated, id])

  const isCreator = profile?.id === teamFormData?.creator_id;

  const teamModify = (method) => {
    const sendingObj = {
      id: teamFormData.id,
      full_name: teamFormData.full_name,
      short_name: teamFormData.short_name,
      creator_id: teamFormData.creator_id,
      profileId: profile.id
    };

    fetch(`${import.meta.env.VITE_BASE_URL}/update/team`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(sendingObj)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          setIsFormTeam(false);
          navigate('/myteams', window.scroll(0, 0))
        }
      })
      .catch(err => alert(err));
  };

  const onSubmitTeam = (e) => {
    e.preventDefault();
    teamModify("PATCH");
  }

  const writeDataTeam = (e) => {
    setTeamFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const sendImage = async (file, type, id) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type); // pl. 'user'
    formData.append("id", id);     // pl. 0

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/insert/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        // Ha a fájl túl nagy (413), vagy más hiba van
        const errorMsg = data?.error || data?.message || "Ismeretlen hiba történt a feltöltés során.";

        if (res.status === 413) {
          toast.error("Túl nagy fájl: Maximum 2 MB és 512x512 felbontás engedélyezett.");
        } else {
          toast.error(errorMsg);
        }
      } else {
        toast.success(data.message || "Feltöltés sikeres!");
      }
    } catch (error) {
      toast.error("Hiba a kép feltöltése során: " + error.message);
    }
  };

  const deleteImage = async (id, type) => {

    fetch(`${import.meta.env.VITE_BASE_URL}/delete/picture`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ id: id, type: type })
    })
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Hiba történt");
        } else {
          toast.success(data.message);
        }
      })
      .catch(err => alert(err));
  };



  const kickPlayer = (method) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/delete/teammembership`, {
      method: method,
      headers: { "Content-type": "application/json" },
      // user_id, user_name, team_id, team_name, profileId
      body: JSON.stringify({
        user_id: selectedMemberId,
        team_id: teamFormData.id,
        profileId: -1,
        user_name: selectedMember_user_name
      })
    })
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Hiba történt");          
          setShowModalKick(false)
        } else {
          setShowModalKick(false)
          toast.success(data.message);
        }
      })
      .catch(err => alert(err));
  }

  const deleteTeam = (method) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/delete/team`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        id: teamFormData.id,
        picture_id: teamPicId,
        user_id: profile.id
      })
    })
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Hiba történt, csak akkor törölhetsz csapatot, ha már csak te vagy benne és nem veszel részt versenyen!");
          setShowModalTeamDelete(false)
        } else {
          setShowModalTeamDelete(false)
          toast.success(data.message);
        }
      })
      .catch(err => alert(err));
    setTimeout(() => {
      navigate("/myteams");
    }, 1500);
  }
  const onSubmitDelete = () => {
    deleteTeam("DELETE");
  }

  const onSubmitKick = (e) => {
    e.preventDefault();
    kickPlayer("DELETE");
  }

  return (
    isLoading ? (
      <>Töltés...</>
    ) : (
      <div>
        {!isFormTeam ? (
          <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
            <div className="card-body">
              <div className="flex justify-center pb-8 gap-10">
                <img
                  className="w-56 h-56"
                  src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${teamPicPath}`}
                  alt={`${teamFormData.full_name} csapat profilképe`}
                  title={`${teamFormData.full_name} profilképe`}
                />
                <div className="card-title">
                  <div className="pl-14">
                    <p className="text-3xl pb-2 text-white">{teamFormData.full_name}</p>
                    <p className="text-xl pb-2 text-gray-400">{`[${teamFormData.short_name}]`}</p>
                    <div className="flex flex-col">
                      {isCreator ? (
                        <>
                          <button
                            className="btn mt-3 text-white w-52"
                            onClick={() => {
                              setIsFormTeam(true);
                              setDisabled(false);
                            }}
                          >
                            Adatok módosítása
                          </button>
                          {/* <button
                            className="btn mt-3 bg-red-800 text-white"
                            onClick={()=>setShowModalTeamDelete(true)}
                          >
                            Csapat törlése
                          </button>
                          <DeleteModal
                            show={showModalTeamDelete}
                            onClose={() => setShowModalTeamDelete(false)}
                            onConfirm={onSubmitDelete}
                            question={"Biztosan ki akarod törölni a csapatot?"}
                            yes={"Igen, törlöm"}
                          /> */}
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => setShowModalLeave(true)}
                        >
                          Kilépés
                        </button>
                      )}
                      <DeleteModal
                        show={showModalLeave}
                        onClose={() => setShowModalLeave(false)}
                        onConfirm={handleLeaveTeam}
                        question={"Biztosan ki akarsz a csapatból?"}
                        yes={"Igen, kilépek"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white">Csapatnév</label>
                    <input
                      id="full_name"
                      type="text"
                      maxLength={16}
                      disabled
                      value={teamFormData.full_name}
                      className="mt-1 block w-full px-3 py-2.5 border rounded-lg bg-gray-700 border-gray-600 text-white shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white">Csapat rövid neve</label>
                    <input
                      id="short_name"
                      type="text"
                      maxLength={4}
                      disabled
                      value={teamFormData.short_name}
                      className="mt-1 block w-full px-3 py-2.5 border rounded-lg bg-gray-700 border-gray-600 text-white shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
            <div className="card-body">
              <div className="flex justify-center pb-8 gap-10">
                <img
                  className="w-56 h-56"
                  src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${teamPicPath}`}
                  alt={`${teamFormData.full_name} csapat profilképe`}
                  title={`${teamFormData.full_name} profilképe`}
                />
                <div className="card-title">
                  <div className="pl-14">
                    <p className="text-3xl pb-2 text-white">{teamFormData.full_name}</p>
                    <p className="text-xl pb-2 text-gray-400">{`[${teamFormData.short_name}]`}</p>

                    <form onSubmit={onSubmitTeam}>
                      <div className="flex flex-wrap gap-2">
                        <button className="btn mt-3 text-white" type="submit">
                          Módosítás
                        </button>
                        <button
                          className="btn mt-3 text-white"
                          type="button"
                          onClick={() => deleteImage(teamData.team.id, "team")}
                        >
                          Fénykép törlés
                        </button>
                        <button
                          className="btn mt-3 text-white"
                          type="button"
                          onClick={() => {
                            setIsFormTeam(false);
                            setDisabled(true);
                            teamFormReset();
                          }}
                        >
                          Mégse
                        </button>
                      </div>
                    </form>

                    <form encType="multipart/form-data">
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-white" htmlFor="image">
                          Fénykép cseréje
                        </label>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                toast.error("A kiválasztott fájl túl nagy. Legfeljebb 2 MB lehet.");
                                return;
                              }

                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const img = new Image();
                                img.onload = () => {
                                  if (img.width > 512 || img.height > 512) {
                                    toast.error("A kép túl nagy felbontású. Maximum 512x512 engedélyezett.");
                                  } else {
                                    setTpFile(file);
                                  }
                                };
                                img.src = event.target.result;
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-1"
                        />
                        <button
                          className="btn mt-3 text-white"
                          type="button"
                          onClick={() => sendImage(tpFile, "team", teamFormData.id)}
                        >
                          Feltöltés
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white">Csapatnév</label>
                    <input
                      id="full_name"
                      type="text"
                      maxLength={16}
                      disabled={disabled}
                      onChange={writeDataTeam}
                      value={teamFormData.full_name}
                      className="mt-1 block w-full px-3 py-2.5 border rounded-lg bg-gray-700 border-gray-600 text-white shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white">Csapat rövid neve</label>
                    <input
                      id="short_name"
                      type="text"
                      maxLength={4}
                      disabled={disabled}
                      onChange={writeDataTeam}
                      value={teamFormData.short_name}
                      className="mt-1 block w-full px-3 py-2.5 border rounded-lg bg-gray-700 border-gray-600 text-white shadow-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white">Új csapatkapitány</label>
                    <select
                      value={teamFormData.creator_id}
                      onChange={(e) =>
                        setTeamFormData({ ...teamFormData, creator_id: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2.5 border rounded-lg bg-gray-700 border-gray-600 text-gray-400 shadow-sm"
                    >
                      <option value="">Válassz csapattagot...</option>
                      {teamMembers
                        .filter((member) => member.id !== teamData.captain.id)
                        .map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.usr_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white">Kirúgni kívánt játékos</label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => {const value = e.target.value; setSelectedMemberId(value); const name = e.target.selectedOptions[0].getAttribute("data-usr_name"); setSelectedMember_user_name(name)}}
                      className="mt-1 block w-full px-3 py-2.5 border rounded-lg bg-gray-700 border-gray-600 text-gray-400 shadow-sm"
                    >
                      <option value="">Válassz egy játékost...</option>
                      {teamMembers
                        .filter((member) => member.id !== teamData.captain.id)
                        .map((member) => (
                          <option key={member.id} value={member.id} data-usr_name={member.usr_name}>
                            {member.usr_name}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={()=>setShowModalKick(true)}
                      disabled={!selectedMemberId}
                      className={`btn mt-3 ${!selectedMemberId ? "hidden" : "bg-red-500 text-white"}`}
                    >
                      Kirúgás
                    </button>
                    <DeleteModal
                        show={showModalKick}
                        onClose={() => setShowModalKick(false)}
                        onConfirm={onSubmitKick}
                        question={`Biztosan ki akarod rúgni "${selectedMember_user_name}"-t a csapatotból?`}
                        yes={"Igen, repülhet"}
                      />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );


}

export default TeamEdit