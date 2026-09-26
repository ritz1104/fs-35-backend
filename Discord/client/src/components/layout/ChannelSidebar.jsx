import {
  Bell,
  ChevronDown,
  Crown,
  FileText,
  Gamepad2,
  Headphones,
  Hash,
  Mic,
  Settings,
  Smile,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectChannel } from "../../features/channelSlice";
import Avatar from "../ui/Avatar";
import ChannelCategory from "../channel/ChannelCategory";
import CreateModal from "../creation/CreateModal";
import { useState } from "react";

const iconMap = {
  general: Hash,
  announcements: Bell,
  development: Sparkles,
  resources: FileText,
  random: Smile,
};

function ChannelSidebar() {
  const dispatch = useDispatch();
  const selectedServer = useSelector((state) => state.servers.selectedServer);
  const { channels, selectedChannel } = useSelector((state) => state.channels);
  const textChannels = channels.filter(
    (channel) => (channel.type || "text") === "text",
  );
  const voiceChannels = channels.filter((channel) => channel.type === "voice");
  const selectedChannelId = selectedChannel?._id || selectedChannel?.id;
  const serverId = selectedServer?._id || selectedServer?.id;
  const [createType, setCreateType] = useState(null);
  return (
    <aside className="channel-sidebar">
      <header className="server-header">
        <div>
          <strong>{selectedServer?.name || "Vynq"}</strong>
          <span>{selectedServer?.description || "Developer Community"}</span>
        </div>
        <button className="icon-button" title="Server menu">
          <ChevronDown size={17} />
        </button>
      </header>
      <div className="channel-scroll">
        <div className="server-spotlight">
          <div className="spotlight-icon">
            <Sparkles size={17} />
          </div>
          <div>
            <strong>Connect. Communicate. Create.</strong>
            <span>{selectedServer ? "Your community" : "Select a server"}</span>
          </div>
        </div>
        <ChannelCategory title="TEXT CHANNELS" onAdd={() => setCreateType("text")}>
          {textChannels.map((channel) => {
            const name = channel.name.replace(/^#/, "");
            const Icon = iconMap[name] || Hash;
            const id = channel._id || channel.id;
            return (
              <button
                onClick={() => dispatch(selectChannel(id))}
                className={`channel-item ${selectedChannelId === id ? "selected" : ""}`}
                key={id}
              >
                <Icon size={16} />
                <span>{name}</span>
              </button>
            );
          })}
        </ChannelCategory>
        <ChannelCategory title="VOICE CHANNELS" onAdd={() => setCreateType("voice")}>
          {voiceChannels.map((channel) => {
            const id = channel._id || channel.id;
            return (
              <button
                onClick={() => dispatch(selectChannel(id))}
                className={`channel-item ${selectedChannelId === id ? "selected" : ""}`}
                key={id}
              >
                <Volume2 size={16} />
                <span>{channel.name}</span>
                <Users size={13} className="channel-meta" />
              </button>
            );
          })}
        </ChannelCategory>
        <div className="quick-links">
          <span className="category-label">QUICK ACCESS</span>
          <button className="channel-item">
            <Crown size={16} />
            <span>Community picks</span>
          </button>
          <button className="channel-item">
            <Gamepad2 size={16} />
            <span>Events & jams</span>
          </button>
        </div>
      </div>
      <footer className="profile-bar">
        <button className="profile-summary">
          <Avatar initials="YU" tone="blue" online />
          <span>
            <strong>you.dev</strong>
            <small>Online</small>
          </span>
        </button>
        <div className="profile-actions">
          <button title="Mute">
            <Mic size={16} />
          </button>
          <button title="Deafen">
            <Headphones size={16} />
          </button>
          <button title="Settings">
            <Settings size={16} />
          </button>
        </div>
      </footer>
      {createType && serverId && <CreateModal kind={createType} serverId={serverId} close={() => setCreateType(null)} />}
    </aside>
  );
}

export default ChannelSidebar;
