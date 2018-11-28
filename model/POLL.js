import { get, map, } from 'lodash'

const POLL_PUBLISH_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  UNPUBLISHED: 2,
}
const fetchData = (store, { id }) => {
  return store.dispatch('FETCH_CHOICES', {
    id,
    params: {
      maxResult: 500,
      sort: '-updated_at',
    },
    endpoint: 'poll',
  }).then(res => {
    return get(res, 'items', [])
  })
}
const publish_status_options = map(POLL_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const tagsAutoComplete = (store, keyword) => {
  return store.dispatch('FETCH_AUTOCOMPLETE_LIST', {
    params: {
      maxResult: 20,
      keyword,
      sort: '-updated_at',
    },
    endpoint: 'tags',
  })
}

export const model = [
  { name: 'id', type: 'TextInput', group: 'basic', width: { list: '50', editor: '500' }, isEditable: false, isListable: true, isNumSentitive: true, isEditEntry: true, order: { editor: 0 }, },
  { name: 'startAt', type: 'Datetime', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 0 }, },
  { name: 'endAt', type: 'Datetime', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 0 }, },
  { name: 'status', type: 'RadioItem', group: 'basic', width: { list: '50', editor: '400' }, isEditable: true, isListable: true, options: publish_status_options, order: { editor: 0 }, },
  { name: 'title', type: 'TextInput', group: 'content', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, isEditEntry: true, order: { editor: 2 }, },
  { name: 'description', type: 'TextareaInput', group: 'content', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, order: { editor: 2 }, autoHeightActive: true, },
  { name: 'tags', type: 'TextTagItem', group: 'content', width: { list: '80', editor: '400' }, isEditable: true, isListable: false, map: { name: 'text', value: 'id', isValArraySensitive: true,  }, order: { editor: 3.5 }, autocomplete: tagsAutoComplete, },
  { name: 'image', type: 'Image', group: 'content', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, order: { editor: 4 }, },
  { name: 'choices', type: 'MediaOptions', group: 'content', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, order: { editor: 5 }, fetchData, },
  { name: 'totalVote', type: 'TextInput', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'frequency', type: 'TextInput', group: 'basic', width: { list: '400', editor: '500' }, isEditable: false, isListable: false, isEditEntry: true, order: { editor: 2 }, },
  { name: 'maxChoice', type: 'TextInput', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'changeable', type: 'TextInput', group: 'basic', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'createdAt', type: 'Datetime', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isDatetimeSentitive: true, order: { editor: 5 }, },
  { name: 'createdBy', type: 'TextInput', group: 'info', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: false, order: { editor: 5 }, },
]
export const filter = [ 'custom_editor' ]
export const groups = [ 'basic', 'content', ]
export const LIST_MAXRESULT = 10
