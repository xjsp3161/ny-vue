<template>
  <div id="menu-relation">
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
            ref="rightTree">
          </el-tree>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import parent from '@/public/parent.js'
import addModel from '@/public/addModel.js'
import { noRelation, relation, batchSave, batchDelete } from '@/api/permissionMenu'
export default {
  name: 'menu-relation',
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
    this.$setKeyValue(this.dialog, { title: '权限关联菜单', visiable: true })
    this.permissionId = this.data.obj.id
  },
  mounted() {
    this.createDefaultMLoading('.el-dialog')
    this.loadNoRelation()
    this.loadRelation()
  },
  methods: {
    loadNoRelation(params = {}) {
      this.mloading.show()
      params.permissionId = this.permissionId
      noRelation(params).then(({ data }) => {
        this.mloading.hide()
        this.leftData.treeList = data != null ? data : []
      }).catch(error => {
        console.log(error)
      })
    },
    loadRelation(params = {}) {
      params.permissionId = this.permissionId
      relation(params).then(({ data }) => {
        this.rightData.treeList = data != null ? data : []
      }).catch(error => {
        console.log(error)
      })
    },
    closeDialog() {
      this.$emit('input', false)
    },
    clickRelation() {
      const selectList = this.$refs.leftTree.getCheckedNodes()
      if (!this.$empty(selectList)) {
        this.$setKeyValue(this.leftData.button, { text: '关联中..', loading: true })
        const params = []
        selectList.forEach(item => {
          params.push({ menuId: item.id, permissionId: this.permissionId })
        })
        batchSave(params).then(({ data }) => {
          this.$setKeyValue(this.leftData.button, { text: '关联', loading: false })
          this.loadNoRelation()
          this.loadRelation()
        }).catch(() => {
          this.$setKeyValue(this.leftData.button, { text: '关联', loading: false })
          this.$message({ type: 'error', message: '关联失败' })
        })
      }
    },
    clickCancelRelation() {
      const selectList = this.$refs.rightTree.getCheckedNodes()
      if (!this.$empty(selectList)) {
        this.$setKeyValue(this.rightData.button, { text: '取消关联中..', loading: true })
        const menuIds = []
        selectList.forEach(item => {
          menuIds.push(item.id)
        })
        const params = { permissionId: this.permissionId, menuIds: menuIds }
        batchDelete(params).then(() => {
          this.$setKeyValue(this.rightData.button, { text: '取消关联', loading: false })
          this.loadNoRelation()
          this.loadRelation()
        }).catch(() => {
          this.$setKeyValue(this.rightData.button, { text: '取消关联', loading: false })
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

