import ServerRail from "./ServerRail";
import ChannelSidebar from "./ChannelSidebar";
import ChatArea from "./ChatArea";
import MemberSidebar from "../member/MemberSidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels } from "../../features/channelSlice";
import { fetchServerMembers } from "../../features/serverSlice";

function ChatLayout() {
  const dispatch = useDispatch();
  const selectedServer = useSelector((state) => state.servers.selectedServer);

  useEffect(() => {
    const serverId = selectedServer?._id || selectedServer?.id;
    if (serverId) {
      dispatch(fetchChannels(serverId));
      dispatch(fetchServerMembers(serverId));
    }
  }, [dispatch, selectedServer]);

  return (
    <div className="app-shell">
      <ServerRail />
      <div className="desktop-channel">
        <ChannelSidebar />
      </div>
      <ChatArea />
      <div className="desktop-members">
        <MemberSidebar />
      </div>
    </div>
  );
}

export default ChatLayout;
