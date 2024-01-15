const getStatus = (req, res) => {

    return res.status(200).send({
        "ble": {},
        "cloud": {
          "connected": false
        },
        "eth": {
          "ip": "10.33.55.170"
        },
        "input:0": {
          "id": 0,
          "state": false
        },
        "input:1": {
          "id": 1,
          "state": false
        },
        "input:2": {
          "id": 2,
          "state": false
        },
        "input:3": {
          "id": 3,
          "state": false
        },
        "mqtt": {
          "connected": false
        },
        "switch:0": {
          "id": 0,
          "source": "timer",
          "output": true,
          "timer_started_at": 1626935739.79,
          "timer_duration": 60,
          "apower": 8.9,
          "voltage": 237.5,
          "aenergy": {
            "total": 6.532,
            "by_minute": [
              45.199,
              47.141,
              88.397
            ],
            "minute_ts": 1626935779
          },
          "temperature": {
            "tC": 23.5,
            "tF": 74.4
          }
        },
        "switch:1": {
          "id": 1,
          "source": "init",
          "output": false,
          "apower": 0,
          "voltage": 237.5,
          "aenergy": {
            "total": 0,
            "by_minute": [
              0,
              0,
              0
            ],
            "minute_ts": 1626935779
          },
          "temperature": {
            "tC": 23.5,
            "tF": 74.4
          }
        },
        "switch:2": {
          "id": 2,
          "source": "timer",
          "output": false,
          "timer_started_at": 1626935591.8,
          "timer_duration": 345,
          "apower": 0,
          "voltage": 237.5,
          "aenergy": {
            "total": 0.068,
            "by_minute": [
              0,
              0,
              0
            ],
            "minute_ts": 1626935779
          },
          "temperature": {
            "tC": 23.5,
            "tF": 74.4
          }
        },
        "switch:3": {
          "id": 3,
          "source": "init",
          "output": false,
          "apower": 0,
          "voltage": 237.5,
          "aenergy": {
            "total": 0,
            "by_minute": [
              0,
              0,
              0
            ],
            "minute_ts": 1626935779
          },
          "temperature": {
            "tC": 23.5,
            "tF": 74.4
          }
        },
        "sys": {
          "mac": "A8032ABE54DC",
          "restart_required": false,
          "time": "16:06",
          "unixtime": 1650035219,
          "uptime": 11081,
          "ram_size": 254744,
          "ram_free": 151560,
          "fs_size": 458752,
          "fs_free": 180224,
          "cfg_rev": 26,
          "kvs_rev": 2725,
          "schedule_rev": 0,
          "webhook_rev": 0,
          "available_updates": {
            "stable": {
              "version": "0.10.1"
            }
          }
        },
        "wifi": {
          "sta_ip": null,
          "status": "disconnected",
          "ssid": null,
          "rssi": 0
        },
        "ws": {
          "connected": true
        }
    });
};

export default getStatus;
