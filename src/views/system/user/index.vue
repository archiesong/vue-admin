<template>
  <div class="user-container clearfix">
    <department
      class="department-container"
      :depts="depts"
      @fetchDept="fetchDept"
      @handleFetchUser="handleFetchUser"
    />
    <el-card class="table-container" shadow="hover">
      <div class="filter-container">
        <el-input
          v-model="query.keywords"
          clearable
          prefix-icon="el-icon-search"
          placeholder="输入名称或者邮箱搜索"
          style="width: 200px;"
          class="filter -item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="query.enabled"
          placeholder="请选择"
          style="width: 140px;"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in enabledTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="success"
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >新增</el-button>
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>
      </div>
      <el-table v-loading="loading" :data="data" style="width:100%" size="small">
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="phone" label="电话" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column label="部门 / 岗位" align="center">
          <template slot-scope="{row}">
            <div>{{ row.dept.name }} / {{ row.job.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <div v-for="item in dicts" :key="item.id">
              <el-tag
                v-if="row.enabled.toString() === item.value"
                :type="row.enabled ? '' : 'info'"
              >{{ item.label }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="create_time"
          label="创建日期"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button
              v-waves
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleUpdate(row)"
            />
            <el-popover :ref="row.id" placement="top" width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button v-waves size="mini" type="text" @click="$refs[row.id].doClose()">取消</el-button>
                <el-button v-waves type="primary" size="mini" @click="handleDelete(row.id)">确定</el-button>
              </div>
              <el-button slot="reference" v-waves type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :hidden="total <= 0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        :layout="'total, prev, pager, next, sizes'"
        @pagination="init"
      />
    </el-card>
    <dialog-form
      ref="dialogForm"
      :dialog-form-visible="dialogFormVisible"
      :dicts="dicts"
      :depts="depts"
      :dialog-status="dialogStatus"
      @Visible="Visible"
    />
  </div>
</template>
<style lang="scss" scoped>
.user-container {
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px;
  display: flex;
  .table-container {
    flex: 1;
    min-height: calc(100vh - 124px);
    // height: calc(100vh - 124px);
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import Pagination from '@/components/Pagination'
import Department from './components/department'
import DialogForm from './components/form'
import waves from '@/directive/waves'
import { fetchDepts } from '@/api/dept'
export default {
  name: 'User',
  components: { Pagination, Department, DialogForm },
  directives: { waves },
  mixins: [initData, initDict],
  data() {
    return {
      depts: [],
      enabledTypeOptions: [
        { value: true, label: '激活' },
        { value: false, label: '锁定' }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      data: [],
      deptId: null
    }
  },
  created() {
    this.fetchDept()
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
      this.getDict('user_status')
    })
  },
  methods: {
    Visible(value) {
      this.dialogFormVisible = value
    },
    beforeInit() {
      this.url = 'api/users'
      this.params = Object.assign(
        { page: this.page, limit: this.limit },
        this.query
      )
      return true
    },
    fetchDept(deptName) {
      fetchDepts(deptName).then(res => {
        this.depts = res.data
      })
    },
    handleFetchUser(dept) {
      if (dept && parseInt(dept.pid)) {
        this.query.deptId = dept.id
      } else {
        delete this.query.deptId
      }
      this.init()
    },
    handleCreate() {
      this.$refs.dialogForm.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      console.log(row)
      this.$refs.dialogForm.JobsParmas.deptId = row.dept.id
      this.$refs.dialogForm.fetchJobs()
      this.$refs.dialogForm.ruleForm = {
        username: row.username,
        phone: row.phone,
        dept: row.dept.id,
        roleId: row.roles.id,
        enabled: row.enabled.toString(),
        email: row.email,
        job: row.job.id
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDownload() {},
    handleDelete() {}
  }
}
</script>
