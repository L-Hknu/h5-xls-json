# xls-json
html5中 可以将xls 转成标准json 修改重新下载 的功能,提供给非开发人员使用

## 关于标题的规范
### 占位符$$用于key的解析
###  [] 中括号 代表有路径 路径中的写法为 xxx(key)/xx(key1)    支持简写  key1/key2   
### () 括号代表表示key值，只解析有key的内容,注意$$为占位符,json 以数组为期待 [{}] 的情况,当
### <> 尖括号代表类型  type:  string (默认) | number| boolean('true','false',其他属性会直接写进去) | list (标识另一个tab页)   
### {} 花括号 代表 筛选项，目前支持正选  配合list使用           例如 list项目 内容为list {3} 就会匹配到list页签的内容 并且返回第三条，如果不写默认第一条不返回其余都返回
## 注意 所有的列表都是从第三行开始计算，第一个预留为说明使用,第二行为标题

#### 基础场景1:
```
{
 "title" : "阅读数 22", 
 "href" : "http://www.google.com", 
}
 ```

| 标题（title) | 链接（href) |
| ------------- | ------------- |
| 阅读数 22  | http://www.google.com  |
#### 路径场景1:
```
[{
 "title" : "阅读数 22", 
 "href" : "http://www.google.com", 
}]
 ```

|[0] 标题（title) |[0] 链接（href) |
| ------------- | ------------- |
| 阅读数 2  | http://www.google.com  |

### 路径场景2：
```
 "infos" :[{ 
  "title" : "阅读数 11", 
  "href" : "http://www.google.com", 
  "icon" : { "name" : 	"dot" }
  },{ 
  "title" : "阅读数 22", 
  "href" : "http://www.baidu.com", 
  "icon" : { "name" : 	"zhuazi	" }
  }]
```

| [新闻(infos)/0]标题（title）| [新闻(infos)/0]链接（href）| [新闻(infos)/0/图标(icon)/0]图标名称（name） | [新闻(infos)/1]标题（title）| [新闻(infos)/1]链接（href）| [新闻(infos)/1/图标(icon)/0]图标名称（name） |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| 阅读数 11 | http://www.google.com | dot | 阅读数 22 | http://www.baidu.com | zhuazi |


### list类型场景
```
 "infos" :[{ 
  "title" : "阅读数 22", 
  "href" : "http://www.baidu.com", 
  "icon" : [{ "name" : 	"zhuazi	" }]
  },{ 
  "title" : "阅读数 22", 
  "href" : "http://www.baidu.com", 
  "icon" : [{ "name" : 	"zhuazi	" },{"name":"zhouzi"}]
  }]
 ```
 
| [新闻(infos)]标题（title）| [新闻(infos)]链接（href）| [新闻(infos)/图标(icon)]图标名称（name）&lt;list&gt; |
| ------------- | ------------- | ------------- |
| 阅读数 22  | http://www.google.com  | icon列表{3} |
| 阅读数 22  | http://www.google.com  | icon列表{3,4} |

#### 此时需要{icon列表}页签
| 预留说明 |
| 名称（name） |
| ------------- |
|  zhuazi | 
|  zhouzi | 
