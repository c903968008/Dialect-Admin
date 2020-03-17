<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search.user" clearable placeholder="发布人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.search.dialect" placeholder="正确答案" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.search.district" placeholder="地区" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input-number v-model="listQuery.search.difficulty" :min="1" :max="10" placeholder="难度" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="id" prop="id" align="center" width="55">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.district.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="音频" width="320px" align="center">
        <template slot-scope="{row}">
          <audio ref="audio" @pause="onPause" @play="onPlay" :src="row.audio" controls="controls"></audio>
        </template>
      </el-table-column>
      <el-table-column label="正确答案" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dialect.translation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="错误答案" width="120px" align="center">
        <template slot-scope="{row}">
          <span v-for="item in row.wrong_arr">{{item}}<br></span>
        </template>
      </el-table-column>
      <el-table-column label="难度" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.difficulty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="答对次数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.answer_right }}</span>
        </template>
      </el-table-column>
      <el-table-column label="答题总数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.answer_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点赞次数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.like }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px" class-name="small-padding fixed-width" fixed="right">
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
          <el-select v-model="temp.city" clearable @change="selectCity" class="filter-item" placeholder="请选择">
            <el-option v-for="item in district.city" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="正确答案" prop="ddid">
          <el-select
            v-model="temp.ddid"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod">
            <el-option
              v-for="item in dialect.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> 
        <el-form-item label="错误选择1" prop="wrong1">
          <el-input v-model="temp.wrong1" />
        </el-form-item>
        <el-form-item label="错误选择2" prop="wrong2">
          <el-input v-model="temp.wrong2" />
        </el-form-item>
        <el-form-item label="错误选择3" prop="wrong3">
          <el-input v-model="temp.wrong3" />
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-input-number v-model="temp.difficulty" :min="1" :max="10"/>
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
import { getAll, create, update, deleteOne } from '@/api/question'
import { getOption, getPrevious } from '@/api/district'
import { getOptionDialect } from '@/api/dialect'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Certificate',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      audio: {
        playing: false
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        search: {
          user: undefined,
          district: undefined,
          dialect: undefined,
          difficulty: undefined,
        }
      },
      district:  {
        province: [],
        city: []
      },
      dialect_id: undefined,
      dialect: {
        options: [],
        value: [],
        list: [],
        loading: false,
      },
      temp: {
        id: undefined,
        user_id: 0,
        province: undefined,
        city: undefined,
        wrong: '',
        wrong1: '',
        wrong2: '',
        wrong3: '',
        district_id: undefined,
        difficulty: 0,
        ddid: undefined
      },
      temp_dialect: undefined,
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
        ddid: [{ required: true, message: '正确答案必填', trigger: 'blur' }],
        wrong1: [{ required: true, message: '错误选择必填三个', trigger: 'blur' }],
        wrong2: [{ required: true, message: '错误选择必填三个', trigger: 'blur' }],
        wrong3: [{ required: true, message: '错误选择必填三个', trigger: 'blur' }],
        difficulty: [{ required: true, message: '难度必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getDistrict()
  },
  methods: {
    // 控制音频的播放与暂停
    startPlayOrPause () {
      return this.audio.playing ? this.pause() : this.play()
    },
    // 播放音频
    play () {
      this.$refs.audio.play()
    },
    // 暂停音频
    pause () {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay () {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause () {
      this.audio.playing = false
    },
    remoteMethod(query) {
      this.dialect.options = []
      if (query !== '') {
        this.dialect.loading = true;
        setTimeout(() => {
          this.dialect.loading = false;
          this.$set(this.dialect,'options',this.dialect.list.filter(item => {
            return item.label.indexOf(query) > -1;
          }))
        }, 200);
        console.log(this.dialect.options)
      } else {
        this.dialect.options = [];
      }
    },
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
            if (l.user_id == 0){
              l.user= { nickName : '管理员' }
            }
            l.audio = 'http://127.0.0.1:8000/dialect/' + l.audio
            l.wrong_arr = l.wrong.split(',')
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
      // console.log(value)
      this.$set(this.temp, 'city', undefined)
      this.$set(this.temp, 'ddid', undefined)
      let param = {
        p_id: value
      }
      getOption(param).then(response => {
        this.district.city = response.data
      })
      let param2 = {
        district_id: value
      }
      getOptionDialect(param2).then(response => {
        this.dialect.list = response.data.map(item => {
          return { value: `${item.id}`, label: `${item.translation}` };
        })
      })
    },
    // 选择二级地区，获取方言
    selectCity(value){
      this.$set(this.temp, 'ddid', undefined)
      let param2 = {
        district_id: value
      }
      getOptionDialect(param2).then(response => {
        this.dialect.list = response.data.map(item => {
          return { value: `${item.id}`, label: `${item.translation}` };
        })
      })
    },
    // 搜索
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        user_id: 0,
        wrong: '',
        district_id: 0,
        difficulty: 0
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
          if (typeof this.temp.city == 'undefined'){
            this.temp.district_id = this.temp.province
          } else {
            this.temp.district_id = this.temp.city
          }
          this.temp.wrong = this.temp.wrong1 + ',' + this.temp.wrong2 + ',' + this.temp.wrong3
          this.temp.dialect_id = this.temp.ddid
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
      let wrong_arr = row.wrong.split(',')
      this.$set(this.temp, 'wrong1', wrong_arr[0])
      this.$set(this.temp, 'wrong2', wrong_arr[1])
      this.$set(this.temp, 'wrong3', wrong_arr[2])
      let param2 = {
        district_id: row.district_id
      }
      getOptionDialect(param2).then(response => {
        this.dialect.list = response.data.map(item => {
          return { value: `${item.id}`, label: `${item.translation}` };
        })
      })
      this.temp_dialect = row.dialect.id
      this.$set(this.temp, 'ddid', row.dialect.translation)
      if (this.temp.district.p_id == 0){
        this.$set(this.temp, 'province', this.temp.district_id)
      } else {
        let param = {
          p_id: this.temp.district.p_id
        }
        getPrevious(param).then(response => {
          this.selectProvince(response.data.id)
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
          this.temp.wrong = this.temp.wrong1 + ',' + this.temp.wrong2 + ',' + this.temp.wrong3
          var numReg = /^[0-9]+$/
          var numRe = new RegExp(numReg)
          if (!numRe.test(this.temp.ddid)){
            this.temp.dialect_id = this.temp_dialect
          } else {
            this.temp.dialect_id = this.temp.ddid
          }
          // console.log(this.temp_dialect)
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