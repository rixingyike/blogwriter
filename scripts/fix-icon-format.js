#!/usr/bin/env node

/**
 * 修复源图标文件格式
 * 将 JPEG 格式的图标文件转换为 PNG 格式
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 源图标文件路径
const sourceIcon = path.join(projectRoot, 'app-icon.png');
// 临时文件路径
const tempIcon = path.join(projectRoot, 'app-icon-temp.png');

console.log('开始修复源图标文件格式...');
console.log(`源文件: ${sourceIcon}`);

async function fixIconFormat() {
  try {
    // 检查源文件是否存在
    if (!fs.existsSync(sourceIcon)) {
      console.error(`错误: 源图标文件不存在: ${sourceIcon}`);
      process.exit(1);
    }

    // 读取源文件信息
    const sourceBuffer = fs.readFileSync(sourceIcon);
    console.log(`源文件大小: ${(sourceBuffer.length / 1024).toFixed(2)} KB`);

    // 使用 sharp 转换为 PNG 格式
    console.log('转换为 PNG 格式...');
    const pngBuffer = await sharp(sourceBuffer)
      .toFormat('png')
      .toBuffer();

    // 保存为临时文件
    fs.writeFileSync(tempIcon, pngBuffer);
    console.log(`临时文件已保存: ${tempIcon}`);
    console.log(`临时文件大小: ${(pngBuffer.length / 1024).toFixed(2)} KB`);

    // 备份原文件
    const backupPath = `${sourceIcon}.backup`;
    fs.renameSync(sourceIcon, backupPath);
    console.log(`原文件已备份: ${backupPath}`);

    // 将临时文件重命名为原文件名
    fs.renameSync(tempIcon, sourceIcon);
    console.log(`临时文件已重命名为原文件名: ${sourceIcon}`);

    console.log('\n✅ 源图标文件格式修复成功!');
    console.log('现在可以运行 pnpm tauri:icons 命令生成图标了');
  } catch (error) {
    console.error('\n❌ 源图标文件格式修复失败:');
    console.error(error.message);
    
    // 清理临时文件
    if (fs.existsSync(tempIcon)) {
      fs.unlinkSync(tempIcon);
    }
    
    process.exit(1);
  }
}

fixIconFormat();