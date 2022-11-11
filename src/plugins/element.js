import { ElButton } from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import * as locale from 'element-plus/lib/locale'
import {ElForm,ElFormItem} from "element-plus";
import {ElInput} from "element-plus";
import ElementPlus from 'element-plus'

export default (app) => {
  locale.use(lang)
  app.use(ElButton).use(ElForm).use(ElFormItem).use(ElInput).use(ElementPlus, { size: 'small', zIndex: 3000 })
}
