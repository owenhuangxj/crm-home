import authApi from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import avatorImg from '../../../static/image/avator.gif'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    userName: '',
    realName: '',
    avatar: avatorImg,
    introduction: '',
    visitor: false,
    roles: [],
    perms: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_REALNAME: (state, realName) => {
      state.realName = realName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMS: (state, perms) => {
      state.perms = perms
    },
    SET_VISITOR: (state, visitor) => {
      state.visitor = visitor
    }
  },

  actions: {
    // 用户名登录
    userLogin({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        authApi.loginAction(username, userInfo.password).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(response.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        authApi.getUserInfo(state.token).then(res => {
          if (!res) reject('res is null');
          if (!res.data) reject('res.data is null');
          if(!res.data.perms
            ||res.data.perms.length==0
            ||!res.data.perms
            ||res.data.perms.length==0){
            commit('SET_VISITOR', true)
          }else{
            commit('SET_VISITOR', false)
          }
          commit('SET_ROLES', res.data.roles)
          commit('SET_PERMS', res.data.perms)
          commit('SET_REALNAME', res.data.realName)
          commit('SET_USERNAME', res.data.userName)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        authApi.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        authApi.getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_USERNAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
