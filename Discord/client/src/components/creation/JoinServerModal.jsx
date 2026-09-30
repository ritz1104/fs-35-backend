import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { joinServerAsync } from "../../features/serverSlice";

function JoinServerModal({ close }) {
  const dispatch = useDispatch();
  const [requestError, setRequestError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const submit = async ({ inviteCode }) => {
    try {
      setRequestError("");
      await dispatch(joinServerAsync(inviteCode.trim())).unwrap();
      close();
    } catch (error) {
      setRequestError(error || "Unable to join server");
    }
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <form className="creation-modal" onSubmit={handleSubmit(submit)} onClick={(event) => event.stopPropagation()} noValidate>
        <div className="creation-modal-head">
          <div><span className="creation-kicker">JOIN A COMMUNITY</span><h2>Join a server</h2></div>
          <button type="button" className="modal-close" title="Close" onClick={close}><X size={18} /></button>
        </div>
        <p className="join-description">Enter the invite code shared by a server member.</p>
        <label>
          Invite code
          <input autoFocus placeholder="e.g. vynq-abc123" autoComplete="off" {...register("inviteCode", { required: "Invite code is required" })} />
        </label>
        {(errors.inviteCode?.message || requestError) && <p className="creation-error">{errors.inviteCode?.message || requestError}</p>}
        <div className="creation-actions"><button type="button" className="cancel-button" onClick={close}>Cancel</button><button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Joining..." : "Join server"}</button></div>
      </form>
    </div>
  );
}

export default JoinServerModal;