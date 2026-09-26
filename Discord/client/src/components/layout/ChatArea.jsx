import { Gift, Hash, Plus, Send, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage } from "../../features/messageSlice";
import ChatHeader from "../chat/ChatHeader";
import Message from "../chat/Message";
import useChannelSocket from "../../hooks/useChannelSocket";
import useChannelEvent from "../../hooks/useChannelEvent";


function ChatArea() {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");

  const selectedChannel = useSelector(
    (state) => state.channels.selectedChannel,
  );

  const messages = useSelector((state) => state.messages.messages);

  const channelId = selectedChannel?._id || selectedChannel?.id;

  useChannelSocket(channelId)
  useChannelEvent()

  const channelName = selectedChannel?.name?.replace(/^#/, "") || "general";

  useEffect(() => {
    if (channelId) dispatch(fetchMessages(channelId));
  }, [dispatch, channelId]);

  const submitMessage = async (event) => {
    event.preventDefault();

    if (!channelId || !content.trim()) return;

    await dispatch(sendMessage({ channelId, content: content.trim() }));

    setContent("");
  };

  const viewMessages = messages.map((message) => {
    const author = message.author_id || message.author_details || {};
    const name =
      author.fullname || author.username || message.author || "Member";
    return {
      ...message,
      id: message._id || message.id,
      author: name,
      initials: name.slice(0, 2).toUpperCase(),
      tone: "violet",
      time: message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      text: message.content || message.text || "",
      reactions: message.reactions || [],
    };
  });

  return (
    <main className="chat-area">
      <ChatHeader channelName={channelName} />
      <div className="message-scroll">
        <div className="channel-intro">
          <div className="intro-icon">
            <Hash size={30} />
          </div>
          <span className="intro-kicker">THE CONVERSATION STARTS HERE</span>
          <h2>
            Welcome to <em>#{channelName}</em>
          </h2>
          <p>This is the beginning of the #{channelName} channel.</p>
          <span>Share what you're making with the community.</span>
        </div>
        <div className="conversation-date">
          <span>Today</span>
        </div>
        {viewMessages.map((message) => (
          <Message message={message} key={message.id} />
        ))}
      </div>
      <div className="composer-wrap">
        <form className="composer" onSubmit={submitMessage}>
          <button type="button" title="Add attachment">
            <Plus size={20} />
          </button>
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={`Message #${channelName}`}
            aria-label={`Message #${channelName}`}
          />
          <button type="button" title="Send a gift">
            <Gift size={18} />
          </button>
          <button type="button" title="Add GIF" className="gif-button">
            GIF
          </button>
          <button type="button" title="Add emoji">
            <Smile size={19} />
          </button>
          <button type="submit" className="send-button" title="Send message">
            <Send size={17} />
          </button>
        </form>
        <p>Vynq is a calm place for curious people. Keep it thoughtful.</p>
      </div>
    </main>
  );
}

export default ChatArea;
