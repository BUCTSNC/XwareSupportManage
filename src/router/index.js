import Vue from 'vue'
import Router from 'vue-router'
import mainPages from "../pages/mainPages";
import login from "../pages/login";
import memberManage from "../pages/memberManage";
import myHandle from "../pages/myHandle";
import Appointment from "../pages/Appointment";
import TimeSlop from "../pages/TimeSlop";
Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: '/',
      redirect:"/myHandle",
      name: 'mainPages',
      component: mainPages,
      children:[
        {
          path:"/memberManage",
          name:"memberManage",
          component:memberManage,
        },
        {
          path: "/myHandle",
          name: "Handle",
          component: myHandle,
        },
        {
          path: "/Appointment",
          name: "Appointment",
          component: Appointment,
        },
        {
          path: "/timeSlop",
          name: "timeSlop",
          component: TimeSlop,
        }
      ]
    }
  ]
})
