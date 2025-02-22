<template>
<div class="data-list">
  <div class="datatable-wrapper">
    <table class="datatable multi-section">
      <thead class="datatable-head">
        <tr>
          <th scope="col" class="department">
            {{ $t('task_types.fields.department') }}
          </th>
          <th scope="col" class="name">{{ $t('task_types.fields.name') }}</th>
          <th scope="col" class="allow-timelog">
            {{ $t('task_types.fields.allow_timelog') }}
          </th>
          <th scope="col" class="actions"></th>
        </tr>
      </thead>
      <draggable
        class="datatable-body"
        v-model="assetsItems"
        draggable=".tasktype-item"
        tag="tbody"
        :sort="true"
        @end="updatePriorityAssets"
      >
        <tr class="datatable-type-header" slot="header">
          <th scope="rowgroup" colspan="4">
            <span class="datatable-row-header">
              {{ $t('assets.title') }}
            </span>
          </th>
        </tr>
        <tr
          class="datatable-row tasktype-item"
          :key="taskType.id"
          v-for="taskType in assetsItems"
        >
          <td class="department">
            <department-name
              :department="getDepartments(taskType.department_id)"
              v-if="!isEmpty(taskType.department_id)"
            />
          </td>
          <task-type-cell class="name" :task-type="taskType" />
          <td class="allow-timelog">
            <boolean-rep
              :value="taskType.allow_timelog"
            />
          </td>
          <row-actions-cell
            :taskType-id="taskType.id"
            @delete-clicked="$emit('delete-clicked', taskType)"
            @edit-clicked="$emit('edit-clicked', taskType)"
          />
        </tr>
      </draggable>
      <draggable
        class="datatable-body"
        v-model="shotsItems"
        draggable=".tasktype-item"
        tag="tbody"
        :sort="true"
        @end="updatePriorityShots"
      >
        <tr class="datatable-type-header" slot="header">
          <th scope="rowgroup" colspan="4">
            <span class="datatable-row-header">
              {{ $t('shots.title') }}
            </span>
          </th>
        </tr>
        <tr
          class="datatable-row tasktype-item"
          v-for="taskType in shotsItems" :key="taskType.id"
        >
          <td class="department">
            <department-name
              :department="getDepartments(taskType.department_id)"
              v-if="!isEmpty(taskType.department_id)"
            />
          </td>
          <task-type-cell class="name" :task-type="taskType" />
          <td class="allow-timelog">
            <boolean-rep
              :value="taskType.allow_timelog"
            />
          </td>
          <row-actions-cell
            :taskType-id="taskType.id"
            @delete-clicked="$emit('delete-clicked', taskType)"
            @edit-clicked="$emit('edit-clicked', taskType)"
          />
        </tr>
      </draggable>
      <draggable
        class="datatable-body"
        v-model="editsItems"
        draggable=".tasktype-item"
        tag="tbody"
        :sort="true"
        @end="updatePriorityEdits"
      >
        <tr class="datatable-type-header" slot="header">
          <th scope="rowgroup" colspan="4">
            <span class="datatable-row-header">
              {{ $t('edits.title') }}
            </span>
          </th>
        </tr>
        <tr
          class="datatable-row tasktype-item"
          v-for="taskType in editsItems" :key="taskType.id"
        >
          <td class="department">
            <department-name
              :department="getDepartments(taskType.department_id)"
              v-if="!isEmpty(taskType.department_id)"
            />
          </td>
          <task-type-cell class="name" :task-type="taskType" />
          <td class="allow-timelog">
            <boolean-rep
              :value="taskType.allow_timelog"
            />
          </td>
          <row-actions-cell
            :taskType-id="taskType.id"
            @delete-clicked="$emit('delete-clicked', taskType)"
            @edit-clicked="$emit('edit-clicked', taskType)"
          />
        </tr>
      </draggable>

      <draggable
        class="datatable-body"
        v-model="episodesItems"
        draggable=".tasktype-item"
        tag="tbody"
        :sort="true"
        @end="updatePriorityEpisodes"
      >
        <tr class="datatable-type-header" slot="header">
          <th scope="rowgroup" colspan="4">
            <span class="datatable-row-header">
              {{ $t('episodes.title') }}
            </span>
          </th>
        </tr>
        <tr
          class="datatable-row tasktype-item"
          v-for="taskType in episodesItems" :key="taskType.id"
        >
          <td class="department">
            <department-name
              :department="getDepartments(taskType.department_id)"
              v-if="!isEmpty(taskType.department_id)"
            />
          </td>
          <task-type-cell class="name" :task-type="taskType" />
          <td class="allow-timelog">
            <boolean-rep
              :value="taskType.allow_timelog"
            />
          </td>
          <row-actions-cell
            :taskType-id="taskType.id"
            @delete-clicked="$emit('delete-clicked', taskType)"
            @edit-clicked="$emit('edit-clicked', taskType)"
          />
        </tr>
      </draggable>

    </table>
  </div>

  <table-info
    :is-loading="isLoading"
    :is-error="isError"
  />

  <p class="has-text-centered nb-task-types">
    {{ entries.length }} {{ $tc('task_types.number', entries.length) }}
  </p>

</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import BooleanRep from '@/components/widgets/BooleanRep'
import DepartmentName from '@/components/widgets/DepartmentName.vue'
import RowActionsCell from '@/components/cells/RowActionsCell'
import TableInfo from '@/components/widgets/TableInfo'
import TaskTypeCell from '@/components/cells/TaskTypeName'

export default {
  name: 'task-type-list',

  props: {
    entries: {
      type: Array,
      default: () => []
    },
    isError: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      assetsItems: [],
      shotsItems: [],
      editsItems: [],
      episodesItems: []
    }
  },

  components: {
    draggable,
    BooleanRep,
    DepartmentName,
    RowActionsCell,
    TableInfo,
    TaskTypeCell
  },

  mounted () {},

  computed: {
    ...mapGetters([
      'getDepartments'
    ]),

    assetTaskTypes () {
      return this.getTaskTypesForEntity('Asset')
    },

    shotTaskTypes () {
      return this.getTaskTypesForEntity('Shot')
    },

    editTaskTypes () {
      return this.getTaskTypesForEntity('Edit')
    },

    episodeTaskTypes () {
      return this.getTaskTypesForEntity('Episode')
    }
  },

  methods: {
    ...mapActions([
    ]),

    getTaskTypesForEntity (entity) {
      return this.entries.filter(taskType => taskType.for_entity === entity)
    },

    updatePriority (items) {
      const forms = []
      items.forEach((item, index) => {
        index += 1
        const form = {
          id: item.id,
          name: item.name,
          priority: String(index)
        }
        item.priority = index
        forms.push(form)
      })
      this.$emit('update-priorities', forms)
    },

    updatePriorityAssets () {
      this.updatePriority(this.assetsItems)
    },

    updatePriorityShots () {
      this.updatePriority(this.shotsItems)
    },

    updatePriorityEdits () {
      this.updatePriority(this.editsItems)
    },

    updatePriorityEpisodes () {
      this.updatePriority(this.episodesItems)
    },

    isEmpty (value) {
      return value === undefined || value === null || value === ''
    }
  },

  watch: {
    entries: {
      immediate: true,
      handler () {
        setTimeout(() => {
          this.assetsItems = JSON.parse(JSON.stringify(this.assetTaskTypes))
          this.shotsItems = JSON.parse(JSON.stringify(this.shotTaskTypes))
          this.editsItems = JSON.parse(JSON.stringify(this.editTaskTypes))
          this.episodesItems = JSON.parse(JSON.stringify(this.episodeTaskTypes))
        }, 100)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.department {
  width: 200px;
  min-width: 200px;
}

.name {
  width: 300px;
  min-width: 300px;
}

.priority {
  width: 80px;
  min-width: 80px;
}

.dedicated {
  width: 100px;
  min-width: 100px;
}

.allow-timelog {
  width: 100px;
  min-width: 100px;
  text-align: center;
}

.actions {
  min-width: 100px;
}

.color {
  width: 100px;
}

.tasktype-item[draggable=false] {
  cursor: grab;
}

.tasktype-item[draggable=true] {
  cursor: grabbing;
}

tr {
  cursor: pointer;
}
</style>
