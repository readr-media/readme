export const items = [
  {
    name: 'management',
    route: 'management',
    type: 'wrapper',
    active: true,
    sub: [
      { name: 'project', route: 'project', active: true, },      
      { name: 'report', route: 'report', active: true, },
      { name: 'memo', route: 'memo', active: true, },      
      { name: 'member', route: 'member', active: true, },      
    ],
  },
  {
    name: 'plug-in',
    route: 'plug-in',
    type: 'wrapper',
    active: true,
    sub: [
      // { name: 'campaign', route: '', active: false, },
      { name: 'enews', route: 'enews', active: true, }
    ],
  },


  {
    name: 'enews',
    route: 'enews',
    type: 'wrapper',
    active: true,
    isSubItem: true, 
    sub: [
      { name: 'campaign', route: '', active: false, },
      { name: 'enews-group-list', route: 'enews-group-list', active: true, }
    ],
  },
  {
    name: 'enews-group-list',
    route: 'enews-group-list',
    active: true, 
    isSubItem: true, 
  },
  {
    name: 'project',
    route: 'project',
    active: true, 
    isSubItem: true, 
  },
  {
    name: 'member',
    route: 'member',
    active: true,
    isSubItem: true, 
  },  
  {
    name: 'memo',
    route: 'memo',
    active: true,
    isSubItem: true, 
  },  


  // {
  //   name: 'EDM',
  //   route: '',
  //   active: false,
  // },
  // {
  //   name: 'RECOMMEND',
  //   route: '',
  //   active: false,
  // },
  // {
  //   name: 'Analytics',
  //   route: '',
  //   active: false,
  // },
  // {
  //   name: 'Image',
  //   route: '',
  //   active: false,
  // },
  // {
  //   name: 'AB',
  //   route: '',
  //   active: false,
  //   sub: [
  //     { name: 'project', route: '' },
  //     { name: 'candidate', route: '' }
  //   ]
  // },
  // {
  //   name: 'Ad',
  //   route: '',
  //   active: false,
  //   sub: [
  //     { name: 'report', route: '' },
  //   ]
  // },
  // {
  //   name: 'Payment',
  //   route: 'memo-manager',
  //   active: false,
  //   sub: [
  //     { name: 'memo-list', route: '' },
  //     { name: 'memo-replies', route: '' }
  //   ]
  // },
]