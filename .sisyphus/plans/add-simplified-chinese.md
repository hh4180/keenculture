# 添加简体中文语言版本

## TL;DR

> **Quick Summary**: 为网站添加简体中文 (`/zh/`) 语言版本，将语言切换按钮文字改为 "Language"
> 
> **Deliverables**:
> - 4个简体中文页面 (`/zh/index.astro`, `/zh/about.astro`, `/zh/services.astro`, `/zh/contact.astro`)
> - 更新 Header.astro 添加简体中文选项，按钮文字改为 "Language"
> - 更新 SEO.astro 添加 `zh` locale 支持
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Wave 1 (Header/SEO) → Wave 2 (4个页面并行)

---

## Context

### Original Request
用户希望：
1. 保留简体中文内容
2. 添加简体中文语言版本，URL 路径为 `/zh/`
3. 语言切换按钮统一显示为 "Language"（原为日语 "言語"）

### Interview Summary
**Key Discussions**:
- URL 路径: `/zh/` (用户选择)
- 内容来源: 从繁体中文 (`zh-hant`) 转换为简体中文

**Research Findings**:
- 当前语言结构: `/` (日文默认), `/ja/`, `/zh-hant/`, `/en/`
- Header.astro 第106行显示 `言語`，需改为 `Language`
- SEO.astro 支持 `ja`, `zh-hant`, `en`，需添加 `zh`

---

## Work Objectives

### Core Objective
添加简体中文语言版本，完善多语言支持

### Concrete Deliverables
- `src/pages/zh/index.astro` - 简体中文首页
- `src/pages/zh/about.astro` - 简体中文关于页
- `src/pages/zh/services.astro` - 简体中文服务页
- `src/pages/zh/contact.astro` - 简体中文联系页
- 更新 `src/components/Header.astro` - 添加简体中文导航
- 更新 `src/components/SEO.astro` - 添加简体中文 SEO 支持

### Definition of Done
- [x] `npm run check` 通过
- [x] `npm run build` 成功
- [x] 访问 `/zh/` 显示简体中文首页
- [x] 语言切换按钮显示 "Language"

### Must Have
- 繁体转简体的内容转换（所有繁体字转为简体）
- 内链路径从 `/zh-hant/` 改为 `/zh/`
- Header 添加简体中文选项
- SEO hreflang 添加 `zh-Hans`

### Must NOT Have (Guardrails)
- 不要修改其他语言版本的内容
- 不要改变现有的页面布局和样式
- 不要添加新的依赖

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (无测试框架)
- **Automated tests**: None
- **Verification**: `npm run check` + `npm run build`

### QA Policy
每个任务完成后运行 `npm run check` 和 `npm run build` 验证

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 基础设施):
├── Task 1: 更新 Header.astro [quick]
└── Task 2: 更新 SEO.astro [quick]

Wave 2 (After Wave 1 — 4个页面并行):
├── Task 3: 创建 /zh/index.astro [quick]
├── Task 4: 创建 /zh/about.astro [quick]
├── Task 5: 创建 /zh/services.astro [quick]
└── Task 6: 创建 /zh/contact.astro [quick]

Wave FINAL:
└── Task 7: 验证构建 [quick]
```

### Agent Dispatch Summary

- **Wave 1**: 2 tasks → `quick`
- **Wave 2**: 4 tasks → `quick`
- **Final**: 1 task → `quick`

---

## TODOs

- [x] 1. 更新 Header.astro - 添加简体中文选项

  **What to do**:
  - 第4行: locale 检测添加 `'zh'`
  - 第8-19行: `withLocale` 函数添加 `'zh'` 处理
  - 第21-46行: `navLabelMap` 添加 `zh` 键（从 `zh-hant` 复制，内容转简体）
  - 第57-61行: `languageLinks` 添加简体中文 `{ label: '简', fullLabel: '简体中文', href: withLocale(basePath, 'zh'), locale: 'zh' }`
  - 第106行: `<span>言語</span>` 改为 `<span>Language</span>`

  **Must NOT do**:
  - 不要改变按钮样式
  - 不要修改其他语言的标签

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 2)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 3-6
  - **Blocked By**: None

  **References**:
  - `src/components/Header.astro` - 完整文件
  - `src/pages/zh-hant/*.astro` - 简体中文标签参考

  **Acceptance Criteria**:
  - [ ] `npm run check src/components/Header.astro` 通过
  - [ ] 语言按钮显示 "Language | JP" (或当前语言)
  - [ ] 下拉菜单包含"简体中文"选项

  **QA Scenarios**:
  ```
  Scenario: 语言按钮显示 Language
    Tool: Bash (grep)
    Steps:
      1. grep "Language" src/components/Header.astro
    Expected Result: 找到 <span>Language</span>
    Evidence: .sisyphus/evidence/task-1-language-button.txt

  Scenario: 简体中文选项存在
    Tool: Bash (grep)
    Steps:
      1. grep "简体中文" src/components/Header.astro
    Expected Result: 找到 fullLabel: '简体中文'
    Evidence: .sisyphus/evidence/task-1-zh-option.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): add simplified chinese to header, change button to Language`
  - Files: `src/components/Header.astro`

---

- [x] 2. 更新 SEO.astro - 添加简体中文支持

  **What to do**:
  - 第9行: Props locale 类型添加 `'zh'`
  - 第22-26行: `localeKeywords` 添加 `zh` 键
  - 第28-32行: `localeSiteName` 添加 `zh` 键
  - 第34-38行: `ogLocaleMap` 添加 `zh: 'zh_CN'`
  - 第59行: `currentLocalePrefix` 检测添加 `'zh'`
  - 第63-74行: `localizePath` 函数添加 `'zh'` 处理
  - 第77-81行: `alternates` 数组添加简体中文 hreflang

  **Must NOT do**:
  - 不要改变 SEO 结构
  - 不要修改其他语言的元数据

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Task 1)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 3-6
  - **Blocked By**: None

  **References**:
  - `src/components/SEO.astro` - 完整文件

  **Acceptance Criteria**:
  - [ ] `npm run check src/components/SEO.astro` 通过
  - [ ] `zh` locale 类型定义正确

  **QA Scenarios**:
  ```
  Scenario: zh locale 支持
    Tool: Bash (grep)
    Steps:
      1. grep "zh_CN" src/components/SEO.astro
    Expected Result: 找到 zh: 'zh_CN' 在 ogLocaleMap
    Evidence: .sisyphus/evidence/task-2-zh-locale.txt
  ```

  **Commit**: YES
  - Message: `feat(seo): add simplified chinese locale support`
  - Files: `src/components/SEO.astro`

---

- [x] 3. 创建简体中文首页 /zh/index.astro

  **What to do**:
  - 复制 `src/pages/zh-hant/index.astro` 到 `src/pages/zh/index.astro`
  - 繁体转简体：所有繁体中文字转为简体
  - 内链更新：`/zh-hant/` → `/zh/`

  **繁简转换要点**:
  - 產 → 产, 業 → 业, 務 → 务, 採 → 采, 購 → 购
  - 鏡 → 镜, 維 → 维, 協 → 协, 連 → 连, 橋 → 桥
  - 調 → 调, 設 → 设, 備 → 备, 專 → 专, 價 → 价
  - 網 → 网, 絡 → 络, 證 → 证, 確 → 确, 達 → 达
  - 據 → 据, 點 → 点, 區 → 区, 開 → 开, 聯 → 联
  - 東 → 东, 亞 → 亚, 廣 → 广, 實 → 实, 與 → 与

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Tasks 4-6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `src/pages/zh-hant/index.astro` - 源文件
  - 繁简转换规则（上述）

  **Acceptance Criteria**:
  - [ ] 文件存在: `src/pages/zh/index.astro`
  - [ ] 无繁体字残留
  - [ ] 所有内链指向 `/zh/`

  **QA Scenarios**:
  ```
  Scenario: 文件存在且无繁体
    Tool: Bash
    Steps:
      1. test -f src/pages/zh/index.astro && echo "exists"
      2. grep -c "產\|業\|務" src/pages/zh/index.astro || echo "no traditional"
    Expected Result: exists, no traditional (或 0)
    Evidence: .sisyphus/evidence/task-3-index.txt

  Scenario: 内链正确
    Tool: Bash (grep)
    Steps:
      1. grep "href=\"/zh/" src/pages/zh/index.astro | head -3
    Expected Result: 所有内链为 /zh/
    Evidence: .sisyphus/evidence/task-3-links.txt
  ```

  **Commit**: NO (与 Tasks 4-6 合并)

---

- [x] 4. 创建简体中文关于页 /zh/about.astro

  **What to do**:
  - 复制 `src/pages/zh-hant/about.astro` 到 `src/pages/zh/about.astro`
  - 繁体转简体
  - 内链更新：`/zh-hant/` → `/zh/`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Tasks 3, 5, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `src/pages/zh-hant/about.astro` - 源文件
  - Task 3 繁简转换规则

  **Acceptance Criteria**:
  - [ ] 文件存在: `src/pages/zh/about.astro`
  - [ ] 无繁体字残留
  - [ ] 所有内链指向 `/zh/`

  **QA Scenarios**:
  ```
  Scenario: 文件存在
    Tool: Bash
    Steps:
      1. test -f src/pages/zh/about.astro && echo "exists"
    Expected Result: exists
    Evidence: .sisyphus/evidence/task-4-about.txt
  ```

  **Commit**: NO (与 Tasks 3, 5, 6 合并)

---

- [x] 5. 创建简体中文服务页 /zh/services.astro

  **What to do**:
  - 复制 `src/pages/zh-hant/services.astro` 到 `src/pages/zh/services.astro`
  - 繁体转简体
  - 内链更新：`/zh-hant/` → `/zh/`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Tasks 3, 4, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `src/pages/zh-hant/services.astro` - 源文件

  **Acceptance Criteria**:
  - [ ] 文件存在: `src/pages/zh/services.astro`
  - [ ] 无繁体字残留

  **QA Scenarios**:
  ```
  Scenario: 文件存在
    Tool: Bash
    Steps:
      1. test -f src/pages/zh/services.astro && echo "exists"
    Expected Result: exists
    Evidence: .sisyphus/evidence/task-5-services.txt
  ```

  **Commit**: NO (与 Tasks 3, 4, 6 合并)

---

- [x] 6. 创建简体中文联系页 /zh/contact.astro

  **What to do**:
  - 复制 `src/pages/zh-hant/contact.astro` 到 `src/pages/zh/contact.astro`
  - 繁体转简体
  - 内链更新：`/zh-hant/` → `/zh/`

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (与 Tasks 3, 4, 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 1, 2

  **References**:
  - `src/pages/zh-hant/contact.astro` - 源文件

  **Acceptance Criteria**:
  - [ ] 文件存在: `src/pages/zh/contact.astro`
  - [ ] 无繁体字残留

  **QA Scenarios**:
  ```
  Scenario: 文件存在
    Tool: Bash
    Steps:
      1. test -f src/pages/zh/contact.astro && echo "exists"
    Expected Result: exists
    Evidence: .sisyphus/evidence/task-6-contact.txt
  ```

  **Commit**: YES (合并 Tasks 3-6)
  - Message: `feat(i18n): add simplified chinese pages`
  - Files: `src/pages/zh/*.astro`

---

## Final Verification Wave

- [x] 7. 验证完整构建

  **What to do**:
  - 运行 `npm run check`
  - 运行 `npm run build`
  - 确认无错误

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Final
  - **Blocks**: None
  - **Blocked By**: Tasks 1-6

  **Acceptance Criteria**:
  - [ ] `npm run check` 退出码 0
  - [ ] `npm run build` 退出码 0
  - [ ] dist/zh/ 目录存在

  **QA Scenarios**:
  ```
  Scenario: 构建成功
    Tool: Bash
    Steps:
      1. npm run check
      2. npm run build
      3. test -d dist/zh && echo "zh exists"
    Expected Result: 无错误，zh exists
    Evidence: .sisyphus/evidence/task-7-build.txt
  ```

  **Commit**: NO

---

## Commit Strategy

1. `feat(i18n): add simplified chinese to header, change button to Language` — Header.astro
2. `feat(seo): add simplified chinese locale support` — SEO.astro
3. `feat(i18n): add simplified chinese pages` — src/pages/zh/*.astro

---

## Success Criteria

### Verification Commands
```bash
npm run check        # Expected: 0 errors
npm run build        # Expected: success
ls dist/zh/          # Expected: index.html, about/index.html, services/index.html, contact/index.html
```

### Final Checklist
- [x] 语言按钮显示 "Language"
- [x] 简体中文4个页面全部创建
- [x] 所有繁体字已转为简体
- [x] 所有内链指向 `/zh/`
- [x] `npm run check` 通过
- [x] `npm run build` 成功
