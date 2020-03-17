<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search.translation" clearable placeholder="普通话" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.search.district" clearable placeholder="地区" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.search.user" clearable placeholder="发布人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.search.status" class="filter-item" clearable placeholder="状态" style="width: 110px;">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" @click="handleAudit">
        自动审核
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
      <el-table-column label="地区" width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.district.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="音频" width="320px" align="center">
        <template slot-scope="{row}">
          <audio ref="audio" @pause="onPause" @play="onPlay" :src="row.audio" controls="controls"></audio>
        </template>
      </el-table-column>
      <el-table-column label="意译" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.translation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px" align="center">
        <template slot-scope="{row}">
          <el-select v-model="row.status" @visible-change="visibleStatus(row)" @change="selectStatus" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px" class-name="small-padding fixed-width">
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

    <el-dialog :title="textMap[create]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:30px;">
        <el-form-item label="所属省" prop="province">
          <el-select v-model="temp.province" @change="selectProvince(value)" class="filter-item" placeholder="请选择">
            <el-option v-for="item in district.province" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属市" prop="city">
          <el-select v-model="temp.city" clearable class="filter-item" placeholder="请选择">
            <el-option v-for="item in district.city" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <p style="color:red;float:left;">*&nbsp;</p><el-form-item label="音频文件" prop="audio">
          <el-upload
            class="upload-demo"
            drag
            action="action"
            ref="upload"
            :on-change="avatarChange"
            :before-upload="beforeAvatarUpload"
            accept=".wav,.mp3">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">上传文件</div>
            <div class="el-upload__tip" slot="tip" v-if="fileName">{{ fileName }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="方言意译" prop="translation">
          <el-input v-model="temp.translation" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[update]" :visible.sync="dialogFormVisibleEdit">
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
        <p style="color:red;float:left;">*&nbsp;</p><el-form-item label="音频文件" prop="audio">
          <el-upload
            class="upload-demo"
            drag
            action="action"
            ref="upload"
            :on-change="avatarChange"
            :before-upload="beforeAvatarUpload"
            accept=".wav,.mp3">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">上传文件</div>
            <div class="el-upload__tip" slot="tip" v-if="fileName">{{ fileName }}</div>
            <div class="el-upload__tip" slot="tip" v-else>已存在文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="方言意译" prop="translation">
          <el-input v-model="temp.translation" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">
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
import { getAll, create, update, deleteOne, audit, autoAudit } from '@/api/dialect'
import { getOption, getPrevious } from '@/api/district'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Dialect',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      statusList: [{
        value: 0,
        label: '未审核'
      },{
        value: 1,
        label: '不通过'
      },{
        value: 2,
        label: '通过'
      }],
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
          status: undefined,
          user: undefined,
          district: undefined,
          translation: undefined
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
      temp: {
        id: undefined,
        translation: '',
        province: undefined,
        city: undefined,
        district_id: undefined,
        status: 2
      },
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      fileUrl: '',
      fileName: '',
      formData: null,
      pvData: [],
      rules: {
        province: [{ required: true, message: '地区必填', trigger: 'blur' }],
        translation: [{ required: true, message: '意译必填', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
    this.getDistrict()
  },
  methods: {
    handleAudit(){
      autoAudit().then(response => {
        if(response.code == 200){
          this.$notify({
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.getList();
        }
      })
    },
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
    avatarChange(file){
      // console.log(file)
      this.fileName = file.name
      this.fileUrl = URL.createObjectURL(file.raw)
      this.temp.audio = file.name
      // console.log(fileUrl)
    },
    beforeAvatarUpload(file) {
      this.formData = new FormData()
      this.formData.append('audio',file)
      return false
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.search.status === ''){
        this.listQuery.search.status = undefined
      }
      getAll(this.listQuery).then(response => {
        if (Array.isArray(response.data.reslut)){
          this.list = response.data.reslut
        } else {
          this.list = Object.values(response.data.reslut)
        }
        this.total = response.data.count
        if(response.data.count != 0){
          this.list.forEach(l => {
            if(l.user_id == 0){
              l.user = { nickName : '管理员' }
            }
            l.audio = 'http://127.0.0.1:8000/dialect/' + l.audio
          });
        }
        console.log(this.list)
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
    visibleStatus(row){
      // console.log(row)
      if (this.temp_id != row.id){
        this.temp_id = row.id
      }
    },
    // 审核
    selectStatus(value){
      // console.log({value:value,temp_id:this.temp_id})
      const param = { 
        id: this.temp_id,
        status: value  
      }
      audit(param).then(response => {
        this.$notify({
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 选择一级地区,获取二级地区
    selectProvince(value){
      // console.log(value)
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
        translation: '',
        province: undefined,
        city: undefined,
        district_id: undefined,
        status: 2
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
      if (this.fileUrl == ''){
        this.formData = new FormData()
      }
      if (typeof this.temp.city == 'undefined'){
        this.formData.append('district_id', this.temp.province)
      } else {
        this.formData.append('district_id', this.temp.city)
      }
      this.formData.append('translation', this.temp.translation)
      this.formData.append('status', 2)
      this.$refs.upload.submit()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.formData).then(() => {
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
      this.fileUrl == ''
      // console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisibleEdit = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.fileUrl == ''){
            this.formData = new FormData()
          }
          this.formData.append('id', this.temp.id)
          if (typeof this.temp.city == 'undefined'){
            this.formData.append('district_id', this.temp.province)
          } else {
            this.formData.append('district_id', this.temp.city)
          }
          this.formData.append('translation', this.temp.translation)
          this.formData.append('status', 2)
          this.$refs.upload.submit()
          console.log(this.temp)
          update(this.formData).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                response.data.audio = 'http://127.0.0.1:8000/dialect/' + response.data.audio
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.getList()
            this.dialogFormVisibleEdit = false
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