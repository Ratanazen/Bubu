use sysinfo::System;
use tauri::{AppHandle, Emitter};
use std::time::Duration;
use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct SystemStats {
    pub cpu_usage: f32,
    pub memory_usage_percent: f32,
    pub is_laptop: bool,
    // Note: detailed battery info requires extra crates, keeping it simple for now
}

pub fn start_monitor(app_handle: AppHandle) {
    std::thread::spawn(move || {
        let mut sys = System::new_all();
        loop {
            sys.refresh_all();
            
            let cpu_usage = sys.global_cpu_usage();
            let total_mem = sys.total_memory();
            let used_mem = sys.used_memory();
            
            let memory_usage_percent = if total_mem > 0 {
                (used_mem as f32 / total_mem as f32) * 100.0
            } else {
                0.0
            };

            let stats = SystemStats {
                cpu_usage,
                memory_usage_percent,
                is_laptop: true, // simplified
            };

            // Emit to frontend
            let _ = app_handle.emit("system-status", stats);
            
            std::thread::sleep(Duration::from_secs(10));
        }
    });
}
