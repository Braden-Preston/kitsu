import Bowser from 'bowser'

import auth from '@/lib/auth'
import lang from '@/lib/lang'
import timezone from '@/lib/timezone'
import init from '@/lib/init'

import userStore from '@/store/modules/user'
import taskTypeStore from '@/store/modules/tasktypes'
import store from '@/store/'

import Assets from '@/components/pages/Assets'
import Login from '@/components/pages/Login'
import Main from '@/components/Main'
import NewProduction from '@/components/pages/production/NewProduction'
import Notifications from '@/components/pages/Notifications'
import OpenProductions from '@/components/pages/OpenProductions'
import ProductionNewsFeed from '@/components/pages/ProductionNewsFeed'
import Shots from '@/components/pages/Shots'
import TaskType from '@/components/pages/TaskType'
import Todos from '@/components/pages/Todos'
import Edits from '@/components/pages/Edits'

const AssetTypes = () => import('../components/pages/AssetTypes')
const Asset = () => import('../components/pages/Asset')
const Breakdown = () => import('../components/pages/Breakdown')
const CustomActions = () => import('../components/pages/CustomActions')
const StatusAutomations = () => import('../components/pages/StatusAutomations')
const Episodes = () => import('../components/pages/Episodes')
const Episode = () => import('../components/pages/Episode')
const EpisodeStats = () => import('../components/pages/EpisodeStats')
const MainSchedule = () => import('../components/pages/MainSchedule')
const NotFound = () => import('../components/pages/NotFound')
const Person = () => import('../components/pages/Person')
const People = () => import('../components/pages/People')
const Playlist = () => import('../components/pages/Playlist')
const Productions = () => import('../components/pages/Productions')
const ProductionAssetTypes = () => import('../components/pages/ProductionAssetTypes')
const ProductionSchedule = () => import('../components/pages/ProductionSchedule')
const ProductionQuota = () => import('../components/pages/ProductionQuota')
const ProductionSettings = () => import('../components/pages/ProductionSettings')
const Profile = () => import('../components/pages/Profile')
const ResetPassword = () => import('../components/pages/ResetPassword')
const ResetChangePassword = () => import('../components/pages/ResetChangePassword')
const Logs = () => import('../components/pages/Logs')
const ServerDown = () => import('../components/pages/ServerDown')
const Settings = () => import('../components/pages/Settings')
const Sequences = () => import('../components/pages/Sequences')
const Shot = () => import('../components/pages/Shot')
const Task = () => import('../components/pages/Task')
const Team = () => import('../components/pages/Team')
const Timesheets = () => import('../components/pages/Timesheets')
const TaskStatus = () => import('../components/pages/TaskStatus')
const TaskTypes = () => import('../components/pages/TaskTypes')
const Departements = () => import('../components/pages/departments/Departments')
const WrongBrowser = () => import('../components/pages/WrongBrowser')
const Edit = () => import('../components/pages/Edit')

const ADMIN_PAGES = [
  'asset-types',
  'custom-actions',
  'status-automations',
  'departments',
  'logs',
  'main-schedule',
  'people',
  'productions',
  'task-status',
  'task-types',
  'main-schedule',
  'settings'
]

export const routes = [

  {
    path: '',
    component: Main,

    beforeEnter: (to, from, next) => {
      const browser = Bowser.getParser(window.navigator.userAgent)
      const isValidBrowser = browser.satisfies({
        chrome: '>20.1.1432',
        firefox: '>31',
        edge: '>90',
        vivaldi: '>2.8',
        opera: '>22',
        safari: '>9'
      })
      if (!isValidBrowser) {
        return next({ name: 'wrong-browser' })
      }

      auth.requireAuth(to, from, (nextPath) => {
        if (nextPath) {
          next(nextPath)
        } else {
          timezone.setTimezone()
          lang.setLocale()
          if (store.state.productions.openProductions.length === 0) {
            init((err) => {
              if (err) {
                next({ name: 'server-down' })
              } else {
                if (!userStore.getters.isCurrentUserArtist(userStore.state)) {
                  next({ name: 'open-productions' })
                } else {
                  next({ name: 'todos' })
                }
              }
            })
          } else {
            if (!userStore.getters.isCurrentUserArtist(userStore.state)) {
              store.commit('DATA_LOADING_END')
              next({ name: 'open-productions' })
            } else {
              store.commit('DATA_LOADING_END')
              next({ name: 'todos' })
            }
          }
        }
      })
    }
  },

  {
    path: '/',
    component: Main,

    beforeEnter: (to, from, next) => {
      auth.requireAuth(to, from, (nextPath) => {
        if (nextPath) {
          next(nextPath)
        } else {
          timezone.setTimezone()
          lang.setLocale()
          const isProhibited =
            !userStore.getters.isCurrentUserAdmin(userStore.state) &&
            to &&
            ADMIN_PAGES.includes(to.name)
          if (taskTypeStore.state.taskTypes.length === 0) {
            init(() => {
              store.commit('DATA_LOADING_END')
              if (isProhibited) {
                next({ name: 'not-found' })
              } else {
                next()
              }
            })
          } else {
            store.commit('DATA_LOADING_END')
            if (isProhibited) {
              next({ name: 'server-down' })
            } else {
              next()
            }
          }
        }
      })
    },

    children: [
      {
        path: '',
        name: 'home'
      },

      {
        path: 'asset-types',
        component: AssetTypes,
        children: [
          { path: 'new', component: AssetTypes },
          {
            name: 'edit-asset-type',
            path: 'edit/:asset_type_id',
            component: AssetTypes
          },
          {
            name: 'delete-asset-type',
            path: 'delete/:asset_type_id',
            component: AssetTypes
          }
        ]
      },

      {
        path: 'departments',
        component: Departements,
        name: 'departments'
      },

      {
        name: 'custom-actions',
        path: 'custom-actions',
        component: CustomActions,
        children: [
          {
            name: 'custom-actions-new',
            path: 'new',
            component: CustomActions
          },
          {
            name: 'edit-custom-action',
            path: 'edit/:custom_action_id',
            component: CustomActions
          },
          {
            name: 'delete-custom-action',
            path: 'delete/:custom_action_id',
            component: CustomActions
          }
        ]
      },

      {
        name: 'status-automations',
        path: 'status-automations',
        component: StatusAutomations,
        children: [
          {
            name: 'status-automations-new',
            path: 'new',
            component: StatusAutomations
          },
          {
            name: 'edit-status-automation',
            path: 'edit/:status_automation_id',
            component: StatusAutomations
          },
          {
            name: 'delete-status-automation',
            path: 'delete/:status_automation_id',
            component: StatusAutomations
          }
        ]
      },

      {
        name: 'notifications',
        path: 'notifications',
        component: Notifications
      },

      {
        path: 'open-productions',
        component: OpenProductions,
        name: 'open-productions'
      },

      {
        path: 'new-production',
        component: NewProduction,
        name: 'new-production'
      },

      {
        path: 'people',
        component: People,
        name: 'people',
        children: [
          { path: 'new', component: People, name: 'new-people' },
          {
            path: 'edit/:person_id',
            component: People,
            name: 'edit-person'
          },
          {
            name: 'delete-person',
            path: 'delete/:person_id',
            component: People
          }
        ]
      },

      {
        path: 'people/:person_id',
        component: Person,
        name: 'person',
        children: [
          {
            path: ':tab',
            component: Person,
            name: 'person-tab'
          }
        ]
      },

      {
        path: '/main-schedule',
        component: MainSchedule,
        name: 'main-schedule'
      },

      {
        path: '/timesheets',
        component: Timesheets,
        name: 'timesheets',
        children: [
          {
            path: 'year/:year',
            component: Timesheets,
            name: 'timesheets-year'
          },
          {
            path: 'year/:year/persons/:person_id',
            component: Timesheets,
            name: 'timesheets-year-person'
          },
          {
            path: 'month/:year',
            component: Timesheets,
            name: 'timesheets-month'
          },
          {
            path: 'month/:year/:month/persons/:person_id',
            component: Timesheets,
            name: 'timesheets-month-person'
          },
          {
            path: 'week/:year',
            component: Timesheets,
            name: 'timesheets-week'
          },
          {
            path: 'week/:year/:week/persons/:person_id',
            component: Timesheets,
            name: 'timesheets-week-person'
          },
          {
            path: 'day/:year/:month',
            component: Timesheets,
            name: 'timesheets-day'
          },
          {
            path: 'day/:year/:month/:day/persons/:person_id',
            component: Timesheets,
            name: 'timesheets-day-person'
          }
        ]
      },

      {
        path: '/logs',
        component: Logs,
        name: 'logs'
      },

      {
        path: 'profile',
        component: Profile,
        name: 'profile',
        children: [
          {
            path: 'change-avatar',
            component: Profile,
            name: 'change-avatar'
          }
        ]
      },

      {
        path: 'settings',
        component: Settings,
        name: 'settings'
      },

      {
        name: 'task-types',
        path: 'task-types',
        component: TaskTypes,
        children: [
          { path: 'new', component: TaskTypes },
          {
            name: 'edit-task-type',
            path: 'edit/:task_type_id',
            component: TaskTypes
          },
          {
            name: 'delete-task-type',
            path: 'delete/:task_type_id',
            component: TaskTypes
          }
        ]
      },

      {
        name: 'task-status',
        path: 'task-status',
        component: TaskStatus,
        children: [
          {
            name: 'new-task-status',
            path: 'new',
            component: TaskStatus
          },
          {
            name: 'edit-task-status',
            path: 'edit/:task_status_id',
            component: TaskStatus
          },
          {
            name: 'delete-task-status',
            path: 'delete/:task_status_id',
            component: TaskStatus
          }
        ]
      },

      {
        path: 'todos',
        component: Todos,
        name: 'todos',
        children: [
          { path: ':tab', component: Todos, name: 'todos-tab' }
        ]
      },

      {
        path: 'productions',
        component: Productions,
        name: 'productions',
        children: [
          {
            path: 'new',
            component: Productions,
            name: 'productions-new'
          },
          {
            path: 'edit/:production_edit_id',
            component: Productions,
            name: 'edit-production'
          },
          {
            path: 'delete/:production_delete_id',
            component: Productions,
            name: 'delete-production'
          }
        ]
      },

      {
        path: 'productions/:production_id/team',
        component: Team,
        name: 'team'
      },

      {
        path: 'productions/:production_id/news-feed',
        component: ProductionNewsFeed,
        name: 'news-feed'
      },

      {
        path: 'productions/:production_id/schedule',
        component: ProductionSchedule,
        name: 'schedule'
      },

      {
        path: 'productions/:production_id/production-settings',
        component: ProductionSettings,
        name: 'production-settings'
      },

      {
        path: 'productions/:production_id/quota',
        component: ProductionQuota,
        name: 'quota',
        children: [
          {
            path: 'month/:year',
            component: ProductionQuota,
            name: 'quota-month'
          },
          {
            path: 'month/:year/:month/persons/:person_id',
            component: ProductionQuota,
            name: 'quota-month-person'
          },
          {
            path: 'week/:year',
            component: ProductionQuota,
            name: 'quota-week'
          },
          {
            path: 'week/:year/:week/persons/:person_id',
            component: ProductionQuota,
            name: 'quota-week-person'
          },
          {
            path: 'day/:year/:month',
            component: ProductionQuota,
            name: 'quota-day'
          },
          {
            path: 'day/:year/:month/:day/persons/:person_id',
            component: ProductionQuota,
            name: 'quota-day-person'
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/quota',
        component: ProductionQuota,
        name: 'episode-quota',
        children: [
          {
            path: 'month/:year',
            component: ProductionQuota,
            name: 'episode-quota-month'
          },
          {
            path: 'month/:year/:month/persons/:person_id',
            component: ProductionQuota,
            name: 'episode-quota-month-person'
          },
          {
            path: 'week/:year',
            component: ProductionQuota,
            name: 'episode-quota-week'
          },
          {
            path: 'week/:year/:week/persons/:person_id',
            component: ProductionQuota,
            name: 'episode-quota-week-person'
          },
          {
            path: 'day/:year/:month',
            component: ProductionQuota,
            name: 'episode-quota-day'
          },
          {
            path: 'day/:year/:month/:day/persons/:person_id',
            component: ProductionQuota,
            name: 'episode-quota-day-person'
          }
        ]
      },

      {
        path: 'productions/:production_id/playlists',
        component: Playlist,
        name: 'playlists',
        children: [
          {
            name: 'playlist',
            path: ':playlist_id',
            component: Playlist
          },
          {
            name: 'delete-playlist',
            path: ':playlist_id/delete',
            component: Playlist
          },
          {
            name: 'edit-playlist',
            path: ':playlist_id/edit',
            component: Playlist
          }
        ]
      },

      {
        path: 'productions/:production_id/breakdown',
        component: Breakdown,
        name: 'breakdown',
        children: [
          {
            path: 'sequences/:sequence_id',
            component: Breakdown,
            name: 'breakdown-sequence'
          },
          {
            path: 'asset-types/:asset_type_id',
            component: Breakdown,
            name: 'breakdown-asset-type'
          }
        ]
      },

      {
        path: 'productions/:production_id/assets',
        component: Assets,
        name: 'assets',
        children: [
          {
            path: 'new',
            component: Assets,
            name: 'new-asset'
          },
          {
            path:
            'edit/:asset_id',
            component: Assets,
            name: 'edit-asset'
          },
          {
            path: 'delete/:asset_id',
            component: Assets,
            name: 'delete-asset'
          },
          {
            path: 'restore/:asset_id',
            component: Assets,
            name: 'restore-asset'
          },
          {
            path: 'delete-all-tasks/:task_type_id',
            component: Assets,
            name: 'delete-all-asset-tasks'
          }
        ]
      },

      {
        path: 'productions/:production_id/assets/:asset_id',
        component: Asset,
        name: 'asset'
      },

      {
        path: 'productions/:production_id/shots',
        component: Shots,
        name: 'shots',
        children: [
          {
            path: 'delete-all-tasks/:task_type_id',
            component: Shots,
            name: 'delete-all-shot-tasks'
          },
          {
            path: 'edit/:shot_id',
            component: Shots,
            name: 'edit-shot'
          },
          {
            path: 'delete/:shot_id',
            component: Shots,
            name: 'delete-shot'
          },
          {
            path: 'restore/:shot_id',
            component: Shots,
            name: 'restore-shot'
          }
        ]
      },

      {
        path: 'productions/:production_id/shots/:shot_id',
        component: Shot,
        name: 'shot'
      },

      {
        path: 'productions/:production_id/edits',
        component: Edits,
        name: 'edits',
        children: [
          {
            path: 'delete-all-tasks/:task_type_id',
            component: Edits,
            name: 'delete-all-edit-tasks'
          },
          {
            path: 'edit/:edit_id',
            component: Edits,
            name: 'edit-edit'
          },
          {
            path: 'delete/:edit_id',
            component: Edits,
            name: 'delete-edit'
          },
          {
            path: 'restore/:edit_id',
            component: Edits,
            name: 'restore-edit'
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes',
        component: Episodes,
        name: 'episodes',
        children: []
      },
      {
        path: 'productions/:production_id/episodes/:episode_id',
        component: Episode,
        name: 'episode'
      },

      {
        path: 'productions/:production_id/sequences',
        component: Sequences,
        name: 'sequences',
        children: [
          {
            path: 'edit/:sequence_id',
            component: Sequences,
            name: 'edit-sequence'
          },
          {
            path: 'delete/:sequence_id',
            component: Sequences,
            name: 'delete-sequence'
          }
        ]
      },

      {
        path: 'productions/:production_id/asset-types',
        component: ProductionAssetTypes,
        name: 'production-asset-types'
      },

      {
        path: 'productions/:production_id/:type/task-types/:task_type_id',
        component: TaskType,
        name: 'task-type',
        children: [
          {
            name: 'task-type-schedule',
            path: 'schedule',
            component: TaskType
          },
          {
            name: 'task-type-estimation',
            path: 'estimation',
            component: TaskType
          }
        ]
      },

      {
        name: 'episode-task',
        path: 'productions/:production_id/episodes/:episode_id/:type/tasks/:task_id',
        component: Task,
        children: [
          {
            name: 'episode-task-preview',
            path: 'previews/:preview_id',
            component: Task
          }
        ]
      },

      {
        name: 'task',
        path: 'productions/:production_id/:type/tasks/:task_id',
        component: Task,
        children: [
          {
            name: 'task-delete',
            path: 'delete',
            component: Task
          },
          {
            name: 'task-change-preview',
            path: 'comments/:comment_id/change-preview',
            component: Task
          },
          {
            name: 'task-preview',
            path: 'previews/:preview_id',
            component: Task
          },
          {
            name: 'task-edit-comment',
            path: 'comments/:comment_id/edit',
            component: Task
          },
          {
            name: 'task-delete-comment',
            path: 'comments/:comment_id/delete',
            component: Task
          }
        ]
      },

      {
        path: 'productions/:production_id/episode-stats',
        component: EpisodeStats,
        name: 'episode-stats',
        children: []
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/schedule',
        component: ProductionSchedule,
        name: 'episode-schedule'
      },
      {
        path: 'productions/:production_id/episodes/:episode_id/playlists',
        component: Playlist,
        name: 'episode-playlists',
        children: [
          {
            name: 'episode-playlist',
            path: ':playlist_id',
            component: Playlist
          },
          {
            name: 'episode-delete-playlist',
            path: ':playlist_id/delete',
            component: Playlist
          },
          {
            name: 'episode-edit-playlist',
            path: ':playlist_id/edit',
            component: Playlist
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/breakdown',
        component: Breakdown,
        name: 'episode-breakdown',
        children: [
          {
            path: 'sequences/:sequence_id',
            component: Breakdown,
            name: 'episode-breakdown-sequence'
          },
          {
            path: 'asset-types/:asset_type_id',
            component: Breakdown,
            name: 'episode-breakdown-asset-type'
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/assets',
        component: Assets,
        name: 'episode-assets',
        children: [
          {
            path: 'new',
            component: Assets,
            name: 'episode-new-asset'
          },
          {
            path: 'edit/:asset_id',
            component: Assets,
            name: 'episode-edit-asset'
          },
          {
            path: 'delete/:asset_id',
            component: Assets,
            name: 'episode-delete-asset'
          },
          {
            path: 'restore/:asset_id',
            component: Assets,
            name: 'episode-restore-asset'
          },
          {
            path: 'delete-all-tasks/:task_type_id',
            component: Assets,
            name: 'episode-delete-all-asset-tasks'
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/assets/:asset_id',
        component: Asset,
        name: 'episode-asset'
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/shots',
        component: Shots,
        name: 'episode-shots',
        children: [
          {
            path: 'shots/manage',
            component: Shots,
            name: 'episode-manage-shots'
          },
          {
            path: 'delete-all-tasks/:task_type_id',
            component: Shots,
            name: 'episode-delete-all-shot-tasks'
          },
          {
            path: 'edit/:shot_id',
            component: Shots,
            name: 'episode-edit-shot'
          },
          {
            path: 'delete/:shot_id',
            component: Shots,
            name: 'episode-delete-shot'
          },
          {
            path: 'shots/restore/:shot_id',
            component: Shots,
            name: 'episode-restore-shot'
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/shots/:shot_id',
        component: Shot,
        name: 'episode-shot'
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/edits',
        component: Edits,
        name: 'episode-edits',
        children: []
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/edits/:edit_id',
        component: Edit,
        name: 'episode-edit'
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/asset-types',
        component: ProductionAssetTypes,
        name: 'episode-production-asset-types'
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/sequences',
        component: Sequences,
        name: 'episode-sequences',
        children: [
          {
            path: 'edit/:sequence_id',
            component: Sequences,
            name: 'episode-edit-sequence'
          },
          {
            path: 'delete/:sequence_id',
            component: Sequences,
            name: 'episode-delete-sequence'
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/:type/task-types/:task_type_id',
        component: TaskType,
        name: 'episode-task-type',
        children: [
          {
            name: 'episode-task-type-schedule',
            path: 'schedule',
            component: TaskType
          },
          {
            name: 'episode-task-type-estimation',
            path: 'estimation',
            component: TaskType
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/task-types/:task_type_id',
        component: TaskType,
        name: 'episodes-task-type',
        children: [
          {
            name: 'episodes-task-type-schedule',
            path: 'schedule',
            component: TaskType
          },
          {
            name: 'episodes-task-type-estimation',
            path: 'estimation',
            component: TaskType
          }
        ]
      },

      {
        path: 'productions/:production_id/episodes/:episode_id/tasks/:task_id',
        name: 'episode-episode-task',
        component: Task,
        children: [
          {
            name: 'episode-episode-task-preview',
            path: 'previews/:preview_id',
            component: Task
          }
        ]
      }
    ]
  },

  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    name: 'reset-password'
  },
  {
    path: '/reset-change-password',
    component: ResetChangePassword,
    name: 'reset-change-password'
  },
  {
    path: '/server-down',
    component: ServerDown,
    name: 'server-down'
  },
  {
    path: '/wrong-browser',
    component: WrongBrowser,
    name: 'wrong-browser'
  },

  {
    path: '/*',
    component: NotFound,
    name: 'not-found'
  }
]
