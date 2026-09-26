import { useSelector } from 'react-redux'
import Avatar from '../ui/Avatar'

function MemberSidebar() {
  const members = useSelector((state) => state.servers.members).map((member) => ({
    ...(member.user || member),
    name: member.user?.fullname || member.user?.username || member.fullname || member.username || 'Member',
    role: member.roles?.[0]?.name || 'Member',
    initials: (member.user?.username || member.username || 'M').slice(0, 2).toUpperCase(),
    online: false,
    tone: 'violet',
  }))
  const online = members.filter((member) => member.online)
  const offline = members.filter((member) => !member.online)
  return <aside className="member-sidebar"><div className="member-header"><span>Members — {members.length}</span></div><div className="member-scroll"><MemberGroup title={`ONLINE — ${online.length}`} list={online} /><MemberGroup title={`OFFLINE — ${offline.length}`} list={offline} /></div></aside>
}

function MemberGroup({ title, list }) {
  return <section className="member-group"><h3>{title}</h3>{list.map((member) => <button className="member-item" key={member.name}><Avatar initials={member.initials} tone={member.tone} online={member.online} /><span><strong>{member.name}</strong><small>{member.role}</small></span></button>)}</section>
}

export default MemberSidebar
