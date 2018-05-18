<template>
  <div id="brand-add">
    <el-dialog :title="dialog.title" width="370px" :visible.sync="dialog.visiable" @close="closeDialog">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" id="form" class="demo-ruleForm" :inline="true">
        <el-form-item label="名称" prop="name" :rules="[{validator: rules.existName, trigger:'blur', required: true, data: data.obj}]">
          <el-input size="small" class="w180" placeholder="请输入" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url" :rules="[{validator: rules.existUrl, trigger:'blur', required: true, data: data.obj}]">
          <el-input size="small" class="w180" placeholder="请输入" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="URL请求类型" prop="urlRequestType">
          <el-select size="small" class="w180" v-model="form.urlRequestType" placeholder="请选择">
            <el-option v-for="item in options.urlRequestTypes" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input size="small" class="w180" placeholder="请输入" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select size="small" class="w180" v-model="form.status" placeholder="请选择">
            <el-option v-for="item in options.status" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="button.loading" size="small" type="primary" @click="clickSaveOrUpdate('form')">{{button.text}}</el-button>
        <el-button size="small" @click="dialog.visiable = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import addModel from '@/public/addModel.js'
import rules from '@/public/rules.js'
import { fetchInfo, crud, checkExist } from '@/api/resource'
export default {
  mixins: [addModel, rules],
  data() {
    return {
      form: {
        id: null,
        name: null,
        url: null,
        urlRequestType: null,
        description: null,
        status: 1
      },
      options: {
        urlRequestTypes: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' }
        ],
        status: [
          { value: 0, label: '禁用' },
          { value: 1, label: '启用' }
        ]
      },
      rules: {
        existName: (rule, value, callback) => {
          if (this.$empty(value)) {
            return callback(new Error('请输入'))
          }
          if (rule.data && value === rule.data.name) {
            return callback()
          }
          checkExist({ name: value }).then(({ data }) => {
            if (data) {
              callback(new Error('已存在,请勿重复添加'))
            } else {
              callback()
            }
          })
        },
        existUrl: (rule, value, callback) => {
          if (this.$empty(value)) {
            return callback(new Error('请输入'))
          }
          if (rule.data && value === rule.data.url) {
            return callback()
          }
          checkExist({ url: value }).then(({ data }) => {
            if (data) {
              callback(new Error('已存在,请勿重复添加'))
            } else {
              callback()
            }
          })
        }
      }
    }
  },
  created() {
    const title = this.data.type === 'add' ? '新增' : '编辑'
    this.$setKeyValue(this.dialog, { title: title, visiable: true })
  },
  mounted() {
    if (this.data.type === 'edit') {
      this.createDefaultMLoading('.el-dialog')
      this.loadInfo()
    }
  },
  methods: {
    loadInfo() {
      const { obj } = this.data
      this.mloading.show()
      fetchInfo({ id: obj.id }).then(({ data }) => {
        this.form = data
        this.mloading.close()
      }).catch(error => this.mloading.error(error, () => this.loadInfo()))
    },
    closeDialog() {
      this.$emit('input', false)
    },
    clickSaveOrUpdate() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.data.type === 'edit' && this.$compareObjValue(this.data.obj, this.form)) {
            this.$message({ type: 'warning', message: '数据并未改变' })
            return
          }
          this.$setKeyValue(this.button, { loading: true, text: '提交中..' })
          if (this.data.type === 'add') {
            crud('post', this.form).then(() => this.success()).catch(() => this.error())
          } else {
            crud('put', this.form).then(() => this.success()).catch(() => this.error())
          }
        }
      })
    },
    success() {
      this.$message({ type: 'success', message: this.dialog.title + '成功' })
      this.closeDialog()
      if (this.data.type === 'add') {
        this.$emit('add')
      } else {
        this.$emit('edit')
      }
    },
    error() {
      this.$message({ type: 'error', message: this.dialog.title + '失败' })
      this.$setKeyValue(this.button, { loading: false, text: '确定' })
    }
  }
}
</script>