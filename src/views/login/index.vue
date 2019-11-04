<template>
  <div
    class="login-container"
    :style="{backgroundImage:`url(${require(`@/assets/bg_images/login-bg-${bgUrlIndex}.jpg`)})`}"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="off"
        ><span slot="prefix" class="svg-container">
          <svg-icon icon-class="user" />
        </span></el-input>
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="大写锁定开启" placement="right" manual>
        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="off"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          > <span slot="prefix" class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <span slot="suffix" class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-input>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="captcha">
        <el-input
          v-model="loginForm.captcha"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <span slot="prefix" class="svg-container">
            <svg-icon icon-class="captcha" />
          </span>
        </el-input>
        <div class="login-captcha">
          <img :src="captchaUrl" @click="getCaptcha">
        </div>
      </el-form-item>
      <el-checkbox
        v-model="loginForm.rememberMe"
      >记住我</el-checkbox>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px; margin-top:20px;"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import defaultSettings from '@/settings'
import { encrypt, decrypt } from '@/utils/rsaEncrypt'
import { validUsername } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('The captcha can not be less than 4 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: Cookies.get('username') ? Cookies.get('username') : '',
        password: Cookies.get('password')
          ? decrypt(Cookies.get('password'))
          : '',
        captcha: '',
        rememberMe: Cookies.get('rememberMe')
          ? Boolean(Cookies.get('rememberMe'))
          : false
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: 'blur', validator: validateCaptcha }
        ]
      },
      bgUrlIndex: 0,
      captchaUrl: '',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.bgToggle()
    this.getCaptcha()
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {},
  methods: {
    bgToggle() {
      setInterval(() => {
        if (this.bgUrlIndex > 5) this.bgUrlIndex = 0
        this.bgUrlIndex++
      }, 1000 * 5)
    },
    getCaptcha() {
      this.$store.dispatch('user/captcha').then(response => {
        const base64 = window.btoa(response.data)
        this.captchaUrl = 'data:image/svg+xml;base64,' + base64
      })
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'a' && key <= 'z')) ||
          (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const { username, password, rememberMe } = this.loginForm
          if (rememberMe) {
            Cookies.set('username', username, {
              expires: defaultSettings.defaultCookieExpires
            })
            Cookies.set('password', encrypt(password), {
              expires: defaultSettings.defaultCookieExpires
            })
            Cookies.set('rememberMe', rememberMe, {
              expires: defaultSettings.defaultCookieExpires
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              try {
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                })
              } catch (error) {
                console.log(error)
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
              this.getCaptcha()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #606266;
$cursor: #606266;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    input {
      height: 38px;
      background: transparent;
      -webkit-appearance: none;
      color: $light_gray;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #606266;
$light_gray: #707070;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    background-clip: padding-box;
    box-shadow: 0 6px 12px rgba(0,0,0,.4);
    border: 5px solid rgba(0,100,200,.3);
    padding: 30px 35px 0;
    width: 450px;
    max-width: 100%;
    overflow: hidden;
    border-radius: 10px;
    // width: 520px;
    // max-width: 100%;
    // padding: 30px 35px 0;
    // background-color: rgba(255, 255, 255, 1);
    // background-clip: padding-box;
    // overflow: hidden;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    // border: 5px solid rgba(0, 100, 200, 0.3);
    // border-radius: 10px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 0px 4px 0px 4px;
    color: $light_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 4px;
    top: 2px;
    font-size: 16px;
    // color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .el-checkbox {
    color: $dark_gray;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .login-captcha {
    width: 33%;
    // height: 50px;
    float: right;
    text-align: center;
    img {
      cursor: pointer;
      vertical-align: middle;
      // width: 100%;
      height: inherit;
      // padding: 5px 0;
      text-align: center;
    }
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
