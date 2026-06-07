# 爆款内容选题生成器

基于真实账号数据训练的内容选题工具，支持小红书、抖音、微信私域三平台差异化选题生成。

---

## 部署步骤（5分钟完成）

### 第一步：注册 Vercel
前往 [vercel.com](https://vercel.com) 注册账号（免费，用 GitHub 登录最方便）

### 第二步：上传项目
1. 在 GitHub 新建一个仓库（public 或 private 都可以）
2. 把这个文件夹里的所有文件上传进去
3. 结构如下：
```
你的仓库/
├── api/
│   └── generate.js
├── public/
│   └── index.html
├── vercel.json
└── README.md
```

### 第三步：在 Vercel 导入项目
1. 打开 Vercel Dashboard → 点击 "Add New Project"
2. 选择你刚创建的 GitHub 仓库 → 点击 Import
3. 不需要修改任何设置，直接点 Deploy

### 第四步：添加 API Key（重要）
部署完成后：
1. 进入项目页面 → Settings → Environment Variables
2. 添加一个变量：
   - Name：`ANTHROPIC_API_KEY`
   - Value：你的 Anthropic API Key（在 console.anthropic.com 获取）
3. 点击 Save
4. 回到 Deployments 页面，点击最新部署旁边的 "..." → Redeploy

### 第五步：访问你的网站
Vercel 会给你一个域名，格式类似 `your-project.vercel.app`，直接访问即可。

---

## 获取 Anthropic API Key

1. 前往 [console.anthropic.com](https://console.anthropic.com)
2. 注册/登录账号
3. 进入 API Keys 页面 → Create Key
4. 复制 Key（只显示一次，注意保存）
5. 新账号有免费额度，足够演示使用

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `public/index.html` | 前端页面 |
| `api/generate.js` | 后端 API，处理 AI 请求（API Key 安全存放在这里）|
| `vercel.json` | Vercel 部署配置 |

---

## 常见问题

**Q：生成失败怎么办？**
检查 Environment Variables 里的 API Key 是否正确，以及是否重新部署了。

**Q：怎么修改标题风格数据？**
编辑 `api/generate.js` 里的 `styleGuide` 变量，替换成新的样本标题即可。

**Q：可以添加更多平台吗？**
在 `public/index.html` 里加 `.ptag` 按钮，在 `api/generate.js` 里的 `platformConfig` 里补充对应描述。
