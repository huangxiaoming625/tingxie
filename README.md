# 📚 小学语文听写词语库

一款专为小学语文教学设计的**智能听写辅助工具**，帮助教师和家长轻松创建、管理和使用词语库。

## 🎯 项目特点

### 📖 智能词语管理
- **结构化组织**: 按年级、学期、单元、课程层级管理
- **批量操作**: 支持一次性添加多个词语
- **难度分级**: 5级难度（最简单→最难）自动调整间隔
- **智能推荐**: 根据学习进度推荐听写内容

### 📷 图像识别
- **荧光笔识别**: 自动识别红色/蓝色荧光笔标记的词语
- **多种输入方式**: 拍照、上传图片、手动输入
- **OCR支持**: 内置文字识别（可扩展真实OCR）

### 🎤 智能听写
- **语音合成**: Web Speech API 自然语音播报
- **动态间隔**: 难度高的词语自动延长间隔时间
- **拼音提示**: 可显示拼音辅助学习
- **进度追踪**: 实时显示听写进度

### 📊 数据分析
- **听写记录**: 完整记录历史听写数据
- **学习报告**: 统计正确率和掌握程度
- **重复练习**: 针对错误词语重点练习

### 📱 跨平台支持
- **响应式设计**: 支持手机、平板、电脑
- **PWA支持**: 可离线使用和安装
- **无需安装**: 直接通过浏览器访问

## 🏃 快速开始

### 前提条件
- Node.js 16+
- npm 或 yarn
- Chrome/Edge 浏览器（推荐）

### 安装和运行

```bash
# 克隆仓库
git clone https://github.com/huangxiaoming625/tingxie.git
cd tingxie

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📖 使用说明

### 1. 首次使用

1. 打开应用，自动创建示例数据
2. 点击"词语库"查看已有的单元和课程
3. 点击"开始听写"尝试第一单元

### 2. 添加词语

#### 方法A：手动添加
1. 进入"词语库"
2. 选择单元→课程
3. 点击"添加词语"
4. 输入词语内容和难度

#### 方法B：图像识别（推荐）
1. 点击"添加词语"标签
2. 用红色/蓝色荧光笔在课本上划出词语
3. 拍照或上传图片
4. 确认识别结果并保存

### 3. 开始听写

1. 点击"开始听写"
2. 选择要听写的课程
3. 设置听写参数（词语数量、基础间隔）
4. 点击"开始听写"

## 🛠️ 技术栈

### 核心框架
- **前端**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **状态管理**: Vue内置响应式系统

### 功能模块
- **语音合成**: Web Speech API
- **本地存储**: localStorage
- **图像处理**: Canvas API + 颜色识别
- **路由**: 单页面应用

### 开发工具
- **代码规范**: ESLint + Prettier
- **包管理**: npm
- **Git**: 版本控制

## 📁 项目结构

```
tingxie/
├── .gitignore             # Git 忽略配置
├── README.md              # 项目说明文档
├── package.json           # 项目依赖配置
├── vite.config.js         # Vite 配置
├── index.html             # HTML 入口
├── dist/                  # 构建输出目录
└── src/
    ├── App.vue            # 根组件
    ├── main.js            # 应用入口
    ├── components/        # 页面组件
    │   ├── WordBookView.vue    # 词语库页面
    │   ├── AddWordsView.vue    # 添加词语页面
    │   ├── DictationView.vue   # 听写页面
    │   └── RecordsView.vue     # 记录页面
    ├── utils/             # 工具函数
    │   ├── storage.js          # 数据存储
    │   ├── tts.js              # 语音合成
    │   └── imageProcessor.js   # 图像处理
    └── types/             # TypeScript 类型定义
```

## 🎨 界面预览

### 主界面
![主界面](https://via.placeholder.com/800x400/ff6b6b/ffffff?text=主界面)

### 词语库管理
![词语库](https://via.placeholder.com/800x400/4ecdc4/ffffff?text=词语库)

### 听写界面
![听写](https://via.placeholder.com/800x400/45b7d1/ffffff?text=听写)

## 🔄 更新日志

### v1.0.0 (2026-03-31)
- ✨ 初始版本发布
- 📖 完成基础词语库管理
- 📷 图像识别功能（模拟）
- 🎤 语音合成和智能听写
- 📊 听写记录和统计
- 📱 响应式设计

## 🤝 贡献指南

欢迎大家为项目贡献代码！

### 开发流程

1. Fork 仓库
2. 创建功能分支 `git checkout -b feature/AmazingFeature`
3. 提交更改 `git commit -m 'Add some AmazingFeature'`
4. 推送到分支 `git push origin feature/AmazingFeature`
5. 打开 Pull Request

### 开发规范

- 使用 Vue 3 的 Composition API
- 遵循 ESLint + Prettier 规范
- 提交信息使用中文或英文
- 新增功能需提供测试用例

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 📞 联系方式

- 项目地址: https://github.com/huangxiaoming625/tingxie
- 邮箱: your@email.com

## 💡 未来规划

### v1.1.0
- [ ] 集成真实 OCR（Tesseract.js）
- [ ] 添加汉字手写识别
- [ ] 支持多语言（英语、拼音）
- [ ] 导出/导入学习数据

### v1.2.0
- [ ] 班级管理和作业布置
- [ ] AI 智能推荐算法
- [ ] 家长端和教师端

### v2.0.0
- [ ] 移动端 APP（React Native）
- [ ] 微信小程序
- [ ] 云端存储和同步

## 🐛 常见问题

### Q: 为什么无法访问页面？
A:
- 检查 Node.js 和依赖是否正确安装
- 确保 3000 端口未被占用
- 尝试关闭代理软件
- 使用 Chrome 浏览器访问

### Q: 语音播报不工作？
A:
- 检查浏览器是否支持 Web Speech API
- 检查系统音频是否正常
- 刷新页面重试

### Q: 图像识别不准确？
A:
- 确保图片清晰，光线充足
- 使用标准的红色/蓝色荧光笔
- 避免阴影和反光
- 手动调整识别区域

## 🌟 致谢

感谢以下项目的启发：
- Vue 3 官方文档
- Web Speech API 规范
- Tesseract OCR 引擎

## 📈 项目统计

[![GitHub stars](https://img.shields.io/github/stars/huangxiaoming625/tingxie)](https://github.com/huangxiaoming625/tingxie/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/huangxiaoming625/tingxie)](https://github.com/huangxiaoming625/tingxie/network)
[![GitHub issues](https://img.shields.io/github/issues/huangxiaoming625/tingxie)](https://github.com/huangxiaoming625/tingxie/issues)
[![GitHub license](https://img.shields.io/github/license/huangxiaoming625/tingxie)](https://github.com/huangxiaoming625/tingxie/blob/main/LICENSE)

## 📝 版权声明

© 2026 huangxiaoming625. All rights reserved.
