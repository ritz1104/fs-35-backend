import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createChannelAsync } from "../../features/channelSlice";
import { createServerAsync } from "../../features/serverSlice";

function CreateModal({ kind, serverId, close }) {
  const dispatch = useDispatch();
  const isServer = kind === "server";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(kind === "voice" ? "voice" : "text");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError(`${isServer ? "Server" : "Channel"} name is required`);
      return;
    }
    try {
      if (isServer) {
        await dispatch(createServerAsync({ name: cleanName, description: description.trim() })).unwrap();
      } else {
        await dispatch(createChannelAsync({ serverId, name: cleanName, type })).unwrap();
      }
      close();
    } catch (requestError) {
      setError(requestError || `Unable to create ${isServer ? "server" : "channel"}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <form className="creation-modal" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <div className="creation-modal-head">
          <div><span className="creation-kicker">VYNQ WORKSPACE</span><h2>{isServer ? "Create a server" : "Create a channel"}</h2></div>
          <button type="button" className="modal-close" title="Close" onClick={close}><X size={18} /></button>
        </div>
        <label>
          {isServer ? "Server name" : "Channel name"}
          <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder={isServer ? "e.g. Design Club" : "e.g. ideas"} />
        </label>
        {isServer ? (
          <label>Description <span className="optional">Optional</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this community about?" rows="3" /></label>
        ) : (
          <label>Channel type<select value={type} onChange={(event) => setType(event.target.value)}><option value="text">Text</option><option value="voice">Voice</option></select></label>
        )}
        {error && <p className="creation-error">{error}</p>}
        <div className="creation-actions"><button type="button" className="cancel-button" onClick={close}>Cancel</button><button type="submit" className="primary-button">Create {isServer ? "server" : "channel"}</button></div>
      </form>
    </div>
  );
}

export default CreateModal;