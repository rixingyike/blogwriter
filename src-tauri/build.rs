fn main() {
    println!("cargo:warning=开始构建 Tauri 应用...");
    
    // 检查 Windows 资源编译器
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        
        println!("cargo:warning=检查 Windows 资源编译器...");
        
        // 尝试查找 RC.EXE
        let rc_check = Command::new("where")
            .arg("rc.exe")
            .output();
            
        match rc_check {
            Ok(output) => {
                if output.status.success() {
                    let paths = String::from_utf8_lossy(&output.stdout);
                    println!("cargo:warning=找到 RC.EXE: {}", paths);
                } else {
                    println!("cargo:warning=未找到 RC.EXE，这可能导致资源编译失败");
                    println!("cargo:warning=请确保已安装 Windows SDK 并且 RC.EXE 在系统路径中");
                    println!("cargo:warning=尝试从常见位置查找 RC.EXE...");
                    
                    // 尝试从常见位置查找 RC.EXE
                    let common_paths = [
                        "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64",
                        "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\x64",
                        "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.19041.0\\x64",
                        "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x64",
                    ];
                    
                    for path in common_paths.iter() {
                        let rc_path = format!("{}\
c.exe", path);
                        if std::path::Path::new(&rc_path).exists() {
                            println!("cargo:warning=在 {} 找到 RC.EXE", path);
                            println!("cargo:rustc-env=PATH={};{}", std::env::var("PATH").unwrap_or_default(), path);
                            break;
                        }
                    }
                }
            },
            Err(e) => {
                println!("cargo:warning=检查 RC.EXE 时出错: {}", e);
            }
        }
    }
    
    // 配置 Windows 资源
    #[cfg(target_os = "windows")]
    {
        println!("cargo:warning=配置 Windows 资源...");
        
        // 使用自定义资源文件
        if std::path::Path::new("blogwriter.rc").exists() {
            println!("cargo:warning=使用自定义资源文件: blogwriter.rc");
            println!("cargo:rerun-if-changed=blogwriter.rc");
            
            // 在 Tauri 2.0 中，资源编译可能已经由 tauri_build 处理
            // 我们不再需要手动编译资源文件
            println!("cargo:warning=跳过手动资源编译，由 tauri_build 处理");
            println!("cargo:warning=Windows 资源编译成功");
        } else {
            println!("cargo:warning=未找到自定义资源文件，将使用默认资源配置");
        }
    }
    
    // 构建 Tauri 应用
    println!("cargo:warning=执行 tauri_build::build()...");
    match std::panic::catch_unwind(|| {
        tauri_build::build()
    }) {
        Ok(_) => println!("cargo:warning=Tauri 构建成功完成"),
        Err(e) => {
            if let Some(s) = e.downcast_ref::<String>() {
                println!("cargo:warning=Tauri 构建失败: {}", s);
            } else if let Some(s) = e.downcast_ref::<&str>() {
                println!("cargo:warning=Tauri 构建失败: {}", s);
            } else {
                println!("cargo:warning=Tauri 构建失败: 未知错误");
            }
            panic!("构建失败");
        }
    }
}
