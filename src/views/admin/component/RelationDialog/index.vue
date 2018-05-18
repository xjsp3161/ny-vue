<template>
  <div id="relation-dialog">
    <el-dialog :title="dialog.title" width="1000px" :visible.sync="dialog.visiable" @close="closeDialog">
      <div class="content-layout">
        <div class="left-layout">
          <el-input size="small" v-model="leftData.filterName" placeholder="请输入内容"></el-input>
          <p><el-button size="mini" @click="clickRelation" :disabled="leftData.button.disabled" v-loading="leftData.button.loading" plain>{{leftData.button.text}}</el-button></p>
          <el-table ref="leftTable" :data="leftData.tableData" size="mini" style="width: 100%" height="400" @selection-change="handleLeftSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="noRelationText" prop="name"></el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page"
            :page-sizes="pagination.pageSizes"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next"
            :total="pagination.total">
          </el-pagination>
        </div>
        <div class="center-layout">
        </div>
        <div class="right-layout">
          <el-input size="small" v-model="rightData.filename" placeholder="请输入内容"></el-input>
          <p><el-button size="mini" @click="clickCancelRelation" v-loading="rightData.button.loading" plain>{{rightData.button.text}}</el-button></p>
          <el-table ref="leftTable" :data="rightData.tableData" height="400" size="mini" style="width: 100%" @selection-change="handleRightSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :label="relationText" prop="name"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import parent from '@/public/parent.js'
import addModel from '@/public/addModel.js'
import { noRelation, relation, batchSave, batchDelete } from '@/api/adminRelationDialog'
export default {
  name: 'relation-dialog',
  mixins: [parent, addModel],
  data() {
    return {
      leftData: {
        filterName: null,
        tableData: null,
        multipleSelection: null,
        button: {
          text: '关联',
          loading: false
        }
      },
      rightData: {
        filterName: null,
        tableData: null,
        multipleSelection: null,
        button: {
          text: '取消关联',
          loading: false
        }
      },
      urls: {
        noRelation: null,
        relation: null,
        batchSave: null,
        batchDelete: null
      },
      relationText: null,
      noRelationText: null,
      pagination: {
        pageSizes: [10, 20, 50, 100], // 默认分页可选择的每页显示的页数
        size: 20, // 分页每页默认显示10条
        page: 1, // 当前默认第一页
        total: 0 // 总条数
      },
      idKey: null,
      idVal: null,
      relationIdKey: null,
      multipleIdKey: null
    }
  },
  created() {
    this.noRelationText = '未关联' + this.data.relation
    this.relationText = '已关联' + this.data.relation
    const title = this.data.title + '关联' + this.data.relation
    this.$setKeyValue(this.dialog, { title: title, visiable: true })
    this.idKey = this.data.idKey
    this.idVal = this.data.obj.id
    this.relationIdKey = this.data.relationIdKey
    this.multipleIdKey = this.data.multipleIdKey
    this.$setKeyValue(this.urls, this.data.urls)
  },
  mounted() {
    this.createDefaultMLoading('.el-dialog')
    this.loadNoRelation()
    this.loadRelation()
  },
  methods: {
    loadNoRelation(params = {}) {
      this.mloading.show()
      const { page, size } = this.pagination
      params.page = page
      params.size = size
      params[[this.idKey]] = this.idVal
      params.name = null
      noRelation(this.urls.noRelation, params).then(({ data }) => {
        this.mloading.hide()
        this.leftData.tableData = data.data
        this.pagination.total = data.total
      }).catch(error => {
        console.log(error)
      })
    },
    loadRelation(params = {}) {
      params[[this.idKey]] = this.idVal
      params.name = null
      relation(this.urls.relation, params).then(({ data }) => {
        this.rightData.tableData = data
      }).catch(error => {
        console.log(error)
      })
    },
    closeDialog() {
      this.$emit('input', false)
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.loadNoRelation()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.loadNoRelation()
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
          params.push({ [this.relationIdKey]: element.id, [this.idKey]: this.idVal })
        })
        batchSave(this.urls.batchSave, params).then(({ data }) => {
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
      if (!this.$empty(this.rightData.multipleSelection)) {
        this.$setKeyValue(this.rightData.button, { text: '取消关联中..', loading: true })
        const params = { [this.idKey]: this.idVal, [this.multipleIdKey]: [] }
        this.rightData.multipleSelection.forEach(element => {
          params.roleIds.push(element.id)
        })
        batchDelete(this.urls.batchDelete, params).then(({ data }) => {
          this.$setKeyValue(this.rightData.button, { text: '取消关联', loading: false })
          this.loadNoRelation()
          this.loadRelation()
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

