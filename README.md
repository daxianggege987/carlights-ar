# أضواء السيارة (Car Dashboard Light Identifier)

> 阿拉伯语汽车仪表盘故障灯识别与解读工具

## 项目概述

面向阿拉伯语用户的单一功能工具 App，帮助普通车主快速理解仪表盘上亮起的警告灯含义、严重程度和应对措施。

## 核心功能

- **搜索查找** — 输入阿拉伯语或英语关键词搜索故障灯
- **分类浏览** — 按 10 大类别（发动机/制动/灯光/电气/安全/变速箱/液体/车身/空调/其它）浏览
- **收藏与最近查看** — 星标收藏、自动记录最近打开的条目（AsyncStorage 本地存储）
- **详情解读** — 每个故障灯包含：含义解释、建议操作、能否继续驾驶、常见原因
- **危险标注** — 🔴红色（立即停车）🟡黄色（尽快检修）🟢绿色（无需担心）

## 数据规模

- 100+ 条故障灯详细数据（持续扩充）
- 10 个分类
- 完整阿拉伯语描述 + 英语对照

## 技术栈

- **Expo SDK 55** (React Native)
- **TypeScript**
- **RTL (Right-to-Left)** 阿拉伯语布局
- 纯本地数据，无需联网

## AdMob：`app-ads.txt`

Google 要求在 **App Store Connect 里填写的开发者网站域名** 上托管 `https://你的域名/app-ads.txt`（与 ipa 无关）。本仓库已提供标准内容：`public/app-ads.txt`。部署步骤与说明见 **`DEPLOY-app-ads.txt`**。

## 运行方式

```bash
# 安装依赖
npm install

# Web 模式运行
npm run web

# iOS 模拟器
npm run ios

# Android 模拟器
npm run android
```

## 项目结构

```
src/
├── types/index.ts          # TypeScript 类型定义
├── theme/index.ts          # 主题色、间距、字号
├── data/
│   ├── categories.ts       # 10 大分类
│   └── warningLights.ts    # 50+ 故障灯数据库
├── components/
│   ├── SearchBar.tsx        # 搜索框
│   ├── CategoryCard.tsx     # 分类卡片
│   ├── LightCard.tsx        # 故障灯列表卡片
│   └── SeverityBadge.tsx    # 严重程度标签
└── screens/
    ├── HomeScreen.tsx       # 首页（搜索+分类+危险灯速览）
    ├── BrowseScreen.tsx     # 分类浏览页
    └── DetailScreen.tsx     # 故障灯详情页
```

## 后续迭代计划

- [ ] 拍照识别（Camera + AI Image Classification）
- [ ] 离线图像匹配模型
- [ ] 多品牌车型适配（丰田/现代/宝马/奔驰等特有灯光）
- [ ] 用户收藏功能
- [ ] 多语言支持（乌尔都语、波斯语等）
- [ ] 附近维修店推荐（地图集成）
