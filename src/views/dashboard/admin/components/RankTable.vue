<template>
<div>
  <p class="col-title" style="text-align:center">排行榜</p>
        <el-select 
          style="margin-bottom:10px;"
          v-model="district"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="请输入地区"
          @change="districtChange">
          <el-option
            v-for="item in districtList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
  <el-table :data="list" style="width: 100%;padding: 15px;" height="500">
    <el-table-column label="头像" width="100">
        <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" height="50" >
        </template>
      </el-table-column>
    <el-table-column label="用户名" width="150">
      <template slot-scope="scope">
        {{ scope.row.nickName}}
      </template>
    </el-table-column>
    <el-table-column label="正确率" width="115" align="center">
      <template slot-scope="scope">
        {{ scope.row.accuracy}} %
      </template>
    </el-table-column>
    <el-table-column label="答题总数" width="115" align="center">
      <template slot-scope="scope">
        {{ scope.row.total}}
      </template>
    </el-table-column>
    
  </el-table>

</div>
</template>

<script>
import { rank } from '@/api/dashboard'
import { getList } from '@/api/district'

export default {
  data() {
    return {
      list: null,
      district: '',
      districtList: []
    }
  },
  created() {
    this.fetchData()
    this.getDistrictList()
  },
  methods: {
    getDistrictList(){
      getList().then(response => {
        // console.log(response.data)
        this.districtList = response.data.map(item => {
          return { value: `${item.id}`, label: `${item.name}` };
        })
      })
    },
    districtChange(e){
      console.log(e)
      if(e == ''){
        this.fetchData()
      } else {
        let param = {
          district_id: e
        }
        this.list = []
        rank(param).then(response => {
          response.data.forEach(item => {
            let data = {
              nickName: item.user.nickName,
              avatarUrl: item.user.avatarUrl,
              total: item.total,
              accuracy: item.accuracy
            }
            this.list.push(data)
          });
        })
      }
    },
    fetchData() {
      rank().then(response => {
        this.list = response.data
      })
    }
  }
}
</script>
