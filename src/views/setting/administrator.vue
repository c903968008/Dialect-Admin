<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search.name" placeholder="管理员名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.search.role_id" placeholder="请选择角色" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
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
      <el-table-column label="头像" align="center" width="100px">
        <template slot-scope="{row}">
          <img :src="row.avatar" height="50" >
        </template>
      </el-table-column>
      <el-table-column label="管理员名称" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="210px" align="center">
        <template slot-scope="{row}">
          <span v-for="item in row.roles">{{ item.name }} </br> </span> 
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

    <el-dialog :title="textMap['create']" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:30px;">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="action"
            :show-file-list="false"
            ref="upload"
            :on-change="avatarChange"
            :before-upload="beforeAvatarUpload"
            accept="image/png,image/gif,image/jpg,image/jpeg">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="管理员名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role_ids">
          <el-select v-model="temp.role_ids" multiple placeholder="请选择" style="width:400px">
            <el-option
              v-for="item in role"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap['update']" :visible.sync="dialogFormVisibleEdit">
      <el-form ref="dataForm" :rules="rulesEdit" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:30px;">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="action"
            :show-file-list="false"
            ref="upload"
            :on-change="avatarChange"
            :before-upload="beforeAvatarUpload"
            accept="image/png,image/gif,image/jpg,image/jpeg">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="管理员名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role_ids">
          <el-select v-model="temp.role_ids" multiple placeholder="请选择" style="width:400px">
            <el-option
              v-for="item in role"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData">
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
import axios from 'axios'
import { getAll, create, update, deleteOne } from '@/api/administrator'
import { getOption } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'District',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20,
        search: {
          name: undefined,
          role_id: undefined
        }
      },
      role: null,
      temp: {
        id: undefined,
        role_ids: [],
        name: '',
        password: '',
        avatar: null
      },
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      imageUrl: '',
      formData: null,
      dialogPvVisible: false,
      pvData: [],
      rulesEdit: {
        name: [{ required: true, message: '管理员名称必填', trigger: 'blur' }],
        role_ids: [{ type: 'array', required: true, message: '角色必填', trigger: 'change' }]
      },
      rules: {
        name: [{ required: true, message: '管理员名称必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        role_ids: [{ type: 'array', required: true, message: '角色必填', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getRole()
  },
  methods: {
    avatarChange(file){
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      this.formData = new FormData()
      this.formData.append('avatar',file)
      return false
    },
    getRole() {
      getOption().then(response => {
        this.role = response.data
      })
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
        this.list.forEach(list => {
          list.avatar = 'http://127.0.0.1:8000/avatars/' + list.avatar
        });
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        name: '',
        password: '',
        role_ids: [],
        avatar: null
      }
    },
    // 添加按钮弹框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.imageUrl = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加
    createData() {
      if (this.imageUrl == ''){
        this.formData = new FormData()
      }
      this.formData.append('name', this.temp.name)
      this.formData.append('password', this.temp.password)
      this.formData.append('role_ids', this.temp.role_ids)
      this.$refs.upload.submit()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.formData).then(res => {
            console.log(res)
            this.list.unshift(this.temp)
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
      this.temp = Object.assign({}, row) // copy obj
      this.$set( this.temp, 'role_ids', this.temp.roles.map(function (role) {
        return role.id
      }))
      this.dialogStatus = 'update'
      this.dialogFormVisibleEdit = true
      console.log({
        temp: this.temp,
        row: this.row
      })
      this.imageUrl = this.temp.avatar
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.imageUrl.substr(0,4) == 'http'){
            this.formData = new FormData()
          }
          this.formData.append('id', this.temp.id)
          this.formData.append('name', this.temp.name)
          if(this.temp.password != undefined){
            this.formData.append('password', this.temp.password)
          }
          this.formData.append('role_ids', this.temp.role_ids)
          this.$refs.upload.submit()
          console.log({ok:this.temp})
          update(this.formData).then(response => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                response.data.avatar = 'http://127.0.0.1:8000/avatars/' + response.data.avatar
                this.list.splice(index, 1, response.data)
                break
              }
            }
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>