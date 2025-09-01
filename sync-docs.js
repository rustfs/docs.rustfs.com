#!/usr/bin/env node

/**
 * 文档同步脚本
 * 用于将中文文档结构和内容同步到其他语言版本
 *
 * 使用方法:
 *   node sync-docs.js          # 同步到所有语言
 *   node sync-docs.js ko       # 仅同步到韩语
 *   node sync-docs.js en fr    # 同步到英语和法语
 */

const fs = require('fs')
const path = require('path')

// 配置
const DOCS_DIR = path.join(__dirname, 'docs')
const SOURCE_LANG = 'zh'

// 获取命令行参数
const args = process.argv.slice(2)

/**
 * 获取文件的修改时间
 */
function getFileModTime(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.mtime
  } catch (err) {
    return null
  }
}

/**
 * 获取文件的行数（去掉头尾空白行）
 */
function getFileLineCount(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    // 去掉头尾空白，然后按行分割
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
 * 递归创建目录
 */
function mkdirRecursive(dir) {
  if (!fs.existsSync(dir)) {
    mkdirRecursive(path.dirname(dir))
    fs.mkdirSync(dir)
  }
}

/**
 * 递归删除目录
 */
function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dirPath)
  }
}

/**
 * 复制文件
 */
function copyFile(src, dest) {
  mkdirRecursive(path.dirname(dest))
  fs.copyFileSync(src, dest)
  console.log(`  ✓ 复制: ${path.relative(DOCS_DIR, dest)}`)
}

/**
 * 创建占位符文件
 */
function createPlaceholder(dest, relativePath) {
  mkdirRecursive(path.dirname(dest))

  // 为占位符内容添加原始文件路径信息
  const content = `---
title: "待翻译"
description: "此页面待翻译"
source: "${relativePath}"
---

# 待翻译

此页面内容尚未翻译，请参考[中文版本](../../zh/${relativePath})。

---

*This page is pending translation. Please refer to the [Chinese version](../../zh/${relativePath}).*
`

  fs.writeFileSync(dest, content)
  console.log(`  ✓ 创建占位符: ${path.relative(DOCS_DIR, dest)}`)
}

/**
 * 递归遍历目录并同步文件
 */
function syncDirectory(sourceDir, targetDir, langCode, stats) {
  // 首先处理目标目录中多余的文件（在中文版本中不存在的）
  if (fs.existsSync(targetDir)) {
    const targetFiles = fs.readdirSync(targetDir)
    targetFiles.forEach(file => {
      // 跳过配置文件和特殊文件
      if (file === 'config.ts' || file === 'sidebar.ts' || file.startsWith('.')) {
        return
      }

      const sourcePath = path.join(sourceDir, file)
      const targetPath = path.join(targetDir, file)

      // 如果源文件不存在，删除目标文件
      if (!fs.existsSync(sourcePath)) {
        if (fs.statSync(targetPath).isDirectory()) {
          deleteFolderRecursive(targetPath)
          console.log(`  ✗ 删除目录: ${path.relative(DOCS_DIR, targetPath)}`)
          stats.deleted++
        } else {
          fs.unlinkSync(targetPath)
          console.log(`  ✗ 删除文件: ${path.relative(DOCS_DIR, targetPath)}`)
          stats.deleted++
        }
      }
    })
  }

  // 然后同步源目录中的文件
  const files = fs.readdirSync(sourceDir)

  files.forEach(file => {
    // 跳过配置文件和特殊文件
    if (file === 'config.ts' || file === 'sidebar.ts' || file.startsWith('.')) {
      return
    }

    const sourcePath = path.join(sourceDir, file)
    const targetPath = path.join(targetDir, file)
    const relativePath = path.relative(path.join(DOCS_DIR, SOURCE_LANG), sourcePath)

    const stat = fs.statSync(sourcePath)

    if (stat.isDirectory()) {
      // 递归处理子目录
      syncDirectory(sourcePath, targetPath, langCode, stats)
    } else {
      const sourceModTime = getFileModTime(sourcePath)
      const targetModTime = getFileModTime(targetPath)

      if (file.endsWith('.md')) {
        // Markdown 文件处理
        if (!fs.existsSync(targetPath)) {
          // 目标文件不存在，创建占位符
          createPlaceholder(targetPath, relativePath)
          stats.created++
        } else {
          // 文件存在，检查是否需要更新
          const sourceLines = getFileLineCount(sourcePath)
          const targetLines = getFileLineCount(targetPath)
          const lineDiff = Math.abs(sourceLines - targetLines)

          if (lineDiff > 5) {
            // 行数差异大于5行，用占位符覆盖
            createPlaceholder(targetPath, relativePath)
            console.log(`  ⚠ 已重置为待翻译: ${path.relative(DOCS_DIR, targetPath)}`)
            console.log(`    行数差异: 中文 ${sourceLines} 行 vs 目标 ${targetLines} 行 (差异: ${lineDiff} 行)`)
            stats.needUpdate++
          } else if (targetModTime && sourceModTime > targetModTime) {
            // 时间戳不一致，也用占位符覆盖
            createPlaceholder(targetPath, relativePath)
            console.log(`  ⚠ 已重置为待翻译: ${path.relative(DOCS_DIR, targetPath)}`)
            console.log(`    中文版本更新时间: ${sourceModTime.toLocaleString()}`)
            console.log(`    目标版本更新时间: ${targetModTime.toLocaleString()}`)
            stats.needUpdate++
          } else {
            // 目标文件已存在且是最新的
            stats.upToDate++
          }
        }
      } else {
        // 非 Markdown 文件，直接复制
        if (!fs.existsSync(targetPath) || sourceModTime > targetModTime) {
          copyFile(sourcePath, targetPath)
          stats.copied++
        } else {
          stats.skipped++
        }
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
 * 同步单个语言
 */
function syncLanguage(langCode) {
  console.log(`\n========================================`)
  console.log(`同步到 ${langCode} 语言版本`)
  console.log(`========================================`)

  const sourceDir = path.join(DOCS_DIR, SOURCE_LANG)
  const targetDir = path.join(DOCS_DIR, langCode)

  if (!fs.existsSync(sourceDir)) {
    console.error(`错误: 中文文档目录不存在 (${sourceDir})`)
    return
  }

  // 确保目标目录存在
  mkdirRecursive(targetDir)

  // 统计信息
  const stats = {
    created: 0,
    copied: 0,
    needUpdate: 0,
    upToDate: 0,
    skipped: 0,
    deleted: 0
  }

  // 执行同步
  syncDirectory(sourceDir, targetDir, langCode, stats)

  // 输出统计
  console.log(`\n统计信息:`)
  console.log(`  - 创建占位符文件: ${stats.created}`)
  console.log(`  - 复制非MD文件: ${stats.copied}`)
  console.log(`  - 删除多余文件: ${stats.deleted}`)
  console.log(`  - 需要更新翻译: ${stats.needUpdate}`)
  console.log(`  - 已是最新: ${stats.upToDate}`)
  console.log(`  - 跳过: ${stats.skipped}`)

  return stats
}

/**
 * 主函数
 */
function main() {
  console.log('文档同步工具')
  console.log('============\n')

  let targetLangs = []

  if (args.length === 0) {
    // 没有指定语言，同步所有语言
    targetLangs = getAllLanguages()
    console.log(`未指定语言，将同步到所有语言版本: ${targetLangs.join(', ')}`)
  } else {
    // 指定了语言
    targetLangs = args
    console.log(`将同步到指定语言版本: ${targetLangs.join(', ')}`)
  }

  // 检查中文源目录
  const sourceDir = path.join(DOCS_DIR, SOURCE_LANG)
  if (!fs.existsSync(sourceDir)) {
    console.error(`\n错误: 中文文档目录不存在 (${sourceDir})`)
    process.exit(1)
  }

  // 总统计
  const totalStats = {
    created: 0,
    copied: 0,
    needUpdate: 0,
    upToDate: 0,
    skipped: 0,
    deleted: 0
  }

  // 逐个同步语言
  targetLangs.forEach(lang => {
    const stats = syncLanguage(lang)
    if (stats) {
      totalStats.created += stats.created
      totalStats.copied += stats.copied
      totalStats.needUpdate += stats.needUpdate
      totalStats.upToDate += stats.upToDate
      totalStats.skipped += stats.skipped
      totalStats.deleted += stats.deleted
    }
  })

  // 输出总统计
  console.log(`\n========================================`)
  console.log(`总体统计`)
  console.log(`========================================`)
  console.log(`  - 处理语言数: ${targetLangs.length}`)
  console.log(`  - 创建占位符文件总数: ${totalStats.created}`)
  console.log(`  - 复制文件总数: ${totalStats.copied}`)
  console.log(`  - 删除多余文件总数: ${totalStats.deleted}`)
  console.log(`  - 需要更新翻译总数: ${totalStats.needUpdate}`)
  console.log(`  - 已是最新总数: ${totalStats.upToDate}`)
  console.log(`  - 跳过总数: ${totalStats.skipped}`)

  if (totalStats.needUpdate > 0) {
    console.log(`\n⚠ 注意: 有 ${totalStats.needUpdate} 个文件的中文版本已更新，可能需要重新翻译。`)
  }

  console.log('\n✅ 同步完成！')
}

// 运行主函数
main()
