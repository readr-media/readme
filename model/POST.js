import { PROJECT_ACTIVE, POST_TYPE, POST_PUBLISH_STATUS } from 'api/config'
import { get, map } from 'lodash'
const type_options = map(POST_TYPE, (s, k) => {
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
const publish_status_options = map(POST_PUBLISH_STATUS, (s, k) => {
  return { name: k, value: s, }
})
const active_options = map(PROJECT_ACTIVE, (s, k) => {
  return { name: k, value: s, }
})

const isSupposedToShowWithTypeNews = data => { return get(data, 'type') === POST_TYPE.NEWS }
const isSupposedToShowWithTypeReview = data => { return get(data, 'type') === POST_TYPE.REVIEW }
const isSupposedToShowWithTypeNewsOrReview = data => { return get(data, 'type') === POST_TYPE.NEWS || get(data, 'type') === POST_TYPE.REVIEW }

export const model = [
  { name: 'id', type: 'TextInput', width: { list: '80', editor: '500' }, isEditable: false, isListable: true, isEditEntry: true, },
  { name: 'type', type: 'RadioItem', width: { list: '50', editor: '400' }, isEditable: true, isListable: true, options: type_options, },
  // { name: 'active', type: 'RadioItem', width: { list: '80', editor: '400' }, isEditable: false, isListable: true, options: active_options, },
  { name: 'publishStatus', type: 'RadioItem', width: { list: '70', editor: '400' }, isEditable: true, isListable: true, options: publish_status_options, },
  { name: 'title', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, isEditEntry: true, },
  { name: 'projectId', type: 'Dropdownlist', width: { list: '110', editor: '400' }, isEditable: true, isListable: true, isNumSentitive: true, fetchSource, },
  { name: 'updatedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isDatetimeSentitive: true, },
  { name: 'createdAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isDatetimeSentitive: true, },
  { name: 'publishedAt', type: 'Datetime', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isDatetimeSentitive: true, },
  { name: 'content', type: 'ContentEditor', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, },
  { name: 'updatedBy', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: false, isListable: false, isHidden: true, },
  { name: 'author', type: 'TextInput', width: { list: '180', editor: '200' }, isEditable: false, isListable: true, isHidden: true, },
  
  // For post.type === news || review
  { name: 'tags', type: 'TextTagItem', width: { list: '80', editor: '400' }, isEditable: true, isListable: false, map: { name: 'text', value: 'id', isValArraySensitive: true, }, autocomplete: tagsAutoComplete, showWith: isSupposedToShowWithTypeNewsOrReview, watcher: 'type', },
  
  // For post.type === news
  { name: 'ogDescription', type: 'TextareaInput', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, showWith: isSupposedToShowWithTypeNews, watcher: 'type', autoHeightActive: true, },
  { name: 'ogImage', type: 'Image', width: { list: '180', editor: '200' }, isEditable: true, isListable: false, isHidden: false, showWith: isSupposedToShowWithTypeNews, watcher: 'type', autoHeightActive: true, },
  { name: 'ogTitle', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: false, isHidden: false, showWith: isSupposedToShowWithTypeNews, watcher: 'type', autoHeightActive: true, },

  // For post.type === review
  { name: 'link', type: 'TextInput', width: { list: '400', editor: '500' }, isEditable: true, isListable: false, isHidden: false, showWith: isSupposedToShowWithTypeReview, watcher: 'type', },
]