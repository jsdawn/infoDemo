import Vue from 'vue'
import 'v-charts/lib/style.css'
import VeLine from 'v-charts/lib/line.common'
import VeScatter from 'v-charts/lib/scatter.common'



Vue.component(VeLine.name, VeLine)
Vue.component(VeScatter.name, VeScatter)