<template>
  <el-table :data="list" style="width: 100%;padding: 15px;">
    <el-table-column label="头像" min-width="70">
        <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" height="50" >
        </template>
      </el-table-column>
    <el-table-column label="用户名" min-width="100">
      <template slot-scope="scope">
        {{ scope.row.nickName}}
      </template>
    </el-table-column>
    <el-table-column label="正确率" width="100" align="center">
      <template slot-scope="scope">
        {{ scope.row.accuracy}} %
      </template>
    </el-table-column>
    
  </el-table>
</template>

<script>
import { rank } from '@/api/dashboard'

export default {
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      rank().then(response => {
        this.list = response.data
      })
    }
  }
}
</script>
