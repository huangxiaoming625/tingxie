# 小学语文听写词语库

一款专为小学语文教学设计的智能听写辅助工具。

## 功能特性

- 📖 **词语库管理** - 按单元、课程系统化管理词语
- 📷 **图像识别** - 拍摄课本页面，自动识别荧光笔标记的词语
- 🎤 **智能听写** - 动态间隔播报，支持难度分级
- 📊 **听写记录** - 记录历史听写数据
- 📱 **响应式设计** - 支持手机、平板、电脑

## 快速开始

### 安装依赖

```bash
cd tingxie
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

### 1. 添加词语

1. 点击"添加词语"标签
2. 用红色或蓝色荧光笔在课本上划出词语
3. 拍摄或上传图片
4. 系统自动识别词语
5. 选择课程并保存

### 2. 词语库管理

- 创建单元和课程
- 批量添加词语
- 设置词语难度
- 按年级和学期筛选

### 3. 开始听写

1. 选择要听写的课程
2. 设置词语数量和间隔时间
3. 开始听写
4. 系统按难度自动调整播报间隔

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **语音合成**: Web Speech API
- **本地存储**: LocalStorage

## 项目结构

```
tingxie/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── WordBookView.vue    # 词语库页面
│   │   ├── AddWordsView.vue    # 添加词语页面
│   │   ├── DictationView.vue   # 听写页面
│   │   └── RecordsView.vue     # 记录页面
│   ├── utils/               # 工具函数
│   │   ├── storage.js          # 数据存储
│   │   ├── tts.js              # 语音合成
│   │   └── imageProcessor.js   # 图像处理
│   ├── types/               # 类型定义
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 浏览器支持

- Chrome (推荐)
- Edge
- Firefox
- Safari

注意：语音播报功能需要浏览器支持 Web Speech API。

## 说明

- 当前版本使用模拟的图像识别，实际项目中可集成 Tesseract.js 或云端 OCR API
- 数据存储在浏览器本地，清除浏览器数据会丢失数据
- 首次使用时会自动添加示例数据
