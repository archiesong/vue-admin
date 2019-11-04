<template>
  <div :class="classObj" class="app-wrapper" :style="{ backgroundImage: themeBg ? `url(${require(`@/assets/custom-theme/${themeBg}`)})`: 'none'}">
    <el-scrollbar style="height:100%">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <navbar />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <right-panel v-if="showSettings">
          <settings />
        </right-panel>
        <footers />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView, Footers } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { theme } from '@/settings'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
    Footers
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      activeTheme: state => state.app.theme
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    themeBg() {
      const themeObj = theme.filter(item => {
        return item.name === this.activeTheme
      })
      return themeObj[0].backgroundImage
    }
  },
  created() {
    const body = document.querySelector('body')
    body.className = `theme-${this.activeTheme}`
  },

  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style lang="scss">
 .app-wrapper .el-scrollbar .el-scrollbar__wrap {
  overflow-x: auto;
}
</style>
<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/element-variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
