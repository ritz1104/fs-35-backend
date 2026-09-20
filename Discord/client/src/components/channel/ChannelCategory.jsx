import { ChevronDown, Plus } from 'lucide-react'

function ChannelCategory({ title, children }) {
  return <section className="channel-category"><div className="category-head"><span><ChevronDown size={12} />{title}</span><button title={`Add ${title.toLowerCase()}`}><Plus size={15} /></button></div>{children}</section>
}

export default ChannelCategory
