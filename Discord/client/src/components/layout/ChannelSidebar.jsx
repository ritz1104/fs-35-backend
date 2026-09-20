import { Bell, ChevronDown, Crown, FileText, Gamepad2, Headphones, Hash, Mic, Settings, Smile, Sparkles, Users, Volume2 } from 'lucide-react'
import { textChannels, voiceChannels } from '../../data/mockData'
import Avatar from '../ui/Avatar'
import ChannelCategory from '../channel/ChannelCategory'

const iconMap = { general: Hash, announcements: Bell, development: Sparkles, resources: FileText, random: Smile }

function ChannelSidebar() {
  return <aside className="channel-sidebar">
    <header className="server-header"><div><strong>Vynq</strong><span>Developer Community</span></div><button className="icon-button" title="Server menu"><ChevronDown size={17} /></button></header>
    <div className="channel-scroll">
      <div className="server-spotlight"><div className="spotlight-icon"><Sparkles size={17} /></div><div><strong>Connect. Communicate. Create.</strong><span>12,408 members</span></div></div>
      <ChannelCategory title="TEXT CHANNELS">{textChannels.map((channel) => { const Icon = iconMap[channel] || Hash; return <button className={`channel-item ${channel === 'general' ? 'selected' : ''}`} key={channel}><Icon size={16} /><span>{channel}</span>{channel === 'announcements' && <em>3</em>}</button> })}</ChannelCategory>
      <ChannelCategory title="VOICE CHANNELS">{voiceChannels.map((channel) => <button className="channel-item" key={channel}><Volume2 size={16} /><span>{channel}</span><Users size={13} className="channel-meta" /></button>)}</ChannelCategory>
      <div className="quick-links"><span className="category-label">QUICK ACCESS</span><button className="channel-item"><Crown size={16} /><span>Community picks</span></button><button className="channel-item"><Gamepad2 size={16} /><span>Events & jams</span></button></div>
    </div>
    <footer className="profile-bar"><button className="profile-summary"><Avatar initials="YU" tone="blue" online /><span><strong>you.dev</strong><small>Online</small></span></button><div className="profile-actions"><button title="Mute"><Mic size={16} /></button><button title="Deafen"><Headphones size={16} /></button><button title="Settings"><Settings size={16} /></button></div></footer>
  </aside>
}

export default ChannelSidebar
