import axios from "axios";
axios.defaults.withCredentials = true
axios.defaults.baseURL = "/manageAPI/"
export default {
  state:{
    login(username,password){
      return axios.post("login",{
        username,
        password
      })
    },
    logout(){
      return axios.get("logout")
    },
    checkLogin(){
      return axios.get("checkLogin")
    },
    createUser(username,password,auth,realName){
      return axios.post("User",{
        username,
        password,
        auth,
        realName
      })
    },
    getUserList(){
      return axios.get("User")
    },
    changeUserInfo(id,realName,auth){
      return axios.put(`User?fid=${id}`,{
        realName,
        auth
      })
    },
    changePassword(id,old,newPassword){
      return axios.post(`changePassword?fid=${id}`,{
        old,
        new:newPassword
      })
    },
    getTimeList(){
      return axios.get("timeSlot")
    },
    createTimeSlop(date,start,end,number){
      return axios.post("timeSlot",{
        date,
        start,
        end,
        number
      })
    },
    changeTimeSlop(id,date,start,end,number){
      return axios.put(`timeSlot?tid=${id}`,{
        date,
        start,
        end,
        number
      })
    },
    queryAppointment(tids){
      return axios.get(`AP?tids=${tids}`)
    },
    sign(uuid){
      return axios.put(`AP?uuid=${uuid}`)
    },
    myHandleList() {
      return axios.get("myHandle")
    },
    handleDetail(eid){
      return axios.get(`handleDetail?eid=${eid}`)
    }
  }
}
