<template>
  <div id="menu-association">
    <el-dialog :title="dialog.title" width="1000px" :visible.sync="dialog.visiable" @close="closeDialog">
      <div class="content-layout">
        <div class="left-layout">
          <el-input size="small" v-model="leftData.filterName" placeholder="请输入内容"></el-input>
          <p><el-button size="mini" @click="clickRelation" :disabled="leftData.button.disabled" v-loading="leftData.button.loading" plain>{{leftData.button.text}}</el-button></p>
          <el-tree :expand-on-click-node="false" 
            :data="leftData.treeList" 
            highlight-current 
            :props="defaultProps" 
            ref="leftTree">
          </el-tree>
        </div>
        <div class="center-layout">
        </div>
        <div class="right-layout">
          <el-input size="small" v-model="rightData.filename" placeholder="请输入内容"></el-input>
          <p><el-button size="mini" @click="clickCancelRelation" v-loading="rightData.button.loading" plain>{{rightData.button.text}}</el-button></p>
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
        button: {
          text: '关联',
          loading: false
        }
      },
      rightData: {
        filterName: null,
        treeList: null,
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
      params.name = null
      fetchPermissionNoExistMenus(params).then(({ data }) => {
        this.mloading.hide()
        this.leftData.treeList = data.data
        this.pagination.total = data.total
      }).catch(error => {
        console.log(error)
      })
    },
    loadPermissionMenus(params = {}) {
      params.permissionId = this.permissionId
      params.name = null
      fetchPermissionMenus(params).then(({ data }) => {
        this.rightData.treeList = data
      }).catch(error => {
        console.log(error)
      })
    },
    closeDialog() {
      this.$emit('input', false)
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.loadRoleNoExistUsers()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.loadRoleNoExistUsers()
    },
    handleLeftSelectionChange(val) {
      this.leftData.multipleSelection = val
    },
    handleRightSelectionChange(val) {
      this.rightData.multipleSelection = val
    },
    clickRelation() {
      if (!this.$empty(this.leftData.multipleSelection)) {
        this.$setKeyValue(this.leftData.button, { text: '关联中..', loading: true })
        const params = []
        this.leftData.multipleSelection.forEach(element => {
          params.push({ userId: element.id, permissionId: this.permissionId })
        })
        crudPermissionMenus('post', '/admin/api/sysRole/batchRoleUsers', params).then(({ data }) => {
          this.$setKeyValue(this.leftData.button, { text: '关联', loading: false })
          this.loadRoleNoExistUsers()
          this.loadRoleUsers()
        }).catch(() => {
          this.$setKeyValue(this.leftData.button, { text: '关联', loading: false })
          this.$message({ type: 'error', message: '关联失败' })
        })
      }
    },
    clickCancelRelation() {
      if (!this.$empty(this.rightData.multipleSelection)) {
        this.$setKeyValue(this.rightData.button, { text: '取消关联中..', loading: true })
        const params = { permissionId: this.permissionId, menudIds: [] }
        this.rightData.multipleSelection.forEach(element => {
          params.menuIds.push(element.id)
        })
        crudPermissionMenus('post', '/admin/api/sysRole/cancelRoleUsers', params).then(({ data }) => {
          this.$setKeyValue(this.rightData.button, { text: '取消关联', loading: false })
          this.loadRoleNoExistUsers()
          this.loadRoleUsers()
        }).catch(() => {
          this.$setKeyValue(this.rightData.button, { text: '关联', loading: false })
          this.$message({ type: 'error', message: '取消关联失败' })
        })
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

