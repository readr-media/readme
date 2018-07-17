import { ROLE_MAP, } from 'api/config'
import { map, } from 'lodash'

const role_options = map(ROLE_MAP, (s, k) => {
  return { name: k, value: s, }
})

export const model = [
  { name: 'id', type: 'TextInput', width: { list: '50', editor: '500' }, isEditable: false, isListable: true, },
  { name: 'nickname', type: 'TextInput', width: { list: '200', editor: '500' }, isEditable: false, isListable: true, },
  { name: 'mail', type: 'TextInput', width: { list: '400', editor: '200' }, isEditable: false, isListable: true, },
  { name: 'role', type: 'RadioItem', width: { list: '110', editor: '400' }, isEditable: true, isListable: true, options: role_options, },
  { name: 'customEditor', type: 'BooleanSwitcher', width: { list: '80', editor: '400' }, isEditable: true, isListable: true, },
]

export const LIST_MAXRESULT = 15