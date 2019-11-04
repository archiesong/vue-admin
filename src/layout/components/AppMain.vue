<template>
  <section class="app-main" :style="{background: variables.mainBg}">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import theme from '@/styles/theme'
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    variables() {
      return theme[this.$store.getters.theme]
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 64= navbar 64  */
  min-height: calc(100vh - 64px);
  width: 100%;
  position: relative;
  overflow: hidden;
  // background-color: #fafbfe;
}

.fixed-header+.app-main {
  padding-top: 64px;
}

.hasTagsView {
  .app-main {
    /* 98 = navbar + tags-view = 64 + 34 */
    min-height: calc(100vh - 98px);
  }

  .fixed-header+.app-main {
    padding-top: 98px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
