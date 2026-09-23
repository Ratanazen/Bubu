mod music;
mod context;
mod browser_bridge;
mod lyrics;
mod ai;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_dialog::init())
    .invoke_handler(tauri::generate_handler![
        music::get_current_media,
        context::get_active_window,
        lyrics::fetch_lyrics,
        ai::generate_chat
    ])
    .setup(|app| {
      browser_bridge::start_server(app.handle().clone());
      
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
