#!/usr/bin/env python3
import os
import glob

# 6种目标语言
languages = ['ja', 'fr', 'de', 'es', 'ru', 'ko']

# 获取所有中文文件
zh_files = glob.glob('docs/zh/**/*.md', recursive=True)

print(f"发现 {len(zh_files)} 个中文文件需要翻译")

for lang in languages:
    print(f"处理 {lang} 语言...")
    created_count = 0
    
    for zh_file in zh_files:
        # 计算目标文件路径
        target_file = zh_file.replace('docs/zh/', f'docs/{lang}/')
        target_dir = os.path.dirname(target_file)
        
        # 创建目录
        os.makedirs(target_dir, exist_ok=True)
        
        # 如果文件不存在，创建模板文件
        if not os.path.exists(target_file):
            # 从中文文件读取标题和描述
            try:
                with open(zh_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # 提取frontmatter
                title = "待翻译"
                description = "此文档正在翻译中"
                
                if content.startswith('---'):
                    end_idx = content.find('---', 3)
                    if end_idx != -1:
                        frontmatter = content[3:end_idx]
                        for line in frontmatter.split('\n'):
                            if line.startswith('title:'):
                                title = line.split(':', 1)[1].strip().strip('"')
                            elif line.startswith('description:'):
                                description = line.split(':', 1)[1].strip().strip('"')
                
                # 创建基础模板
                template = f"""---
title: "{title}"
description: "{description}"
---

# {title}

此文档正在翻译中，请稍后查看更新。

原文件路径: {zh_file}
"""
                
                with open(target_file, 'w', encoding='utf-8') as f:
                    f.write(template)
                    
                created_count += 1
                
            except Exception as e:
                print(f"处理文件 {zh_file} 时出错: {e}")
    
    print(f"  {lang}: 创建了 {created_count} 个文件")

# 统计最终结果
print("\n最终统计:")
for lang in languages:
    count = len(glob.glob(f'docs/{lang}/**/*.md', recursive=True))
    print(f"{lang}: {count} 文件")