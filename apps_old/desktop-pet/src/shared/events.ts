export type BubuEventType = 
    | "APP_OPENED"
    | "APP_FOCUSED"
    | "NOTIFICATION_RECEIVED"
    | "MUSIC_STARTED"
    | "MUSIC_PAUSED"
    | "MUSIC_CHANGED"
    | "MUSIC_STOPPED"
    | "MUSIC_POSITION_CHANGED"
    | "USER_CLICKED"
    | "USER_DRAGGED"
    | "SLEEP"
    | "WAKE"
    | "SKIN_CHANGED";

export interface BubuEvent {
    type: BubuEventType;
    payload?: any;
}
