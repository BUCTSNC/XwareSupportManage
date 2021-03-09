<template>
  <div class="login-wrap">
    <div class="ms-title">登录管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <div v-if="errorInfo">
          <span>{{errInfo}}</span>
        </div>
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="账号" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submit">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import info from "../store/info";

  export default {
    name: 'login',
    data() {
      return {
        errorInfo : false,
        ruleForm: {
          name: '',
          password: '',
          validate: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          validate: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      if (this.state.islogin === false){
        this.API.checkLogin().then(res=>{
          if (res.data.code === 200){
            this.$store.commit("login")
            this.$store.commit("infoSet",res.data.data)
            this.$router.push("/")
          }
        }).catch(e=>{
          this.$message.error("后端异常")
        })
      }else{
        this.$router.push("/")
      }
    },
    methods: {
      submit(){
        let username = this.ruleForm.name
        let password = this.ruleForm.password
        this.API.login(username,password).then(res=>{
          if(res.data.code === 200){
            this.$store.commit("login")
            this.$store.commit("infoSet",res.data.data)
            this.$router.push("/")
          }else if(res.data.code === 401){
            this.$message.warning("无此用户或密码错误")
          }else{
            this.$message.error("后端异常")
          }
        }).catch(e=>{
          console.log(e)
          this.$message.error("后端异常")
        })
      }
    },
    computed:{
      API(){
        return this.$store.state.API
      },
      state(){
        return this.$store.state.info
      }
    }
  }
</script>

<style scoped>
  .login-wrap{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width:100%;
    height:100%;
  }
  .ms-title{
    top:50%;
    width:100%;
    text-align: center;
    font-size:30px;
    color: #fff;
  }
  .ms-login{
    width:300px;
    height:240px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
  }
  .ms-login span {
    color: red;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
  .code {
    width: 112px;
    height: 35px;
    border: 1px solid #ccc;
    float: right;
    border-radius: 2px;
  }
  .validate-code {
    width: 136px;
    float: left;
  }
  .register {
    font-size:14px;
    line-height:30px;
    color:#999;
    cursor: pointer;
    float:right;
  }
</style>
