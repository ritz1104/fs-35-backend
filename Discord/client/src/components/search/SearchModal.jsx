import { ChevronRight, Hash, Search, X } from 'lucide-react'
import Avatar from '../ui/Avatar'

function SearchModal({ close }) {
  return <div className="modal-backdrop" onClick={close}><div className="search-modal" onClick={(event) => event.stopPropagation()}><div className="search-modal-head"><Search size={20} /><input autoFocus placeholder="Search Vynq" /><button onClick={close}><X size={18} /></button></div><div className="search-results"><p>RECENT SEARCHES</p><button><Hash size={16} /><span><strong>development</strong><small>Channel</small></span><ChevronRight size={15} /></button><button><Avatar initials="SC" tone="coral" /><span><strong>Sarah Chen</strong><small>Member</small></span><ChevronRight size={15} /></button><p>TRY SEARCHING FOR</p><div className="search-hints"><span>people</span><span>channels</span><span>messages</span></div></div></div></div>
}

export default SearchModal
