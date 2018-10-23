export const model = [
  { name: 'groupName', type: 'TextInput', isEditable: true, isListable: true, },
  { name: 'count', type: 'TextInput', width: { list: '90', editor: '90', }, isEditable: false, isListable: true, },
  { name: 'updatedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, },
  { name: 'createdAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, },
]