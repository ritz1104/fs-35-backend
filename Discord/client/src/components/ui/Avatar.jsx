function Avatar({ initials, tone = 'violet', online, large = false }) {
  return <span className={`avatar avatar-${tone} ${large ? 'avatar-large' : ''}`}>
    {initials}
    {online !== undefined && <i className={`presence ${online ? 'is-online' : 'is-offline'}`} />}
  </span>
}

export default Avatar
