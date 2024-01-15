export interface ShellySwitch {
    id: number,
    source: "timer" | "init",
    output: boolean,
    timer_started_at: number,
    timer_duration: number,
    apower: number,
    voltage: number,
    aenergy: {
        total: number,
        by_minute: number[],
        minute_ts: number
    },
    temperature: {
        tC: number
    }
}