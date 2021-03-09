<template>
  <div id="wrap">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账户信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="changePassword(Info.id)">修改密码</el-button>
      </div>
      <div class="myInfoWrapper">
          <span class="myInfo">
          username:{{username}}
          </span>
        <span class="myInfo">
          realName:{{realName}}
          </span>
        <span class="myInfo">
          权限:{{this.auth}}
          </span>
      </div>
    </el-card>
    <el-table
      :data="memberList"
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
        label="userName"
        prop="userName"
        align="center">
      </el-table-column>
      <el-table-column
        label="realName"
        prop="realName"
        align="center">
      </el-table-column>
      <el-table-column
        label="权限"
        prop="auth"
        align="center">
        <template slot-scope="scope">
          <el-tag :type="authType(scope.row)">{{authRender(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="this.$store.state.info.info.auth>=4" align="center">

        <template slot="header" slot-scope="scope">
          <el-button type="danger" size="small" round @click="dialogVisible=true">创建新用户</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="primary" size="small" round @click="changeStatu(scope.row)">修改信息</el-button>
          <el-button type="danger" size="small" round @click="changePassword(scope.row.id)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="创建新成员" :visible.sync="dialogVisible" :close-on-click-modal="false" @cancel="cancel">
      <el-form :model="newMember" size="mini">
        <el-form-item label="username">
          <el-input v-model="newMember.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="password">
          <el-input v-model="newMember.password" autocomplete="off" type="password" :show-password="true"></el-input>
        </el-form-item>
        <el-form-item label="realName">
          <el-input v-model="newMember.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-radio-group v-model="newMember.auth">
            <el-radio :label="2">普通成员</el-radio>
            <el-radio :label="3">权限成员</el-radio>
            <el-radio :label="4" v-if="this.$store.state.info.info.auth===5">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" :disabled="submitStatu">取 消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="submitStatu">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="tochangeVisible" :close-on-click-modal="false" @cancel="cancel">
      <el-form :model="tochange" size="mini">
        <el-form-item label="realName">
          <el-input v-model="tochange.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-radio-group v-model="tochange.auth">
            <el-radio :label="2">普通成员</el-radio>
            <el-radio :label="3">权限成员</el-radio>
            <el-radio :label="4" v-if="this.$store.state.info.info.auth===5">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" :disabled="submitStatu">取 消</el-button>
        <el-button type="primary" @click="tochangeSubmit" :loading="submitStatu">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="changePasswordDialog" :close-on-click-modal="false" @cancel="cancel">
      <el-form :model="password" size="mini">
        <el-form-item label="oldPassword">
          <el-input v-model="password.old" autocomplete="off" type="password" :show-password="true"></el-input>
        </el-form-item>
        <el-form-item label="newPassword">
          <el-input v-model="password.new" autocomplete="off" type="password" :show-password="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" :disabled="submitStatu">取 消</el-button>
        <el-button type="primary" @click="changePasswordSubmit" :loading="submitStatu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "memberManage",
    data() {
      return {
        username: "",
        realName: "",
        dialogVisible: false,
        changePasswordDialog: false,
        tochangeVisible: false,
        password: {
          id: "",
          new: "",
          old: "",
        },
        tochange: {
          id: -1,
          realName: "",
          auth: 2,
        },
        newMember: {
          username: "",
          password: "",
          realName: "",
          auth: 2,
        },
        submitStatu: false,
        memberList: [],
      }
    },
    mounted() {
      this.username = this.$store.state.info.info.userName
      this.realName = this.$store.state.info.info.realName
      this.loadList()
    },
    computed: {
      auth() {
        switch (this.$store.state.info.info.auth) {
          case 1:
            return "退休";
          case 2:
            return "普通成员";
          case 3:
            return "权限成员";
          case 4:
            return "管理员";
          case 5:
            return "系统维护者";
        }
      },
      API() {
        return this.$store.state.API
      },
      Info() {
        return this.$store.state.info.info
      }
    },
    methods: {
      cancel() {
        this.newMember = {
          name: "",
          password: "",
          realName: "",
          auth: 2,
        }
        this.password = {
          id: "",
          new: "",
          old: "",
        }
        this.tochange = {
          id: -1,
          realName: "",
          auth: 2,
        }
        this.dialogVisible = false
        this.changePasswordDialog = false
        this.tochangeVisible = false
      },
      addSubmit() {
        let username = this.newMember.username
        let password = this.newMember.password
        let auth = this.newMember.auth
        let realName = this.newMember.realName
        for (let it in this.newMember) {
          if (this.newMember[it] === "") {
            this.$message.error("您有留空")
            return
          }
        }
        this.submitStatu = true
        this.API.createUser(username, password, auth, realName).then(res => {
            this.submitStatu = false
            if (res.data.code === 200) {
              this.loadList()
              this.$message.success("创建成功")
              this.cancel()
            } else {
              this.$message.error(res.data.msg)
            }
          }
        ).catch(err => {
          console.log(err)
          this.submitStatu = false
        })


      },
      loadList() {
        this.API.getUserList().then(res => {
          if (res.data.code === 200) {
            this.memberList = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error("后端异常")
          console.log(err)
        })
      },
      authRender(row) {
        switch (row.auth) {
          case 1:
            return "退休";
          case 2:
            return "普通成员";
          case 3:
            return "权限成员";
          case 4:
            return "管理员";
          case 5:
            return "系统维护者";
        }
      },
      tochangeSubmit() {
        let auth = this.tochange.auth
        let realName = this.tochange.realName
        if (realName === "") {
          this.$message("真名不可为空")
          return
        }
        this.submitStatu = true
        this.API.changeUserInfo(this.tochange.id, realName, auth).then(res => {
            this.submitStatu = false
            if (res.data.code === 200) {
              this.loadList()
              this.$message.success("创建成功")
              this.cancel()
            } else {
              this.$message.error(res.data.msg)
            }
          }
        )
      },
      changeStatu(row) {
        this.tochange.id = row.id
        this.tochange.auth = row.auth
        this.tochange.realName = row.realName
        this.tochangeVisible = true
      },
      authType(row) {
        switch (row.auth) {
          case 1:
            return "info";
          case 2:
            return "";
          case 3:
            return "success";
          case 4:
            return "danger";
          case 5:
            return "danger";
        }
      },
      changePassword(id) {
        this.password.id = id
        this.changePasswordDialog = true
      },
      changePasswordSubmit() {
        if (this.password.new === "") {
          return
        }
        this.submitStatu = true
        this.API.changePassword(this.password.id, this.password.old, this.password.new).then(res => {
          this.submitStatu = false
          if (res.data.code === 200) {
            this.$message.success("修改成功")
            this.cancel()
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error("后端异常")
          console.log(err)
        })
      }

    }
  }
</script>

<style scoped lang="scss">
  .box-card {
    margin-bottom: 30px;
  }

  .myInfoWrapper {
    display: flex;
    justify-content: center;

    .myInfo {
      margin: 10px 50px;
    }
  }

</style>
