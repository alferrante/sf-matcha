// Main SF Matcha app

const { useState, useMemo, useEffect, useRef } = React;

const FILTERS = [
{ id: "all", label: "all spots", emoji: "🍵" },
{ id: "top", label: "top picks", emoji: "⭐" },
{ id: "buzzy", label: "new / buzzy", emoji: "✨" },
{ id: "confirmed", label: "soy confirmed", emoji: "✓" },
{ id: "reported", label: "soy reported", emoji: "?" },
{ id: "none", label: "no soy", emoji: "✗" },
{ id: "call", label: "soy TBD", emoji: "…" }];


const HOOD_GROUPS = [
"Mission", "Japantown", "Inner Sunset", "Outer Sunset",
"SoMa", "Russian Hill", "North Beach", "Pac Heights",
"Marina", "Bernal", "Tenderloin"];

const GOOGLE_MAP_CENTER = { lat: 37.765, lng: -122.436 };
let googleMapsLoadPromise = null;

function getMapsApiKey() {
  return (window.SF_MATCHA_CONFIG && window.SF_MATCHA_CONFIG.googleMapsApiKey) || "";
}

function loadGoogleMapsScript(apiKey) {
  if (window.google && window.google.maps && window.google.maps.Map) return Promise.resolve(window.google.maps);
  if (googleMapsLoadPromise) return googleMapsLoadPromise;
  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const callbackName = "__sfMatchaGoogleMapsReady";
    window[callbackName] = () => resolve(window.google.maps);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleMapsLoadPromise;
}


function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "matcha",
    "pinStyle": "sticker",
    "showLabels": true,
    "marqueeSpeed": 40,
    "headerCopy": "the only san francisco matcha map you need.",
    "wobble": true
  } /*EDITMODE-END*/);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const palettes = {
    matcha: { bg: "#FFF8E7", ink: "#1a1a1a", pop: "#8FBF3F", pop2: "#EE6C4D", lime: "#D9FF3F" },
    sunset: { bg: "#FFEFE0", ink: "#1a1a1a", pop: "#FF7A4D", pop2: "#FFD13D", lime: "#FF4FA8" },
    midnight: { bg: "#0F1A0F", ink: "#F5FFE0", pop: "#D9FF3F", pop2: "#FF4FA8", lime: "#8FBF3F" },
    bubblegum: { bg: "#FFE6F0", ink: "#1a1a1a", pop: "#FF4FA8", pop2: "#7FC4FF", lime: "#D9FF3F" }
  };
  const C = palettes[tweaks.palette] || palettes.matcha;

  const filtered = useMemo(() => {
    return SHOPS.filter((s) => {
      if (filter === "top" && !s.topPick) return false;
      if (filter === "buzzy" && !s.buzzy) return false;
      if (["confirmed", "reported", "none", "call"].includes(filter) && s.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(s.name.toLowerCase().includes(q) ||
        s.hood.toLowerCase().includes(q) ||
        s.note.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [filter, search]);

  const visibleIds = new Set(filtered.map((s) => s.id));

  const stats = useMemo(() => ({
    shown: filtered.length,
    confirmed: filtered.filter((s) => s.status === "confirmed").length,
    buzzy: filtered.filter((s) => s.buzzy).length,
    top: filtered.filter((s) => s.topPick).length
  }), [filtered]);

  return (
    <div style={{ "--bg": C.bg, "--ink": C.ink, "--pop": C.pop, "--pop2": C.pop2, "--lime": C.lime, background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <Marquee speed={tweaks.marqueeSpeed} />
      <Header copy={tweaks.headerCopy} C={C} />
      <FilterBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} stats={stats} C={C} />

      <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, padding: "0 32px 48px", maxWidth: 1600, margin: "0 auto" }}>
        <MapPanel
          shops={SHOPS}
          visibleIds={visibleIds}
          selected={selected}
          setSelected={setSelected}
          hovered={hovered}
          setHovered={setHovered}
          C={C}
          tweaks={tweaks} />
        
        <ShopList
          shops={filtered}
          selected={selected}
          setSelected={setSelected}
          hovered={hovered}
          setHovered={setHovered}
          C={C} />
        
      </div>

      <Footer C={C} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette">
          <TweakSelect tweakKey="palette" value={tweaks.palette} onChange={setTweak}
          options={[
          { value: "matcha", label: "matcha cream (default)" },
          { value: "sunset", label: "sunset orange" },
          { value: "midnight", label: "midnight green" },
          { value: "bubblegum", label: "bubblegum pink" }]
          } />
        </TweakSection>
        <TweakSection title="Pin style">
          <TweakRadio tweakKey="pinStyle" value={tweaks.pinStyle} onChange={setTweak}
          options={[
          { value: "sticker", label: "sticker" },
          { value: "splat", label: "splat" },
          { value: "blob", label: "blob" }]
          } />
        </TweakSection>
        <TweakSection title="Animation">
          <TweakToggle tweakKey="wobble" value={tweaks.wobble} onChange={setTweak} label="pin wobble" />
          <TweakToggle tweakKey="showLabels" value={tweaks.showLabels} onChange={setTweak} label="show pin labels" />
          <TweakSlider tweakKey="marqueeSpeed" value={tweaks.marqueeSpeed} onChange={setTweak}
          label="marquee speed" min={10} max={120} step={5} />
        </TweakSection>
        <TweakSection title="Copy">
          <TweakText tweakKey="headerCopy" value={tweaks.headerCopy} onChange={setTweak} label="hero tagline" />
        </TweakSection>
      </TweaksPanel>

      {selected && <ShopDetail shop={SHOPS.find((s) => s.id === selected)} onClose={() => setSelected(null)} C={C} />}
    </div>);

}

// ===================== MARQUEE =====================
function Marquee({ speed }) {
  const items = [
  "🍵 sf's freshest matcha map",
  "✦ updated weekly by real humans",
  "🌿 42 spots scouted",
  "✿ soy status verified",
  "⭐ founder & locals approved",
  "🎀 tap a pin for the goods"];

  const loop = [...items, ...items, ...items];
  return (
    <div style={{
      background: "var(--ink)", color: "var(--bg)", overflow: "hidden",
      borderBottom: "3px solid var(--ink)", padding: "10px 0", fontFamily: "'Space Mono', monospace",
      fontSize: 14, fontWeight: 700, letterSpacing: "0.04em"
    }}>
      <div style={{
        display: "inline-flex", whiteSpace: "nowrap", animation: `marquee ${speed}s linear infinite`,
        gap: 36
      }}>
        {loop.map((t, i) =>
        <span key={i} style={{ display: "inline-flex", gap: 36, alignItems: "center" }}>
            {t} <span style={{ color: "var(--pop)" }}>★</span>
          </span>
        )}
      </div>
    </div>);

}

// ===================== HEADER =====================
function Header({ copy, C }) {
  return (
    <header style={{ padding: "40px 32px 16px", maxWidth: 1600, margin: "0 auto" }}>
      <h1 style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800, fontSize: "clamp(64px, 11vw, 160px)", lineHeight: 0.88,
        margin: 0, letterSpacing: "-0.05em",
        color: "var(--pop)"
      }}>
        sf matcha<span style={{ color: "var(--pop)" }}>.</span>
      </h1>
      <p style={{
        fontFamily: "'Nunito', sans-serif", fontSize: 20, marginTop: 14, maxWidth: 640,
        lineHeight: 1.4, fontWeight: 500
      }}>
        {copy}
      </p>
    </header>);

}

function mapsUrl(shop) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${shop.name} ${shop.address} San Francisco CA`);
}

function displayHours(hours) {
  if (hours === "check hours") return "hours not listed";
  return hours.replace(/;\s*check hours$/i, "");
}

function Sticker({ children, bg, rotate = 0, ink = "var(--ink)" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      background: bg, color: ink,
      padding: "10px 16px",
      border: "2.5px solid var(--ink)", borderRadius: 18,
      boxShadow: "4px 4px 0 var(--ink)",
      transform: `rotate(${rotate}deg)`,
      fontFamily: "'Bricolage Grotesque', sans-serif"
    }}>
      {children}
    </div>);

}

// ===================== FILTER BAR =====================
function FilterBar({ filter, setFilter, search, setSearch, stats, C }) {
  return (
    <div style={{ padding: "16px 32px 24px", maxWidth: 1600, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
        <div style={{
          flex: "1 1 360px", maxWidth: 520, position: "relative",
          background: "#fff", border: "2.5px solid var(--ink)", borderRadius: 999,
          boxShadow: "4px 4px 0 var(--ink)",
          display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 4px 20px"
        }}>
          <span style={{ fontSize: 18 }}>🔎</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search by name, neighborhood, vibe…"
            style={{
              border: 0, outline: "none", background: "transparent",
              flex: 1, padding: "12px 0", fontSize: 16,
              fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: "var(--ink)"
            }} />
          
          {search &&
          <button onClick={() => setSearch("")} style={{
            border: "2px solid var(--ink)", background: "var(--bg)", borderRadius: 999,
            padding: "4px 10px", cursor: "pointer", fontFamily: "'Space Mono', monospace",
            fontSize: 11, fontWeight: 700
          }}>clear ✕</button>
          }
        </div>

        <div style={{ display: "flex", gap: 24, fontFamily: "'Bricolage Grotesque', sans-serif", flexWrap: "wrap" }}>
          <Stat n={stats.shown} label="shown" pop="var(--pop)" />
          <Stat n={stats.confirmed} label="soy ✓" pop="var(--pop)" />
          <Stat n={stats.top} label="top picks" pop="var(--pop2)" />
          <Stat n={stats.buzzy} label="buzzy" pop="var(--lime)" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15,
                padding: "10px 18px", borderRadius: 999,
                border: "2.5px solid var(--ink)",
                background: active ? "var(--ink)" : "#fff",
                color: active ? "var(--bg)" : "var(--ink)",
                boxShadow: active ? "2px 2px 0 var(--pop)" : "3px 3px 0 var(--ink)",
                cursor: "pointer",
                transform: active ? "translate(1px, 1px)" : "none",
                transition: "all 0.12s",
                display: "inline-flex", alignItems: "center", gap: 8
              }}>
              
              <span>{f.emoji}</span> {f.label}
            </button>);

        })}
      </div>
    </div>);

}

function Stat({ n, label, pop }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ fontWeight: 800, fontSize: 32, lineHeight: 1, color: pop, textShadow: "1px 1px 0 var(--ink)" }}>{n}</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
    </div>);

}

// ===================== MAP =====================
function MapPanel({ shops, visibleIds, selected, setSelected, hovered, setHovered, C, tweaks }) {
  const hasGoogleMapsKey = Boolean(getMapsApiKey());
  return (
    <div className="map-panel" style={{
      position: "sticky",
      top: 18,
      alignSelf: "start",
      borderRadius: 32,
      border: "3px solid var(--ink)",
      boxShadow: "8px 8px 0 var(--ink)",
      overflow: "hidden",
      background: "#C9E8FF",
      aspectRatio: "1 / 1",
      minHeight: 560
    }}>
      {hasGoogleMapsKey ?
      <GoogleMapLayer
        shops={shops}
        visibleIds={visibleIds}
        selected={selected}
        setSelected={setSelected}
        hovered={hovered}
        setHovered={setHovered}
        tweaks={tweaks} /> :
      <SFMapSVG />}

      {/* pins layer */}
      {!hasGoogleMapsKey &&
      <div style={{ position: "absolute", inset: 0 }}>
        {shops.map((s) => {
          const isVisible = visibleIds.has(s.id);
          const isHover = hovered === s.id;
          const isSelected = selected === s.id;
          return (
            <Pin
              key={s.id}
              shop={s}
              x={s.x}
              y={s.y}
              dimmed={!isVisible}
              hovered={isHover}
              selected={isSelected}
              onHover={setHovered}
              onClick={() => setSelected(s.id)}
              showLabel={tweaks.showLabels}
              wobble={tweaks.wobble}
              style={tweaks.pinStyle} />);


        })}
      </div>
      }

      {/* legend */}
      <div style={{
        position: "absolute", bottom: 16, left: 16,
        background: "rgba(255,248,231,0.95)",
        border: "2.5px solid var(--ink)", borderRadius: 16,
        boxShadow: "4px 4px 0 var(--ink)",
        padding: "12px 14px",
        fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
        backdropFilter: "blur(4px)"
      }}>
        <div style={{ marginBottom: 6, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, fontWeight: 800 }}>
          legend
        </div>
        {Object.entries(STATUS_META).map(([k, v]) =>
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{
            width: 14, height: 14, borderRadius: 999, background: v.color,
            border: "1.5px solid var(--ink)", display: "inline-block"
          }} />
            <span>{v.label}</span>
          </div>
        )}
      </div>

      {/* corner badge */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        background: "var(--pop)", color: "var(--ink)",
        border: "2.5px solid var(--ink)", borderRadius: 999,
        boxShadow: "4px 4px 0 var(--ink)",
        padding: "8px 14px",
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 13,
        transform: "rotate(4deg)",
        display: "inline-flex", alignItems: "center", gap: 6
      }}>
        {hasGoogleMapsKey ? "google map + pins" : "🗺️ tap a pin"}
      </div>
    </div>);

}

function GoogleMapLayer({ shops, visibleIds, selected, setSelected, hovered, setHovered, tweaks }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const [mapStatus, setMapStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    const apiKey = getMapsApiKey();
    loadGoogleMapsScript(apiKey).
    then((maps) => {
      if (cancelled || !mapEl.current) return;

      const map = new maps.Map(mapEl.current, {
        center: GOOGLE_MAP_CENTER,
        zoom: 12.45,
        minZoom: 11,
        maxZoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: "greedy",
        backgroundColor: "#C9E8FF",
        styles: [
        { elementType: "geometry", stylers: [{ saturation: -45 }, { lightness: 24 }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#5C624F" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#FFF8E7" }, { weight: 3 }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#b9c6a7" }, { weight: 0.7 }] },
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#DDE9C8" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }, { lightness: 12 }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#D8D2C4" }] },
        { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "simplified" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#F5EACB" }] },
        { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#BFE2FF" }] }]

      });

      const bounds = new maps.LatLngBounds();
      shops.forEach((shop) => {
        if (shop.lat && shop.lng) bounds.extend({ lat: shop.lat, lng: shop.lng });
      });
      map.fitBounds(bounds, window.innerWidth < 700 ? 46 : 72);

      const layer = document.createElement("div");
      layer.style.position = "absolute";
      layer.style.inset = "0";
      layer.style.pointerEvents = "none";

      const overlay = new maps.OverlayView();
      overlay.onAdd = function () {
        this.getPanes().overlayMouseTarget.appendChild(layer);
      };
      overlay.draw = function () {
        const projection = this.getProjection();
        if (!projection) return;
        renderGoogleMapPins(layer, projection, overlay._state);
      };
      overlay.onRemove = function () {
        layer.remove();
      };

      overlay._state = { shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks };
      overlay.setMap(map);
      mapRef.current = map;
      overlayRef.current = overlay;
      setMapStatus("ready");
    }).
    catch(() => {
      if (!cancelled) setMapStatus("error");
    });

    return () => {
      cancelled = true;
      if (overlayRef.current) overlayRef.current.setMap(null);
    };
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current._state = { shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks };
    overlayRef.current.draw();
  }, [shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks]);

  return (
    <>
      <div ref={mapEl} style={{ position: "absolute", inset: 0 }} />
      {mapStatus !== "ready" &&
      <div style={{
        position: "absolute", inset: 0,
        background: mapStatus === "error" ? "#C9E8FF" : "rgba(255,248,231,0.72)"
      }}>
          {mapStatus === "error" && <SFMapSVG />}
          <div style={{
          position: "absolute", left: 18, top: 18,
          background: "rgba(255,248,231,0.96)",
          border: "2.5px solid var(--ink)", borderRadius: 16,
          boxShadow: "4px 4px 0 var(--ink)",
          padding: "10px 12px",
          fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 11
        }}>
            {mapStatus === "error" ? "Google Maps key needs a restriction/API check" : "loading Google map..."}
          </div>
        </div>
      }
    </>);
}

function renderGoogleMapPins(layer, projection, state) {
  if (!state) return;
  const { shops, visibleIds, selected, hovered, setSelected, setHovered, tweaks } = state;
  layer.innerHTML = "";

  shops.forEach((shop) => {
    if (!shop.lat || !shop.lng) return;
    const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(shop.lat, shop.lng));
    const meta = STATUS_META[shop.status];
    const pinSize = window.innerWidth < 700 ? 42 : 46;
    const starSize = window.innerWidth < 700 ? 18 : 20;
    const isVisible = visibleIds.has(shop.id);
    const isHovered = hovered === shop.id;
    const isSelected = selected === shop.id;
    const pin = document.createElement("button");
    pin.type = "button";
    pin.setAttribute("aria-label", shop.name);
    pin.style.cssText = [
    "position:absolute",
    `left:${point.x}px`,
    `top:${point.y}px`,
    `width:${pinSize}px`,
    `height:${pinSize}px`,
    "border-radius:999px",
    "border:3px solid #1a1a1a",
    `background:${meta.color}`,
    "box-shadow:3px 3px 0 #1a1a1a",
    "display:grid",
    "place-items:center",
    `font-size:${window.innerWidth < 700 ? 21 : 23}px`,
    "line-height:1",
    "cursor:pointer",
    "pointer-events:auto",
    "transition:transform .18s cubic-bezier(.34,1.56,.64,1), opacity .18s",
    `transform:translate(-50%, -50%) ${isHovered || isSelected ? "scale(1.18)" : "scale(1)"}`,
    `opacity:${isVisible ? 1 : 0.18}`,
    `z-index:${isSelected ? 100 : isHovered ? 50 : 10}`].
    join(";");
    if (tweaks.wobble && isVisible) {
      pin.style.animation = `wobble${shop.id.length % 4} ${3 + shop.id.length % 5 * 0.3}s ease-in-out infinite`;
    }
    pin.textContent = shop.emoji;
    pin.addEventListener("mouseenter", () => setHovered(shop.id));
    pin.addEventListener("mouseleave", () => setHovered(null));
    pin.addEventListener("click", () => setSelected(shop.id));
    layer.appendChild(pin);

    if (shop.topPick) {
      const star = document.createElement("span");
      star.textContent = "★";
      star.style.cssText = `position:absolute;right:-7px;top:-7px;width:${starSize}px;height:${starSize}px;border-radius:999px;background:var(--pop2);color:#fff;border:2px solid #1a1a1a;display:grid;place-items:center;font-size:11px;font-weight:800;transform:rotate(15deg);pointer-events:none;`;
      pin.appendChild(star);
    }

    if (tweaks.showLabels && (isHovered || isSelected)) {
      const label = document.createElement("div");
      label.style.cssText = "position:absolute;left:50%;top:100%;transform:translate(-50%,8px);background:#1a1a1a;color:var(--bg);padding:6px 10px;border-radius:8px;white-space:nowrap;font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:13px;pointer-events:none;box-shadow:2px 2px 0 var(--pop);";
      label.innerHTML = `${shop.name}<div style=\"font-family:'Space Mono',monospace;font-size:10px;opacity:.7;font-weight:400;\">${shop.hood} · ${meta.short}</div>`;
      pin.appendChild(label);
    }
  });
}

function Pin({ shop, x, y, dimmed, hovered, selected, onHover, onClick, showLabel, wobble, style }) {
  const meta = STATUS_META[shop.status];
  const z = selected ? 100 : hovered ? 50 : 10;

  let shape;
  if (style === "splat") {
    shape =
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <path
        d="M 50,5 Q 70,10 75,25 Q 95,30 90,50 Q 95,75 70,80 Q 60,95 45,90 Q 25,98 18,75 Q 2,68 8,50 Q 2,28 25,22 Q 32,5 50,5 Z"
        fill={meta.color} stroke="#1a1a1a" strokeWidth="3" />
      
      </svg>;

  } else if (style === "blob") {
    shape =
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <path
        d="M 50,4 Q 80,12 88,38 Q 96,62 78,82 Q 60,98 40,90 Q 16,82 8,58 Q 2,32 22,14 Q 36,2 50,4 Z"
        fill={meta.color} stroke="#1a1a1a" strokeWidth="3" />
      
      </svg>;

  } else {
    // sticker (default) — circle
    shape =
    <div style={{
      width: "100%", height: "100%", borderRadius: "50%",
      background: meta.color, border: "3px solid #1a1a1a"
    }} />;

  }

  return (
    <div
      onMouseEnter={() => onHover(shop.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${x}%`, top: `${y}%`,
        transform: `translate(-50%, -50%) ${hovered || selected ? "scale(1.18)" : "scale(1)"}`,
        transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1), opacity 0.18s",
        opacity: dimmed ? 0.18 : 1,
        cursor: "pointer", zIndex: z,
        animation: wobble && !dimmed ? `wobble${shop.id.length % 4} ${3 + shop.id.length % 5 * 0.3}s ease-in-out infinite` : "none"
      }}>
      
      <div style={{
        position: "relative", width: 56, height: 56,
        filter: hovered || selected ? "drop-shadow(3px 3px 0 #1a1a1a)" : "drop-shadow(2px 2px 0 #1a1a1a)"
      }}>
        {shape}
        <div style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          fontSize: 28, lineHeight: 1, userSelect: "none"
        }}>
          {shop.emoji}
        </div>
        {shop.topPick &&
        <div style={{
          position: "absolute", top: -8, right: -8,
          width: 22, height: 22, borderRadius: "50%",
          background: "var(--pop2)", color: "#fff",
          border: "2px solid #1a1a1a",
          display: "grid", placeItems: "center",
          fontSize: 12, fontWeight: 800,
          transform: "rotate(15deg)"
        }}>★</div>
        }
      </div>
      {showLabel && (hovered || selected) &&
      <div style={{
        position: "absolute", left: "50%", top: "100%", transform: "translate(-50%, 8px)",
        background: "#1a1a1a", color: "var(--bg)",
        padding: "6px 10px", borderRadius: 8, whiteSpace: "nowrap",
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 13,
        pointerEvents: "none",
        boxShadow: "2px 2px 0 var(--pop)"
      }}>
          {shop.name}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, opacity: 0.7, fontWeight: 400 }}>
            {shop.hood} · {meta.short}
          </div>
        </div>
      }
    </div>);

}

// ===================== SHOP LIST =====================
function ShopList({ shops, selected, setSelected, hovered, setHovered, C }) {
  if (shops.length === 0) {
    return (
      <div style={{
        border: "3px dashed var(--ink)", borderRadius: 32, padding: 48,
        textAlign: "center", fontFamily: "'Bricolage Grotesque', sans-serif"
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🍵</div>
        <div style={{ fontWeight: 800, fontSize: 24 }}>no spots match</div>
        <div style={{ marginTop: 8, opacity: 0.6 }}>try a different filter or search.</div>
      </div>);

  }
  return (
    <div className="shop-list" style={{
      display: "flex", flexDirection: "column", gap: 14,
      paddingRight: 4, paddingBottom: 8
    }}>
      {shops.map((s, i) =>
      <ShopCard
        key={s.id}
        shop={s}
        index={i}
        selected={selected === s.id}
        hovered={hovered === s.id}
        onHover={() => setHovered(s.id)}
        onLeave={() => setHovered(null)}
        onClick={() => setSelected(s.id)} />

      )}
    </div>);

}

function ShopCard({ shop, index, selected, hovered, onHover, onLeave, onClick }) {
  const meta = STATUS_META[shop.status];
  const tilts = [-1, 0.5, -0.5, 1, 0, -1.5, 1.2];
  const tilt = tilts[index % tilts.length];
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        background: "#fff",
        border: "2.5px solid var(--ink)",
        borderRadius: 22,
        padding: 18,
        boxShadow: hovered || selected ? "6px 6px 0 var(--pop)" : "4px 4px 0 var(--ink)",
        transform: `rotate(${tilt}deg) ${hovered || selected ? "translate(-2px, -2px)" : "none"}`,
        transition: "all 0.18s",
        cursor: "pointer",
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "flex-start"
      }}>
      
      <div style={{
        width: 54, height: 54, borderRadius: "50%",
        background: meta.color, border: "2.5px solid var(--ink)",
        display: "grid", placeItems: "center", fontSize: 28,
        boxShadow: "2px 2px 0 var(--ink)", flexShrink: 0
      }}>
        {shop.emoji}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <h3 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
            fontSize: 20, margin: 0, letterSpacing: "-0.01em"
          }}>{shop.name}</h3>
          {shop.topPick && <Tag bg="var(--pop2)" ink="#fff">★ top pick</Tag>}
          {shop.buzzy && <Tag bg="var(--lime)">✦ buzzy</Tag>}
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, marginTop: 4, opacity: 0.7 }}>
          {shop.address} · <span style={{ fontWeight: 700 }}>{shop.hood}</span>
        </div>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 14, lineHeight: 1.5,
          margin: "10px 0 0", color: "#2a2a2a"
        }}>{shop.note}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
        <span style={{
          background: meta.color, color: meta.ink,
          fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 11,
          padding: "5px 10px", borderRadius: 999,
          border: "1.5px solid var(--ink)", whiteSpace: "nowrap"
        }}>{meta.label}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, opacity: 0.6 }}>
          {shop.price} · {displayHours(shop.hours)}
        </span>
        <a
          href={mapsUrl(shop)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink)",
            textDecoration: "none",
            borderBottom: "1.5px solid var(--ink)"
          }}>
          maps ↗
        </a>
      </div>
    </div>);

}

function Tag({ children, bg, ink = "var(--ink)" }) {
  return (
    <span style={{
      background: bg, color: ink,
      fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
      padding: "3px 8px", borderRadius: 999,
      border: "1.5px solid var(--ink)", textTransform: "uppercase", letterSpacing: "0.04em"
    }}>{children}</span>);

}

// ===================== DETAIL MODAL =====================
function ShopDetail({ shop, onClose, C }) {
  const meta = STATUS_META[shop.status];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="shop-detail-overlay" onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(26,26,26,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      overflowY: "auto", overscrollBehavior: "contain",
      animation: "fadeIn 0.2s"
    }}>
      <div
        className="shop-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-detail-title"
        onClick={(e) => e.stopPropagation()}
        style={{
        background: "var(--bg)", border: "3px solid var(--ink)", borderRadius: 28,
        boxShadow: "10px 10px 0 var(--ink)",
        maxWidth: 540, width: "100%", maxHeight: "calc(100vh - 48px)",
        display: "flex", flexDirection: "column",
        animation: "popIn 0.25s cubic-bezier(.34,1.56,.64,1)",
        overflow: "hidden"
      }}>
        <div className="shop-detail-header" style={{
          background: meta.color, padding: "32px 28px",
          borderBottom: "3px solid var(--ink)",
          position: "relative", flexShrink: 0
        }}>
          <button aria-label="Close shop details" onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            width: 36, height: 36, borderRadius: "50%",
            border: "2.5px solid var(--ink)", background: "#fff",
            cursor: "pointer", fontSize: 16, fontWeight: 800,
            boxShadow: "2px 2px 0 var(--ink)"
          }}>✕</button>
          <div className="shop-detail-icon" style={{
            width: 84, height: 84, borderRadius: "50%",
            background: "#fff", border: "3px solid var(--ink)",
            boxShadow: "4px 4px 0 var(--ink)",
            display: "grid", placeItems: "center", fontSize: 48,
            marginBottom: 16
          }}>{shop.emoji}</div>
          <h2 id="shop-detail-title" className="shop-detail-title" style={{
            fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
            fontSize: 38, margin: 0, letterSpacing: "-0.02em", lineHeight: 1
          }}>{shop.name}</h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, marginTop: 8 }}>
            {shop.address} · {shop.hood}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{
              background: "var(--ink)", color: "var(--bg)",
              fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
              padding: "5px 10px", borderRadius: 999
            }}>{meta.label}</span>
            {shop.topPick && <Tag bg="#fff">★ top pick</Tag>}
            {shop.buzzy && <Tag bg="#fff">✦ buzzy</Tag>}
          </div>
        </div>

        <div className="shop-detail-body" style={{
          padding: 28, fontFamily: "'Nunito', sans-serif",
          overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch"
        }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <Mini label="hours" val={displayHours(shop.hours)} />
            <Mini label="price" val={shop.price} />
            <Mini label="neighborhood" val={shop.hood} />
          </div>
          <p style={{ fontSize: 17, lineHeight: 1.5, margin: 0 }}>{shop.note}</p>
          <div style={{
            marginTop: 16, padding: 14, background: "#fff",
            border: "2px solid var(--ink)", borderRadius: 14,
            fontSize: 14, lineHeight: 1.5
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
              color: meta.ink
            }}>soy status</div>
            {shop.soyNote}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <Btn primary href={mapsUrl(shop)}>📍 directions</Btn>
            <Btn href={shop.source}>🔗 source</Btn>
            <Btn href={mapsUrl(shop)}>🗺️ google maps</Btn>
          </div>
        </div>
      </div>
    </div>);

}

function Mini({ label, val }) {
  return (
    <div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 18 }}>{val}</div>
    </div>);

}

function Btn({ children, primary, href }) {
  const style = {
      fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 14,
      padding: "10px 16px", borderRadius: 999,
      border: "2.5px solid var(--ink)",
      background: primary ? "var(--pop)" : "#fff",
      color: "var(--ink)",
      boxShadow: "3px 3px 0 var(--ink)", cursor: "pointer",
      textDecoration: "none", display: "inline-flex", alignItems: "center"
    };
  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" style={style}>{children}</a>;
  }
  return (
    <button style={style}>{children}</button>);

}

// ===================== FOOTER =====================
function Footer({ C }) {
  return (
    <footer style={{
      borderTop: "3px solid var(--ink)",
      background: "var(--ink)", color: "var(--bg)",
      padding: "32px", textAlign: "center",
      fontFamily: "'Space Mono', monospace", fontSize: 13
    }}>
      <div style={{
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
        fontSize: 28, marginBottom: 8, color: "var(--lime)"
      }}>made with 🍵 in sf</div>
      <div style={{ opacity: 0.7 }}>sanfranciscomatcha.com · est. 2026

      </div>
    </footer>);

}

// MOUNT
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
