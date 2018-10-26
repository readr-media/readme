import { REPORT_PUBLISH_STATUS, } from 'api/config'
import { map, } from 'lodash'
const publish_status_options = map(REPORT_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const authorAutoComplete = (store, keyword) => {
  return store.dispatch('FETCH_AUTOCOMPLETE_LIST', {
    params: {
      maxResult: 500,
      keyword,
    },
    flag: 'members-nickname',
  })
}
export const model = [
  { name: 'id', type: 'TextInput', width: { list: '80', editor: '500' }, isEditable: false, isListable: true, isEditEntry: true, },
  { name: 'title', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, isEditEntry: true, },
  { name: 'ogTitle', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: false, isHidden: true, },
  { name: 'slug', type: 'TextInput', width: { list: '110', editor: '400' }, isEditable: true, isListable: true, },
  { name: 'projectId', type: 'TextInput', width: { list: '110', editor: '400' }, isEditable: true, isListable: false, isNumSentitive: true, },
  { name: 'publishStatus', type: 'RadioItem', width: { list: '80', editor: '400' }, isEditable: true, isListable: true, options: publish_status_options, },
  { name: 'authors', type: 'TextTagItem', width: { list: '80', editor: '400' }, isEditable: true, isListable: false, map: { name: 'nickname', value: 'id',  }, autocomplete: authorAutoComplete, },
  { name: 'updatedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, },
  { name: 'createdAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, },
  { name: 'publishedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, },
  { name: 'description', type: 'TextareaInput', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, },
  { name: 'ogDescription', type: 'TextareaInput', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },
  { name: 'heroImage', type: 'Image', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },
  { name: 'ogImage', type: 'Image', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },
  // { name: 'updatedBy', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },
]
