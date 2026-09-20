export const servers = [
  { name: 'Vynq', label: 'V', tone: 'violet', active: true },
  { name: 'DevHub', label: 'DH', tone: 'orange' },
  { name: 'AI Lab', label: 'AI', tone: 'mint' },
  { name: 'Frontend Club', label: 'FC', tone: 'blue' },
  { name: 'GameDev', label: 'GD', tone: 'pink' },
]

export const textChannels = ['general', 'announcements', 'development', 'resources', 'random']
export const voiceChannels = ['General', 'Gaming', 'Chill Zone']

export const members = [
  { name: 'Alex Morgan', handle: '@alexm', role: 'Product engineer', initials: 'AM', tone: 'violet', online: true },
  { name: 'Sarah Chen', handle: '@sarahc', role: 'Design systems', initials: 'SC', tone: 'coral', online: true },
  { name: 'Rahul Mehta', handle: '@rahulm', role: 'Backend explorer', initials: 'RM', tone: 'mint', online: true },
  { name: 'Ananya Rao', handle: '@ananyarao', role: 'Frontend engineer', initials: 'AR', tone: 'blue', online: true },
  { name: 'Dev Patel', handle: '@devbuilds', role: 'Open source', initials: 'DP', tone: 'orange', online: true },
  { name: 'John Kim', handle: '@johnk', role: 'Away for now', initials: 'JK', tone: 'slate', online: false },
  { name: 'Mike Torres', handle: '@miket', role: 'Offline', initials: 'MT', tone: 'pink', online: false },
  { name: 'Priya Shah', handle: '@priyashah', role: 'Offline', initials: 'PS', tone: 'gold', online: false },
]

export const messages = [
  { id: 1, author: 'Alex Morgan', handle: '@alexm', time: '09:42 AM', initials: 'AM', tone: 'violet', text: 'Hey everyone! What are you building this week?', reactions: ['sparkles 8', 'heart 4'] },
  { id: 2, author: 'Sarah Chen', handle: '@sarahc', time: '09:45 AM', initials: 'SC', tone: 'coral', text: "I'm shaping a React dashboard for a climate analytics product. Finally found a chart interaction that feels right.", reactions: ['heart 6'] },
  { id: 3, author: 'Rahul Mehta', handle: '@rahulm', time: '09:48 AM', initials: 'RM', tone: 'mint', text: 'Nice! I am experimenting with event streams and trying to keep the architecture pleasantly boring.', reactions: ['eyes 3'] },
  { id: 4, author: 'You', handle: '@you', time: '09:53 AM', initials: 'YU', tone: 'blue', text: "Let's share our projects here. The best part of this space is seeing how different people solve the same problem.", attachment: true, reactions: [] },
]
