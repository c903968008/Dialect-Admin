<template>
  <div>
    <p class="col-title" style="text-align:center;">设置</p>
    <el-form ref="form" :model="config" label-width="120px" style="margin-top:30px;">
      <p class="setting-title">小程序设置</p>
      <el-form-item label="用户答题数/次">
        <el-input-number v-model="config.answer_count" controls-position="right" />
      </el-form-item>
      <p class="setting-title">方言自动审核设置</p>
      <el-form-item label="答题总数多于">
        <el-input-number v-model="config.dialect_audit_total" controls-position="right" />
      </el-form-item>
      <el-form-item label="正确率高于">
        <el-input-number v-model="config.dialect_audit_accuracy" controls-position="right" />
      </el-form-item>
      <el-form-item label="反馈数少于">
        <el-input-number v-model="config.feedback_count" controls-position="right" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { showConfig, editConfig } from '@/api/dashboard'

export default {
  data() {
    return {
      config: {
        answer_count: 0,
        dialect_audit_total: 0,
        dialect_audit_accuracy: 0,
        feedback_count: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSubmit() {
      console.log(this.config)
      editConfig(this.config).then(response => {
        this.$notify({
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    fetchData() {
      showConfig().then(response => {
        this.config = response.data
        // console.log(this.config)
      })
    }
  }
}
</script>
<style>
.setting-title{
  color:#fff;
  background: rgb(64, 158, 255);
  font-size: 15px;
  margin-left:19px;
  padding:10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
