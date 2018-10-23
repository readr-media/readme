# READR
This CMS's framework is based on [Vue-hacknews-2.0](https://github.com/vuejs/vue-hackernews-2.0).

## Build Setup

**Requires Node.js 7+**

``` bash
# install dependencies
yarn # or yarn install

# serve in dev mode, with hot reload at localhost:8080
yarn run dev

# build for production
yarn run build

# serve in production mode
yarn start
```

## How to add new list?

### step 1

Go `/configuration`, add a new item to `items` like:
```
export const items = [
  {
    name: 'member',
    route: 'member',
    active: true,
  },
]
```

And you will maintain the wording at `/locale/zh-TW.js` for member like:
```
export default {
  'MEMBER': {
    ...
  },
  'NAVIGATION': {
    'INDEX': '選單',
    'MEMBER': '會員管理',
  },
}
```

Then, you've gotta construct a model called 'MEMBER.js' in folder `src/model/` like:
```
  import { ROLE_MAP, } from 'api/config'
  import { map, } from 'lodash'

  const role_options = map(ROLE_MAP, (s, k) => {
    return { name: k, value: s, }
  })
  const custom_editor_options = [
    { name: 'true', value: true, },
    { name: 'false', value: false, }
  ]
  const active_options = [
    { name: '1', value: 1, },
    { name: '0', value: 0, },
  ]

  export const model = [
    { name: 'id', type: 'TextInput', width: { list: '50', editor: '500' }, isEditable: false, isListable: true, },
    { name: 'nickname', type: 'TextInput', width: { list: '200', editor: '500' }, isEditable: false, isListable: true, isInitiliazible: true, },
    { name: 'mail', type: 'TextInput', width: { list: '400', editor: '200' }, isEditable: false, isListable: true, isInitiliazible: true, },
    { name: 'role', type: 'RadioItem', width: { list: '110', editor: '400' }, isEditable: true, isListable: true, options: role_options, },
    { name: 'active', type: 'RadioItem', width: { list: '80', editor: '400' }, isEditable: false, isListable: true, options: active_options, },
    { name: 'customEditor', type: 'BooleanSwitcher', width: { list: '80', editor: '400' }, isEditable: true, isListable: true, options: custom_editor_options, },
  ]

  export const filter = [ 'custom_editor' ]

  export const LIST_MAXRESULT = 15
```

## License

[MIT](http://opensource.org/licenses/MIT)

[vue.js](https://vuejs.org/)

based on [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0)

Copyright (c) 2018 Readr
