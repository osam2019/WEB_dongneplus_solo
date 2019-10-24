import Vue from 'vue'
import VueRouter from 'vue-router'
import menu_contents from "@/components/menu_contents"
Vue.use(VueRouter)

const routes = [
    {
        path: '/menu_contents',
        component: menu_contents
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
