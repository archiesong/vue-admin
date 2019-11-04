<template>
  <div>
    <svg-icon icon-class="theme" @click="dialogVisible = true" />
    <el-dialog title="主题设置" width="600px" :visible.sync="dialogVisible" append-to-body>
      <el-row :gutter="20" class="theme-container">
        <el-col v-for="(item, index) in theme" :key="index" class="theme-item" :span="6" @click.native="checkTheme(item.name)">
          <el-tooltip placement="top" :content="item.title">
            <div class="theme-box" :alt="item.title" :style="{ backgroundImage: item.backgroundImage ? `url(${require(`@/assets/custom-theme/${item.backgroundImage}`)})`: 'none'}">
              <div class="header-theme" :style="{background: item.top }" />
              <div class="slide-theme" :style="{background: item.slide }">
                <div class="logo-theme" :style="{background: item.logo }" />
              </div>
            </div>
          </el-tooltip>
          <i v-if="activeTheme == item.name " class="check-theme el-icon-check" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTheme">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { theme } from '@/settings'
export default {
  data() {
    return {
      dialogVisible: false,
      theme,
      activeTheme: this.$store.getters.theme
    }
  },
  methods: {
    checkTheme(name) {
      this.activeTheme = name
    },
    handleTheme() {
      this.$store.dispatch('app/setTheme', this.activeTheme).then(() => {
        this.dialogVisible = false
        setTimeout(() => {
          this.$message({
            message: '切换主题成功!',
            type: 'success'
          })
        }, 100)
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.theme-container{
  .theme-item{
    box-sizing: border-box;
    height:90px;
    margin-bottom: 20px;
    position: relative;
    .check-theme{
      position: absolute;
      font-size:30px;
      color: #1890ff;
      left: 50%;
      top: 40%;
      z-index: 999;
    }
    .theme-box{
      box-sizing: border-box;
      width: 100%;
      height:100%;
      position: relative;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      font-size: 12px;
      color: #666;
      background-color: #f2f2f2;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      transition: all .2s ease-in-out;
      &:hover{
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
      }
      .header-theme{
        box-sizing: border-box;
        position: relative;
        z-index: 10;
        height: 15px;
        background-color: #fff;
        border-top-right-radius: 3px;
      }
      .slide-theme{
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        width: 30px;
        height: 100%;
        z-index: 11;
        box-shadow: 1px 0 2px 0 rgba(0,0,0,.05);
        background-color: #20222A;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        .logo-theme{
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 15px;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
          border-top-left-radius: 3px;

        }
      }
    }
  }
}

</style>
