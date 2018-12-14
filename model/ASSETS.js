import { get, map } from 'lodash'
const COPYRIGHT_TYPE = {
  CC: 1,
  CC_BY_SA_3: 2
}
const ASSETS_TYPE = {
  IMAGE: 1,
  VIDEO: 2,
  AUDIO: 3
}
const copyRightOpts = (store, { vueInstance }) => new Promise(resolve => {
  const opts = map(COPYRIGHT_TYPE, (v, k) => ({ id: v, text: vueInstance.$t(`ASSETS.COPYRIGHT_${k}`), }))
  resolve(opts)
})
const copyright_options = map(COPYRIGHT_TYPE, (s, k) => {
  return { name: k, value: s, }
})
const assetsOpts = (store, { vueInstance }) => new Promise(resolve => {
  const opts = map(COPY_RIGHT, (v, k) => ({ id: v, text: vueInstance.$t(`ASSETS.${k}`), }))
  remove(opts, opt => opt.id === 2 || opt.id === 3)
  resolve(opts)
})
const assets_options = map(ASSETS_TYPE, (s, k) => {
  return { name: k, value: s, }
})

export const model = [
  { name: 'id', type: 'TextInput', group: 'info', width: { list: '50', editor: '500' }, isEditable: false, isListable: true, isEditEntry: true, order: { list: 0 } },
  { name: 'assetType', type: 'RadioItem', group: 'info', width: { list: '80', editor: '400' }, isEditable: false, isListable: true,options: assets_options, order: { list: 4 }, },
  { name: 'title', type: 'TextInput', group: 'basic', width: { list: '400', editor: '500' }, isEditable: true, isListable: true, isEditEntry: true, },
  { name: 'url', type: 'Uploader', group: 'basic', width: { list: '250', editor: '200' }, isEditable: true, isListable: false, },
  { name: 'copyright', type: 'Dropdownlist', group: 'basic', width: { list: '70', editor: '400' }, isEditable: true, isListable: true, options: copyright_options, fetchSource: copyRightOpts, required: true, order: { list: 2 }, },
]

export const groups = [ 'info', 'basic' ]