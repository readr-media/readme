import { PROMOTION_ACTIVE, PROMOTION_STATUS } from 'api/config'
import { get, map, } from 'lodash'

const status_options = map(PROMOTION_STATUS, (s, k) => {
  return { name: k, value: s, }
})

export const model = [
  { name: 'id', type: 'TextInput', group: 'info', listWidth: { min: '60' }, isEditable: false, isListable: true, isNumSentitive: true, isEditEntry: true, order: { list: 0, editor: 0 }, },
  { name: 'status', type: 'RadioItem', group: 'info', listWidth: { min: '50' }, isEditable: false, isListable: true, options: status_options, order: { list: 2, editor: 0 }, isButtonized: true, },
  { name: 'createdAt', type: 'Datetime', group: 'info', listWidth: { min: '140' }, isEditable: false, isListable: true, isDatetimeSentitive: true, order: { list: 4, editor: 5 }, },
  { name: 'updatedAt', type: 'Datetime', group: 'info', isEditable: false, isListable: false, isDatetimeSentitive: true, order: { editor: 5 }, },
  { name: 'publishedAt', type: 'Datetime', group: 'info', isEditable: false, isListable: false, isDatetimeSentitive: true, isButtonizedWith: true, },

  { name: 'order', type: 'TextInput', group: 'basic', listWidth: { min: '50' }, isEditable: true, isListable: true, isNumSentitive: true, order: { list: 3, editor: 6 }, },

  { name: 'title', type: 'TextInput', group: 'content', listWidth: { min: '340', max: '10000' }, isEditable: true, isListable: true, isEditEntry: true, order: { list: 1, editor: 2 }, },
  { name: 'description', type: 'TextareaInput', group: 'content', isEditable: true, isListable: false, order: { editor: 2 }, autoHeightActive: true, },
  { name: 'image', type: 'AssetPicker', group: 'content', listWidth: { min: '180', max: '180' }, isEditable: true, isListable: false, acceptedFileTypes: [ 'image/*' ], },
  { name: 'link', type: 'TextInput', group: 'content', isEditable: true, isListable: false, },
]

export const groups = [ 'info', 'basic', 'content', ]
export const LIST_MAXRESULT = 15
export const isSearchable = false

