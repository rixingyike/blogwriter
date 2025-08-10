# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 开发指南

### 图标生成

项目使用 `src/assets/blogwriter_logo.png` 作为源图片，自动生成 Tauri 应用所需的各种尺寸图标。

生成图标命令：
```bash
pnpm icons
```

此命令会自动将源图片转换为以下格式：
- 各种尺寸的 PNG 图标 (32x32, 128x128, 等)
- Windows 图标 (icon.ico)
- macOS 图标 (icon.icns)
- Microsoft Store 图标 (Square*.png)

### 开发历史

- 在codebuddy的帮助下，建立了tauri+marked的PC桌面软件项目，可以使用pnpm tauri dev运行。
- 加菜单栏。入库，开始记录。
- 添加自动图标生成功能，使用 app-icon.png 生成所有所需图标。
- 解决Windows平台下图标显示问题：
  - 修复了Tauri 2.0中资源编译冲突问题
  - 解决了Windows SDK依赖问题（RC.EXE资源编译器）
  - 修复了API变更导致的`get_webview_window`方法调用错误
  - 优化了资源文件配置，避免重复定义和编译图标资源
  - 通过修改`build.rs`文件，让`tauri_build::build()`正确处理资源编译