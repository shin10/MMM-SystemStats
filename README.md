# Module: MMM-SystemStats

![maintained? no](https://img.shields.io/badge/Maintained%3F-no-red.svg?style=flat-square)

This [MagicMirror](https://github.com/MichMich/MagicMirror) modules, shows the processor temperature, system load, available RAM, uptime and free disk space.

![Magic-Mirror Module MMM-SystemStats screenshot](screenshot.png)

Tested with:

- Raspberry Pi

## Dependencies

- An installation of [MagicMirror²](https://github.com/MichMich/MagicMirror)
- npm
- [async](https://www.npmjs.com/package/async)

## Installation

Navigate into your MagicMirror's `modules` folder:

```sh
cd ~/MagicMirror/modules
```

Clone this repository:

```sh
git clone https://github.com/BenRoe/MMM-SystemStats
```

Navigate to the new `MMM-SystemStats` folder and install the node dependencies.

```sh
cd MMM-SystemStats/ && npm install
```

Configure the module in your `config.js` file.

## Update the module

Navigate into the `MMM-SystemStats` folder with `cd ~/MagicMirror/modules/MMM-SystemStats` and get the latest code from Github with `git pull`.

If you haven't changed the modules, this should work without any problems. Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
  {
    module: "MMM-SystemStats",
    position: "top_center", // This can be any of the regions.
    // classes: 'small dimmed', // Add your own styling. OPTIONAL.
    // header: 'System Stats', // Set the header text OPTIONAL
    config: {
      updateInterval: 10000, // every 10 seconds
      align: "right", // align labels
      //header: 'System Stats', // This is optional
      units: "metric", // default, metric, imperial
      view: "textAndIcon"
    }
  }
];
```

## Configuration options

The following properties can be configured:

| Option             | Default                        | Expected                                                                        | Description                                                                                                       |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `updateInterval`   | `10000` (10 seconds)           | `1000` - `86400000`                                                             | How often does the content needs to be fetched? (Milliseconds)                                                    |
| `animationSpeed`   | `0` (animation off)            | `0` - `5000`                                                                    | Speed of the update animation. (Milliseconds)                                                                     |
| `language`         | `config.language`              |                                                                                 | language id for text can be different from MM.                                                                    |
| `units`            | `config.units`                 | `config.units`, `default` = Kelvin, `metric` = Celsius, `imperial` = Fahrenheit | What units to use.                                                                                                |
| `align`            | `right`                        | `left` or `right`                                                               | Align the labels.                                                                                                 |
| `label`            | `textAndIcon`                  | `textAndIcon`, `text` or `icon`                                                 | Show text labels with icons, only text, or only icons.                                                            |
| `useSyslog`        | `false`                        |                                                                                 | log event to MMM-syslog?                                                                                          |
| `thresholdCPUTemp` | `70`                           |                                                                                 | upper-threshold for CPU Temp. If CPU Temp is more than this value, log to MMM-syslog if useSyslog=true. (Celsius) |
| `baseURLSyslog`    | `http://127.0.0.1:8080/syslog` |                                                                                 | URL base of [MMM-syslog module](https://github.com/paviro/MMM-syslog")                                            |

## ToDo

- better indication for the system load
