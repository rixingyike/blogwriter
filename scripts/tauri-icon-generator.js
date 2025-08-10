#!/usr/bin/env node

/**
 * 使用 Tauri CLI 生成应用图标
 * 这个脚本是对 `pnpm tauri icon` 命令的封装，提供更好的错误处理和日志输出
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 源图标文件路径
const sourceIcon = path.join(projectRoot, 'app-icon.png');
// 输出目录
const outputDir = path.join(projectRoot, 'src-tauri', 'icons');

// 检查源图标文件是否存在
if (!fs.existsSync(sourceIcon)) {
  console.error(`错误: 源图标文件不存在: ${sourceIcon}`);
  console.error('请在项目根目录创建一个名为 app-icon.png 的图标文件');
  process.exit(1);
}

console.log('开始生成应用图标...');
console.log(`源图标文件: ${sourceIcon}`);
console.log(`输出目录: ${outputDir}`);

try {
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`创建输出目录: ${outputDir}`);
  }

  // 执行 Tauri CLI 命令生成图标
  console.log('执行 Tauri CLI 命令...');
  execSync(`pnpm tauri icon "${sourceIcon}" --output "${outputDir}"`, {
    stdio: 'inherit',
    cwd: projectRoot
  });

  console.log('\n✅ 图标生成成功!');
  
  // 列出生成的图标文件
  console.log('\n生成的图标文件:');
  const iconFiles = fs.readdirSync(outputDir);
  iconFiles.forEach(file => {
    const filePath = path.join(outputDir, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });

  // 验证关键图标文件
  const requiredIcons = ['icon.ico', 'icon.png', 'icon.icns'];
  const missingIcons = requiredIcons.filter(icon => !iconFiles.includes(icon));
  
  if (missingIcons.length > 0) {
    console.warn('\n⚠ 警告: 以下关键图标文件未生成:');
    missingIcons.forEach(icon => console.warn(`- ${icon}`));
  } else {
    console.log('\n✅ 所有关键图标文件已生成');
  }
} catch (error) {
  console.error('\n❌ 图标生成失败:');
  console.error(error.message);
  process.exit(1);
}