<template>
  <div>
    <el-table
      :data="timelist"
      height="600"
      max-height="700"
    >
      <el-table-column
        label="ID"
        prop="id"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="date"
        prop="date"
        align="center">
      </el-table-column>
      <el-table-column
        label="slot"
        prop="slot"
        align="center">
      </el-table-column>
      <el-table-column
        label="allow"
        prop="existAndContain"
        align="center">
      </el-table-column>
      <el-table-column v-if="this.$store.state.info.info.auth>=3" align="center">
        <template slot="header" slot-scope="scope">
          <el-button type="danger" size="small" round @click="add">创建新时间段</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="primary" size="small" round @click="change(scope.row)">修改时间段</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="cancel">
      <el-form :model="info">
        <el-form-item label="日期">
          <el-date-picker
            v-model="info.date"
            align="left"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker
            is-range
            align="left"
            v-model="info.range"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="允许人数">
          <el-input-number v-model="info.allow" type="number" align="left"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" :disabled="submitStatu">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitStatu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "TimeSlop",
      data(){
        return{
          timelist:[],
          dialogVisible:false,
          submitStatu:false,
          formTitle:"",
          info:{
            id:-1,
            range:[new Date(),new Date()],
            date:null,
            allow:0,
          }
        }
      },
      mounted() {
        this.getList()
      },
      computed:{
        API(){
          return this.$store.state.API
        }
      },
      methods:{
        cancel(){
          this.dialogVisible = false
          this.submitStatu = false,
            this.info = {
              id:-1,
              range:[new Date(),new Date()],
              date:null,
              allow:0,
            }
        },
        add(){
          this.info.id = -1
          this.dialogVisible = true
          this.formTitle = "增加新时间段"
        },
        change(row){
          this.info.id = row.id
          this.info.date = this.stringToDate(row.date.split("(")[0])
          this.info.range = [this.stringToDateTime(row.slot.split("-")[0]),this.stringToDateTime(row.slot.split("-")[1])]
          this.info.allow = Number.parseInt(row.existAndContain.split("/")[1])
          this.dialogVisible = true
          this.formTitle = "修改时间段信息"
        },
        submit(){
          let id = Number.parseInt(this.info.id)
          let date = this.DateToString(this.info.date)
          let start = date + " "+ this.DateTimeToString(this.info.range[0])
          let end = date + " "+ this.DateTimeToString(this.info.range[1])
          let allow = this.info.allow
          let res =null
          if (id===-1){
            this.submitStatu = true
            res = this.API.createTimeSlop(date,start,end,allow)
          }else if (id>=0){
            this.submitStatu = true
            res = this.API.changeTimeSlop(id,date,start,end,allow)
          }
          if (res!=null){
            res.then(res=>{
              console.log(res)
              if (res.data.code === 200){
                this.getList()
                this.$message.success("提交成功")
              }else{
                this.$message.error(res.data.msg)
              }
              this.submitStatu = false
            }).catch(err=>{
              this.submitStatu = false
              console.log(err)
            })
          }
        },
        getList(){
          this.API.getTimeList().then(res=>{
            if(res.data.code===200){
              this.timelist = res.data.data
            }
          })
        },
        stringToDate(str){
          return new Date(String(str).replace("-","/"))
        },
        stringToDateTime(str){
          let l = String(str).split(":")
          return new Date(0,0,0,Number.parseInt(l[0]),Number.parseInt(l[1]),Number.parseInt(l[2]),0)
        },
        DateToString(Date){
          return [Date.getFullYear(),Date.getMonth(),Date.getDay()].join("-")
        },
        DateTimeToString(Date){
          return [Date.getHours(),Date.getMinutes(),Date.getSeconds()].join(":")
        }
      }
    }
</script>

<style scoped>

</style>
