use std::net::SocketAddr;
use tauri::{AppHandle, Emitter};
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use futures_util::stream::StreamExt;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct BrowserPayload {
    pub url: Option<String>,
    pub title: Option<String>,
    pub timestamp: Option<f64>,
}

pub fn start_server(app_handle: AppHandle) {
    tauri::async_runtime::spawn(async move {
        let addr = "127.0.0.1:14233".parse::<SocketAddr>().unwrap();
        let listener = TcpListener::bind(&addr).await.expect("Failed to bind WebSocket");
        println!("Browser Bridge WebSocket listening on: {}", addr);

        while let Ok((stream, _)) = listener.accept().await {
            let app_handle = app_handle.clone();
            tokio::spawn(async move {
                if let Ok(mut ws_stream) = accept_async(stream).await {
                    println!("Browser connected!");
                    while let Some(msg) = ws_stream.next().await {
                        if let Ok(msg) = msg {
                            if msg.is_text() {
                                let text = msg.to_text().unwrap_or_default();
                                if let Ok(payload) = serde_json::from_str::<BrowserPayload>(text) {
                                    // Forward to frontend via Tauri event
                                    let _ = app_handle.emit("browser-data", payload);
                                }
                            }
                        }
                    }
                    println!("Browser disconnected.");
                }
            });
        }
    });
}
