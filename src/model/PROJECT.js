import { PROJECT_STATUS, } from 'api/config'
import { PROJECT_PUBLISH_STATUS, } from 'api/config'
import { map, } from 'lodash'

const status_options = map(PROJECT_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const publish_status_options = map(PROJECT_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const tagsAutoComplete = (store, keyword) => {
  return store.dispatch('FETCH_AUTOCOMPLETE_LIST', {
    params: {
      maxResult: 20,
      keyword,
      sort: '-updated_at',
    },
    flag: 'tags-name',
  })
}

export const model = [
  { name: 'id', type: 'TextInput', width: { list: '80', editor: '500' }, isEditable: false, isListable: true, isEditEntry: true, order: { editor: 0 }, },
  { name: 'title', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, isEditEntry: true, order: { editor: 2 }, },
  { name: 'ogTitle', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: false, isHidden: false, order: { editor: 2.5 }, },
  { name: 'progress', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'memoPoints', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'slug', type: 'TextInput', width: { list: '110', editor: '400' }, isEditable: true, isListable: true, order: { editor: 1.5 }, },
  { name: 'status', type: 'RadioItem', width: { list: '50', editor: '400' }, isEditable: true, isListable: true, options: status_options, order: { editor: 0 }, },
  { name: 'publishStatus', type: 'RadioItem', width: { list: '80', editor: '400' }, isEditable: true, isListable: true, options: publish_status_options, order: { editor: 0 }, },
  { name: 'projectOrder', type: 'TextInput', width: { list: '50', editor: '80' }, isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 6 }, },
  { name: 'updatedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, order: { editor: 5 }, },
  { name: 'createdAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isDatetimeSentitive: true, order: { editor: 5 }, },
  { name: 'publishedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 4 }, },
  { name: 'description', type: 'TextareaInput', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, order: { editor: 2 }, },
  { name: 'ogDescription', type: 'TextareaInput', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, order: { editor: 2.5 }, },
  { name: 'heroImage', type: 'Image', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, order: { editor: 3 }, },
  { name: 'ogImage', type: 'Image', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, order: { editor: 3 }, },
  { name: 'updatedBy', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, order: { editor: 5 }, },
  { name: 'tags', type: 'TextTagItem', width: { list: '80', editor: '400' }, isEditable: true, isListable: false, map: { name: 'text', value: 'id',  }, order: { editor: 3.5 }, autocomplete: tagsAutoComplete, },
]
