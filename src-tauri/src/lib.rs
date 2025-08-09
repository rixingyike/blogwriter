use tauri_plugin_dialog::DialogExt;
use std::fs;
use std::path::Path;
use log::{error, info};
use env_logger;
use std::error::Error;
use serde::Serialize;
use std::time::UNIX_EPOCH;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

/// 文件信息结构体
#[derive(Serialize)]
struct FileInfo {
    exists: bool,
    is_file: bool,
    is_dir: bool,
    size: u64,
    last_modified: Option<String>,
    readonly: bool,
    path: String,
}

/// 辅助函数：处理文件操作错误并记录日志
#[allow(dead_code)]
fn handle_file_error<T, E: Error>(result: Result<T, E>, operation: &str, path: &Path) -> Result<T, String> {
    match result {
        Ok(value) => Ok(value),
        Err(err) => {
            let error_msg = format!("{} '{}' 失败: {}", operation, path.to_string_lossy(), err);
            error!("{}", error_msg);
            Err(error_msg)
        }
    }
}
#[tauri::command]
fn greet(name: &str) -> String {
    info!("Greeting user: {}", name);
    format!("Hello, {}! You've been greeted from Rust!", name)
}



#[tauri::command]
async fn save_file(app_handle: tauri::AppHandle, content: String) -> Result<(), String> {
    // 使用阻塞操作获取文件路径
    let result = std::sync::mpsc::channel();
    let sender = result.0;
    
    app_handle.dialog()
        .file()
        .add_filter("Markdown", &["md"])
        .set_title("保存Markdown文件")
        .save_file(move |path_result| {
            sender.send(path_result).unwrap();
        });
    
    // 等待对话框结果
    let path = match result.1.recv().unwrap() {
        Some(path) => {
            let path_str = path.to_string();
            info!("用户选择保存路径: {}", path_str);
            Path::new(&path_str).to_path_buf()
        },
        None => return Err("未选择文件".to_string()),
    };
    
    // 检查路径是否有效
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            error!("保存路径的父目录不存在: {}", parent.to_string_lossy());
            return Err(format!("保存路径 '{}' 的父目录不存在", parent.to_string_lossy()));
        }
    }
    
    // 保存文件内容
    info!("正在保存文件: {}", path.to_string_lossy());
    match fs::write(&path, content) {
        Ok(_) => {
            info!("文件保存成功: {}", path.to_string_lossy());
            Ok(())
        },
        Err(err) => {
            error!("保存文件失败: {} - {}", path.to_string_lossy(), err);
            Err(format!("保存文件 '{}' 失败: {}", path.to_string_lossy(), err))
        }
    }
}



#[tauri::command]
async fn open_file(app_handle: tauri::AppHandle) -> Result<String, String> {
    // 使用阻塞操作获取文件路径
    let result = std::sync::mpsc::channel();
    let sender = result.0;
    
    app_handle.dialog()
        .file()
        .add_filter("Markdown", &["md"])
        .set_title("打开Markdown文件")
        .pick_file(move |path_result| {
            sender.send(path_result).unwrap();
        });
    
    // 等待对话框结果
    let path = match result.1.recv().unwrap() {
        Some(p) => {
            let path_str = p.to_string();
            info!("用户选择打开文件: {}", path_str);
            p
        },
        None => {
            info!("用户取消了文件打开操作");
            return Err("未选择文件".to_string());
        }
    };
    
    // 验证文件是否存在
    let path_str = path.to_string();
    let path_obj = Path::new(&path_str);
    if !path_obj.exists() {
        error!("文件不存在: {}", path_str);
        return Err(format!("文件 '{}' 不存在", path_str));
    }
    
    // 验证文件是否可读
    if let Ok(metadata) = fs::metadata(path_obj) {
        if metadata.len() > 10 * 1024 * 1024 {  // 10MB 限制
            error!("文件过大: {} ({} bytes)", path_str, metadata.len());
            return Err(format!("文件 '{}' 过大，超过10MB限制", path_str));
        }
    }
    
    // 尝试读取文件内容
    info!("正在读取文件: {}", path_str);
    match fs::read_to_string(path_obj) {
        Ok(content) => {
            info!("文件读取成功: {}", path_str);
            Ok(content)
        },
        Err(err) => {
            error!("读取文件失败: {} - {}", path_str, err);
            Err(format!("读取文件 '{}' 失败: {}", path_str, err))
        }
    }
}



#[tauri::command]
async fn check_file_exists(file_path: String) -> Result<bool, String> {
    info!("检查文件是否存在: {}", file_path);
    let path = Path::new(&file_path);
    
    if !path.exists() {
        info!("文件不存在: {}", file_path);
        return Ok(false);
    }
    
    match fs::metadata(path) {
        Ok(metadata) => {
            let is_file = metadata.is_file();
            info!("路径 '{}' 是{}文件", file_path, if is_file { "一个" } else { "不是" });
            Ok(is_file)
        },
        Err(err) => {
            error!("检查文件状态失败: {} - {}", file_path, err);
            Err(format!("检查文件 '{}' 状态失败: {}", file_path, err))
        }
    }
}



#[tauri::command]
async fn get_file_info(file_path: String) -> Result<FileInfo, String> {
    info!("获取文件信息: {}", file_path);
    let path = Path::new(&file_path);
    
    let exists = path.exists();
    let mut file_info = FileInfo {
        exists,
        is_file: false,
        is_dir: false,
        size: 0,
        last_modified: None,
        readonly: false,
        path: file_path.clone(),
    };
    
    if !exists {
        info!("文件不存在: {}", file_path);
        return Ok(file_info);
    }
    
    match fs::metadata(path) {
        Ok(metadata) => {
            file_info.is_file = metadata.is_file();
            file_info.is_dir = metadata.is_dir();
            file_info.size = metadata.len();
            file_info.readonly = metadata.permissions().readonly();
            
            // 尝试获取最后修改时间
            if let Ok(modified) = metadata.modified() {
                if let Ok(duration) = modified.duration_since(UNIX_EPOCH) {
                    file_info.last_modified = Some(duration.as_secs().to_string());
                }
            }
            
            info!("成功获取文件信息: {}", file_path);
            Ok(file_info)
        },
        Err(err) => {
            error!("获取文件信息失败: {} - {}", file_path, err);
            Err(format!("获取文件 '{}' 信息失败: {}", file_path, err))
        }
    }
}



#[tauri::command]
async fn create_directory(dir_path: String) -> Result<(), String> {
    info!("创建目录: {}", dir_path);
    let path = Path::new(&dir_path);
    
    // 检查目录是否已存在
    if path.exists() {
        if path.is_dir() {
            info!("目录已存在: {}", dir_path);
            return Ok(());
        } else {
            error!("路径已存在但不是目录: {}", dir_path);
            return Err(format!("路径 '{}' 已存在但不是目录", dir_path));
        }
    }
    
    // 创建目录
    match fs::create_dir_all(path) {
        Ok(_) => {
            info!("成功创建目录: {}", dir_path);
            Ok(())
        },
        Err(err) => {
            error!("创建目录失败: {} - {}", dir_path, err);
            Err(format!("创建目录 '{}' 失败: {}", dir_path, err))
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 初始化日志系统
    env_logger::init();
    
    info!("启动应用程序...");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, save_file, open_file, check_file_exists, get_file_info, create_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}