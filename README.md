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
- **发牌**：10 列都必须非空才能从牌库发牌。
- **操作**：点牌自动落到合适位置；动不了会晃一下。支持无限撤销与无限提示。计时从首次操作开始。

## 目录

- `src/game/` — 类型、发牌、合法移动、收列、引擎
- `src/components/` — PlayingCard、列、牌库、顶栏、胜利弹层
- `src/hooks/useSpiderGame.ts` — React 状态封装

## 许可

自用娱乐项目。
