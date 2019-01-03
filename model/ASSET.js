import { get, map } from 'lodash'
const COPYRIGHT_TYPE = {
  COPYRIGHT: 1,
  CC: 2,
  CC_BY_SA_3: 3
}
const ASSETS_TYPE = {
  IMAGE: 1,
  VIDEO: 2,
  AUDIO: 3
}
const copyRightOpts = (store, { vueInstance }) => new Promise(resolve => {
  const opts = map(COPYRIGHT_TYPE, (v, k) => ({ id: v, text: vueInstance.$t(`ASSET.COPYRIGHT_${k}`), }))
  resolve(opts)
})
const copyright_options = map(COPYRIGHT_TYPE, (s, k) => {
  return { name: k, value: s, }
})
const assetsOpts = (store, { vueInstance }) => new Promise(resolve => {
  const opts = map(COPY_RIGHT, (v, k) => ({ id: v, text: vueInstance.$t(`ASSET.${k}`), }))
  remove(opts, opt => opt.id === 2 || opt.id === 3)
  resolve(opts)
})
const assets_options = map(ASSETS_TYPE, (s, k) => {
  return { name: k, value: s, }
})

export const model = [
  { name: 'id', type: 'TextInput', group: 'info', listWidth: { min: '60' }, isEditable: false, isListable: true, isEditEntry: true, order: { list: 0 } },
  { name: 'destination', type: 'TextInput', group: 'info', isEditable: false, isListable: false, isHidden: true },
  { name: 'assetType', type: 'RadioItem', group: 'info', listWidth: { min: '80' }, isEditable: false, isListable: true,options: assets_options, order: { list: 4 }, },
  { name: 'title', type: 'TextInput', group: 'basic', listWidth: { min: '340', max: '10000' }, isEditable: true, isListable: true, isEditEntry: true, required: true },
  
  { name: 'fileName', type: 'TextInput', group: 'info', isEditable: false, isListable: false, isHidden: true },
  { name: 'fileExt', type: 'TextInput', group: 'info', isEditable: false, isListable: false, isHidden: true },
  { name: 'fileType', type: 'TextInput', group: 'info', isEditable: false, isListable: false, isHidden: true },
  { name: 'file', type: 'Uploader', group: 'basic', isEditable: true, isListable: false, },

  { name: 'copyright', type: 'Dropdownlist', group: 'basic', listWidth: { min: '100' }, isEditable: true, isListable: true, isNumSentitive: true, options: copyright_options, fetchSource: copyRightOpts, required: true, order: { list: 2 }, default: '-1', defaultText: 'NA_COPYRIGHT' },
]

export const groups = [ 'info', 'basic' ]
export const assetsEndpoint = '/api/asset/list?type=image'
export const LIST_MAXRESULT = 15