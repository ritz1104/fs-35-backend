import { Bell, CircleHelp, Hash, Menu, PanelRight, Search } from 'lucide-react'

function ChatHeader() {
  return <header className="chat-header"><button className="mobile-menu icon-button" title="Open channels"><Menu size={20} /></button><div className="channel-heading"><Hash size={20} /><div><h1>general</h1><p>Welcome to the Vynq community.</p></div></div><div className="chat-tools"><button className="header-search"><Search size={16} /><span>Search</span><kbd>⌘ K</kbd></button><button className="icon-button" title="Notifications"><Bell size={18} /></button><button className="icon-button" title="Help"><CircleHelp size={18} /></button><button className="icon-button member-toggle" title="Members"><PanelRight size={18} /></button></div></header>
}

export default ChatHeader
