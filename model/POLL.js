import { map, } from 'lodash'

const POLL_PUBLISH_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  UNPUBLISHED: 2,
}
const publish_status_options = map(POLL_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})

export const model = [
  { name: 'id', type: 'TextInput', group: 'content', width: { list: '50', editor: '500' }, isEditable: false, isListable: true, isEditEntry: true, order: { editor: 0 }, },
  { name: 'start_at', type: 'Datetime', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 0 }, },
  { name: 'end_at', type: 'Datetime', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 0 }, },
  { name: 'title', type: 'TextInput', group: 'content', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, isEditEntry: true, order: { editor: 2 }, },
  { name: 'status', type: 'RadioItem', group: 'basic', width: { list: '50', editor: '400' }, isEditable: true, isListable: true, options: publish_status_options, order: { editor: 0 }, },
  { name: 'description', type: 'TextareaInput', group: 'content', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, order: { editor: 2 }, },
  { name: 'image', type: 'Image', group: 'content', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, order: { editor: 4 }, },
  { name: 'total_vote', type: 'TextInput', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'frequency', type: 'TextInput', group: 'basic', width: { list: '400', editor: '500' }, isEditable: true, isListable: false, isEditEntry: true, order: { editor: 2 }, },
  { name: 'max_choice', type: 'TextInput', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'changeable', type: 'TextInput', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'created_at', type: 'Datetime', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isDatetimeSentitive: true, order: { editor: 5 }, },
  { name: 'created_by', type: 'TextInput', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: false, order: { editor: 5 }, },
]
export const filter = [ 'custom_editor' ]
export const groups = [ 'basic', 'content', ]
export const LIST_MAXRESULT = 10
