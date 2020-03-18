<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search.user" clearable placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.search.content" clearable placeholder="内容" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.search.pre_translation" clearable placeholder="原答案" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.search.status" class="filter-item" clearable placeholder="状态" style="width: 110px;">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
      <el-table-column label="用户名" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="音频" width="320px" align="center">
        <template slot-scope="{row}">
          <audio ref="audio" :src="row.question.audio" controls="controls" @pause="onPause" @play="onPlay" />
        </template>
      </el-table-column>
      <el-table-column label="原答案" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.question.dialect.translation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈答案" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.translation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleShow(row)">
            查题
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :size.sync="listQuery.size" @pagination="getList" />

    <el-dialog :visible.sync="dialogQuestionVisible" title="题目">
      <el-form ref="dataForm" :rules="rules" :model="question" label-position="left" label-width="120px" style="width: 400px; margin-left:30px;">
        <el-form-item label="发布人">
          <span>{{ question.user.nickName }}</span>
        </el-form-item>
        <el-form-item label="音频">
          <audio ref="audio" :src="question.audio" controls="controls" @pause="onPause" @play="onPlay" />
        </el-form-item>
        <el-form-item label="地区">
          <span>{{ question.district.name }}</span>
        </el-form-item>
        <el-form-item label="正确答案">
          <span>{{ question.dialect.translation }}</span>
        </el-form-item>
        <el-form-item label="错误选择1">
          <span>{{ question.wrong1 }}</span>
        </el-form-item>
        <el-form-item label="错误选择2">
          <span>{{ question.wrong2 }}</span>
        </el-form-item>
        <el-form-item label="错误选择3">
          <span>{{ question.wrong3 }}</span>
        </el-form-item>
        <el-form-item label="点赞数">
          <span>{{ question.like }}</span>
        </el-form-item>
        <el-form-item label="难度">
          <span>{{ question.difficulty }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogQuestionVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, deleteOne } from '@/api/feedback'
import { show } from '@/api/question'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      statusOptions: [{
        value: 0,
        label: '未查看'
      }, {
        value: 1,
        label: '未接受'
      }, {
        value: 2,
        label: '已接受'
      }],
      audio: {
        playing: false
      },
      question: {
        audio: '',
        district: {
          name: ''
        },
        dialect: {
          translation: ''
        },
        user: {
          nickName: ''
        },
        wrong1: '',
        wrong2: '',
        wrong3: '',
        like: 0,
        difficulty: 0
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
          content: undefined,
          pre_translation: undefined,
          status: undefined
        }
      },
      dialogQuestionVisible: false,
      rules: []
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
        if (response.data.count != 0) {
          this.list.forEach(l => {
            l.question.audio = this.GLOBAL.baseURL + 'dialect/' + l.question.audio
            if (l.status == 0) {
              l.status = '未查看'
            } else if (l.status == 1) {
              l.status = '未接受'
            } else {
              l.status = '已接受'
            }
          })
        }
        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.getList()
    },
    // 查看题目
    handleShow(row) {
      const id = { id: row.question_id }
      show(id).then(response => {
        if (response.data.user_id == 0) {
          response.data.user.nickName = '管理员'
        }
        this.question = response.data
        this.question.audio = this.GLOBAL.baseURL + 'dialect/' + this.question.audio
        var wrong_arr = this.question.wrong.split(',')
        this.question.wrong1 = wrong_arr[0]
        this.question.wrong2 = wrong_arr[1]
        this.question.wrong3 = wrong_arr[2]
        console.log(this.question)
      })
      this.dialogQuestionVisible = true
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
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
    }
  }
}
</script>
