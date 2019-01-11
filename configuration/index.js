
const nav = [
  { name: 'management', },
  { name: 'plugin', },
  { name: 'configure', },
]

const items = [
  { nav: 'management', name: 'dashbord', type: 'wrapper', },
  { nav: 'management', name: 'project', type: 'list', },
  { nav: 'management', name: 'post', type: 'list', },
  { nav: 'management', name: 'poll', type: 'list', },
  { nav: 'management', name: 'memo', type: 'list', },  
  { nav: 'management', name: 'report', type: 'list', },
  { nav: 'management', name: 'asset', type: 'list', },
  { nav: 'management', name: 'ad', type: 'wrapper', },
  { nav: 'management', name: 'tag', type: 'wrapper', },
  { nav: 'management', name: 'member', type: 'list', },
  { 
    nav: 'plugin',
    name: 'enews',
    type: 'wrapper',
    active: true,
    sub: [
      { name: 'enews-event-list', active: false },
      { name: 'enews-group-list', active: true }
    ], 
  },
  { nav: 'plugin', name: 'epay', type: 'wrapper', },
  { nav: 'configure', name: 'account_role', type: 'wrapper', },
  { nav: 'configure', name: 'account_permission', type: 'wrapper', },
  { nav: 'configure', name: 'share', type: 'wrapper', },
  { nav: 'configure', name: 'domain', type: 'wrapper', },
]

module.exports = {
  nav,
  items
}