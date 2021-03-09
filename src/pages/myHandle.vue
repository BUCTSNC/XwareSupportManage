<template>
  <div>
    <el-table
      :data="handleList"
      height="600"
      max-height="700"
    >
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
          <el-button type="primary" size="small" round @click="lookup(scope.row)">查看维修信息</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "myHandle",
      data(){
          return{
            handleList:[],
          }
      },
      mounted() {
        this.myHandleList()
      },
      computed:{
          API(){
            return this.$store.state.API
          }
      },
      methods:{
        lookup(row){

        },
        myHandleList(){
          this.API.myHandleList().then(res=>{
            if (res.data.code === 200){
              this.handleList = res.data.data
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
