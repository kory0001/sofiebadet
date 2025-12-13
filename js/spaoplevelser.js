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
        <div class="kategori__header">
          <h2 class="kategori__title font-editorial">${kategori}</h2>
          ${
            behandlinger[0].introTekst
              ? `
            <p class="kategori__intro font-editorial-italic">${behandlinger[0].introTekst}</p>
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
    <article class="card ${behandling.kundefavorit ? "card--featured" : ""}">
      <a href="behandling.html?slug=${behandling.slug}" class="card__link">
        
        <!-- VENSTRE KOLONNE: Tekst -->
        <div class="card__content">
          <h3 class="card__title font-buvera">${behandling.navn}</h3>
          
          <p class="card__description font-hedvig">${behandling.kortBeskrivelse}<span class="card__read-more font-buvera">Læs mere 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16.1379 13.4416H0V11.5584H16.1379C18.3024 11.5584 19.4483 12.1753 21.3263 12.1753V12.0779C17.634 10.3896 16.2653 8.50649 15.0239 6.55844L16.8382 5C18.6525 8.40909 20.5623 10.3247 24 11.9156V13.0519C20.5623 14.6429 18.6525 16.5909 16.8382 20L15.0239 18.4091C16.2653 16.4935 17.634 14.6104 21.3263 12.9221V12.8247C19.4483 12.8247 18.2706 13.4416 16.1379 13.4416Z" fill="#321600"/>
            </svg>
          </span></p>
          
   
           
          
          <div class="card__meta font-hedvig">
            <span>${behandling.varighed}</span>
            <span>•</span>
            <span>${behandling.personer}</span>
          </div>
        </div>
        
        <!-- HØJRE KOLONNE: Pris + Knap -->
        <div class="card__aside">
          <div class="card__pricing">
            ${
              behandling.prisOriginal
                ? `
              <span class="card__price card__price--old font-editorial-italic">${behandling.prisOriginal},- pr. person</span>
            `
                : ""
            }
            <span class="card__price card__price--current font-editorial-italic">${behandling.pris},- pr. person</span>
          </div>
          
          <button class="card__button font-hedvig">
            Book tid  <span><svg xmlns="http://www.w3.org/2000/svg" width="17" height="11" viewBox="0 0 17 11" fill="none">
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
