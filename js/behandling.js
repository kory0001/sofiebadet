// Supabase configuration
const SUPABASE_URL = "https://vdkcizkrlybxlhwegkzu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2NpemtybHlieGxod2Vna3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTU4NjksImV4cCI6MjA4MDkzMTg2OX0.JIcfc4MJxyq0YArmV4PbezNBaAh8QEirEgYv6jJVgXo";

// API endpoint
const API_BASE = `${SUPABASE_URL}/rest/v1`;

// ==========================================
// GET SLUG FROM URL
// ==========================================
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug");

// ==========================================
// FETCH SINGLE BEHANDLING
// ==========================================
async function getBehandling(slug) {
  const response = await fetch(`${API_BASE}/behandlinger?slug=eq.${slug}`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  const data = await response.json();
  return data[0];
}

// ==========================================
// FETCH RELATED BEHANDLINGER (FLERE END 3)
// ==========================================
async function getRelatedBehandlinger(currentSlug) {
  const response = await fetch(`${API_BASE}/behandlinger?slug=neq.${currentSlug}&limit=10`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  return await response.json();
}

// ==========================================
// SHUFFLE ARRAY (RANDOM)
// ==========================================
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ==========================================
// RENDER RELATED BEHANDLINGER
// ==========================================
function renderRelatedBehandlinger(behandlinger) {
  const container = document.getElementById("relatedContainer");

  if (!container || !behandlinger || behandlinger.length === 0) return;

  container.innerHTML = behandlinger
    .map(
      (b) => `
      <div class="related__card" onclick="window.location.href='behandling.html?slug=${b.slug}'">
        <h4 class="related__card--title font-buvera">${b.navn}</h4>

        <p class="related__card--text">
          ${b.kort_beskrivelse || ""}
        </p>

        <p class="related__card--meta">
          ${b.varighed} • ${b.pris},- pr. person
        </p>

        <a href="https://www.sofiebadet.dk/book-tid" class="button button--secondary button--small" onclick="event.stopPropagation()">
          Book tid
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none">
            <path
              d="M16.1379 13.4416H0V11.5584H16.1379C18.3024 11.5584 19.4483 12.1753 21.3263 12.1753V12.0779C17.634 10.3896 16.2653 8.50649 15.0239 6.55844L16.8382 5C18.6525 8.40909 20.5623 10.3247 24 11.9156V13.0519C20.5623 14.6429 18.6525 16.5909 16.8382 20L15.0239 18.4091C16.2653 16.4935 17.634 14.6104 21.3263 12.9221V12.8247C19.4483 12.8247 18.2706 13.4416 16.1379 13.4416Z"
              fill="#321600" />
          </svg>
        </a>
      </div>
    `
    )
    .join("");
}

// ==========================================
// RENDER BEHANDLING DETAIL
// ==========================================
async function renderBehandling() {
  try {
    const behandling = await getBehandling(slug);

    if (!behandling) return;

    // HERO
    document.getElementById("heroTitle").textContent = behandling.navn;
    document.getElementById("introText").textContent = behandling.kort_intro_tekst || "";

    // Kundefavorit
    if (behandling.kundefavorit) {
      document.getElementById("kundefavoritBadge").style.display = "flex";
    }

    // VARIGHED
    document.getElementById("varighedTitel").textContent = `${behandling.varighed}:`;

    if (behandling.varighed_beskrivelse?.length) {
      document.getElementById("varighedListe").innerHTML = behandling.varighed_beskrivelse
        .map(
          (item) => `<li>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M0 1.51402C1.34146 3.8271 3.08943 6.26635 7.11382 8.45327V9.54673C3.08943 11.7336 1.34146 14.1729 0 16.4439L1.58536 18C3.57724 14.2991 5.93496 11.5654 10 9.50467V8.45327C5.93496 6.39252 3.57724 3.70093 1.58536 0L0 1.51402Z" fill="#321600"/>
              </svg>
              <span>${item}</span>
            </li>`
        )
        .join("");
    }

    // INKLUDERET
    document.getElementById("inkluderetListe").innerHTML = behandling.inkluderet
      .map(
        (item) => `<li>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M0 1.51402C1.34146 3.8271 3.08943 6.26635 7.11382 8.45327V9.54673C3.08943 11.7336 1.34146 14.1729 0 16.4439L1.58536 18C3.57724 14.2991 5.93496 11.5654 10 9.50467V8.45327C5.93496 6.39252 3.57724 3.70093 1.58536 0L0 1.51402Z" fill="#321600"/>
            </svg>
            <span>${item}</span>
          </li>`
      )
      .join("");

    // PRAKTISK
    document.getElementById("praktiskListe").innerHTML = behandling.praktisk
      .map(
        (item) => `<li>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M0 1.51402C1.34146 3.8271 3.08943 6.26635 7.11382 8.45327V9.54673C3.08943 11.7336 1.34146 14.1729 0 16.4439L1.58536 18C3.57724 14.2991 5.93496 11.5654 10 9.50467V8.45327C5.93496 6.39252 3.57724 3.70093 1.58536 0L0 1.51402Z" fill="#321600"/>
            </svg>
            <span>${item}</span>
          </li>`
      )
      .join("");

    // PRIS
    if (behandling.pris_original) {
      document.getElementById("prisOriginal").textContent = `${behandling.pris_original},- pr. person`;
      document.getElementById("prisOriginal").style.display = "block";
    }

    document.getElementById("prisAktuel").textContent = `${behandling.pris},- pr. person`;

    // BESKRIVELSE
    document.getElementById("beskrivelse").innerHTML = behandling.lang_beskrivelse
      .split("\n\n")
      .map((p) => `<p>${p}</p>`)
      .join("");

    // ==========================================
    // RELATED (RANDOM)
    // ==========================================
    const related = await getRelatedBehandlinger(behandling.slug);
    const randomRelated = shuffleArray(related).slice(0, 3);
    renderRelatedBehandlinger(randomRelated);
  } catch (error) {
    console.error("Fejl:", error);
  }
}

// ==========================================
// INIT
// ==========================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderBehandling);
} else {
  renderBehandling();
}
