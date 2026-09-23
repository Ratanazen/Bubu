use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct GeminiRequest {
    contents: Vec<GeminiContent>,
}

#[derive(Serialize)]
struct GeminiContent {
    parts: Vec<GeminiPart>,
}

#[derive(Serialize)]
struct GeminiPart {
    text: String,
}

#[derive(Deserialize, Debug)]
struct GeminiResponse {
    candidates: Option<Vec<GeminiCandidate>>,
}

#[derive(Deserialize, Debug)]
struct GeminiCandidate {
    content: GeminiContentResponse,
}

#[derive(Deserialize, Debug)]
struct GeminiContentResponse {
    parts: Vec<GeminiPartResponse>,
}

#[derive(Deserialize, Debug)]
struct GeminiPartResponse {
    text: String,
}

#[tauri::command]
pub async fn generate_chat(
    api_key: String,
    active_app: Option<String>,
    current_song: Option<String>,
) -> Result<String, String> {
    if api_key.trim().is_empty() {
        return Err("API key is empty".into());
    }

    let client = Client::new();
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={}",
        api_key
    );

    let mut context_str = String::from("You are Bubu, a cute, slightly sassy desktop pet companion. Keep your response to ONE short sentence.");
    if let Some(app) = active_app {
        context_str.push_str(&format!(" The user is currently looking at an app called: {}.", app));
    }
    if let Some(song) = current_song {
        context_str.push_str(&format!(" The user is listening to a song called: {}.", song));
    }
    context_str.push_str(" Make a witty observation about what they are doing.");

    let req_body = GeminiRequest {
        contents: vec![GeminiContent {
            parts: vec![GeminiPart { text: context_str }],
        }],
    };

    let res = client
        .post(&url)
        .header("Content-Type", "application/json")
        .json(&req_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() {
        let json: GeminiResponse = res.json().await.map_err(|e| e.to_string())?;
        if let Some(candidates) = json.candidates {
            if let Some(first) = candidates.first() {
                if let Some(part) = first.content.parts.first() {
                    return Ok(part.text.clone());
                }
            }
        }
        Ok("I'm speechless!".to_string())
    } else {
        Err(format!("API Error: {}", res.status()))
    }
}
