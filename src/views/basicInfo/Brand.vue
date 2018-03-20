<template>
<div id="brand">
  <!-- <div class="list-header-layout">
    <div class="left">
      <el-input v-model="input" size="small" placeholder="支持编码或名称检索"></el-input>
    </div>
    <div class="left">
      <el-button type="primary" size="small">查询</el-button>
    </div>
    <div class="right">
      <el-button size="small" @click="clickShowDialog('save')">新增</el-button>
    </div>
  </div> -->
  <search-bar :data="searchBarData"></search-bar>
  <table-slot :height.sync="maxHeight">
    <div class="list-table-layout" slot="table">
      <el-table :data="tableData" border :size="listPageTableSize" :max-height="maxHeight" style="width: 100%;">
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="品牌编码" align="center"></el-table-column>
        <el-table-column prop="name" label="品牌名称" align="center"></el-table-column>
        <el-table-column prop="status" label="条码生成规则" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center"></el-table-column>
        <el-table-column prop="updateUser" label="最后更新人" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="最后更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain>编辑</el-button>
            <el-button type="danger" size="mini" plain>删除</el-button>
            <el-button type="info" size="mini" plain>禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" slot="footer">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="defaultPageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </table-slot> 

  <el-dialog :title="dialogTitle" :close-on-click-modal="false" width="360px" :visible.sync="dialogFormVisible">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="品牌编码" :rules="rules.input" prop="code">
        <el-input size="small" class="w180" placeholder="请输入" v-model="ruleForm.code"></el-input>
      </el-form-item>
      <el-form-item label="品牌名称" :rules="rules.input" prop="name">
        <el-input size="small" class="w180" placeholder="请输入" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="条码生成规则" prop="rule">
        <el-select size="small" class="w180" v-model="ruleForm.rule" placeholder="请选择">
          <el-option label="商品编码+尺码" value="0"></el-option>
          <el-option label="商品编码+颜色+尺码" value="1"></el-option>
          <el-option label="不自动生成" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select size="small" class="w180" v-model="ruleForm.status" placeholder="请选择" disabled>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="buttonLoading" size="small" type="primary" @click="clickSaveOrUpdate()">{{buttonText}}</el-button>
      <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import { fetchList } from '@/api/brand.js'
import model from '@/public/model.js'
import SearchBar from '@/components/SearchBar/index.vue'
export default {
  mixins: [model],
  name: 'brand',
  components: { SearchBar },
  data() {
    return {
      input: '',
      ruleForm: {
        name: null,
        code: null,
        rule: '1',
        status: '1'
      },
      searchBarData: [
        [
          { type: 'input', value: null, key: 'codeOrName', placeholder: '请输入' },
          { name: '查询', type: 'search' },
          { name: '重置', type: 'reset' }
        ],
        [
          { name: '新增', type: 'add' }
        ]
      ],
      rules: {}
    }
  },
  created() {
    this.buttonText = '确 定'
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList(null).then(response => {
        this.tableData = response.data.items
      })
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    clickShowDialog(type) {
      this.dialogTitle = type === 'save' ? '新增' : '编辑'
      this.dialogFormVisible = true
    },
    clickSaveOrUpdate() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true
          this.buttonText = '保存中...'
        } else {
          this.buttonLoading = true
          this.buttonText = '确 定'
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
