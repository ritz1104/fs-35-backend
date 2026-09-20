import { Gift, Hash, Plus, Send, Smile } from 'lucide-react'
import { messages } from '../../data/mockData'
import ChatHeader from '../chat/ChatHeader'
import Message from '../chat/Message'

function ChatArea() {
  return <main className="chat-area"><ChatHeader /><div className="message-scroll"><div className="channel-intro"><div className="intro-icon"><Hash size={30} /></div><span className="intro-kicker">THE CONVERSATION STARTS HERE</span><h2>Welcome to <em>#general</em></h2><p>This is the beginning of the #general channel.</p><span>Share what you're making with the community.</span></div><div className="conversation-date"><span>Today</span></div>{messages.map((message) => <Message message={message} key={message.id} />)}</div><div className="composer-wrap"><div className="composer"><button type="button" title="Add attachment"><Plus size={20} /></button><input placeholder="Message #general" aria-label="Message #general" /><button type="button" title="Send a gift"><Gift size={18} /></button><button type="button" title="Add GIF" className="gif-button">GIF</button><button type="button" title="Add emoji"><Smile size={19} /></button><button type="button" className="send-button" title="Send message"><Send size={17} /></button></div><p>Vynq is a calm place for curious people. Keep it thoughtful.</p></div></main>
}

export default ChatArea
