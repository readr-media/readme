import { ROLE_MAP as ROLE_MAP_CONF, } from 'api/config'
import { get, } from 'lodash'

export const ROLE_MAP = [
  { key: get(ROLE_MAP_CONF, 'ADMIN'), name: 'admin', route: 'admin', },
  { key: get(ROLE_MAP_CONF, 'EDITOR'), name: 'editor', route: 'editor', },
  { key: get(ROLE_MAP_CONF, 'GUESTEDITOR'), name: 'guestEditor', route: 'guesteditor', },
  { key: get(ROLE_MAP_CONF, 'MEMBER'), name: 'member', route: 'member', },
]

export const PROJECT_STATUS_MAP = [
  { code: 0, name: 'status_canadate' },
  { code: 1, name: 'status_wip' },
  { code: 2, name: 'status_finished' },
]
export const PROJECT_PUBLISH_STATUS_MAP = [
  { code: 0, name: 'status_unpublished' },
  { code: 1, name: 'status_draft' },
  { code: 2, name: 'status_published' },
  { code: 3, name: 'status_scheduling' },
]

export const REPORT_PUBLISH_STATUS_MAP = [
  { code: 0, name: 'status_unpublished' },
  { code: 1, name: 'status_draft' },
  { code: 2, name: 'status_published' },
  { code: 3, name: 'status_scheduling' },
]

export const MEMO_PUBLISH_STATUS_MAP = [
  { code: 0, name: 'status_draft' },
  { code: 1, name: 'status_scheduled' },
  { code: 2, name: 'status_published' },
  { code: 3, name: 'status_deactive' },
]

export const DEFAULT_LIST_MAXRESULT = 15
export const IMAGE_SIZE = [ 'mobile@2x', 'mobile@3x', 'mobile@4x', 'tablet@1x', 'tablet@2x', 'desktop@1x', 'desktop@2x', ]
export const IMAGE_SIZE_RESOLUTION = [
  { target: 'mobile@4x', width: 1500 },
  { target: 'mobile@3x', width: 1200 },
  { target: 'mobile@2x', width: 800 },
  { target: 'tablet@2x', width: 2700 },
  { target: 'tablet@1x', width: 1000 },
  { target: 'desktop@2x', width: 3000 },
  { target: 'desktop@1x', width: 2000 }
]