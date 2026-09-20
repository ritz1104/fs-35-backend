import ServerRail from './ServerRail'
import ChannelSidebar from './ChannelSidebar'
import ChatArea from './ChatArea'
import MemberSidebar from '../member/MemberSidebar'

function ChatLayout() {
  return <div className="app-shell">
    <ServerRail />
    <div className="desktop-channel"><ChannelSidebar /></div>
    <ChatArea />
    <div className="desktop-members"><MemberSidebar /></div>
  </div>
}

export default ChatLayout
