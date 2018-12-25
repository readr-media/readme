
const active_options = [
  { name: '1', value: 1, },
  { name: '0', value: 0, },
]

export const model = [
  { name: 'id', type: 'TextInput', listWidth: { min: '50', max: '500' }, isEditable: false, isListable: false, isHidden: true, },
  { name: 'groupName', type: 'TextInput', isEditable: true, isListable: true, isAnchoric: true, },
  { name: 'count', type: 'TextInput', listWidth: { min: '90', max: '90', }, isEditable: false, isListable: true, isHidden: true, },
  { name: 'updatedAt', type: 'Datetime', listWidth: { min: '180', max: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
  { name: 'createdAt', type: 'Datetime', listWidth: { min: '180', max: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
]

export const subModel = [
  { name: 'id', type: 'TextInput', listWidth: { min: '50', max: '500' }, isEditable: false, isListable: false, isHidden: true, isHidden: true, },
  { name: 'mail', type: 'TextInput', listWidth: { min: '250', max: '200' }, isEditable: true, isListable: true, isInitialiazible: true, isEditEntry: true, },
  { name: 'nickname', type: 'TextInput', listWidth: { min: '200', max: '500' }, isEditable: true, isListable: true, isInitialiazible: true, },
  { name: 'active', type: 'RadioItem', listWidth: { min: '50', max: '400' }, isEditable: false, isListable: true, options: active_options, isHidden: true, },
  { name: 'updatedAt', type: 'Datetime', listWidth: { min: '150', max: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
  { name: 'createdAt', type: 'Datetime', listWidth: { min: '150', max: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
]

export const LIST_MAXRESULT = 15
