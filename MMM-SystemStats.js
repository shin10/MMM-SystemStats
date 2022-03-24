/* Magic Mirror
 * Module: MMM-SystemStats
 *
 * By Benjamin Roesner http://benjaminroesner.com
 * MIT Licensed.
 */

Module.register("MMM-SystemStats", {
  defaults: {
    updateInterval: 10000,
    animationSpeed: 0,
    align: "right",
    alignText: null,
    alignIcon: null,
    alignValue: null,
    language: config.language,
    units: config.units,
    useSyslog: false,
    thresholdCPUTemp: 75, // in configured units
    baseURLSyslog: "http://127.0.0.1:8080/syslog",
    label: "textAndIcon",
    layout: "table",
    statItems: [
      "cpuTemp",
      "sysLoad",
      "freeMem",
      "upTime",
      "freeSpace",
      "ipAddress"
    ]
  },
  // Define required styles.
  getStyles: function () {
    return ["font-awesome.css", "MMM-SystemStats.css"];
  },
  // Define required scripts.
  getScripts: function () {
    return ["moment.js", "moment-duration-format.js"];
  },

  // Define required translations.
  getTranslations: function () {
    return {
      de: "translations/de.json",
      en: "translations/en.json",
      fr: "translations/fr.json",
      id: "translations/id.json",
      sv: "translations/sv.json"
    };
  },

  // Define start sequence
  start: function () {
    Log.log("Starting module: " + this.name);

    // set locale
    moment.locale(this.config.language);

    this.stats = {
      cpuTemp: null,
      sysLoad: null,
      freeMem: null,
      upTime: null,
      freeSpace: null,
      ipAddress: null
    };
    this.sendSocketNotification("CONFIG", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "STATS") {
      this.stats.cpuTemp = payload.cpuTemp;
      if (this.config.useSyslog) {
        const cpuTemp = Math.ceil(parseFloat(this.stats.cpuTemp));
        if (cpuTemp > this.config.thresholdCPUTemp) {
          console.log(
            "alert for threshold violation (" +
              cpuTemp +
              "/" +
              this.config.thresholdCPUTemp +
              ")"
          );
          this.sendSocketNotification("ALERT", {
            config: this.config,
            type: "WARNING",
            message:
              this.translate("TEMP_THRESHOLD_WARNING") +
              " (" +
              this.stats.cpuTemp +
              "/" +
              this.config.thresholdCPUTemp +
              ")"
          });
        }
      }
      this.stats.sysLoad = payload.sysLoad?.[0];
      this.stats.freeMem = Number(payload.freeMem).toFixed() + "%";
      let upTime = parseInt(payload.upTime?.[0]);
      this.stats.upTime = moment.duration(upTime, "seconds").humanize();
      this.stats.freeSpace = payload.freeSpace;
      this.stats.ipAddress = payload.ipAddress;
      this.updateDom(this.config.animationSpeed);
    }
  },

  // Override dom generator.
  getDom: function () {
    const wrapper = document.createElement("table");
    wrapper.classList.add(
      `MMM-SystemStats-${this.config.layout}-layout`,
      this.config.label
    );
    wrapper.classList.toggle(`align-${this.config.align}`, this.config.align);

    const sysData = {
      cpuTemp: {
        text: "CPU_TEMP",
        icon: "fa-thermometer"
      },
      sysLoad: {
        text: "SYS_LOAD",
        icon: "fa-tachometer"
      },
      freeMem: {
        text: "RAM_FREE",
        icon: "fa-microchip"
      },
      upTime: {
        text: "UPTIME",
        icon: "fa-clock-o"
      },
      freeSpace: {
        text: "DISK_FREE",
        icon: "fa-hdd-o"
      },
      ipAddress: {
        text: "IP_ADDRESS",
        icon: "fa-sitemap"
      }
    };

    this.config.statItems.forEach((item) => {
      if (sysData[item] === undefined) return;
      const row = document.createElement("tr");

      if (this.config.label.match(/^(text|textAndIcon)$/)) {
        const c1 = document.createElement("td");
        c1.classList.add("title");
        c1.classList.toggle(
          `align-${this.config.alignText}`,
          this.config.alignText
        );
        c1.innerHTML = this.translate(sysData[item].text);
        row.appendChild(c1);
      }

      if (this.config.label.match(/^(icon|textAndIcon)$/)) {
        const c2 = document.createElement("td");
        c2.classList.add("icon");
        c2.classList.toggle(
          `align-${this.config.alignIcon}`,
          this.config.alignIcon
        );
        c2.innerHTML = `<i class="fa ${sysData[item].icon} fa-fw"></i>`;
        row.appendChild(c2);
      }

      const c3 = document.createElement("td");
      c3.classList.add("value");
      c3.classList.toggle("loading", this.stats[item]);
      c3.classList.toggle(
        `align-${this.config.alignValue}`,
        this.config.alignValue
      );
      switch (this.stats[item]) {
        case null:
          c3.innerHTML = this.translate("LOADING");
          break;
        case "":
          c3.innerHTML = this.translate("NOT_AVAILABLE");
          break;
        default:
          c3.innerHTML = this.stats[item];
          break;
      }

      row.appendChild(c3);

      wrapper.appendChild(row);
    });

    return wrapper;
  }
});
