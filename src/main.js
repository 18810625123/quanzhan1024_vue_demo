import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
import {
    ActionBar, ActionBarIcon, ActionBarButton, Divider, Popup, Overlay, Dialog, Form, Field,
    Icon, Stepper, Card, Button, List, Tab, Tabs, Row, Col, Swipe, SwipeItem,Search,
    Cascader, DatetimePicker, Uploader, TabbarItem, Tabbar, Notify, NoticeBar,
    CellGroup, Cell, Loading, PullRefresh, NavBar, SubmitBar, ShareSheet, Badge, Sticky
} from 'vant'

app.use(ActionBar).use(ActionBarIcon).use(ActionBarButton).use(Divider).use(Popup).use(Overlay)
    .use(Col).use(Row).use(Uploader).use(Dialog).use(Form).use(Field).use(Icon).use(Sticky)
    .use(Stepper).use(Card).use(Button).use(List).use(Tab).use(Tabs).use(SubmitBar)
    .use(Cascader).use(DatetimePicker).use(TabbarItem).use(Tabbar).use(NavBar).use(Badge)
    .use(Notify).use(NoticeBar).use(Swipe).use(SwipeItem).use(Loading).use(PullRefresh)
    .use(CellGroup).use(Cell).use(ShareSheet).use(Search)
import "./assets/css/global.css"

// 自定义组件
// import {CustomField} from './components/base/Field'
import './components/util'

import env from '../env'

// 路由守卫
router.beforeEach((to,from,next)=>{
    // console.log(`路由守卫 ${from.path}  =>  ${to.path}`)
    next()
})
app.use(store).use(router).mount('#app')

