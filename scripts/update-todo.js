#!/usr/bin/env node

/**
 * 更新待翻译任务列表
 * 为每个语言生成 todo.md 文件，列出所有待翻译的文档
 *
 * 使用方法:
 *   node update-todo.js          # 更新所有语言的 todo.md
 *   node update-todo.js ko       # 仅更新韩语的 todo.md
 *   node update-todo.js en fr    # 更新英语和法语的 todo.md
 */

const fs = require('fs')
const path = require('path')

// 配置
const DOCS_DIR = path.join(__dirname, '..', 'docs')
const SOURCE_LANG = 'zh'
const TODO_FILENAME = 'todo.md'

// 获取命令行参数
const args = process.argv.slice(2)

// 待翻译标记
const PENDING_MARKERS = [
  '待翻译',
  'pending translation',
  'This page is pending translation',
  '此页面待翻译',
  '此页面内容尚未翻译'
]

/**
 * 检查文件是否为待翻译文件
 */
function isPendingTranslation(filePath) {
  try {
    if (!filePath.endsWith('.md')) {
      return false
    }
    
    const content = fs.readFileSync(filePath, 'utf-8')
    const firstLines = content.split('\n').slice(0, 20).join('\n').toLowerCase()
    
    // 检查是否包含待翻译标记
    return PENDING_MARKERS.some(marker => 
      firstLines.includes(marker.toLowerCase())
    )
  } catch (err) {
    return false
  }
}

/**
 * 获取文件的行数（去掉头尾空白行）
 */
function getFileLineCount(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const trimmedContent = content.trim()
    if (trimmedContent === '') {
      return 0
    }
    return trimmedContent.split('\n').length
  } catch (err) {
    return null
  }
}

/**
 * 递归扫描目录查找待翻译文件
 */
function scanDirectory(targetDir, sourceDir, langCode, results) {
  if (!fs.existsSync(targetDir)) {
    return
  }
  
  const files = fs.readdirSync(targetDir)
  
  files.forEach(file => {
    // 跳过配置文件、特殊文件和 todo.md
    if (file === 'config.ts' || 
        file === 'sidebar.ts' || 
        file === TODO_FILENAME ||
        file.startsWith('.')) {
      return
    }
    
    const targetPath = path.join(targetDir, file)
    const sourcePath = path.join(sourceDir, file)
    const stat = fs.statSync(targetPath)
    
    if (stat.isDirectory()) {
      // 递归处理子目录
      scanDirectory(targetPath, sourcePath, langCode, results)
    } else if (file.endsWith('.md')) {
      // 检查是否为待翻译文件
      if (isPendingTranslation(targetPath)) {
        const relativePath = path.relative(path.join(DOCS_DIR, langCode), targetPath)
        const sourceLines = fs.existsSync(sourcePath) ? getFileLineCount(sourcePath) : null
        
        results.push({
          path: relativePath,
          sourceLines: sourceLines,
          sourceExists: fs.existsSync(sourcePath)
        })
      }
    }
  })
}

/**
 * 获取所有语言目录
 */
function getAllLanguages() {
  const langs = []
  const items = fs.readdirSync(DOCS_DIR)
  
  items.forEach(item => {
    const itemPath = path.join(DOCS_DIR, item)
    if (fs.statSync(itemPath).isDirectory() &&
      item !== SOURCE_LANG &&
      !item.startsWith('.') &&
      item !== 'public') {
      langs.push(item)
    }
  })
  
  return langs
}

/**
 * 生成 todo.md 内容
 */
function generateTodoContent(langCode, pendingFiles) {
  const langNames = {
    'de': '德语',
    'en': '英语',
    'es': '西班牙语',
    'fr': '法语',
    'ja': '日语',
    'ko': '韩语',
    'pt': '葡萄牙语',
    'ru': '俄语',
    'tr': '土耳其语'
  }
  
  const langName = langNames[langCode] || langCode.toUpperCase()
  const updateTime = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  
  let content = `# ${langName}待翻译任务列表\n\n`
  content += `> 最后更新: ${updateTime}\n`
  content += `> 总计: ${pendingFiles.length} 个文件待翻译\n\n`
  
  if (pendingFiles.length === 0) {
    content += `## 🎉 恭喜！\n\n`
    content += `所有文件都已翻译完成！\n`
    return content
  }
  
  // 按目录分组
  const byDirectory = {}
  pendingFiles.forEach(file => {
    const dir = path.dirname(file.path)
    const category = dir === '.' ? '根目录' : dir.split('/')[0]
    
    if (!byDirectory[category]) {
      byDirectory[category] = []
    }
    byDirectory[category].push(file)
  })
  
  // 生成目录索引
  content += `## 📋 任务总览\n\n`
  Object.keys(byDirectory).sort().forEach(category => {
    const count = byDirectory[category].length
    content += `- **${category}**: ${count} 个文件\n`
  })
  content += `\n`
  
  // 生成详细列表
  content += `## 📝 待翻译文件列表\n\n`
  
  Object.keys(byDirectory).sort().forEach(category => {
    content += `### ${category}\n\n`
    
    byDirectory[category]
      .sort((a, b) => a.path.localeCompare(b.path))
      .forEach(file => {
        const checkbox = '- [ ]'
        const lineInfo = file.sourceLines ? ` (${file.sourceLines} 行)` : ''
        const linkPath = file.path.replace(/\\/g, '/')
        content += `${checkbox} [${file.path}](./${linkPath})${lineInfo}\n`
      })
    
    content += `\n`
  })
  
  // 添加使用说明
  content += `## 📖 使用说明\n\n`
  content += `1. 点击文件链接可直接打开对应文件\n`
  content += `2. 翻译完成后，可以在对应条目前打勾 ✓\n`
  content += `3. 行数信息仅供参考，用于评估工作量\n`
  content += `4. 运行 \`npm run todo:${langCode}\` 可重新生成此列表\n\n`
  
  content += `## 🔄 更新此列表\n\n`
  content += `\`\`\`bash\n`
  content += `npm run todo:${langCode}\n`
  content += `\`\`\`\n\n`
  
  content += `---\n\n`
  content += `*此文件由脚本自动生成，请勿手动编辑内容部分*\n`
  
  return content
}

/**
 * 更新语言的 todo.md
 */
function updateLanguageTodo(langCode) {
  const sourceDir = path.join(DOCS_DIR, SOURCE_LANG)
  const targetDir = path.join(DOCS_DIR, langCode)
  const todoPath = path.join(targetDir, TODO_FILENAME)
  
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ 错误: 语言目录不存在 (${targetDir})`)
    return false
  }
  
  // 扫描待翻译文件
  const pendingFiles = []
  scanDirectory(targetDir, sourceDir, langCode, pendingFiles)
  
  // 生成 todo.md 内容
  const content = generateTodoContent(langCode, pendingFiles)
  
  // 写入文件
  fs.writeFileSync(todoPath, content, 'utf-8')
  
  console.log(`✅ ${langCode.toUpperCase()}: 已更新 todo.md (${pendingFiles.length} 个待翻译文件)`)
  
  return true
}

/**
 * 主函数
 */
function main() {
  console.log('待翻译任务列表更新工具')
  console.log('=====================\n')
  
  let targetLangs = []
  
  // 解析参数
  if (args.includes('--help') || args.includes('-h')) {
    console.log('使用方法:')
    console.log('  node update-todo.js [语言代码...]')
    console.log('\n示例:')
    console.log('  node update-todo.js          # 更新所有语言')
    console.log('  node update-todo.js ko       # 仅更新韩语')
    console.log('  node update-todo.js en fr    # 更新英语和法语')
    console.log('\n说明:')
    console.log('  脚本会在每个语言目录下生成 todo.md 文件')
    console.log('  列出该语言所有待翻译的文档')
    process.exit(0)
  }
  
  if (args.length === 0) {
    // 没有指定语言，更新所有语言
    targetLangs = getAllLanguages()
    console.log(`更新所有语言的 todo.md: ${targetLangs.join(', ')}\n`)
  } else {
    // 指定了语言
    targetLangs = args
    console.log(`更新指定语言的 todo.md: ${targetLangs.join(', ')}\n`)
  }
  
  // 更新每个语言的 todo.md
  let successCount = 0
  targetLangs.forEach(lang => {
    if (updateLanguageTodo(lang)) {
      successCount++
    }
  })
  
  // 总结
  console.log(`\n📊 完成: ${successCount}/${targetLangs.length} 个语言的 todo.md 已更新`)
  
  if (successCount > 0) {
    console.log('\n💡 提示: 可以打开各语言目录下的 todo.md 查看待翻译任务列表')
  }
}

// 运行主函数
main()
