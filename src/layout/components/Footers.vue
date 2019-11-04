<template>
  <footer class="main-footer">
    <span>&copy; 2019 Song Chao <a href="javascript:void(0);">Apache License 2.0</a></span>
    <span>-</span>
    <a href="javascript:void(0);">鄂ICP备18005431号</a>
  </footer>
</template>
<script>
export default {
  name: 'Footers',
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.main-footer{
    background: none repeat scroll 0 0 #fff;
    border-top: 1px solid #e7eaec;
    overflow: hidden;
    padding: 10px 10px 0;
    height: 33px;
    font-size: .7rem!important;
    color: #7a8b9a;
    letter-spacing: .8px;
    font-family: Arial,sans-serif!important;
    z-index: 99;
}
</style>
