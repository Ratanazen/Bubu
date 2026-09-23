use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Serialize, Deserialize, Debug)]
pub struct LrcResponse {
    pub id: i32,
    pub trackName: Option<String>,
    pub artistName: Option<String>,
    pub albumName: Option<String>,
    pub duration: Option<f64>,
    pub plainLyrics: Option<String>,
    pub syncedLyrics: Option<String>,
}

#[tauri::command]
pub async fn fetch_lyrics(track_name: String, artist_name: String) -> Result<Option<LrcResponse>, String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    let url = format!(
        "https://lrclib.net/api/get?track_name={}&artist_name={}",
        urlencoding::encode(&track_name),
        urlencoding::encode(&artist_name)
    );

    let res = client.get(&url).send().await.map_err(|e| e.to_string())?;
    
    if res.status().is_success() {
        let json = res.json::<LrcResponse>().await.map_err(|e| e.to_string())?;
        Ok(Some(json))
    } else {
        Ok(None)
    }
}
