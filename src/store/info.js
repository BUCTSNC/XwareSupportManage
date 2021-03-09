export default {
  state:()=>{
    return{
      islogin:false,
      info:null,
    }
  },
  mutations:{
    login(state){
      state.islogin = true
    },
    logout(state){
      state.islogin = false
      state.info = null
    },
    infoSet(state,newInfo){
      state.info = newInfo
    }
  },
  actions:{

  },
  getters: {}
}
