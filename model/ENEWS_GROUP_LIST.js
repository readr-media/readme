
const active_options = [
  { name: '1', value: 1, },
  { name: '0', value: 0, },
]

export const model = [
  { name: 'id', type: 'TextInput', width: { list: '50', editor: '500' }, isEditable: false, isListable: false, isHidden: true, },
  { name: 'groupName', type: 'TextInput', isEditable: true, isListable: true, isAnchoric: true, },
  { name: 'count', type: 'TextInput', width: { list: '90', editor: '90', }, isEditable: false, isListable: true, isHidden: true, },
  { name: 'updatedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
  { name: 'createdAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
]

export const subModel = [
  { name: 'id', type: 'TextInput', width: { list: '50', editor: '500' }, isEditable: false, isListable: false, isHidden: true, isHidden: true, },
  { name: 'mail', type: 'TextInput', width: { list: '250', editor: '200' }, isEditable: true, isListable: true, isInitialiazible: true, isEditEntry: true, },
  { name: 'nickname', type: 'TextInput', width: { list: '200', editor: '500' }, isEditable: true, isListable: true, isInitialiazible: true, },
  { name: 'active', type: 'RadioItem', width: { list: '50', editor: '400' }, isEditable: false, isListable: true, options: active_options, isHidden: true, },
  { name: 'updatedAt', type: 'Datetime', width: { list: '150', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
  { name: 'createdAt', type: 'Datetime', width: { list: '150', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, isHidden: true, },
]

export const LIST_MAXRESULT = 15
