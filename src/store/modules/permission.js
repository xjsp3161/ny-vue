// import { asyncRouterMap, constantRouterMap } from '@/router'
import { constantRouterMap, LayoutComponent, _import_ } from '@/router'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta) {
//     const s = roles.some(role => route.meta.title === role.meta.title)
//     return s
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(asyncRouterMap, roles) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (hasPermission(roles, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, roles)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

/**
 * 通过递归的方式处理后端返回的路由列表
 * @param roles
 */
function filterRouter(roles) {
  roles.forEach(route => {
    route.meta = { title: route.name, icon: route.icon }
    if (route.children !== null && route.children.length > 0) {
      if (route.component === null) {
        route.componentName = 'LayoutComponent'
        route.component = LayoutComponent
        route.redirect = '/sys/admin/test/test1'
      } else {
        route.componentName = route.component
        route.component = _import_(route.component)
        route.redirect = '/sys/admin/test/test1'
      }
      filterRouter(route.children)
    } else {
      route.component = _import_(route.component)
    }
  })
  return roles
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        // 过滤一下服务端返回的动态路由，设置meta属性
        // 原系统默认路由权限过滤方式
        // let accessedRouters
        // if (roles.indexOf('admin') >= 0) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }
        const consoleRoles = filterRouter(roles)
        console.log(consoleRoles)
        commit('SET_ROUTERS', consoleRoles)
        resolve()
      })
    }
  }
}

export default permission
