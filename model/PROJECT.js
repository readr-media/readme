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
    endpoint: 'tags',
  })
}

export const model = [
  { name: 'id', type: 'TextInput', listWidth: { min: '100' }, isEditable: false, isListable: true, isEditEntry: true, order: { editor: 0, list: 0 }, },
  { name: 'title', type: 'TextInput', listWidth: { min: '340', max: '10000' }, isEditable: true, isListable: true, isEditEntry: true, order: { editor: 2, list: 1 }, },
  { name: 'ogTitle', type: 'TextInput', isEditable: true, isListable: false, isHidden: false, order: { editor: 2.5 }, },
  { name: 'progress', type: 'TextInput', isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'memoPoints', type: 'TextInput', isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, },
  { name: 'slug', type: 'TextInput', listWidth: { min: '110', max: '200' }, isEditable: true, isListable: true, order: { editor: 1.5, list: 3 }, },
  { name: 'status', type: 'RadioItem', listWidth: { min: '80' }, isEditable: true, isListable: true, options: status_options, order: { editor: 0, list: 4 }, },
  { name: 'publishStatus', type: 'RadioItem', listWidth: { min: '80' }, isEditable: true, isListable: true, options: publish_status_options, order: { editor: 0, list: 5 }, },
  { name: 'projectOrder', type: 'TextInput', isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 6 }, },
  { name: 'updatedAt', type: 'Datetime', listWidth: { min: '140' }, isEditable: false, isListable: true, isDatetimeSentitive: true, order: { editor: 5, list: 6 }, },
  { name: 'createdAt', type: 'Datetime', isEditable: false, isListable: false, isDatetimeSentitive: true, order: { editor: 5 }, },
  { name: 'publishedAt', type: 'Datetime', isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 4 }, },
  { name: 'description', type: 'TextareaInput', isEditable: true, isListable: false, order: { editor: 2 }, autoHeightActive: true, },
  { name: 'ogDescription', type: 'TextareaInput', isEditable: true, isListable: false, isHidden: false, order: { editor: 2.5 }, autoHeightActive: true, },
  { name: 'heroImage', type: 'AssetPicker', isEditable: true, isListable: false, order: { editor: 4 }, },
  { name: 'ogImage', type: 'AssetPicker', isEditable: true, isListable: false, order: { editor: 4 }, acceptedFileTypes: [ 'image/*' ], },
  { name: 'updatedBy', type: 'TextInput', isEditable: false, isListable: false, isHidden: true, order: { editor: 5 }, },
  { name: 'tags', type: 'TextTagItem', isEditable: true, isListable: false, map: { name: 'text', value: 'id', isValArraySensitive: true,  }, order: { editor: 3.5 }, autocomplete: tagsAutoComplete, },
]

export const filters = [
  { name: 'title', type: 'TextInput' },
  { name: 'tags', type: 'TextInput' },
  { name: 'id', type: 'TextInput' },
  { name: 'slug', type: 'TextInput' },
]
export const LIST_MAXRESULT = 15