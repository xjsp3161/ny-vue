<template>
  <div id="SearchBar" class="search-bar">
    <slot></slot>
    <template v-if="data && data.length > 0">
      <div class="left" v-for="(item, index) in data[0]" :key="index">
        <template v-if="item.type === 'input'">
          <el-input v-model="item.value" size="small" @keyup.enter.native="keyCneterSearch" :placeholder="item.placeholder"></el-input>
        </template>
        <template v-else-if="item.type === 'search'">
          <el-button type="primary" size="small" @click="clickSearch">{{item.name}}</el-button>
        </template>
        <template v-else-if="item.type === 'reset'">
          <el-button type="primary" size="small" @click="clickReset">{{item.name}}</el-button>
        </template>
      </div>
      <template v-esle-if="data.length > 1">
        <div class="right">
          <div class="left" v-for="(item,index) in data[1]" :key="index">
            <template v-if="item.type === 'add'">
              <el-button size="small" @click="clickAdd">{{item.name}}</el-button>
            </template>
          </div>
        </div>
      </template>
    </template>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  methods: {
    clickSearch() {
      console.log('search')
    },
    clickReset() {
      console.log('reset')
    },
    keyCneterSearch() {
      console.log('keyCenterSearch')
    },
    clickAdd() {
      console.log('add')
    }
  },
  watch: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
div.left {
  margin-left: 5px;
}
</style>