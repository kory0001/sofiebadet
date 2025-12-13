// ==========================================
// STATE
// ==========================================

let allBehandlinger = [];
let activeFilter = null;

// ==========================================
// KATEGORIER
// ==========================================

const KATEGORIER = [
  { navn: "Hammam", slug: "hammam" },
  { navn: "Kurbad", slug: "kurbad" },
  { navn: "Karbad", slug: "karbad" },
  { navn: "Spa-massage", slug: "spa-massage" },
  { navn: "Spa-rejse", slug: "spa-rejse" },
  { navn: "Ansigtsbehandling", slug: "ansigtsbehandling" },
];

// ==========================================
// STEP 1: FETCH BEHANDLINGER FRA SUPABASE
// ==========================================

async function getBehandlinger() {
  const response = await fetch(`${API_BASE}/behandlinger?order=sortering.asc`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  // Map til det format vi bruger
  return data.map((b) => ({
    slug: b.slug,
    navn: b.navn,
    kategori: b.kategori,
    kategoriSlug: b.kategori_slug,
    introTekst: b.intro_tekst,
    kortBeskrivelse: b.kort_beskrivelse,
    varighed: b.varighed,
    personer: b.personer,
    pris: b.pris,
    prisOriginal: b.pris_original,
    kundefavorit: b.kundefavorit,
  }));
}

// ==========================================
// STEP 2: RENDER FILTER BUTTONS
// ==========================================

function renderFilterButtons() {
  const container = document.getElementById("filterButtons");

  // Generer knapper for hver kategori
  const buttonsHTML = KATEGORIER.map(
    (kat) => `
    <button 
      class="filter__btn font-buvera ${activeFilter === kat.slug ? "active" : ""}" 
      onclick="setFilter('${kat.slug}')"
    >
      ${kat.navn}
    </button>
  `
  ).join("");

  // Tilføj "Ryd alle" knap hvis filter er aktiv
  const clearBtn = activeFilter
    ? `
    <button class="filter__btn clear-btn font-buvera" onclick="setFilter(null)">
      Ryd alle <span>×</span>
    </button>
  `
    : "";

  container.innerHTML = buttonsHTML + clearBtn;
}

// ==========================================
// STEP 3: SET FILTER
// ==========================================

function setFilter(kategoriSlug) {
  activeFilter = kategoriSlug;
  renderFilterButtons();
  renderBehandlinger();
}

// ==========================================
// STEP 4: RENDER BEHANDLINGER
// ==========================================

function renderBehandlinger() {
  const container = document.getElementById("behandlingerContainer");

  // Filtrer behandlinger hvis aktiv filter
  const filtered = activeFilter ? allBehandlinger.filter((b) => b.kategoriSlug === activeFilter) : allBehandlinger;

  // Gruppér efter kategori
  const grouped = filtered.reduce((acc, behandling) => {
    const kat = behandling.kategori;
    if (!acc[kat]) acc[kat] = [];
    acc[kat].push(behandling);
    return acc;
  }, {});

  // Byg HTML
  let html = "";

  for (const [kategori, behandlinger] of Object.entries(grouped)) {
    html += `
      <div class="kategori-section">
        <!-- Kategori header -->
        <div class="kategori-header">
          <h2 class="font-editorial">${kategori}</h2>
          ${
            behandlinger[0].introTekst
              ? `
            <p class="font-editorial-italic">${behandlinger[0].introTekst}</p>
          `
              : ""
          }
        </div>
        
        <!-- Grid af behandlinger -->
        <div class="behandlinger-grid">
          ${behandlinger.map((b) => createCard(b)).join("")}
        </div>
      </div>
    `;
  }

  // Vis "ingen resultater" hvis tomt
  if (html === "") {
    html = '<p class="no-results font-hedvig">Ingen behandlinger fundet i denne kategori</p>';
  }

  container.innerHTML = html;
}

// ==========================================
// STEP 5: CREATE BEHANDLING CARD
// ==========================================

function createCard(behandling) {
  return `
    <article>
      <a href="behandling.html?slug=${behandling.slug}" class="behandling-card">
        
        <!-- Navn -->
        <h3 class="font-editorial">${behandling.navn}</h3>
        
        <!-- Beskrivelse -->
        <p class="beskrivelse font-hedvig">${behandling.kortBeskrivelse}</p>     <!-- read-more -->
        <div class="read-more font-buvera">
          Læs mere <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M16.1379 13.4416H0V11.5584H16.1379C18.3024 11.5584 19.4483 12.1753 21.3263 12.1753V12.0779C17.634 10.3896 16.2653 8.50649 15.0239 6.55844L16.8382 5C18.6525 8.40909 20.5623 10.3247 24 11.9156V13.0519C20.5623 14.6429 18.6525 16.5909 16.8382 20L15.0239 18.4091C16.2653 16.4935 17.634 14.6104 21.3263 12.9221V12.8247C19.4483 12.8247 18.2706 13.4416 16.1379 13.4416Z" fill="#321600"/>
</svg>
        </div>
        <!-- Detaljer -->
        <div class="detaljer font-hedvig">
          <div class="detalje">
            <span>${behandling.varighed}</span>
          </div>
          <div>•</div>
          <div class="detalje">
            <span>${behandling.personer}</span>
          </div>
        </div>
        
        <!-- Pris -->
        <div class="pris">
          ${
            behandling.prisOriginal
              ? `
            <span class="pris-original font-hedvig">${behandling.prisOriginal},-</span>
          `
              : ""
          }
          <span class="pris-aktuel font-hedvig-italic">${behandling.pris},- pr. person</span>
        </div>
        
   
        
      </a>
    </article>
  `;
}

// ==========================================
// STEP 6: INIT - KØR NÅR SIDEN LOADER
// ==========================================

async function init() {
  try {
    // Vis loading
    document.getElementById("behandlingerContainer").innerHTML = '<div class="loading font-hedvig">Henter behandlinger...</div>';

    // Hent data
    allBehandlinger = await getBehandlinger();

    // Render
    renderFilterButtons();
    renderBehandlinger();
  } catch (error) {
    console.error("Fejl ved hentning:", error);
    document.getElementById("behandlingerContainer").innerHTML = '<p class="error font-hedvig">Kunne ikke hente behandlinger. Prøv igen senere.</p>';
  }
}

// Kør init når DOM er klar
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
