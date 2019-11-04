// import md5 from 'js-md5'
import { captcha, login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import defaultSettings from '@/settings'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  uuid: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ENABLED: (state, enabled) => {
    state.enabled = enabled
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_CREATE_TIME: (state, create_time) => {
    state.create_time = create_time
  },
  SET_JOB: (state, job) => {
    state.job = job
  },
  SET_DEPT: (state, dept) => {
    state.dept = dept
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user captcha
  captcha({ commit }) {
    return new Promise((resolve, reject) => {
      captcha().then(response => {
        const { data } = response
        commit('SET_UUID', data.uuid)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  login({ commit, state }, userInfo) {
    const { username, password, captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password, captcha: captcha.trim(), uuid: state.uuid }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, name, avatar, enabled, email, create_time, job, dept, phone } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_ROLES', roles || defaultSettings.systemDefaultRole)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ENABLED', enabled)
        commit('SET_EMAIL', email)
        commit('SET_JOB', job)
        commit('SET_DEPT', dept)
        commit('SET_PHONE', phone)
        commit('SET_CREATE_TIME', create_time)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
