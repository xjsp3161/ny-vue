<template>
  <div id="menu-association">
    <el-dialog :title="dialog.title" width="1000px" :visible.sync="dialog.visiable" @close="closeDialog">
      <div class="content-layout">
        <div class="left-layout">
          <el-input size="small" v-model="leftData.filterName" placeholder="请输入内容"></el-input>
          <p>
            <el-button size="mini" @click="clickRelation" :disabled="leftData.button.disabled" v-loading="leftData.button.loading" plain>{{leftData.button.text}}</el-button>
            未关联菜单
          </p>
          <el-tree :expand-on-click-node="false" 
            :data="leftData.treeList" 
            highlight-current 
            show-checkbox
            :props="defaultProps" 
            @check-change="handlerLeftTreeCheckChange"
            ref="leftTree">
          </el-tree>
        </div>
        <div class="center-layout">
        </div>
        <div class="right-layout">
          <el-input size="small" v-model="rightData.filename" placeholder="请输入内容"></el-input>
          <p>
            <el-button size="mini" @click="clickCancelRelation" v-loading="rightData.button.loading" plain>{{rightData.button.text}}</el-button>
            已关联菜单
          </p>
          <el-tree :expand-on-click-node="false" 
            :data="rightData.treeList" 
            highlight-current 
            show-checkbox
            :props="defaultProps" 
            @check-change="handlerRightTreeCheckChange"
            ref="leftTree">
          </el-tree>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import parent from '@/public/parent.js'
import addModel from '@/public/addModel.js'
import { fetchPermissionNoExistMenus, fetchPermissionMenus } from '@/api/menu'
import { crudPermissionMenus } from '@/api/permissionMenu'
export default {
  name: 'menu-association',
  mixins: [parent, addModel],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      leftData: {
        filterName: null,
        treeList: null,
        selectList: [],
        button: {
          text: '关联',
          loading: false
        }
      },
      rightData: {
        filterName: null,
        treeList: null,
        selectList: [],
        button: {
          text: '取消关联',
          loading: false
        }
      },
      roleId: null
    }
  },
  created() {
    this.$setKeyValue(this.dialog, { title: '角色关联用户', visiable: true })
    this.permissionId = this.data.obj.id
  },
  mounted() {
    this.createDefaultMLoading('.el-dialog')
    this.loadPermissionNoExistMenus()
    this.loadPermissionMenus()
  },
  methods: {
    loadPermissionNoExistMenus(params = {}) {
      this.mloading.show()
      params.permissionId = this.permissionId
      fetchPermissionNoExistMenus(params).then(({ data }) => {
        this.mloading.hide()
        if (data != null) {
          this.leftData.treeList = data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    loadPermissionMenus(params = {}) {
      params.permissionId = this.permissionId
      fetchPermissionMenus(params).then(({ data }) => {
        if (data != null) {
          this.rightData.treeList = data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    closeDialog() {
      this.$emit('input', false)
    },
    clickRelation() {
      if (!this.$empty(this.leftData.selectList)) {
        this.$setKeyValue(this.leftData.button, { text: '关联中..', loading: true })
        const params = []
        this.leftData.selectList.forEach(element => {
          params.push({ menuId: element, permissionId: this.permissionId })
        })
        crudPermissionMenus('post', '/admin/api/sysPermission/batchPermissionMenus', params).then(({ data }) => {
          this.$setKeyValue(this.leftData.button, { text: '关联', loading: false })
          this.loadPermissionNoExistMenus()
          this.loadPermissionMenus()
        }).catch(() => {
          this.$setKeyValue(this.leftData.button, { text: '关联', loading: false })
          this.$message({ type: 'error', message: '关联失败' })
        })
      }
    },
    clickCancelRelation() {
      if (!this.$empty(this.rightData.selectList)) {
        this.$setKeyValue(this.rightData.button, { text: '取消关联中..', loading: true })
        const params = { permissionId: this.permissionId, menuIds: [] }
        this.rightData.selectList.forEach(element => {
          params.menuIds.push(element)
        })
        crudPermissionMenus('post', '/admin/api/sysPermission/cancelPermissionMenus', params).then(() => {
          this.$setKeyValue(this.rightData.button, { text: '取消关联', loading: false })
          this.loadPermissionNoExistMenus()
          this.loadPermissionMenus()
        }).catch(() => {
          this.$setKeyValue(this.rightData.button, { text: '取消关联', loading: false })
          this.$message({ type: 'error', message: '取消关联失败' })
        })
      }
    },
    handlerLeftTreeCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.leftData.selectList.push(data.id)
      } else {
        const selectList = this.leftData.selectList
        if (selectList.length > 0 && selectList.indexOf(data.id) !== -1) {
          this.leftData.selectList.splice(selectList.indexOf(data.id), 1)
        }
      }
    },
    handlerRightTreeCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.rightData.selectList.push(data.id)
      } else {
        const selectList = this.rightData.selectList
        if (selectList.length > 0 && selectList.indexOf(data.id) !== -1) {
          this.rightData.selectList.splice(selectList.indexOf(data.id), 1)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content-layout{
  width: 100%;
  height: 600px;
  .left-layout {
    padding: 5px;
    width: 450px;
    float: left;
    border: 1px solid #d9d9d9;
  }
  .center-layout {
    width: 60px;
    float: left;
    height: 100%;
    text-align: center;
    vertical-align: middle;
    button {
      margin: 0 auto;
      margin-top: 10px;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .right-layout {
    padding: 5px;
    border: 1px solid #d9d9d9;
    width: 450px;
    float: left;
  }
}
</style>

