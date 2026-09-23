// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::{Parser, Subcommand};
use std::process::exit;

#[derive(Parser)]
#[command(name = "bubu")]
#[command(about = "Bubu Control CLI", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Waybar JSON output
    Waybar,
    /// Stop Bubu
    Stop,
    /// Start Bubu
    Start,
    /// Show Pet Status
    Status,
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Waybar) => {
            // Simulated Waybar JSON response. In a real app, this reads from /tmp/bubu-state.json
            // that the main GUI process writes to.
            let json = serde_json::json!({
                "text": "Bubu: Idle 🐾",
                "tooltip": "Bubu is chilling on your desktop",
                "class": "idle"
            });
            println!("{}", json);
            exit(0);
        }
        Some(Commands::Status) => {
            println!("Bubu is currently running. Mode: Default");
            exit(0);
        }
        Some(Commands::Start) => {
            println!("Starting Bubu GUI...");
            // Let it fall through to app_lib::run()
        }
        Some(Commands::Stop) => {
            println!("Stopping Bubu...");
            // In a real app, send a kill signal to the main process via IPC
            exit(0);
        }
        None => {
            // No CLI arguments, run the GUI
        }
    }

    app_lib::run();
}
