import { Compass, Home, Plus } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectServer } from '../../features/serverSlice'
import Avatar from '../ui/Avatar'
import CreateModal from '../creation/CreateModal'

const tones = ['orange', 'blue', 'mint', 'violet', 'pink']

function ServerRail() {
  const dispatch = useDispatch()
  const { servers, selectedServer } = useSelector((state) => state.servers)
  const [showCreate, setShowCreate] = useState(false)
  return <>
    <aside className="server-rail">
    <div className="brand-mark" data-tooltip="Vynq home" aria-label="Vynq home"><span>V</span><i /></div>
    <div className="rail-divider" />
    <button className="rail-button home-button" data-tooltip="Home" aria-label="Home"><Home size={18} /></button>
    <div className="rail-divider rail-divider-small" />
    {servers.map((server, index) => { const name = server.name || 'Server'; const label = name.slice(0, 2).toUpperCase(); const id = server._id || server.id; return <button onClick={() => dispatch(selectServer(id))} className={`rail-button server-icon tone-${tones[index % tones.length]} ${((selectedServer?._id || selectedServer?.id) === id) ? 'active' : ''}`} data-tooltip={name} aria-label={name} key={id}>{label}</button> })}
    <button onClick={() => setShowCreate(true)} className="rail-button add-server" data-tooltip="Add a server" aria-label="Add a server"><Plus size={19} /></button>
    <button className="rail-button explore" data-tooltip="Explore servers" aria-label="Explore servers"><Compass size={18} /></button>
    <div className="rail-spacer" />
    <button className="rail-button rail-user" data-tooltip="Your profile" aria-label="Your profile"><Avatar initials="YU" tone="blue" online /></button>
    </aside>
    {showCreate && <CreateModal kind="server" close={() => setShowCreate(false)} />}
  </>
}

export default ServerRail
