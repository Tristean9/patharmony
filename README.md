# 北大校园违停情况描述提交处理平台

## 项目结构

- 使用`rsbuild`创建 `React+TypeScript` 项目
- 使用`Redux`进行状态管理, 中间件`saga`
- 使用`Redux-Router`进行路由管理
- 使用`Mock Server Work`进行模拟请求

## 界面说明

界面一：学生用户提交违停情况反馈页面
元素：
 输入框：描述违停情况
 选择框：车辆类型（自行车、电动车、机动车）
 按钮：提交信息
 地图标注功能：标注违停地点
 车牌号输入框：用于匹配车主身份
 提示信息：关于违停概念的说明
 隐私保护说明：关于保护车主隐私的提示

界面二：保安员确认违停情况页面
元素：
 信息展示：展示学生提交的违停情况描述、地点
 确认按钮：确认情况属实
 图片上传功能：上传实地确认图片
 文本框：反馈系统信息
 通知保安算法按钮：自动通知附近保安员按钮

界面三：中控处理违停情况页面
元素：
 信息查看：查看所有信息（学生反馈、保安反馈、车主身份）
 提醒车主按钮：提醒车主挪车/通知有关部门
 解决情况反馈：反馈信息给学生
 查看权限设置：设置各主体的信息查看权限

界面四：登录页面
元素：
 用户名输入框
 密码输入框
 登录按钮

## Setup

Install the dependencies:

```bash
yarn install
```

## Get Started

Start the dev server:

```bash
yarn dev
```

Build the app for production:

```bash
yarn build
```

Preview the production build locally:

```bash
yarn preview
```
