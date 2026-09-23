use tauri::{AppHandle, Manager, WebviewWindowBuilder, WebviewUrl};

#[tauri::command]
pub async fn spawn_pet_window(app: AppHandle, id: String) -> Result<(), String> {
    let window_label = format!("pet-{}", id);
    
    // Check if it already exists
    if app.get_webview_window(&window_label).is_some() {
        return Ok(());
    }

    let url = format!("/pet.html?id={}", id);
    
    let builder = WebviewWindowBuilder::new(&app, &window_label, WebviewUrl::App(url.into()))
        .title(format!("Bubu Character - {}", id))
        .inner_size(300.0, 300.0)
        .transparent(true)
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .position(100.0, 100.0);

    match builder.build() {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string())
    }
}
