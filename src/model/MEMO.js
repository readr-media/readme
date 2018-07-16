import { MEMO_PUBLISH_STATUS, } from 'api/config'
import { map, } from 'lodash'
const publish_status_options = map(MEMO_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})

export const model = [
  { name: 'id', type: 'TextInput', width: { list: '80', editor: '500' }, isEditable: false, isListable: true, },
  { name: 'title', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, },
  { name: 'projectId', type: 'TextInput', width: { list: '110', editor: '400' }, isEditable: true, isListable: true, isNumSentitive: true, },
  { name: 'publishStatus', type: 'RadioItem', width: { list: '80', editor: '400' }, isEditable: true, isListable: true, options: publish_status_options, },
  { name: 'memoOrder', type: 'TextInput', width: { list: '50', editor: '80' }, isEditable: true, isListable: true, isNumSentitive: true, },
  { name: 'updatedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, },
  { name: 'createdAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isDatetimeSentitive: true, },
  { name: 'publishedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isDatetimeSentitive: true, },
  { name: 'content', type: 'ContentEditor', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, },
  { name: 'updatedBy', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },
  { name: 'author', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },
]

export const LIST_MAXRESULT = 6
