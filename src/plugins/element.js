import Vue from 'vue'
import { Button, Form, FormItem, Input ,Container,Header,Main,Aside,
        Menu,MenuItem,MenuItemGroup,Submenu,Breadcrumb,BreadcrumbItem,
        Card,Row,Col,Table,TableColumn,Switch, Tooltip,Pagination,Dialog,
        MessageBox,Tag,Image, Tree,Select,Option, Cascader,Alert,Steps,Step,
        Tabs,TabPane,CascaderPanel, CheckboxGroup, Checkbox, Upload, RadioGroup, 
        Radio,Carousel, CarouselItem, Calendar
        
} from 'element-ui'

//导入message组件,同时全局挂载message
import { Message } from 'element-ui'
//导入timeline时间线组件
import Timeline from '../plugins/timeline/index.js'
import TimelineItem from '../plugins/timeline-item/index.js'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Aside)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
// Vue.use(Image)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
// Vue.use(CascaderPanel)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Carousel)
Vue.use(CarouselItem)
// Vue.use(Calendar)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

