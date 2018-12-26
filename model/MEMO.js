import { MEMO_PUBLISH_STATUS, } from 'api/config'
import { get, map, } from 'lodash'
const publish_status_options = map(MEMO_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const fetchSource = store => {
  return store.dispatch('FETCH_LIST', {
    params: {
      maxResult: 500,
      sort: '-updated_at',
    },
    endpoint: 'project',
  }).then(res => {
    return map(get(res, 'items', []), item => ({ id: item.id, text: item.title, }))
  })
}
export const model = [
  { name: 'id', type: 'TextInput', listWidth: { min: '60' }, isEditable: false, isListable: true, isNumSentitive: true, isEditEntry: true, },
  { name: 'title', type: 'TextInput', listWidth: { min: '340', max: '10000' }, isEditable: true, isListable: true, isEditEntry: true, },
  { name: 'projectId', type: 'Dropdownlist', listWidth: { min: '110' }, isEditable: true, isListable: true, isNumSentitive: true, fetchSource, },
  { name: 'publishStatus', type: 'RadioItem', listWidth: { min: '80' }, isEditable: true, isListable: true, options: publish_status_options, },
  { name: 'memoOrder', type: 'TextInput', listWidth: { min: '50' }, isEditable: true, isListable: true, isNumSentitive: true, },
  { name: 'updatedAt', type: 'Datetime', listWidth: { min: '140' }, isEditable: false, isListable: true, isDatetimeSentitive: true, },
  { name: 'createdAt', type: 'Datetime', isEditable: false, isListable: false, isDatetimeSentitive: true, },
  { name: 'publishedAt', type: 'Datetime', isEditable: true, isListable: false, isDatetimeSentitive: true, },
  { name: 'content', type: 'ContentEditor', isEditable: true, isListable: false, },
  { name: 'updatedBy', type: 'TextInput', isEditable: false, isListable: false, isHidden: true, },
  { name: 'author', type: 'TextInput', isEditable: false, isListable: false, isHidden: true, },
]

export const LIST_MAXRESULT = 10