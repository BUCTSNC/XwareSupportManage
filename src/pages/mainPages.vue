<template>
  <el-container class="main">
    <el-aside width="200px" :style="{height:windowHeight+'px'}">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        active-text-color="#7092BD"
        background-color="#E9EDF4"
        text-color="#556077"
        :unique-opened="true"
        :style="{height:windowHeight+'px'}"
        @select="jump"
      >
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">我的处理</span>
        </el-menu-item>
        <el-menu-item index="2" v-if="info.auth>=3">
          <i class="el-icon-menu"></i>
          <span slot="title">预约列表</span>
        </el-menu-item>
        <el-menu-item index="3" v-if="info.auth>=3">
          <i class="el-icon-menu"></i>
          <span slot="title">时间段</span>
        </el-menu-item>
        <el-menu-item index="4" v-if="info.auth>=4">
          <i class="el-icon-menu"></i>
          <span slot="title">成员管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
    import info from "../store/info";
    export default {
      name: "mainPages.vue",
      data(){
        return{
          windowHeight:0
        }
      },
      beforeMount() {
        this.windowHeight = window.screen.height

      },
      computed:{
        islogin(){
          return this.$store.state.info.islogin
        },
        API(){
          return this.$store.state.API
        },
        info(){
          return this.$store.state.info.info
        }
      },
      mounted() {
        if (this.islogin === false){
          this.API.checkLogin().then(res=>{
            if (res.data.code === 200){
              this.$store.commit("login")
              this.$store.commit("infoSet",res.data.data)
              console.log(this.info)
            }else{
              this.$router.push("/login")
            }
          }).catch(e=>{
            this.$router.push("/login")
          })
        }

      },
      methods:{
        jump(index,indexPath){
          console.log(typeof index)
          switch (index) {
            case "1":this.$router.push("/myHandle");return;
            case "2":this.$router.push("/Appointment");return;
            case "3":this.$router.push("/timeSlop");return;
            case "4":this.$router.push("/memberManage");return;
            default:return;
          }
        }
      },
    }
</script>

<style scoped lang="scss">
.main{
  background-color: #f6f6f6;
}
</style>
