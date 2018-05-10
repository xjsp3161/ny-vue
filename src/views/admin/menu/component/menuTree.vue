<template>
  <div id="menu-tree">
    <el-dialog :title="dialog.title" width="1000px" :visible.sync="dialog.visiable" @close="closeDialog">
      <div class="content-layout">
        <div class="tree-layout">
        <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree class="filter-tree" @node-click="treeNodeClick" :data="treeList" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="tree"></el-tree>
      </div>
      <div class="info-layout">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" id="form" class="demo-ruleForm" :inline="true">
          <el-form-item label="名称" prop="name">
            <el-input size="small" class="w180"  placeholder="请输入" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="icon" prop="icon">
            <el-input size="small" class="w180"  placeholder="请输入" v-model="form.icon"></el-input>
          </el-form-item>
          <el-form-item label="url" prop="url">
            <el-input size="small" class="w180"  placeholder="请输入" v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="父级" prop="parentName">
            <el-input size="small" class="w180" disabled  v-model="form.parentName"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input size="small" class="w180" v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="等级" prop="level">
            <el-input size="small" class="w180" disabled v-model="form.level"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="resourceUrl">
            <el-input size="small" class="w180" v-model="form.path"></el-input>
          </el-form-item>
          <el-form-item label="国际化" prop="webComponent">
            <el-input size="small" class="w180" v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="前端组件" prop="webComponent">
            <el-input size="small" class="w180" v-model="form.component"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="enable">
            <el-radio v-model="form.enable" label="1">启用</el-radio>
            <el-radio v-model="form.enable" label="0">禁用</el-radio>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" class="w180" :rows="2" placeholder="请输入内容" v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
      </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import parent from '@/public/parent.js'
import { fetchMenuTree } from '@/api/menu.js'
import addModel from '@/public/addModel.js'
export default {
  name: 'menu-tree',
  mixins: [parent, addModel],
  data() {
    return {
      filterText: '',
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      form: {
        id: null,
        title: null,
        url: null,
        icon: null,
        sort: null,
        level: null,
        parentId: null,
        parentName: null,
        name: null,
        path: null,
        component: null,
        description: null,
        enable: 1
      },
      rules: {
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.$setKeyValue(this.dialog, { title: '菜单树', visiable: true })
  },
  mounted() {
    this.createDefaultMLoading('#menu-tree')
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchMenuTree(null).then(({ data }) => {
        this.mloading.hide()
        this.treeList = data
      }).catch((error) => {
        this.mloading.error(error.message, () => {
          this.fetchData()
        })
      })
    },
    treeNodeClick(data, node, tree) {
      this.form = {
        id: data.id,
        name: data.name,
        title: data.title,
        icon: data.icon,
        url: data.url,
        parentName: data.parentName,
        sort: data.sort,
        level: data.level,
        path: data.path,
        component: data.component,
        description: data.description,
        enable: data.enable
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    closeDialog() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.content-layout {
  width: 100%;
  height: 800px;
}
.tree-layout {
  float: left;
  width: 50%;
  height: 500px;
  max-height: 500px;
}
.info-layout {
  margin-top: 50px;
  float: left;
  position: relative;
  width: 50%;
}
</style>

