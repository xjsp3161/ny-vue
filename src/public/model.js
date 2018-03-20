export default {
  data() {
    return {
      loading: false,
      loadingText: '加载中..',
      dialogFormVisible: false,
      dialogTitle: null,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      defaultPageSizes: [10, 20, 50, 100],
      listPageHeaderElementSize: 'small',
      listPageTableSize: 'mini',
      listPageTableButtonSize: 'mini',
      listPageTableColumnAlign: 'center',
      tableData: null,
      buttonLoading: false,
      buttonText: null,
      maxHeight: 0
    }
  }
}
