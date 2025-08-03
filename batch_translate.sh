#!/bin/bash

# 批量翻译脚本
# 将中文文档翻译为6种语言

# 语言映射
declare -A languages=(
    ["ja"]="日语"
    ["fr"]="法语"
    ["de"]="德语"
    ["es"]="西班牙语"
    ["ru"]="俄语"
    ["ko"]="韩语"
)

# 获取所有中文markdown文件
zh_files=($(find docs/zh -name "*.md" -type f | sort))

echo "发现 ${#zh_files[@]} 个中文文件需要翻译"

# 为每种语言创建完整目录结构
for lang in "${!languages[@]}"; do
    echo "处理 ${languages[$lang]} (${lang})..."
    
    for zh_file in "${zh_files[@]}"; do
        # 计算目标文件路径
        target_file="${zh_file/docs\/zh/docs\/$lang}"
        target_dir=$(dirname "$target_file")
        
        # 创建目录
        mkdir -p "$target_dir"
        
        # 如果文件不存在，创建占位符
        if [ ! -f "$target_file" ]; then
            echo "创建占位符: $target_file"
            cat > "$target_file" << EOF
---
title: "待翻译"
description: "此文档正在翻译中"
---

# 此文档正在翻译中

请稍后查看更新。

EOF
        fi
    done
done

echo "批量创建完成！"

# 统计每种语言的文件数
for lang in "${!languages[@]}"; do
    count=$(find docs/$lang -name "*.md" -type f | wc -l)
    echo "${languages[$lang]} ($lang): $count 文件"
done