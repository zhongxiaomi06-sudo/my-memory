# 🧠 永久记忆系统 · AI 技能文件

> 把这个文件放在 `~/.codex/AGENTS.md` 或 `~/项目目录/AGENTS.md`
> AI 每次启动时自动读取，就像拥有了永久记忆

---

## 启动时自举流程（AI 每次对话开头执行）

### 第一步：检查本地是否有记忆仓库

```bash
if [ -d ~/Documents/我的过去 ]; then
    echo "✅ 本地记忆仓库存在"
    cd ~/Documents/我的过去
    git pull --rebase
else
    echo "❌ 本地无记忆仓库，请先 git clone"
    git clone https://github.com/zhongxiaomi06-sudo/my-memory.git ~/Documents/我的过去
fi
```

### 第二步：读取我的背景

- 读取 `~/Documents/我的过去/README.md`
- 读取 `~/Documents/我的过去/memories/projects/PROJECTS_INDEX.md`（项目索引）

### 第三步：读取最近 3 条记忆

```bash
ls -t ~/Documents/我的过去/codex对话/ */*.md 2>/dev/null | head -3
```

---

## 任务完成后保存记忆（AI 自动执行）

```bash
cd ~/Documents/我的过去

# 生成当日摘要文件
SUMMARY_FILE="codex对话/$(date +%Y-%m-%d)-摘要.md"
cat >> "$SUMMARY_FILE" << 'EOF'

## 对话时间
$(date +%Y-%m-%d %H:%M)

## 做了什么
（总结）

## 解决了什么
（关键点）

## 状态
- [ ] 待继续

## 学到什么
（知识点）
EOF

git add .
git commit -m "更新记忆: $(date +%Y-%m-%d %H:%M)"
git push
```

---

## 跨平台规则

| 平台 | 如何读取 |
|------|---------|
| Codex | 自动读取本 SKILL.md + 读本地仓库文件 |
| Claude | 先执行 git pull，再读 .md 文件 |
| Trae | 同上 |
| 新电脑 | `git clone https://github.com/zhongxiaomi06-sudo/my-memory.git ~/Documents/我的过去` |

---

## 核心原则

1. **不依赖任何服务器** — 只用 GitHub 私有仓库
2. **每次对话自动保存** — 不用手动操作
3. **每次启动自动读取** — 无缝衔接
4. **跨平台共享** — Codex/Claude/Trae 都能用
5. **敏感文件必须加密** — `系统配置/` 下的 `.ovpn`、证书、代理脚本已用 git-crypt 加密
