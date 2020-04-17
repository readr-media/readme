export const model = [
  { name: 'id', type: 'TextInput', group: 'info', listWidth: { max: '60' }, isEditable: false, isListable: true, isNumSentitive: true, isEditEntry: true, order: { list: 0 }, },
  { name: 'updatedAt', type: 'Datetime', group: 'info', isEditable: false, isListable: true, isDatetimeSentitive: true, order: { list: 2 }, },
  { name: 'text', type: 'TextInput', group: 'content', isEditable: true, isListable: true, isEditEntry: true, order: { list: 1 }, },
]

export const groups = [ 'info', 'content', ]
export const LIST_MAXRESULT = 15
export const isSearchable = false