import { ROLE_MAP, } from 'api/config'
import { map, } from 'lodash'

const role_options = map(ROLE_MAP, (s, k) => {
  return { name: k, value: s, }
})
const roleOpts = (store, { vueInstance }) => new Promise(resolve => {
  const opts = map(ROLE_MAP, (v, k) => ({ id: v, text: vueInstance.$t(`MEMBER.ROLE_${k}`), }))
  resolve(opts)
})
const custom_editor_options = [
  { name: 'true', value: true, },
  { name: 'false', value: false, }
]
const active_options = [
  { name: 'ACTIVATED', value: 1, },
  { name: 'INACTIVE', value: 0, },
]

export const model = [
  { name: 'id', group: 'info', type: 'TextInput', listWidth: { min: '60' }, isEditable: false, isListable: true, isEditEntry: true, order: { list: 0, editor: 0 }, },
  { name: 'active', group: 'info', type: 'RadioItem', listWidth: { min: '80' }, isEditable: false, isListable: true, options: active_options, order: { list: 3, editor: 1 }, isButtonized: true },
  { name: 'updatedAt', type: 'Datetime', group: 'info', listWidth: { min: '140' }, isEditable: false, isListable: true, isDatetimeSentitive: true, order: { list: 5, editor: 5 }, },
  { name: 'createdAt', type: 'Datetime', group: 'info', isEditable: false, isListable: false, isDatetimeSentitive: true, order: { editor: 5 }, },

  { name: 'nickname', group: 'basic', type: 'TextInput', listWidth: { min: '200' }, isEditable: true, isListable: true, isInitialiazible: true, isEditEntry: true, order: { list: 1 } },
  { name: 'mail', group: 'basic', type: 'TextInput', listWidth: { min: '250', max: '10000' }, isEditable: false, isListable: true, isInitialiazible: true, isEditEntry: true, order: { list: 2 } },
  { name: 'role', type: 'Dropdownlist', group: 'basic', listWidth: { min: '60' }, isEditable: true, isListable: true, isNumSentitive: true, options: role_options, fetchSource: roleOpts, required: true, order: { list: 2.5 }, },
  { name: 'customEditor', group: 'basic', type: 'BooleanSwitcher', listWidth: { min: '80' }, isEditable: true, isListable: true, options: custom_editor_options, order: { list: 4 } },

  { name: 'name', group: 'advanced', type: 'TextInput', isEditable: true, isListable: false, isInitialiazible: true },
  { name: 'phone', group: 'advanced', type: 'TextInput', isEditable: true, isListable: false, isInitialiazible: true },
  { name: 'work', group: 'advanced', type: 'TextInput', isEditable: true, isListable: false, isInitialiazible: true },
  { name: 'birthday', type: 'Datetime', group: 'advanced', isEditable: true, isListable: false, isDatetimeSentitive: true, default: '1970-01-01T00:00:00Z', datetimeType: 'date', },

]

export const filter = [ 'custom_editor' ]
export const groups = [ 'info', 'basic', 'advanced' ]
export const LIST_MAXRESULT = 15