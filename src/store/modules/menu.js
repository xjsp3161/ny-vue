import { fetchMenuTree } from '@/api/menu'

const user = {
  state: {
    menuTree: null
  },

  mutations: {
    SET_MENU_TREE: (state, menuTree) => {
      state.menuTree = menuTree
    }
  },

  actions: {
    // 拉起菜单
    LoadMenuTre({ commit }, menuTree) {
      return new Promise((resolve, reject) => {
        fetchMenuTree(null).then(({ data }) => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
