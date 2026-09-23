use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct ActiveWindow {
    pub app_name: String,
    pub title: String,
}

#[tauri::command]
pub fn get_active_window() -> Option<ActiveWindow> {
    // 1. Try Hyprland
    if let Ok(output) = Command::new("hyprctl").arg("activewindow").arg("-j").output() {
        if output.status.success() {
            if let Ok(json) = serde_json::from_slice::<serde_json::Value>(&output.stdout) {
                if let (Some(class), Some(title)) = (json["class"].as_str(), json["title"].as_str()) {
                    return Some(ActiveWindow {
                        app_name: class.to_string(),
                        title: title.to_string(),
                    });
                }
            }
        }
    }
    
    // 2. Try xdotool (X11)
    if let Ok(output) = Command::new("xdotool").arg("getactivewindow").arg("getwindowclassname").output() {
        if output.status.success() {
            let class = String::from_utf8_lossy(&output.stdout).trim().to_string();
            
            if let Ok(title_out) = Command::new("xdotool").arg("getactivewindow").arg("getwindowname").output() {
                let title = String::from_utf8_lossy(&title_out.stdout).trim().to_string();
                return Some(ActiveWindow {
                    app_name: class,
                    title,
                });
            }
        }
    }

    None
}
