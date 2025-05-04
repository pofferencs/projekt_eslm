import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowUp } from "react-icons/fa";

function TeamEdit() {
  const { state } = useLocation(); // Get passed team data
  const navigate = useNavigate();

  const [isModify, setIsModify] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [shortName, setShortName] = useState("");
  const [members, setMembers] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (state && state.team) {
      const { team } = state;
      setTeamName(team.name);
      setShortName(team.shortName);
      setMembers(team.members);
    }
  }, [state]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));  // Preview the image
      // You can handle the file upload here
    }
  };

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handlePromote = (id) => {
    const member = members.find((m) => m.id === id);
    const others = members.filter((m) => m.id !== id);
    setMembers([member, ...others]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("teamName", teamName);
    formData.append("shortName", shortName);
    formData.append("members", JSON.stringify(members));
    if (image) {
      formData.append("image", image);  // Add the image file
    }

    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log("Response:", result);
      // Handle response (e.g., navigate back or show a success message)
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-neutral rounded-xl shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-4">Edit Team Details</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          disabled={!isModify}
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1">Short Name</label>
        <input
          type="text"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          disabled={!isModify}
          className="input input-bordered w-full"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Manage Team Members</h2>
      <ul className="space-y-2 mb-6">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center bg-base-200 px-4 py-2 rounded"
          >
            <span>{member.name}</span>
            {isModify && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(member.id)}
                  className="text-red-500 hover:text-red-300"
                >
                  <FaTrashAlt />
                </button>
                <button
                  onClick={() => handlePromote(member.id)}
                  className="text-green-400 hover:text-green-300"
                >
                  <FaArrowUp />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {isModify && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Team Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="input input-bordered w-full"
          />
          {image && <img src={image} alt="Preview" className="mt-4 max-w-xs" />}
        </div>
      )}

      <div className="flex justify-end gap-3">
        {isModify ? (
          <>
            <button onClick={handleSave} className="btn btn-success">
              Save Changes
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-outline btn-error">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsModify(true)} className="btn btn-primary">
            Start Editing
          </button>
        )}
      </div>
    </div>
  );
}

export default TeamEdit;
