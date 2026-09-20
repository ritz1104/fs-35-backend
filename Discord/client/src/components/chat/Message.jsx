import { ChevronRight, MessageCircle, MoreHorizontal, Smile, Sparkles } from 'lucide-react'
import Avatar from '../ui/Avatar'

function Message({ message }) {
  return <article className="message-row"><Avatar initials={message.initials} tone={message.tone} /><div className="message-body"><div className="message-meta"><strong>{message.author}</strong>{message.author === 'Alex Morgan' && <span className="role-chip">MOD</span>}<time>{message.time}</time></div><p>{message.text}</p>{message.attachment && <div className="project-card"><div className="project-thumb"><Sparkles size={20} /><span>vynq.design</span></div><div><strong>Open source, open conversation</strong><span>A small space for big ideas.</span></div><ChevronRight size={16} /></div>}{message.reactions.length > 0 && <div className="reactions">{message.reactions.map((reaction) => <button key={reaction}>{reaction}</button>)}</div>}</div><div className="message-actions"><button title="Add reaction"><Smile size={15} /></button><button title="Reply"><MessageCircle size={15} /></button><button title="More"><MoreHorizontal size={15} /></button></div></article>
}

export default Message
