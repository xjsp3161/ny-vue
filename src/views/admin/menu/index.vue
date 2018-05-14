<!-- 基础信息 - 品牌 -->
<template>
<div id="menu">
  <search-bar :data="searchBarData" @search="searchAction" @add="showAdd()" @command="clickMoreCommand">
      <div class="left" slot="rightFirst">
        <el-button size="small" @click="menuTree.visiable=true">显示菜单树</el-button>
      </div>
  </search-bar>
  <table-contain :height.sync="table.maxHeight">
    <el-table :data="table.data" slot="table" :size="table.size" :max-height="table.maxHeight" style="width: 100%;">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" align="center"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center"></el-table-column>
      <el-table-column prop="url" label="URL" align="center"></el-table-column>
      <el-table-column prop="parentName" label="父级" align="center"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center"></el-table-column>
      <el-table-column prop="level" label="等级" align="center"></el-table-column>
      <el-table-column prop="name" label="国际化" align="center"></el-table-column>
      <el-table-column prop="path" label="资源路径" align="center"></el-table-column>
      <el-table-column prop="component" label="前端组件" align="center"></el-table-column>
      <el-table-column prop="enable" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
         <el-button type="primary" size="mini" @click="clickEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="clickDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      slot="footer"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next"
      :total="pagination.total">
    </el-pagination>
  </table-contain> 
  <add v-if="add.visiable" v-model="add.visiable" :data="add.data" @add="handleCurrentChange(1)" @edit="fetchData"></add>
  <menu-tree v-if="menuTree.visiable" v-model="menuTree.visiable"></menu-tree>
</div>
</template>
<script>
import { fetchList, crud } from '@/api'
import model from '@/public/indexModel.js'
import Add from './add.vue'
import MenuTree from './component/MenuTree.vue'
export default {
  mixins: [model],
  name: 'user',
  components: { Add, MenuTree },
  data() {
    return {
      searchBarData: [
        [
          { type: 'input', value: null, key: 'nameOrCode', placeholder: '编码或名称模糊检索', class: 'w130' },
          { type: 'search', name: '查询' },
          { type: 'reset', name: '重置' }
        ],
        [
          { type: 'add', name: '新增' }
        ]
      ],
      menuTree: {
        visiable: false
      }
    }
  },
  mounted() {
    this.createDefaultMLoading('#menu')
    this.fetchData()
  },
  methods: {
    fetchData(params = {}) {
      this.mloading.show()
      const { page, size } = this.pagination
      params.page = page
      params.size = size
      fetchList('/admin/api/sysMenu', params).then(({ data }) => {
        this.mloading.hide()
        this.table.data = data.data
        this.pagination.total = data.total
      }).catch((error) => {
        this.mloading.error(error.message, () => {
          this.fetchData()
        })
      })
    },
    searchAction(params) {
      this.fetchData(params)
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.fetchData()
    },
    clickMoreCommand(command) {
      this.$message({ message: command, type: 'success' })
    },
    clickEdit(index, row) {
      this.$setKeyValue(this.add, { visiable: true, data: { type: 'edit', obj: row }})
    },
    showAdd() {
      this.$setKeyValue(this.add, { visiable: true, data: { type: 'add' }})
    },
    clickDelete(index, row) {
      this.$confirm('是否需要删除数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crud('delete', { id: row.id }).then(() => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.fetchData()
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败!' })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>