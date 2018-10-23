export const items = [
  {
    name: 'EDM',
    route: '',
    active: false,
  },
  {
    name: 'project',
    route: 'project',
    active: true,
  },
  {
    name: 'report',
    route: 'report',
    active: true,
  },
  {
    name: 'memo',
    route: 'memo',
    active: true,
  },  
  {
    name: 'member',
    route: 'member',
    active: true,
  },  
  {
    name: 'enews',
    route: 'enews',
    type: 'wrapper',
    active: true,
    sub: [
      { name: 'campaign', route: '', active: false, },
      { name: 'enews-group-list', route: 'enews/enews-group-list', active: true, }
    ]    
  },
  {
    name: 'RECOMMEND',
    route: '',
    active: false,
  },
  {
    name: 'Analytics',
    route: '',
    active: false,
  },
  {
    name: 'Image',
    route: '',
    active: false,
  },
  {
    name: 'AB',
    route: '',
    active: false,
    sub: [
      { name: 'project', route: '' },
      { name: 'candidate', route: '' }
    ]
  },
  {
    name: 'Ad',
    route: '',
    active: false,
    sub: [
      { name: 'report', route: '' },
    ]
  },
  {
    name: 'Payment',
    route: 'memo-manager',
    active: false,
    sub: [
      { name: 'memo-list', route: '' },
      { name: 'memo-replies', route: '' }
    ]
  },
]