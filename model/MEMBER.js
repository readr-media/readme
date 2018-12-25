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
  { name: 'id', type: 'TextInput', listWidth: { min: '60' }, isEditable: false, isListable: true, isEditEntry: true, },
  { name: 'nickname', type: 'TextInput', listWidth: { min: '200' }, isEditable: false, isListable: true, isInitialiazible: true, isEditEntry: true, },
  { name: 'mail', type: 'TextInput', listWidth: { min: '250', max: '600' }, isEditable: false, isListable: true, isInitialiazible: true, isEditEntry: true, },
  { name: 'role', type: 'RadioItem', listWidth: { min: '60' }, isEditable: true, isListable: true, options: role_options, },
  { name: 'active', type: 'RadioItem', listWidth: { min: '80' }, isEditable: false, isListable: true, options: active_options, },
  { name: 'customEditor', type: 'BooleanSwitcher', listWidth: { min: '80' }, isEditable: true, isListable: true, options: custom_editor_options, },
]

export const filter = [ 'custom_editor' ]

export const LIST_MAXRESULT = 10