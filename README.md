# 猪猪纸牌 / Piggy Solitaire

赌场风 **蜘蛛接龙（Spider Solitaire）** 单机小游戏。无账号、无联网对战、无真实货币。

| 中文 | 英文 |
|------|------|
| 猪猪纸牌 | Piggy Solitaire |
| 猪猪纸牌 · 蜘蛛接龙 | Piggy Solitaire · Spider |

## 技术栈

- Vite + React + TypeScript + Tailwind CSS
- 游戏规则为纯函数（`src/game`），可用 Vitest 单测
- 静态部署友好（Netlify 等）

## 安装与启动

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

## 玩法简述

- **10 列**；标准 104 张牌。开局发 54 张：前 4 列各 6 张、后 6 列各 5 张（仅最上明牌）；牌库 50 张，可发 5 次，每次每列 1 张。
- **难度**：简单（单花色红桃）/ 中等（双花色）/ 困难（四花色）。
- **移动**：只能移动「同花色且点数连续递减」的明牌序列；落到另一列时，目标顶牌须比移入序列的首张大 1，或目标为空列。
- **收列**：同花色 K→A 连续 13 张自动收走；收满 8 副即胜利。
- **分数（Windows XP 蜘蛛）**：`500 − (步数 + 撤销次数) + 收列数 × 100`；发牌不计步/不分；允许负分；负分时再撤销则分数强制为 0。
- **排行榜**：各难度独立。本机用 `localStorage`；部署到 Netlify 后走 `/api/leaderboard`（Blobs）全站共享。默认榜首 BTFzds（参考分）。
- **进场**：首次进入需填写 ID 并选择难度。
- **发牌**：10 列都必须非空才能从牌库发牌。
- **操作**：点牌自动落到合适位置；动不了会晃一下。支持无限撤销与无限提示。计时从首次操作开始。

## 排行榜存在哪？

| 环境 | 存储 | 谁能看见 |
|------|------|----------|
| 本地 `npm run dev` | 浏览器 localStorage | 仅本机本浏览器 |
| Netlify 线上站 | Netlify Blobs（云端） | 所有访问该站点的玩家 |

连上 Netlify 后无需再配 Firebase；推代码即用。

## 目录

- `src/game/` — 类型、发牌、合法移动、收列、引擎
- `src/components/` — PlayingCard、列、牌库、顶栏、胜利弹层
- `src/hooks/useSpiderGame.ts` — React 状态封装

## 许可

自用娱乐项目。
