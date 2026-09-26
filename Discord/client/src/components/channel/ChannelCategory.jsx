import { ChevronDown, Plus } from "lucide-react";

function ChannelCategory({ title, children, onAdd }) {
  return (
    <section className="channel-category">
      <div className="category-head">
        <span>
          <ChevronDown size={12} />
          {title}
        </span>
        <button type="button" title={`Add ${title.toLowerCase()}`} onClick={onAdd}>
          <Plus size={15} />
        </button>
      </div>
      {children}
    </section>
  );
}

export default ChannelCategory;
