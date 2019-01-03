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
const fetchSource = (store, { vueInstance }) => new Promise(resolve => resolve([
  { id: 0, text: vueInstance.$t('POLL.FREQUENCY_OPTION.ONCE'), },
  { id: 1, text: vueInstance.$t('POLL.FREQUENCY_OPTION.DAILY'), },
  { id: 7, text: vueInstance.$t('POLL.FREQUENCY_OPTION.WEEKLY'), },
]))

const isSupposedToShowedWithFrequency = data => get(data, 'frequency') === '0' || get(data, 'frequency') === 0

export const model = [
  { name: 'id', type: 'TextInput', group: 'info', listWidth: { min: '60' }, isEditable: false, isListable: true, isNumSentitive: true, isEditEntry: true, order: { list: 0, editor: 0 }, },
  { name: 'createdAt', type: 'Datetime', group: 'info', isEditable: false, isListable: false, isDatetimeSentitive: true, order: { list: 4, editor: 5 }, },
  { name: 'updatedAt', type: 'Datetime', group: 'info', listWidth: { min: '140' }, isEditable: false, isListable: true, isDatetimeSentitive: true, order: { editor: 5 }, },
  { name: 'createdBy', type: 'TextInput', group: 'info', isEditable: false, isListable: false, isHidden: false, order: { editor: 5 }, },
  { name: 'publishedAt', type: 'Datetime', group: 'info', isEditable: false, isListable: false, isDatetimeSentitive: true, isButtonizedWith: true, },
  { name: 'status', type: 'RadioItem', group: 'info', listWidth: { min: '50' }, isEditable: false, isListable: true, options: publish_status_options, order: { list: 2, editor: 0 }, isButtonized: true, isSchedulable: true, },
  
  { name: 'startAt', type: 'Datetime', group: 'basic', isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 0 }, },
  { name: 'endAt', type: 'Datetime', group: 'basic', isEditable: true, isListable: false, isDatetimeSentitive: true, order: { editor: 0 }, watcher: 'startAt', relativeToWatcher: 'after' },
  { name: 'title', type: 'TextInput', group: 'content', listWidth: { min: '340', max: '10000' }, isEditable: true, isListable: true, isEditEntry: true, order: { list: 1, editor: 2 }, },
  { name: 'description', type: 'TextareaInput', group: 'content', isEditable: true, isListable: false, order: { editor: 2 }, autoHeightActive: true, },
  { name: 'tags', type: 'TextTagItem', group: 'content', isEditable: true, isListable: false, map: { name: 'text', value: 'id', isValArraySensitive: true,  }, order: { editor: 3.5 }, autocomplete: tagsAutoComplete, },
  // { name: 'image', type: 'AssetPicker', isEditable: true, isListable: false, order: { editor: 4 }, acceptedFileTypes: [ 'image/*' ], },
  { name: 'choices', type: 'MediaOptions', group: 'content', isEditable: true, isListable: false, isHidden: false, order: { editor: 5 }, fetchData, default: [] },
  { name: 'totalVote', type: 'TextInput', group: 'info', listWidth: { min: '80' }, isEditable: false, isListable: true, isNumSentitive: true, order: { list: 3, editor: 1, }, },
  { name: 'frequency', type: 'Dropdownlist', group: 'basic', isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 2 }, fetchSource, required: true },
  { name: 'maxChoice', type: 'TextInput', group: 'basic', isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 1, }, required: true },
  { name: 'changeable', type: 'CheckboxItem', group: 'basic', isEditable: true, isListable: false, isNumSentitive: true, order: { editor: 3, }, hideTitle: true, subText: 'CHANGEABLE', watcher: 'frequency', showWith: isSupposedToShowedWithFrequency,},
]
export const filter = [ 'custom_editor' ]
export const groups = [ 'info', 'basic', 'content', ]
export const LIST_MAXRESULT = 15
