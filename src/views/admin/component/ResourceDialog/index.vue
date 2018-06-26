<template>
  <div id="menu-relation">
    <el-dialog :title="dialog.title" width="1000px" :visible.sync="dialog.visiable" @close="closeDialog">
      <div class="content-layout">
        <div class="checkbox-layout" v-for="(item, index) in resourceTree" :key="index">
          <el-checkbox v-model="item.checked" :indeterminate="item.indeterminate" @change="handleCheckAllChange($event, item)" class="checkbox-title">{{item.name}}</el-checkbox>
          <br/>
          <el-checkbox v-for="(sub, subIndex) in item.children" :checked="sub.checked" @change="handleCheckChange($event, item, sub)" :label="sub.name" :key="subIndex">{{sub.name}}</el-checkbox>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script src="./index.js"></script>
<style lang="scss" scoped>
.content-layout {
  width: 100%;
  height: 600px;
  .checkbox-layout {
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 1px solid rgba(232, 232, 232, 0.9);
    .checkbox-title {
      font-weight: 1000;
      font-size: 18px;
      padding-bottom: 3px;
    }
  }
}
.el-checkbox {
  margin-top: 5px;
}
.el-checkbox {
  margin-left: 20px;
}
</style>


