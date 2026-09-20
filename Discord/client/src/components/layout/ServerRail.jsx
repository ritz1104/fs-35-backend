import { Compass, Home, Plus } from 'lucide-react'
import Avatar from '../ui/Avatar'

const serverList = [
  { name: 'DevHub', label: 'DH', tone: 'orange', active: true },
  { name: 'CodeCraft', label: 'CC', tone: 'blue' },
  { name: 'AI Lab', label: 'AI', tone: 'mint' },
  { name: 'Frontend Club', label: 'FC', tone: 'violet' },
  { name: 'GameDev', label: 'GD', tone: 'pink' },
]

function ServerRail() {
  return <aside className="server-rail">
    <div className="brand-mark" data-tooltip="Vynq home" aria-label="Vynq home"><span>V</span><i /></div>
    <div className="rail-divider" />
    <button className="rail-button home-button" data-tooltip="Home" aria-label="Home"><Home size={18} /></button>
    <div className="rail-divider rail-divider-small" />
    {serverList.map((server) => <button className={`rail-button server-icon tone-${server.tone} ${server.active ? 'active' : ''}`} data-tooltip={server.name} aria-label={server.name} key={server.name}>{server.label}</button>)}
    <button className="rail-button add-server" data-tooltip="Add a server" aria-label="Add a server"><Plus size={19} /></button>
    <button className="rail-button explore" data-tooltip="Explore servers" aria-label="Explore servers"><Compass size={18} /></button>
    <div className="rail-spacer" />
    <button className="rail-button rail-user" data-tooltip="Your profile" aria-label="Your profile"><Avatar initials="YU" tone="blue" online /></button>
  </aside>
}

export default ServerRail
