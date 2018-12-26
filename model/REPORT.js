import { REPORT_PUBLISH_STATUS, } from 'api/config'
import { get, map, } from 'lodash'
const publish_status_options = map(REPORT_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const authorAutoComplete = (store, keyword) => {
  return store.dispatch('FETCH_AUTOCOMPLETE_LIST', {
    params: {
      maxResult: 500,
      keyword,
    },
    endpoint: 'members/nickname',
  })
}

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
  { name: 'id', type: 'TextInput', listWidth: { min: '60' }, isEditable: false, isListable: true, isEditEntry: true, },
  { name: 'title', type: 'TextInput', listWidth: { min: '340', max: '10000' }, isEditable: true, isListable: true, isEditEntry: true, },
  { name: 'ogTitle', type: 'TextInput', isEditable: true, isListable: false, isHidden: true, },
  { name: 'slug', type: 'TextInput', listWidth: { min: '110' }, isEditable: true, isListable: true, },
  { name: 'projectId', type: 'Dropdownlist', isEditable: true, isListable: false, isNumSentitive: true, fetchSource,},
  { name: 'publishStatus', type: 'RadioItem', listWidth: { min: '80' }, isEditable: true, isListable: true, options: publish_status_options, },
  { name: 'authors', type: 'TextTagItem', isEditable: true, isListable: false, map: { name: 'nickname', value: 'id',  }, autocomplete: authorAutoComplete, },
  { name: 'updatedAt', type: 'Datetime', listWidth: { min: '140' }, isEditable: false, isListable: true, },
  { name: 'createdAt', type: 'Datetime', isEditable: false, isListable: false, },
  { name: 'publishedAt', type: 'Datetime', isEditable: true, isListable: false, },
  { name: 'description', type: 'TextareaInput', isEditable: true, isListable: false, autoHeightActive: true, },
  { name: 'ogDescription', type: 'TextareaInput', isEditable: false, isListable: false, isHidden: true, autoHeightActive: true, },
  { name: 'heroImage', type: 'AssetPicker', isEditable: true, isListable: false, isHidden: false, },
  { name: 'ogImage', type: 'AssetPicker', isEditable: true, isListable: false, isHidden: false, },
  // { name: 'updatedBy', type: 'TextInput', isEditable: false, isListable: false, isHidden: true, },
]
