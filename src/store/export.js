import info from "./info";
import API from "./API";
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex)
export default new Vuex.Store({
  modules:{
    API,
    info
  }
})

