<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search.title" clearable placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="id" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="200px">
        <template slot-scope="{row}">
          <img :src="row.image" height="50">
        </template>
      </el-table-column>
      <el-table-column label="标题" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="{row}">
          <router-link :to="'/activity/edit/'+row.id">
            <el-button type="primary" size="mini">
              编辑
            </el-button>
          </router-link>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getAll, deleteOne } from '@/api/activity'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ActivityList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        search: {
          title: undefined
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 搜索
    handleFilter() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        if (Array.isArray(response.data.reslut)) {
          this.list = response.data.reslut
        } else {
          this.list = Object.values(response.data.reslut)
        }
        this.total = response.data.count
        if (response.data.count != 0) {
          this.list.forEach(list => {
            list.image = 'http://127.0.0.1:8000/activity/' + list.image
          })
        }
        this.listLoading = false
      })
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

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
