<template>
  <div class="card-box" :style="{width: deptWidth}">
    <el-card shadow="hover">
      <div slot="header">
        <el-input
          v-model="deptName"
          clearable
          placeholder="输入部门名称搜索"
          prefix-icon="el-icon-search"
          style="width: 100%;"
          class="filter-item"
          @change="fetchDept"
        />
      </div>
      <el-scrollbar>
        <el-tree
          :data="depts"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-scrollbar>
    </el-card>
    <el-button v-show="toggleType" class="icon-btn" icon="el-icon-d-arrow-left" @click="toggleCard" />
    <el-button
      v-show="!toggleType"
      class="icon-btn"
      icon="el-icon-d-arrow-right"
      @click="toggleCard"
    />
  </div>
</template>
<style lang="scss">
.card-box {
  .el-card {
    .el-card__body {
      height: calc(100% - 73px);
    }
  }
  .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;

    }
  }
}
</style>
<style lang="scss" scoped>
.card-box {
  position: relative;
  transition: width 1s ease;
  margin-right: 35px;
  min-height: calc(100vh - 124px);
  .el-card {
    .el-scrollbar {
      height: 100%;
    }
    height: 100%;
  }
  .icon-btn {
    position: absolute;
    right:0;
    transform: translateX(100%);
    top: 50%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: 20px 5px;
  }
}
</style>
<script>
export default {
  props: {
    depts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      deptName: '',
      deptWidth: '23%',
      toggleType: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
  },
  methods: {
    toggleCard() {
      this.deptWidth = this.toggleType ? '0px' : '23%'
      this.toggleType = !this.toggleType
    },
    fetchDept() {
      this.$emit('fetchDept', this.deptName)
    },
    handleNodeClick(dept) {
      this.$emit('handleFetchUser', dept)
    }

  }
}
</script>
