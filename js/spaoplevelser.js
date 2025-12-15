// ==========================================
// STATE
// ==========================================
let allBehandlinger = [];
let activeFilters = [];
let showTilbudOnly = false; // ← NY: Track om "Tilbud" filter er aktivt

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
// STEP 2: RENDER FILTER BUTTONS - OPDATERET
// ==========================================
function renderFilterButtons(shouldAnimateClear = false) {
  const container = document.getElementById("filterButtons");

  // Tilbud knap
  const tilbudBtn = `
    <button 
      class="filter__btn font-buvera ${showTilbudOnly ? "active" : ""}" 
      onclick="toggleTilbud()"
    >
      Tilbud
    </button>
  `;

  const buttonsHTML = KATEGORIER.map(
    (kat) => `
    <button 
      class="filter__btn font-buvera ${activeFilters.includes(kat.slug) ? "active" : ""}" 
      onclick="toggleFilter('${kat.slug}')"
    >
      ${kat.navn}
    </button>
  `
  ).join("");

  const clearBtn =
    activeFilters.length > 0 || showTilbudOnly
      ? `
    <div class="filter__break"></div>
    <button 
      class="filter__btn clear-btn font-buvera" 
      id="clearButton" 
      ${shouldAnimateClear ? 'style="animation: fadeIn 0.3s ease-in-out;"' : ""}
      onclick="clearFilters()"
    >
      Ryd alle <span>×</span>
    </button>
  `
      : "";

  container.innerHTML = tilbudBtn + buttonsHTML + clearBtn;
}

// ==========================================
// STEP 3: TOGGLE FILTER
// ==========================================
function toggleFilter(kategoriSlug) {
  // Gem om clear button var synlig FØR vi ændrer noget
  const hadActiveFilters = activeFilters.length > 0 || showTilbudOnly;

  const index = activeFilters.indexOf(kategoriSlug);

  if (index > -1) {
    activeFilters.splice(index, 1);
  } else {
    activeFilters.push(kategoriSlug);
  }

  // Skal vi animere? Kun hvis der IKKE var aktive filtre før
  const shouldAnimate = !hadActiveFilters && (activeFilters.length > 0 || showTilbudOnly);

  renderFilterButtons(shouldAnimate);
  renderBehandlinger();
}

// ==========================================
// STEP 3B: TOGGLE TILBUD - NY FUNKTION
// ==========================================
function toggleTilbud() {
  // Gem om clear button var synlig FØR vi ændrer noget
  const hadActiveFilters = activeFilters.length > 0 || showTilbudOnly;

  showTilbudOnly = !showTilbudOnly;

  // Skal vi animere? Kun hvis der IKKE var aktive filtre før
  const shouldAnimate = !hadActiveFilters && (activeFilters.length > 0 || showTilbudOnly);

  renderFilterButtons(shouldAnimate);
  renderBehandlinger();
}

function clearFilters() {
  activeFilters = [];
  showTilbudOnly = false; // ← Reset også tilbud filter
  renderFilterButtons(false);
  renderBehandlinger();
}

// ==========================================
// STEP 4: RENDER BEHANDLINGER - OPDATERET
// ==========================================
function renderBehandlinger() {
  const container = document.getElementById("behandlingerContainer");

  // Filtrer behandlinger
  let filtered = allBehandlinger;

  // Først: Filtrer på tilbud hvis aktivt
  if (showTilbudOnly) {
    filtered = filtered.filter((b) => b.prisOriginal); // Kun behandlinger med pris_original
  }

  // Derefter: Filtrer på kategorier hvis aktive
  if (activeFilters.length > 0) {
    filtered = filtered.filter((b) => activeFilters.includes(b.kategoriSlug));
  }

  const grouped = filtered.reduce((acc, behandling) => {
    const kat = behandling.kategori;
    if (!acc[kat]) acc[kat] = [];
    acc[kat].push(behandling);
    return acc;
  }, {});

  let html = "";

  for (const [kategori, behandlinger] of Object.entries(grouped)) {
    html += `
      <div class="kategori-section">
        <div class="kategori__header">
          <h3 class="kategori__title font-editorial">${kategori}</h3>
          ${behandlinger[0].introTekst ? `<p class="kategori__intro font-editorial-italic">${behandlinger[0].introTekst}</p>` : ""}
        </div>
        
        <div class="behandlinger-grid">
          ${behandlinger.map((b) => createCard(b)).join("")}
        </div>
      </div>
    `;
  }

  if (html === "") {
    html = '<p class="no-results font-hedvig">Ingen behandlinger fundet</p>';
  }

  container.innerHTML = html;
} // ==========================================
// STEP 5: CREATE BEHANDLING CARD
// ==========================================
function createCard(behandling) {
  return `
    <article class="card ${behandling.kundefavorit ? "card--featured" : ""}">
      <a href="behandling.html?slug=${behandling.slug}" class="card__link">
        ${behandling.prisOriginal ? '<span class="card__badge">Månedens behandling - 20%</span>' : ""}
        
        <div class="card__content">
          <h4 class="card__title font-buvera">${behandling.navn}</h4>
          <p class="card__description font-hedvig">
            ${behandling.kortBeskrivelse} 
            <span class="card__read-more font-buvera">
              Læs mere 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M16.1379 13.4416H0V11.5584H16.1379C18.3024 11.5584 19.4483 12.1753 21.3263 12.1753V12.0779C17.634 10.3896 16.2653 8.50649 15.0239 6.55844L16.8382 5C18.6525 8.40909 20.5623 10.3247 24 11.9156V13.0519C20.5623 14.6429 18.6525 16.5909 16.8382 20L15.0239 18.4091C16.2653 16.4935 17.634 14.6104 21.3263 12.9221V12.8247C19.4483 12.8247 18.2706 13.4416 16.1379 13.4416Z" fill="#321600"/>
              </svg>
            </span>
          </p>
          
          <div class="card__meta font-hedvig">
            <span>${behandling.varighed}</span>
            <span>•</span>
            <span>${behandling.personer}</span>
          </div>
        </div>
        
        <div class="card__aside">
          <div class="card__pricing">
            ${behandling.prisOriginal ? `<span class="card__price card__price--old font-editorial-italic">${behandling.prisOriginal},- pr. person</span>` : ""}
            <span class="card__price card__price--current font-editorial-italic">${behandling.pris},- pr. person</span>
          </div>
          
          <button class="button button--primary">
            Book tid  
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="11" viewBox="0 0 17 11" fill="none">
                <path d="M11.154 5.72H0V4.444H11.154C12.65 4.444 13.442 4.862 14.74 4.862V4.796C12.188 3.652 11.242 2.376 10.384 1.056L11.638 0C12.892 2.31 14.212 3.608 16.588 4.686V5.456C14.212 6.534 12.892 7.854 11.638 10.164L10.384 9.086C11.242 7.788 12.188 6.512 14.74 5.368V5.302C13.442 5.302 12.628 5.72 11.154 5.72Z" fill="#F6F6EC"/>
              </svg>
            </span>
          </button>
        </div>
      </a>
    </article>
  `;
}

// ==========================================
// STEP 6: INIT
// ==========================================
async function init() {
  try {
    document.getElementById("behandlingerContainer").innerHTML = '<div class="loading font-hedvig">Henter behandlinger...</div>';
    allBehandlinger = await getBehandlinger();
    renderFilterButtons(false);
    renderBehandlinger();
  } catch (error) {
    console.error("Fejl ved hentning:", error);
    document.getElementById("behandlingerContainer").innerHTML = '<p class="error font-hedvig">Kunne ikke hente behandlinger. Prøv igen senere.</p>';
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
