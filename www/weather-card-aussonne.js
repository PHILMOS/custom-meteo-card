/* Carte météo personnalisée pour Home Assistant — fond dynamique selon la météo actuelle */

const DAY_BG = {
  "clear-night": null, // remplacé par NIGHT_BG
  "sunny": "linear-gradient(180deg,#2f7fd1 0%,#5fa8e6 35%,#a9d6ef 70%,#e8f3f6 100%)",
  "partlycloudy": "linear-gradient(180deg,#3f74ab 0%,#6f9bc7 35%,#b3cee0 70%,#e6eff2 100%)",
  "cloudy": "linear-gradient(180deg,#5c6b7a 0%,#7c8b98 35%,#a9b6bf 70%,#d3dadd 100%)",
  "rainy": "linear-gradient(180deg,#2c3a4a 0%,#455567 35%,#647485 70%,#8a97a1 100%)",
  "pouring": "linear-gradient(180deg,#232f3d 0%,#3a4a5c 35%,#57677a 70%,#7c8a94 100%)",
  "lightning": "linear-gradient(180deg,#1c2029 0%,#333949 35%,#4c5464 70%,#6b7280 100%)",
  "lightning-rainy": "linear-gradient(180deg,#191d24 0%,#2c323f 35%,#454e5e 70%,#636c78 100%)",
  "snowy": "linear-gradient(180deg,#6c8299 0%,#9db3c4 35%,#cfe0e8 70%,#f0f6f8 100%)",
  "snowy-rainy": "linear-gradient(180deg,#556b80 0%,#8199ac 35%,#b6cad6 70%,#e3edf1 100%)",
  "hail": "linear-gradient(180deg,#5c6f80 0%,#8698a8 35%,#bccdd6 70%,#e8f0f3 100%)",
  "fog": "linear-gradient(180deg,#818e97 0%,#a3aeb5 35%,#c7d0d4 70%,#e6ebed 100%)",
  "windy": "linear-gradient(180deg,#3f7096 0%,#6f9cb8 35%,#b0d0dc 70%,#e6f1f3 100%)",
  "windy-variant": "linear-gradient(180deg,#3f7096 0%,#6f9cb8 35%,#b0d0dc 70%,#e6f1f3 100%)",
  "exceptional": "linear-gradient(180deg,#4a5b73 0%,#71829a 35%,#a7b7c6 70%,#dbe4e9 100%)",
};

const NIGHT_BG = {
  "clear-night": "linear-gradient(180deg,#050814 0%,#101a3a 35%,#22305e 70%,#3c4a78 100%)",
  "sunny": "linear-gradient(180deg,#050814 0%,#101a3a 35%,#22305e 70%,#3c4a78 100%)",
  "partlycloudy": "linear-gradient(180deg,#0a0e1e 0%,#182448 35%,#2d3a63 70%,#4a5578 100%)",
  "cloudy": "linear-gradient(180deg,#14171f 0%,#252a35 35%,#3a4049 70%,#565c65 100%)",
  "rainy": "linear-gradient(180deg,#0a0d14 0%,#181f2a 35%,#2c3644 70%,#465162 100%)",
  "pouring": "linear-gradient(180deg,#07090e 0%,#131922 35%,#242e3a 70%,#3c4855 100%)",
  "lightning": "linear-gradient(180deg,#05060a 0%,#111420 35%,#20242f 70%,#343a48 100%)",
  "lightning-rainy": "linear-gradient(180deg,#050609 0%,#0f121b 35%,#1c202b 70%,#2f3542 100%)",
  "snowy": "linear-gradient(180deg,#1a2436 0%,#2f3f57 35%,#4d5f77 70%,#7a8ba0 100%)",
  "snowy-rainy": "linear-gradient(180deg,#141c2a 0%,#263349 35%,#41506a 70%,#6c7c92 100%)",
  "hail": "linear-gradient(180deg,#181f29 0%,#2b3542 35%,#465262 70%,#71808f 100%)",
  "fog": "linear-gradient(180deg,#20242a 0%,#343a41 35%,#4f5760 70%,#75808a 100%)",
  "windy": "linear-gradient(180deg,#0c1a26 0%,#1c3446 35%,#345266 70%,#5a7c8f 100%)",
  "windy-variant": "linear-gradient(180deg,#0c1a26 0%,#1c3446 35%,#345266 70%,#5a7c8f 100%)",
  "exceptional": "linear-gradient(180deg,#12151d 0%,#242a37 35%,#3c4453 70%,#5c6674 100%)",
};

const CONDITION_LABEL_FR = {
  "clear-night": "Nuit claire",
  "sunny": "Ensoleillé",
  "partlycloudy": "Partiellement nuageux",
  "cloudy": "Nuageux",
  "rainy": "Pluie",
  "pouring": "Fortes pluies",
  "lightning": "Orage",
  "lightning-rainy": "Orage et pluie",
  "snowy": "Neige",
  "snowy-rainy": "Pluie et neige",
  "hail": "Grêle",
  "fog": "Brouillard",
  "windy": "Venteux",
  "windy-variant": "Venteux",
  "exceptional": "Exceptionnel",
};

const RAIN_FAMILY = ["rainy", "pouring", "lightning-rainy", "snowy-rainy", "hail"];
const SNOW_FAMILY = ["snowy", "snowy-rainy"];
const STORM_FAMILY = ["lightning", "lightning-rainy"];
const CLOUD_FAMILY = ["cloudy", "partlycloudy", "windy", "windy-variant", ...RAIN_FAMILY, ...SNOW_FAMILY, ...STORM_FAMILY];

function seededPositions(count, seedBase, spread) {
  const out = [];
  let seed = seedBase;
  for (let i = 0; i < count; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const r1 = seed / 233280;
    seed = (seed * 9301 + 49297) % 233280;
    const r2 = seed / 233280;
    out.push({ x: r1 * spread, y: r2 * 100 });
  }
  return out;
}

const STARS = seededPositions(28, 42, 100);

function cloudSvg({ small = false } = {}) {
  return `<path class="cloud-shape" d="M23 62c-8 0-14-6-14-13 0-6 4-11 10-13 1-9 9-16 18-16 7 0 13 4 16 10 2-1 4-1 6-1 8 0 15 6 15 14 0 1 0 2 0 3 6 1 10 6 10 12 0 7-6 12-13 12H23z"/>`;
}

function sunSvg() {
  return `
  <g class="sun-group">
    <g class="sun-rays">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="50" y1="50" x2="50" y2="16" transform="rotate(${a} 50 50)" />`).join("")}
    </g>
    <circle class="sun-core" cx="50" cy="50" r="19"/>
  </g>`;
}

function moonSvg() {
  return `
  <g class="moon-group">
    <path class="moon-core" d="M62 30a24 24 0 1 0 0 40 19 19 0 0 1 0-40z"/>
    ${STARS.slice(0, 4).map((s, i) => `<circle class="twinkle" style="animation-delay:${(i * 0.5).toFixed(1)}s" cx="${(s.x * 0.3 + 12).toFixed(0)}" cy="${(s.y * 0.3 + 8).toFixed(0)}" r="1.3"/>`).join("")}
  </g>`;
}

function iconSvg(condition, isDay, { size = 90 } = {}) {
  const parts = [];
  const showCloud = CLOUD_FAMILY.includes(condition) || condition === "fog" || condition === "exceptional";
  const showSunMoon = condition === "sunny" || condition === "clear-night" || condition === "partlycloudy";

  if (showSunMoon) {
    parts.push(`<g transform="translate(${showCloud ? 14 : 0}, ${showCloud ? -8 : 0}) scale(${showCloud ? 0.62 : 0.85})">${isDay ? sunSvg() : moonSvg()}</g>`);
  }
  if (showCloud) {
    parts.push(`<g transform="translate(2,18) scale(0.92)">${cloudSvg()}</g>`);
  }
  if (RAIN_FAMILY.includes(condition)) {
    const n = condition === "pouring" ? 5 : 3;
    const xs = [30, 42, 54, 66, 38];
    for (let i = 0; i < n; i++) {
      parts.push(`<path class="drop" style="animation-delay:${(i * 0.22).toFixed(2)}s" d="M${xs[i]} 66 q3 6 0 10 q-3 -1 -3 -5 q0 -3 3 -5z"/>`);
    }
  }
  if (SNOW_FAMILY.includes(condition)) {
    const xs = [30, 44, 58, 70];
    for (let i = 0; i < xs.length; i++) {
      parts.push(`<g class="flake" style="animation-delay:${(i * 0.4).toFixed(2)}s" transform="translate(${xs[i]},68)">
        <line x1="-4" y1="0" x2="4" y2="0"/><line x1="0" y1="-4" x2="0" y2="4"/>
        <line x1="-2.8" y1="-2.8" x2="2.8" y2="2.8"/><line x1="-2.8" y1="2.8" x2="2.8" y2="-2.8"/>
      </g>`);
    }
  }
  if (STORM_FAMILY.includes(condition)) {
    parts.push(`<path class="bolt" d="M52 58 L40 74 L48 74 L44 90 L60 70 L51 70 Z"/>`);
  }
  if (condition === "fog") {
    parts.push(`<g class="fog-lines">
      <line x1="15" y1="45" x2="85" y2="45"/><line x1="22" y1="58" x2="88" y2="58"/><line x1="12" y1="71" x2="78" y2="71"/>
    </g>`);
  }
  if (condition === "windy" || condition === "windy-variant") {
    parts.push(`<g class="wind-lines">
      <path d="M15 42 h40 a6 6 0 1 0 -6 -6"/>
      <path d="M18 58 h50 a6 6 0 1 1 -6 6"/>
      <path d="M22 74 h32 a5 5 0 1 0 -5 -5"/>
    </g>`);
  }
  return `<svg class="wicon cond-${condition}" width="${size}" height="${size}" viewBox="0 0 100 100">${parts.join("")}</svg>`;
}

function mountainsSvg() {
  return `
  <svg class="mountains" viewBox="0 0 400 90" preserveAspectRatio="none">
    <path d="M0 90 L0 55 L40 20 L70 45 L110 10 L150 50 L190 28 L230 60 L270 15 L310 48 L350 25 L400 55 L400 90 Z" class="mtn-back"/>
    <path d="M0 90 L0 68 L55 35 L95 60 L140 30 L180 62 L225 40 L270 66 L320 38 L360 60 L400 42 L400 90 Z" class="mtn-front"/>
  </svg>`;
}

function fmtDay(dateStr) {
  try {
    const d = new Date(dateStr);
    const s = new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(d);
    return s.replace(".", "").toUpperCase();
  } catch (e) {
    return "";
  }
}

class WeatherCardAussonne extends HTMLElement {
  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("Merci de définir 'entity' (ex: weather.aussonne)");
    }
    this._config = {
      sun_entity: "sun.sun",
      forecast_days: 4,
      name: null,
      ...config,
    };
    this._forecast = null;
    this._forecastSub = null;
    this._lastRenderKey = null;
    if (!this._built) {
      this.innerHTML = `<ha-card><div class="wca-root"></div></ha-card>`;
      this._built = true;
    }
  }

  set hass(hass) {
    this._hass = hass;
    const stateObj = hass.states[this._config.entity];
    if (!stateObj) {
      this._renderError(`Entité introuvable : ${this._config.entity}`);
      return;
    }
    if (!this._subscribedFor || this._subscribedFor !== this._config.entity) {
      this._subscribedFor = this._config.entity;
      this._subscribeForecast();
    }
    this._render();
  }

  async _subscribeForecast() {
    if (this._forecastSub) {
      try { this._forecastSub(); } catch (e) {}
      this._forecastSub = null;
    }
    try {
      this._forecastSub = await this._hass.connection.subscribeMessage(
        (msg) => {
          this._forecast = (msg && msg.forecast) || [];
          this._render();
        },
        { type: "weather/subscribe_forecast", entity_id: this._config.entity, forecast_type: "daily" }
      );
    } catch (e) {
      const stateObj = this._hass.states[this._config.entity];
      this._forecast = (stateObj && stateObj.attributes && stateObj.attributes.forecast) || [];
      this._render();
    }
  }

  disconnectedCallback() {
    if (this._forecastSub) {
      try { this._forecastSub(); } catch (e) {}
      this._forecastSub = null;
    }
  }

  _renderError(msg) {
    const root = this.querySelector(".wca-root");
    if (root) root.innerHTML = `<div class="wca-error">${msg}</div>`;
  }

  _render() {
    const hass = this._hass;
    const cfg = this._config;
    const stateObj = hass.states[cfg.entity];
    if (!stateObj) return;

    const condition = stateObj.state in DAY_BG ? stateObj.state : "cloudy";
    const sunState = hass.states[cfg.sun_entity];
    const isDay = sunState ? sunState.state === "above_horizon" : condition !== "clear-night";

    const renderKey = JSON.stringify({ condition, isDay, t: stateObj.attributes.temperature, f: this._forecast });
    if (renderKey === this._lastRenderKey) return;
    this._lastRenderKey = renderKey;

    const bg = (isDay ? DAY_BG : NIGHT_BG)[condition] || DAY_BG.cloudy;
    const name = cfg.name || stateObj.attributes.friendly_name || "Météo";
    const temp = stateObj.attributes.temperature;
    const unit = hass.config?.unit_system?.temperature || "°C";
    const label = CONDITION_LABEL_FR[condition] || condition;

    const forecast = (this._forecast || []).slice(0, cfg.forecast_days);
    const today = forecast[0];
    const hi = today && today.temperature != null ? Math.round(today.temperature) : null;
    const lo = today && today.templow != null ? Math.round(today.templow) : null;

    const dateStr = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

    const particlesOverlay = this._backgroundParticles(condition, isDay);

    const forecastHtml = forecast.map((f) => {
      const c = f.condition in DAY_BG ? f.condition : "cloudy";
      const h = f.temperature != null ? Math.round(f.temperature) : "–";
      const l = f.templow != null ? Math.round(f.templow) : "–";
      return `
        <div class="wca-fday">
          <div class="wca-fday-temp">${h}/${l}°</div>
          <div class="wca-fday-icon">${iconSvg(c, true, { size: 40 })}</div>
          <div class="wca-fday-name">${fmtDay(f.datetime)}</div>
        </div>`;
    }).join("");

    const root = this.querySelector(".wca-root");
    root.innerHTML = `
      <div class="wca-bg" style="background:${bg}">
        ${particlesOverlay}
        ${mountainsSvg()}
      </div>
      <div class="wca-content">
        <div class="wca-header">
          <div>
            <div class="wca-name">${name}</div>
            <div class="wca-date">${dateStr}</div>
          </div>
        </div>
        <div class="wca-main">
          <div class="wca-temp-block">
            <div class="wca-temp">${temp != null ? Math.round(temp) : "–"}<span class="wca-unit">${unit}</span></div>
            <div class="wca-cond">${label}</div>
            ${hi != null || lo != null ? `
              <div class="wca-hilo">
                ${hi != null ? `<span class="hi">▲ ${hi}°</span>` : ""}
                ${lo != null ? `<span class="lo">▼ ${lo}°</span>` : ""}
              </div>` : ""}
          </div>
          <div class="wca-icon-big">${iconSvg(condition, isDay, { size: 108 })}</div>
        </div>
      </div>
      ${forecast.length ? `<div class="wca-forecast">${forecastHtml}</div>` : ""}
    `;
  }

  _backgroundParticles(condition, isDay) {
    if (!isDay && (condition === "clear-night" || condition === "partlycloudy" || condition === "cloudy")) {
      return `<div class="wca-stars">${STARS.map((s, i) => `<div class="star" style="left:${s.x.toFixed(1)}%;top:${(s.y * 0.55).toFixed(1)}%;animation-delay:${(i % 6 * 0.4).toFixed(1)}s"></div>`).join("")}</div>`;
    }
    if (RAIN_FAMILY.includes(condition)) {
      const n = condition === "pouring" ? 40 : 22;
      const drops = seededPositions(n, 7, 100);
      return `<div class="wca-rainbg">${drops.map((d, i) => `<div class="rainline" style="left:${d.x.toFixed(1)}%;animation-delay:${(i % 10 * 0.11).toFixed(2)}s;animation-duration:${(0.5 + (i % 5) * 0.08).toFixed(2)}s"></div>`).join("")}</div>`;
    }
    if (SNOW_FAMILY.includes(condition)) {
      const n = 26;
      const flakes = seededPositions(n, 13, 100);
      return `<div class="wca-snowbg">${flakes.map((f, i) => `<div class="snowdot" style="left:${f.x.toFixed(1)}%;animation-delay:${(i % 8 * 0.5).toFixed(1)}s;animation-duration:${(4 + (i % 5)).toFixed(1)}s"></div>`).join("")}</div>`;
    }
    if (condition === "fog") {
      return `<div class="wca-fogbg"><div class="fogband" style="top:30%"></div><div class="fogband" style="top:55%;animation-delay:-4s"></div><div class="fogband" style="top:78%;animation-delay:-8s"></div></div>`;
    }
    return "";
  }

  getCardSize() {
    return 5;
  }
}

const style = document.createElement("style");
style.textContent = `
  weather-card-aussonne ha-card { padding: 0; overflow: hidden; position: relative; }
  .wca-root { position: relative; min-height: 300px; overflow: hidden; color: #fff; font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif); }
  .wca-error { padding: 16px; color: var(--error-color, red); }
  .wca-bg { position: absolute; inset: 0; overflow: hidden; }
  .wca-content { position: relative; z-index: 2; padding: 18px 20px 84px 20px; }
  .wca-header { display:flex; justify-content: space-between; align-items:flex-start; }
  .wca-name { font-size: 20px; font-weight: 700; text-shadow: 0 1px 6px rgba(0,0,0,.35); }
  .wca-date { font-size: 13px; opacity: .85; text-transform: capitalize; margin-top: 2px; }
  .wca-main { display:flex; justify-content: space-between; align-items:center; margin-top: 18px; }
  .wca-temp-block { display:flex; flex-direction:column; }
  .wca-temp { font-size: 64px; font-weight: 700; line-height: 1; text-shadow: 0 2px 10px rgba(0,0,0,.35); }
  .wca-unit { font-size: 26px; font-weight: 400; vertical-align: top; margin-left: 2px; }
  .wca-cond { font-size: 15px; opacity: .9; margin-top: 4px; }
  .wca-hilo { display:flex; gap: 14px; margin-top: 10px; font-size: 15px; font-weight: 600; }
  .wca-hilo .hi { color: #ff6b5e; }
  .wca-hilo .lo { color: #6ec3ff; }
  .wca-icon-big { flex-shrink:0; filter: drop-shadow(0 4px 10px rgba(0,0,0,.35)); }

  .wca-forecast { position:relative; z-index:3; display:flex; justify-content: space-around; align-items:center; padding: 12px 6px 14px; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.28) 40%, rgba(0,0,0,.42) 100%); backdrop-filter: blur(1px); }
  .wca-fday { display:flex; flex-direction:column; align-items:center; gap:2px; flex:1; min-width:0; }
  .wca-fday-temp { font-size: 13px; font-weight: 600; }
  .wca-fday-name { font-size: 11px; opacity: .85; letter-spacing:.03em; }
  .wca-fday-icon svg { display:block; }

  .mountains { position:absolute; left:0; right:0; bottom:0; width:100%; height:34%; }
  .mtn-back { fill: rgba(20,25,35,.35); }
  .mtn-front { fill: rgba(10,13,20,.55); }

  .wicon .cloud-shape { fill: #eef3f6; }
  .wicon .sun-core { fill: #ffd35c; }
  .wicon .sun-rays line { stroke:#ffd35c; stroke-width:4; stroke-linecap:round; }
  .wicon .sun-group { transform-origin: 50px 50px; animation: spin 30s linear infinite; }
  .wicon .moon-core { fill: #dfe6f2; }
  .wicon .twinkle { fill:#fff; animation: twinkle 2.4s ease-in-out infinite; }
  .wicon .drop { fill:#4fb2ff; animation: fall .9s ease-in infinite; }
  .wicon .flake { stroke:#eaf6ff; stroke-width:2; stroke-linecap:round; animation: fall 1.6s ease-in infinite; }
  .wicon .bolt { fill:#ffd54f; animation: flash 1.6s ease-in-out infinite; }
  .wicon .fog-lines line { stroke: rgba(255,255,255,.85); stroke-width:4; stroke-linecap:round; }
  .wicon .wind-lines path { fill:none; stroke:#eef3f6; stroke-width:4; stroke-linecap:round; }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes twinkle { 0%,100% { opacity:.25; } 50% { opacity:1; } }
  @keyframes fall { 0% { transform: translateY(-2px); opacity:0; } 20% { opacity:1; } 100% { transform: translateY(10px); opacity:0; } }
  @keyframes flash { 0%,40%,100% { opacity:.85; } 45% { opacity:.2; } 50% { opacity:1; } }

  .wca-stars { position:absolute; inset:0; }
  .star { position:absolute; width:2px; height:2px; background:#fff; border-radius:50%; animation: twinkle 3s ease-in-out infinite; }

  .wca-rainbg { position:absolute; inset:0; overflow:hidden; opacity:.35; }
  .rainline { position:absolute; top:-10%; width:1.5px; height:16%; background: linear-gradient(180deg, rgba(180,220,255,0), rgba(180,220,255,.9)); animation-name: rainfall; animation-timing-function: linear; animation-iteration-count: infinite; }
  @keyframes rainfall { from { transform: translateY(-20%); } to { transform: translateY(650%); } }

  .wca-snowbg { position:absolute; inset:0; overflow:hidden; opacity:.55; }
  .snowdot { position:absolute; top:-5%; width:4px; height:4px; border-radius:50%; background:#fff; animation-name: snowfall; animation-timing-function: linear; animation-iteration-count: infinite; }
  @keyframes snowfall { from { transform: translate(0,-10%); } to { transform: translate(12px,650%); } }

  .wca-fogbg { position:absolute; inset:0; overflow:hidden; }
  .fogband { position:absolute; left:-30%; width:160%; height:14%; background: rgba(255,255,255,.18); border-radius:50%; filter: blur(6px); animation: fogdrift 14s ease-in-out infinite; }
  @keyframes fogdrift { 0% { transform: translateX(-5%);} 50% { transform: translateX(5%);} 100% { transform: translateX(-5%);} }
`;
document.head.appendChild(style);

customElements.define("weather-card-aussonne", WeatherCardAussonne);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "weather-card-aussonne",
  name: "Carte Météo Aussonne",
  description: "Carte météo avec arrière-plan dynamique selon la météo actuelle",
});
