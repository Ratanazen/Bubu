use mpris::{PlayerFinder, PlaybackStatus};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct MediaInfo {
    pub playing: bool,
    pub title: String,
    pub artist: String,
    pub album: String,
}

#[tauri::command]
pub fn get_current_media() -> Option<MediaInfo> {
    let finder = match PlayerFinder::new() {
        Ok(f) => f,
        Err(_) => return None,
    };
    
    // Find the first active player
    let player = match finder.find_active() {
        Ok(p) => p,
        Err(_) => return None,
    };

    let metadata = player.get_metadata().unwrap_or_else(|_| mpris::Metadata::new(""));
    let status = player.get_playback_status().unwrap_or(PlaybackStatus::Stopped);
    
    Some(MediaInfo {
        playing: status == PlaybackStatus::Playing,
        title: metadata.title().unwrap_or("").to_string(),
        artist: metadata.artists().map(|a| a.join(", ")).unwrap_or_default(),
        album: metadata.album_name().unwrap_or("").to_string(),
    })
}
