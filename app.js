// ===== Utils =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

function fmtTime(d = new Date()) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function scrollToId(id){
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function safeUrl(u){
  if (!u) return "";
  if (u === "#") return "";
  return u;
}

function readmeUrl(repoUrl){
  const base = safeUrl(repoUrl);
  return base ? `${base}#readme` : "";
}

// ===== Config =====
const EMAIL_PRIMARY = "n.a.elshamy1@gmail.com";
const EMAIL_STUDENT = "elshamyn@sheridancollege.ca";
const SECP_CODE = "GL38G50Q9NREC8RJ";

// ===== Matrix Rain =====
(function matrixRain(){
  const canvas = $("#matrix");
  const ctx = canvas.getContext("2d", { alpha: true });

  let w, h, cols, drops, fontSize;
  const chars = "01アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+?";

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    fontSize = Math.max(14, Math.floor(Math.min(w, h) / 60));
    cols = Math.floor(w / fontSize);
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * (h / fontSize)));
  }
  resize();
  window.addEventListener("resize", resize);

  function draw(){
    ctx.fillStyle = "rgba(5, 6, 10, 0.18)";
    ctx.fillRect(0, 0, w, h);

    ctx.font = `${fontSize}px IBM Plex Mono`;
    for (let i = 0; i < drops.length; i++){
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = "rgba(0, 255, 156, 0.28)";
      ctx.fillText(text, x, y);

      drops[i]++;
      if (y > h && Math.random() > 0.975) drops[i] = 0;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== Clock + dates =====
$("#clock").textContent = fmtTime();
setInterval(() => ($("#clock").textContent = fmtTime()), 1000);

$("#year").textContent = new Date().getFullYear();
$("#patchDate").textContent = new Date().toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });

// ===== Projects (GitHub READMEs = writeups) =====
// From your GitHub list + SREBattle
const PROJECTS = [
  {
    title: "SREBattle / SadServers Agent Eval",
    desc: "Automation project: run agents against SadServers scenarios, validate with checks, and record results.",
    tags: ["Automation", "Python", "Linux", "LLM Eval"],
    links: { repo: "https://github.com/SadServers/SREBattle" }
  },
  {
    title: "Linux Monitoring Tool",
    desc: "Lightweight Bash tooling to monitor processes + CPU usage on Linux systems.",
    tags: ["Linux", "Shell", "Monitoring", "Automation"],
    links: { repo: "https://github.com/nadaelshamii/linux-monitoring-tool" }
  },
  {
    title: "Database Breach Analysis",
    desc: "Security analysis project focused on breach context, impact, and defensive takeaways.",
    tags: ["Incident Analysis", "Security", "Reporting"],
    links: { repo: "https://github.com/nadaelshamii/Database-Breach-Analysis" }
  },
  {
    title: "PowerShell System Monitoring",
    desc: "PowerShell scripts for system monitoring + basic telemetry collection on Windows.",
    tags: ["PowerShell", "Windows", "Automation"],
    links: { repo: "https://github.com/nadaelshamii/Powershell-System-Monitoring" }
  },
  {
    title: "ICMP Network Analysis",
    desc: "Network analysis focusing on ICMP behavior, patterns, and interpretation of captures.",
    tags: ["Networking", "ICMP", "Analysis"],
    links: { repo: "https://github.com/nadaelshamii/icmp-network-analysis" }
  },
  {
    title: "IP Fragmentation Analysis",
    desc: "Networking analysis exploring fragmentation behavior and how it appears in packet data.",
    tags: ["Networking", "Packets", "Analysis"],
    links: { repo: "https://github.com/nadaelshamii/ip-fragmentation-analysis" }
  },
  {
    title: "Buffer Overflow / Null-Free Assembly",
    desc: "Low-level exploration of assembly constraints and payload-style considerations.",
    tags: ["RE", "Assembly", "Security"],
    links: { repo: "https://github.com/nadaelshamii/Buffer-Overflow-Null-Free-Assembly-" }
  }
];

// Writeup links = README
PROJECTS.forEach(p => {
  p.links.writeup = readmeUrl(p.links.repo);
});

// Featured = SOC-friendly + your favorites
const FEATURED = [
  "SREBattle / SadServers Agent Eval",
  "PowerShell System Monitoring",
  "Linux Monitoring Tool"
];

// ===== Projects render + filtering =====
const projectsGrid = $("#projectsGrid");
const tagbar = $("#tagbar");
const filterLabel = $("#filterLabel");

const allTags = Array.from(new Set(PROJECTS.flatMap(p => p.tags))).sort((a,b)=>a.localeCompare(b));
let activeTag = "ALL";

function renderTagbar(){
  tagbar.innerHTML = [
    `<button class="chip ${activeTag==="ALL"?"active":""}" data-tag="ALL">ALL</button>`,
    ...allTags.map(t => `<button class="chip ${activeTag===t?"active":""}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`)
  ].join("");

  $$("#tagbar .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag;
      filterLabel.textContent = activeTag;
      renderTagbar();
      renderProjects();
      termPrint(`filter set to <span class="sys">${escapeHtml(activeTag)}</span>`);
    });
  });
}

function actionButtons(p){
  const repo = safeUrl(p.links.repo);
  const writeup = safeUrl(p.links.writeup);

  const repoBtn = repo
    ? `<a class="a" href="${repo}" target="_blank" rel="noopener">Repo →</a>`
    : `<span class="a" aria-disabled="true">Repo →</span>`;

  const writeupBtn = writeup
    ? `<a class="a" href="${writeup}" target="_blank" rel="noopener">Writeup (README) →</a>`
    : `<span class="a" aria-disabled="true">Writeup →</span>`;

  return repoBtn + writeupBtn;
}

function renderProjects(){
  const list = (activeTag === "ALL")
    ? PROJECTS
    : PROJECTS.filter(p => p.tags.includes(activeTag));

  projectsGrid.innerHTML = list.map(p => `
    <article class="proj">
      <div class="proj__title">${escapeHtml(p.title)}</div>
      <div class="proj__desc">${escapeHtml(p.desc)}</div>
      <div class="proj__meta">
        ${p.tags.map(t => `<span class="mini" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join("")}
      </div>
      <div class="proj__actions">
        ${actionButtons(p)}
      </div>
    </article>
  `).join("");

  $$("#projectsGrid .mini").forEach(el => {
    el.addEventListener("click", () => {
      activeTag = el.dataset.tag;
      filterLabel.textContent = activeTag;
      renderTagbar();
      renderProjects();
    });
  });
}

renderTagbar();
renderProjects();

// Featured list
const featuredEl = $("#featured");
featuredEl.innerHTML = FEATURED.map(name => {
  const p = PROJECTS.find(x => x.title === name);
  if (!p) return "";
  const repo = safeUrl(p.links.repo);
  const writeup = safeUrl(p.links.writeup);

  return `
    <div class="fitem">
      <div class="frow">
        <b>${escapeHtml(p.title)}</b>
      </div>
      <div class="dim">${escapeHtml(p.desc.slice(0, 90))}${p.desc.length>90?"…":""}</div>
      <div class="proj__actions" style="margin-top:10px;">
        ${repo ? `<a class="a" href="${repo}" target="_blank" rel="noopener">Repo →</a>` : `<span class="a" aria-disabled="true">Repo →</span>`}
        ${writeup ? `<a class="a" href="${writeup}" target="_blank" rel="noopener">Writeup →</a>` : `<span class="a" aria-disabled="true">Writeup →</span>`}
      </div>
    </div>
  `;
}).join("");

// ===== Terminal =====
const termBody = $("#termBody");
const termInput = $("#termInput");

function termPrint(html){
  const div = document.createElement("div");
  div.className = "term__line";
  div.innerHTML = html;
  termBody.appendChild(div);
  termBody.scrollTop = termBody.scrollHeight;
}

function boot(){
  termPrint(`<span class="sys">[boot]</span> initializing portfolio shell…`);
  termPrint(`<span class="sys">[ok]</span> matrix feed online • ui stable • links not fake`);
  termPrint(`<span class="dim">Type</span> <span class="sys">help</span> <span class="dim">to explore.</span>`);
}
boot();

function termCmd(cmd){
  termPrint(`<span class="cmd">$</span> <span class="cmd">${escapeHtml(cmd)}</span>`);
  const c = cmd.trim().toLowerCase();
  if (!c) return;

  const handlers = {
    "help": () => termPrint([
      `<span class="sys">commands</span>: help, about, projects, skills, certs, ctfs, filter <tag>, open booking, clear`,
      `<span class="dim">pro tip</span>: Ctrl/⌘ + K opens the palette`
    ].join("<br>")),

    "about": () => termPrint(`Cybersecurity student focused on <span class="sys">SOC</span> + <span class="sys">DFIR</span> + <span class="sys">automation</span>. Evidence-first. Logs-first.`),

    "projects": () => {
      termPrint(`<span class="sys">project archive</span> loaded: ${PROJECTS.length} items`);
      PROJECTS.forEach(p => termPrint(`• <b>${escapeHtml(p.title)}</b> <span class="dim">(${escapeHtml(p.tags.join(", "))})</span>`));
      scrollToId("projectsSection");
    },

    "skills": () => termPrint([
      `<b>SOC/DFIR</b>: triage mindset, investigation notes, Windows fundamentals, log-first approach`,
      `<b>Tools</b>: Git/GitHub, virtualization, basic network analysis`,
      `<b>Automation</b>: Python + PowerShell + shell scripting`
    ].join("<br>")),

    "certs": () => termPrint([
      `Certs: <span class="sys">CompTIA Security+</span>`,
      `Verify: <span class="dim">verify.CompTIA.org</span> • Code: <span class="sys">${escapeHtml(SECP_CODE)}</span>`
    ].join("<br>")),

    "ctfs": () => termPrint([
      `CTFs Attended: Ontario Cyber Secuirty Summit 2025/ CyberSci 2025 /Bsides toronto 2025`,
      `<span class="dim">writeups:</span> inclduing (methods + tools + fix). will be updated soon. `
    ].join("<br>")),

    "open booking": () => openBooking(),
    "clear": () => { termBody.innerHTML = ""; boot(); }
  };

  if (c.startsWith("filter ")){
    const tag = cmd.slice(7).trim();
    const real = allTags.find(t => t.toLowerCase() === tag.toLowerCase());
    if (!real) return termPrint(`<span class="bad">unknown tag</span>. Try: <span class="dim">${escapeHtml(allTags.join(", "))}</span>`);
    activeTag = real;
    filterLabel.textContent = activeTag;
    renderTagbar();
    renderProjects();
    return termPrint(`filter set to <span class="sys">${escapeHtml(activeTag)}</span>`);
  }

  if (handlers[c]) return handlers[c]();
  termPrint(`<span class="warn">unknown command</span>. Type <span class="sys">help</span>.`);
}

termInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter"){
    const cmd = termInput.value;
    termInput.value = "";
    termCmd(cmd);
  }
});

// ===== Quick links =====
$("#openProjects").addEventListener("click", () => scrollToId("projectsSection"));
$("#openCTFs").addEventListener("click", () => { termCmd("ctfs"); termInput.focus(); });
$("#openBooking2").addEventListener("click", () => openBooking());

const emailLink = $("#emailLink");
if (emailLink) emailLink.href = `mailto:${EMAIL_PRIMARY}`;

$("#copyEmail").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL_PRIMARY);
    termPrint(`<span class="sys">copied</span> ${escapeHtml(EMAIL_PRIMARY)} to clipboard`);
  } catch {
    termPrint(`<span class="warn">clipboard blocked</span> — manually copy: ${escapeHtml(EMAIL_PRIMARY)}`);
  }
});

// ===== Security+ copy =====
const secPlusNote = $("#secPlusNote");
$("#copySecPlus")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(SECP_CODE);
    secPlusNote.textContent = "✅ Copied Security+ verification code.";
    setTimeout(()=> secPlusNote.textContent = "", 2400);
  } catch {
    secPlusNote.textContent = `Clipboard blocked — copy manually: ${SECP_CODE}`;
  }
});

// ===== Booking modal (opens email draft) =====
const bookingOverlay = $("#bookingOverlay");
const bookingNote = $("#bookingNote");

function openBooking(){
  bookingOverlay.classList.add("open");
  bookingOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeBooking(){
  bookingOverlay.classList.remove("open");
  bookingOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  bookingNote.textContent = "";
}

$("#openBooking").addEventListener("click", openBooking);
$("#closeBooking").addEventListener("click", closeBooking);
$("#cancelBooking").addEventListener("click", closeBooking);

bookingOverlay.addEventListener("click", (e) => {
  if (e.target === bookingOverlay) closeBooking();
});

// Submit booking form -> mailto draft
$("#bookingForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#bkName")?.value?.trim() || "";
  const fromEmail = $("#bkEmail")?.value?.trim() || "";
  const org = $("#bkOrg")?.value?.trim() || "";
  const type = $("#bkType")?.value || "Portfolio review";
  const msg = $("#bkMsg")?.value?.trim() || "";

  const subject = `[${type}] Portfolio Request — ${name || "Recruiter"}`;
  const bodyLines = [
    `Hi Nada,`,
    ``,
    `I’d like to connect about: ${type}`,
    org ? `Organization: ${org}` : null,
    fromEmail ? `My email: ${fromEmail}` : null,
    ``,
    msg ? `Context:` : null,
    msg || null,
    ``,
    `Best,`,
    name || ""
  ].filter(Boolean);

  const mailto = `mailto:${encodeURIComponent(EMAIL_PRIMARY)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  window.location.href = mailto;

  bookingNote.textContent = "Opening your email client…";
  termPrint(`<span class="sys">booking</span> opening email draft`);
  setTimeout(closeBooking, 600);
});

// ESC closes overlays
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    closePalette();
    if (bookingOverlay.classList.contains("open")) closeBooking();
  }
});

// ===== Command Palette =====
const paletteOverlay = $("#paletteOverlay");
const paletteInput = $("#paletteInput");
const paletteList = $("#paletteList");

const COMMANDS = [
  { name: "Projects", value: "projects", hint: "List projects + scroll down" },
  { name: "CTFs", value: "ctfs", hint: "Show CTF notes" },
  { name: "Skills", value: "skills", hint: "Skills snapshot" },
  { name: "Certifications", value: "certs", hint: "Security+ verify info" },
  { name: "About", value: "about", hint: "Short about" },
  { name: "Open Booking", value: "open booking", hint: "Open booking modal" },
  { name: "Clear Terminal", value: "clear", hint: "Reset terminal" }
];

let paletteIndex = 0;

function openPalette(){
  paletteOverlay.classList.add("open");
  paletteOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  paletteInput.value = "";
  paletteIndex = 0;
  renderPalette();
  paletteInput.focus();
}
function closePalette(){
  paletteOverlay.classList.remove("open");
  paletteOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderPalette(){
  const q = paletteInput.value.trim().toLowerCase();
  const items = COMMANDS.filter(c => (c.name + " " + c.value + " " + c.hint).toLowerCase().includes(q));
  if (paletteIndex >= items.length) paletteIndex = Math.max(0, items.length - 1);

  paletteList.innerHTML = items.map((c, idx) => `
    <div class="pitem ${idx===paletteIndex ? "active" : ""}" data-value="${escapeHtml(c.value)}">
      <div><strong>${escapeHtml(c.name)}</strong> <span class="dim">— ${escapeHtml(c.hint)}</span></div>
      <div class="dim">${escapeHtml(c.value)}</div>
    </div>
  `).join("");

  $$("#paletteList .pitem").forEach((el, idx) => {
    el.addEventListener("mouseenter", () => { paletteIndex = idx; renderPalette(); });
    el.addEventListener("click", () => runPalette(el.dataset.value));
  });
}

function runPalette(val){
  closePalette();
  if (val === "open booking") openBooking();
  else termCmd(val);
  termInput.focus();
}

$("#openPalette").addEventListener("click", openPalette);
$("#closePalette").addEventListener("click", closePalette);

paletteOverlay.addEventListener("click", (e) => {
  if (e.target === paletteOverlay) closePalette();
});

paletteInput.addEventListener("input", renderPalette);
paletteInput.addEventListener("keydown", (e) => {
  const q = paletteInput.value.trim().toLowerCase();
  const items = COMMANDS.filter(c => (c.name + " " + c.value + " " + c.hint).toLowerCase().includes(q));

  if (e.key === "ArrowDown"){ e.preventDefault(); paletteIndex = Math.min(items.length-1, paletteIndex+1); renderPalette(); }
  if (e.key === "ArrowUp"){ e.preventDefault(); paletteIndex = Math.max(0, paletteIndex-1); renderPalette(); }
  if (e.key === "Enter"){
    e.preventDefault();
    const chosen = items[paletteIndex];
    if (chosen) runPalette(chosen.value);
  }
});

// Ctrl/Cmd + K opens palette
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
    e.preventDefault();
    if (paletteOverlay.classList.contains("open")) closePalette();
    else openPalette();
  }
});

// ===== MicroNav active highlight =====
(function microNavActive(){
  const links = Array.from(document.querySelectorAll(".microNav__link"));
  if (!links.length) return;

  const sections = links
    .map(a => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle("active", a.dataset.nav === id));
  };

  setActive(sections[0]?.id);

  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, {
    threshold: [0.2, 0.35, 0.5, 0.65],
    rootMargin: "-15% 0px -60% 0px"
  });

  sections.forEach(s => obs.observe(s));
})();

// Signal rotator
const signals = [
  "Low noise, high receipts.",
  "Threats detected: 0 (today). Ego detected: also 0.",
  "GitHub READMEs = writeups. Less yapping, more proof.",
  "Blue team energy: calm, methodical, slightly obsessed with logs."
];
let si = 0;
setInterval(() => {
  si = (si + 1) % signals.length;
  $("#signal").textContent = signals[si];
}, 2400);
