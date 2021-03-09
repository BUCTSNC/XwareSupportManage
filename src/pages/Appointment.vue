<template>
  <div class="contain">
    <el-row>
      <el-col :span="12">
        <el-select v-model="selectSlot" :filterable="true" :reserve-keyword="true" :multiple="true" style="width: 100%"
                   @change="select">
          <el-option-group
            label="未结束">
            <el-option
              v-for="item in running"
              :key="item.id"
              :label="item.str"
              :value="item.id">
            </el-option>
          </el-option-group>
          <el-option-group
            label="已结束"
          >
            <el-option
              v-for="item in finish"
              :key="item.id"
              :label="item.str"
              :value="item.id">
            </el-option>
          </el-option-group>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="appointmentList">
        <el-table-column
          label="UUID"
          prop="uuid"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="预约时间段"
          align="center">
          <template slot-scope="scope">
            <div>{{scope.row.meta.date}}</div>
            <div>{{scope.row.meta.slot}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          align="center">
          <template slot-scope="scope">
            {{scope.row.user.realName}}
          </template>
        </el-table-column>
        <el-table-column
          label="问题类型"
          align="center">
          <template slot-scope="scope">
            {{scope.row.meta.problemType}}
          </template>
        </el-table-column>
        <el-table-column
          label="处理状态"
          align="center"
        ><template slot-scope="scope">{{scope.row.meta.applyTime}}</template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          align="center"
        ><template slot-scope="scope">
          <el-tag :type="handleStatusType(scope.row.meta.status)">
            {{handleStatus(scope.row.meta.status)}}
          </el-tag>
        </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" round @click="sign(scope)" v-if="scope.row.meta.status===1">签到</el-button>
            <el-button type="danger" size="mini" round @click="" disabled v-if="false">取消预约</el-button>
            <el-button type="primary" size="mini" round @click="checkDetail(scope.row)">查看描述</el-button>
            <el-button type="success" size="mini" round v-if="scope.row.meta.status===4||scope.row.meta.status===3">查看处理信息</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "Appointment",
    data() {
      return {
        selectSlot: [],
        finish: [],
        running: [],
        appointmentList: [],
        debounce: null,
        detail:"",
      }
    },
    mounted() {
      this.getSlot()
    },
    computed: {
      API() {
        return this.$store.state.API
      }
    },
    methods: {
      getSlot() {
        this.API.getTimeList().then(res => {
          let f = []
          let uf = []
          if (res.data.code === 200) {
            for (let d of res.data.data) {
              if (this.stringToDateTime(d.date, d.slot.split("-")[1]) <= new Date()) {
                f.push({
                  id: d.id,
                  str: d.date + " " + d.slot
                })
              } else {
                uf.push({
                  id: d.id,
                  str: d.date + " " + d.slot
                })
              }
            }
            this.finish = f
            this.running = uf
          }
        })
      },
      stringToDateTime(dstr) {
        let d = dstr.split("(")[0].replace("-", "/")
        return Date.parse(d)
      },
      select(list) {
        if (this.debounce != null) {
          clearTimeout(this.debounce)
        }
        if (list.length === 0) {
          return
        }
        let tids = list.join(",")
        this.debounce = setTimeout(() => {
          this.handleSelect(tids)
        }, 2000)
      },
      handleSelect(tids) {
        this.API.queryAppointment(tids).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            this.appointmentList = res.data.data
          } else {
            this.$message("获取失败")
          }
        })
      },
      sign(scope){
        console.log(scope.$index)
        this.API.sign(scope.row.uuid).then(res=>{
          if (res.data.code === 200){
            this.appointmentList[scope.$index].meta.status = 2
          }
        })
      },
      checkDetail(row){
        this.$alert(row.describe)
      },
      handleStatus(status){
        switch(status){
          case 0:return "正在预约";
          case 1:return "预约成功";
          case 2:return "签到成功";
          case 3:return "正在维修";
          case 4:return "维修完成";
          case 5:return "预约失效";
          case 6:return "预约失败";
          default:return "未知状态";
        }
      },
      handleStatusType(status){
        switch(status){
          case 0:return "";
          case 1:return "success";
          case 2:return "success";
          case 3:return "warning";
          case 4:return "success";
          case 5:return "";
          case 6:return "danger";
          default:return "danger";
        }
      }
    },
  }
</script>

<style scoped>

</style>
