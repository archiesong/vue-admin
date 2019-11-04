import { constantRoutes, filterAsyncRoutes } from '@/router'
import { buildMenus } from '@/api/menu'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      buildMenus().then(response => {
        const { data } = response
        const accessedRoutes = filterAsyncRoutes(data)
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
