<template>
  <el-dialog
    :title="textMap[dialogStatus]"
    :visible.sync="dialogFormVisible"
    :before-close="cancel"
    append-to-body
    width="618px"
  >
    <el-form ref="dataForm" :model="ruleForm" :rules="rules" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" placeholder="输入用户名" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="输入电话" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" placeholder="输入邮箱" />
      </el-form-item>
      <el-form-item label="部门" style="display: inline-block;">
        <select-tree
          ref="treeSelect"
          v-model="ruleForm.dept"
          placeholder="选择部门"
          clearable
          filterable
          :options="depts"
          :props="defaultProps"
          @selected="handlerClear"
          @handleSelect="handleSelect"
        />
      </el-form-item>
      <el-form-item label="岗位" style="display: inline-block;">
        <el-select v-model="ruleForm.job" placeholder="选择岗位">
          <el-option
            v-for="(item, index) in jobs"
            :key="item.name + index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio
          v-for="item in dicts"
          :key="item.id"
          v-model="ruleForm.enabled"
          :label="item.value"
        >{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item label="角色" prop="role" style="display:block;">
        <el-select v-model="ruleForm.roleId" placeholder="请选择" style="width:100%;">
          <el-option
            v-for="(item, index) in roles"
            :key="item.name + index"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>
<style scoped>
</style>
<script>
import SelectTree from '@/components/SelectTree'
import { fetchJobs } from '@/api/job'
import { fetchRoles } from '@/api/role'
import { createUser, updateUser } from '@/api/user'
import { validUsername, validPhone, validEmail } from '@/utils/validate'
export default {
  name: 'DialogForm',
  components: {
    SelectTree
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    depts: {
      type: Array,
      default: () => []
    },
    dialogStatus: {
      type: String,
      default: ''
    },
    dicts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名!'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的电话号码!'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱地址!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      defaultProps: {
        parent: 'pid', // 父级唯一标识
        value: 'id', // 唯一标识
        label: 'name', // 标签显示
        children: 'children' // 子级
      },
      JobsParmas: {
        page: 1,
        limit: 9999
      },
      jobs: [],
      roles: [],
      ruleForm: {
        username: null,
        phone: '',
        dept: '',
        roleId: '',
        enabled: '',
        email: '',
        job: ''
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        enabled: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      }
    }
  },
  created() {
    this.fetchRoles()
  },
  methods: {
    cancel() {
      this.$emit('Visible', false)
      this.$nextTick(() => {
        this.resetForm()
        this.$refs.treeSelect.clearHandler()
        this.$refs['dataForm'].clearValidate()
      })
    },
    fetchRoles() {
      fetchRoles().then(res => {
        this.roles = res.data
      })
    },
    fetchJobs() {
      fetchJobs(this.JobsParmas).then(res => {
        this.jobs = res.data
      })
    },
    handleSelect(data, node) {
      this.ruleForm.job = ''
      this.JobsParmas.deptId = data.id
      this.fetchJobs(this.JobsParmas)
    },
    handlerClear() {
      this.jobs = []
      this.ruleForm.job = ''
    },
    resetForm() {
      this.ruleForm = {
        username: '',
        phone: '',
        dept: '',
        role: '',
        status: '',
        email: '',
        job: ''
      }
      this.JobsParmas.deptId = ''
      this.jobs = []
    },
    handleSubmit() {
      switch (this.dialogStatus) {
        case 'create':
          this.createData()
          break
        case 'update':
          this.updateData()
          break
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.ruleForm).then(response => {
            console.log(response)
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.ruleForm).then(response => {
            console.log(response)
          })
        }
      })
    }
  }

}
</script>
