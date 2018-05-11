export default {
  data() {
    return {
      filterText: '',
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      OperationTypes: {
        Find: 0,
        Add: 1,
        Edit: 2,
        Delete: 3
      },
      currentOperationTypes: 0,
      originalForm: {
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
        enable: null
      },
      form: null,
      rules: {
      }
    }
  }
}
