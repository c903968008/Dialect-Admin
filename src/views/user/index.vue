<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search.nickName" clearable placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input-number controls-position="right" :min="0" v-model="listQuery.search.accuracy_min" clearable placeholder="正确率区间" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      —
      <el-input-number controls-position="right" :max="100" v-model="listQuery.search.accuracy_max" clearable placeholder="正确率区间" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="id" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" width="100px">
        <template slot-scope="{row}">
          <img :src="row.avatarUrl" height="50">
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正确答题数" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.right }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总答题数" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正确率" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.accuracy }} %</span>
        </template>
      </el-table-column>
      <el-table-column label="证书" width="210px" align="center">
        <template slot-scope="{row}">
          <span v-for="item in row.certificates">{{ item.name }} </br> </span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, deleteOne } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        search: {
          nickName: undefined,
          accuracy_min: undefined,
          accuracy_max: undefined
        }
      },
      dialogPvVisible: false,
      pvData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        if (Array.isArray(response.data.reslut)) {
          this.list = response.data.reslut
        } else {
          this.list = Object.values(response.data.reslut)
        }
        this.total = response.data.count
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.getList()
    },
    // 删除
    handleDelete(row) {
      const id = { id: row.id }
      deleteOne(id).then(response => {
        // this.$notify({
        //   message: '删除成功',
        //   type: 'success',
        //   duration: 2000
        // })
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    }
  }
}
</script>
