import { X } from 'lucide-react'
import Avatar from '../ui/Avatar'

function ProfileCard({ close }) {
  return <div className="modal-backdrop" onClick={close}><div className="profile-card" onClick={(event) => event.stopPropagation()}><button className="profile-close" onClick={close}><X size={17} /></button><div className="profile-cover" /><div className="profile-content"><Avatar initials="YU" tone="blue" online large /><div className="profile-name"><h2>you.dev</h2><span>Alex Morgan</span></div><div className="profile-status"><span className="status-dot" /> Online</div><div className="profile-divider" /><label>ABOUT ME</label><p>Building small tools for people who like making things.</p><label>ROLES</label><div className="role-list"><span><i />Builder</span><span><i />Community</span></div><div className="profile-divider" /><small className="joined-date">Member since Feb 2024</small></div></div></div>
}

export default ProfileCard
