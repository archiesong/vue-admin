<template>
  <div class="navbar" :style="{background: variables.headerBg, color:variables.headerText}">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <theme-switch class="right-menu-item hover-effect" />
        <el-tooltip content="size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        @command="handleCommand"
      >
        <span class="avatar-wrapper el-dropdown-link">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile" icon="el-icon-user"> 个人中心</el-dropdown-item>

          <el-dropdown-item divided command="logout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        @command="handleCommand">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">
            <svg-icon icon-class="profile" />
            个人中心
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <span style="display:block;" @click="logout">
              <svg-icon icon-class="logout" />
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import ThemeSwitch from '@/components/ThemeSwitch'
import theme from '@/styles/theme'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull,
    SizeSelect,
    ThemeSwitch
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device']),
    variables() {
      return theme[this.$store.getters.theme]
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          // this.showDialog();
          break
        case 'logout': // 退出系统
          this.logout()
          break
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  padding: 0 12px 0 0;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height:64px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 64px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      // color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      outline: none;
      .avatar-wrapper {
        position: relative;
        outline: none;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          vertical-align: middle;
          border-radius: 10px;
          outline: none;
        }

        .el-icon-arrow-down {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 30px;
          // font-size: 12px;
        }
      }
    }

  }
}
.el-dropdown-menu__item{
  width: 160px;
}
.el-dropdown {
  color: inherit;
}
</style>
