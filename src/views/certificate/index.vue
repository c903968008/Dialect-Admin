<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search.name" clearable placeholder="证书名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input-number v-model="listQuery.search.rank" :min="1" :max="10" placeholder="级别" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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
      <!-- <el-table-column label="证书图片" align="center" width="150px">
        <template slot-scope="{row}">
          <el-popover placement="right" title="" trigger="hover">
            <img :src="row.image">
            <img slot="reference" :src="row.image" :alt="row.image" style="max-height: 50px;max-width: 130px">
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column label="证书名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.district.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证书级别" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="答题正确数量" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:30px;">
        <el-form-item label="所属省" prop="province">
          <el-select v-model="temp.province" @change="selectProvince" class="filter-item" placeholder="请选择">
            <el-option v-for="item in district.province" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属市" prop="city">
          <el-select v-model="temp.city" clearable class="filter-item" placeholder="请选择">
            <el-option v-for="item in district.city" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="地区" prop="district_id">
          <el-select
            v-model="districtValue"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in districtOptions"
              :key="item.districtValue"
              :label="item.districtLabel"
              :value="item.districtValue">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="证书名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- <el-form-item label="证书图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :auto-upload="false"
            :show-file-list="false"
            ref="upload"
            :data="imgData"
            :on-change="imgChange"
            :on-success="uploadSuccess">
            <img v-if="temp.image" :src="temp.image" class="avatar">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="证书描述" prop="description">
          <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
        <el-form-item label="证书级别" prop="rank" type="number">
          <el-input-number v-model="temp.rank" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="答题正确数量" prop="num">
          <el-input-number v-model="temp.num" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

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
import { getAll, create, update, deleteOne } from '@/api/certificate'
import { getOption, getPrevious } from '@/api/district'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Certificate',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      imgUrl: '',
      imgData: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        search: {
          name: undefined,
          rank: undefined
        }
      },
      district:  {
        province: [],
        city: []
      },
      districtOptions: [],
      districtValue: [],
      districtList: [],
      loading: false,
      states: ["Alabama", "Alaska", "Arizona",
        "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida",
        "Georgia", "Hawaii", "Idaho", "Illinois",
        "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland",
        "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana",
        "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania",
        "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas",
        "Utah", "Vermont", "Virginia",
        "Washington", "West Virginia", "Wisconsin",
        "Wyoming"],
      temp: {
        id: undefined,
        name: '',
        province: undefined,
        city: undefined,
        num: 1,
        description: '',
        rank: 1,
        district_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        province: [{ required: true, message: '地区必填', trigger: 'blur' }],
        name: [{ required: true, message: '证书名称必填', trigger: 'blur' }],
        rank: [{ required: true, message: '证书级别必填', trigger: 'blur' }],
        num: [{ required: true, message: '答题正确数量必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getDistrict()
  },
  // mounted() {
      // this.districtList = this.states.map(item => {
      //   return { value: `value:${item}`, label: `label:${item}` };
      // });
  //     console.log(this.districtList)
  //   },
  methods: {
    // imgChange(file, fileList){
    //   console.log(file.raw)
    //   console.log(file.name)
    //   // this.temp.image = URL.createObjectURL(file.raw);
    //   console.log(this.temp.image)
    //   this.imgUrl = URL.createObjectURL(file.raw);
    // },
    // uploadSuccess(res, file){
      
    // },
    // remoteMethod(query) {
    //     if (query !== '') {
    //       this.loading = true;
    //       setTimeout(() => {
    //         this.loading = false;
    //         this.districtOptions = this.districtList.filter(item => {
    //           return item.label.toLowerCase()
    //             .indexOf(query.toLowerCase()) > -1;
    //         });
    //       }, 200);
    //     } else {
    //       this.districtOptions = [];
    //     }
    //   },
    getList() {
      this.listLoading = true
      getAll(this.listQuery).then(response => {
        if (Array.isArray(response.data.reslut)){
          this.list = response.data.reslut
        } else {
          this.list = Object.values(response.data.reslut)
        }
        this.total = response.data.count
        if(response.data.count != 0){
          this.list.forEach(l => {
            l.image = 'http://localhost:8000/' + l.image
          });
        }
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    getDistrict() {
      let param = {
        p_id: 0
      }
      getOption(param).then(response => {
        this.district.province = response.data
      })
    },
    // 选择一级地区,获取二级地区
    selectProvince(value){
      console.log(value)
      this.$set(this.temp, 'city', undefined)
      let param = {
        p_id: value
      }
      getOption(param).then(response => {
        this.district.city = response.data
      })
    },
    // 搜索
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        name: '',
        num: 1,
        description: '',
        rank: 1,
        district_id: 0
      }
    },
    // 添加按钮弹框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // console.log(this.temp)
          // console.log('province:'+this.temp.province)
          // console.log('city:'+this.temp.city)
          if (typeof this.temp.city == 'undefined'){
            this.temp.district_id = this.temp.province
          } else {
            this.temp.district_id = this.temp.city
          }
          // console.log(this.temp)
          create(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑按钮弹框
    handleUpdate(row) {
      // console.log(this.district)
      this.temp = Object.assign({}, row) // copy obj
      if (this.temp.district.p_id == 0){
        this.$set(this.temp, 'province', this.temp.district_id)
      } else {
        let param = {
          p_id: this.temp.district.p_id
        }
        getPrevious(param).then(response => {
          this.selectProvince(response.data.id);
          this.$set(this.temp, 'province', response.data.id)
          this.$set(this.temp, 'city', this.temp.district_id)
        })
      }
      // console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (typeof this.temp.city == 'undefined'){
            this.temp.district_id = this.temp.province
          } else {
            this.temp.district_id = this.temp.city
          }
          console.log(this.temp)
          const tempData = Object.assign({}, this.temp)
          update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除
    handleDelete(row) {
      const id = { id: row.id }
      deleteOne(id).then(response => {
        this.$notify({
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>