export const nav = [
  { name: 'management', },
  { name: 'plugin', },
  { name: 'configure', },
]
export const items = [
  {
    nav: 'management',
    name: 'dashbord',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'management',
    name: 'project',
    type: 'list',
    active: true,
  },
  {
    nav: 'management',
    name: 'post',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'management',
    name: 'memo',
    type: 'list',
    active: true,
  },
  {
    nav: 'management',
    name: 'report',
    type: 'list',
    active: true,
  },
  {
    nav: 'management',
    name: 'poll',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'management',
    name: 'ad',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'management',
    name: 'tag',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'management',
    name: 'member',
    type: 'list',
    active: true,
  },
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
  {
    nav: 'plugin',
    name: 'epay',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'configure',
    name: 'account_role',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'configure',
    name: 'account_permission',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'configure',
    name: 'share',
    type: 'wrapper',
    active: false,
  },
  {
    nav: 'configure',
    name: 'domain',
    type: 'wrapper',
    active: false,
  },
]