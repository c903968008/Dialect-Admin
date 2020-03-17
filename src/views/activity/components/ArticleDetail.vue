<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          提交
        </el-button>
      </sticky>

      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="title" label-width="45px" label="标题:" class="postInfo-container-item">
                <el-input v-model="postForm.title" placeholder="请输入标题" />
              </el-form-item>
            </el-col>

            <el-col :span="16">
              <el-form-item prop="time" label-width="120px" label="发布时间:" class="postInfo-container-item">
                <el-date-picker v-model="postForm.time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择发布时间" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-form-item prop="image" style="margin-bottom: 30px;" label="图片:">

          <div class="upload-container">
            <el-upload
              ref="upload"
              v-model="imageUrl"
              :multiple="false"
              class="image-uploader"
              action="action"
              :show-file-list="false"
              :on-change="imgChange"
              :before-upload="beforeimgUpload"
              accept="image/png,image/gif,image/jpg,image/jpeg"
              drag
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
            </el-upload>
            <div v-show="imageUrl.length>1" class="image-preview image-app-preview">
              <div class="image-preview-wrapper">
                <img :src="imageUrl">
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { create, update, show } from '@/api/activity'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  status: 'published',
  title: '', // 文章题目
  content: '', // 文章内容
  image: '', // 文章图片
  id: undefined,
  time: ''
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        // this.$message({
        //   message: rule.field + '为必传项',
        //   type: 'error'
        // })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else if (value.length > 10) {
        this.$message({
          message: rule.field + '必须少于10个字',
          type: 'error'
        })
        callback(new Error(rule.field + '必须少于10个字'))
      } else {
        callback()
      }
    }
    return {
      imageUrl: '',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        time: [{ validator: validateRequire }],
        title: [{ validator: validateTitle }],
        content: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      console.log(this.isEdit)
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    imgChange(file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeimgUpload(file) {
      this.formData = new FormData()
      this.formData.append('image', file)
      return false
    },
    // 编辑时 获取信息
    fetchData(id) {
      show({ id: id }).then(response => {
        console.log(response)
        this.postForm = response.data
        this.postForm.image = 'http://127.0.0.1:8000/activity/' + response.data.image
        this.imageUrl = this.postForm.image
        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '修改活动'
      const route = Object.assign({}, this.tempRoute, { title: `${title}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '修改活动'
      document.title = `${title}`
    },
    // 提交
    submitForm() {
      console.log(this.postForm)
      if (this.imageUrl === '') {
        this.$message({
          message: '图片为必传项',
          type: 'error'
        })
      } else {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true

            if (this.formData == undefined) {
              this.formData = new FormData()
            }
            this.formData.append('title', this.postForm.title)
            this.formData.append('content', this.postForm.content)
            const time = this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date(this.postForm.time))
            this.formData.append('time', time)
            this.$refs.upload.submit()
            // console.log(this.formData.get('title'))
            // console.log(this.formData.get('content'))
            // console.log(this.formData.get('time'))

            if (this.isEdit) {
              this.formData.append('id', this.postForm.id)
              update(this.formData).then(res => {
                console.log(res)
                this.$notify({
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              })
            } else {
              create(this.formData).then(res => {
                console.log(res)
                this.$notify({
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
                this.loading = false
              })
            }
          }
        })
      }
    },

    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (const k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
      }
      return fmt
    }
  }
}

</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 35%;
    float: left;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
