#!/usr/bin/env node

const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

const LAST_TRANSLATED_FILE = path.join(__dirname, '..', '.last-translated-commit')

function getLastTranslatedCommit() {
  try {
    return fs.readFileSync(LAST_TRANSLATED_FILE, 'utf8').trim()
  } catch (error) {
    return null
  }
}

function getCurrentCommit() {
  return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
}

function getCommitsSince(lastCommit) {
  try {
    const commits = execSync(`git log --oneline ${lastCommit}..HEAD`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(line => line.length > 0)
      .map(line => {
        const [hash, ...messageParts] = line.split(' ')
        return {
          hash,
          message: messageParts.join(' ')
        }
      })
    return commits
  } catch (error) {
    return []
  }
}

function updateLastTranslatedCommit(commitHash) {
  fs.writeFileSync(LAST_TRANSLATED_FILE, commitHash)
  console.log(`✅ 已更新最后翻译的提交: ${commitHash.substring(0, 7)}`)
}

function main() {
  const command = process.argv[2]

  if (command === 'check') {
    const lastTranslated = getLastTranslatedCommit()
    const current = getCurrentCommit()

    if (!lastTranslated) {
      console.log('❌ 未找到上次翻译的提交记录')
      return
    }

    console.log(`📋 上次翻译的提交: ${lastTranslated.substring(0, 7)}`)
    console.log(`📋 当前提交: ${current.substring(0, 7)}`)

    if (lastTranslated === current) {
      console.log('✅ 所有提交都已翻译完成')
      return
    }

    const commits = getCommitsSince(lastTranslated)

    if (commits.length === 0) {
      console.log('✅ 没有新的提交需要翻译')
    } else {
      console.log(`\n📝 发现 ${commits.length} 个新提交需要翻译:`)
      commits.forEach((commit, index) => {
        console.log(`${index + 1}. ${commit.hash.substring(0, 7)} - ${commit.message}`)
      })
    }
  } else if (command === 'update') {
    const current = getCurrentCommit()
    updateLastTranslatedCommit(current)
  } else {
    console.log('使用方法:')
    console.log('  node scripts/check-translation.js check   - 检查需要翻译的提交')
    console.log('  node scripts/check-translation.js update - 更新最后翻译的提交')
  }
}

main()
