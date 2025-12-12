// ==========================================
// STEP 1: GET SLUG FROM URL
// ==========================================

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get("slug"); // → "luksus-hammam"

// ==========================================
// STEP 2: FETCH SINGLE BEHANDLING
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
  return data[0]; // Første (og eneste) resultat
}

// ==========================================
// STEP 3: RENDER BEHANDLING DETAIL
// ==========================================

async function renderBehandling() {
  try {
    const behandling = await getBehandling(slug);

    // Hvis ikke fundet
    if (!behandling) {
      document.body.innerHTML = `
        <div class="error-page">
          <h1 class="font-editorial">Behandling ikke fundet</h1>
          <a href="spaoplevelser.html" class="font-hedvig">← Tilbage til oversigt</a>
        </div>
      `;
      return;
    }

    // === HERO SECTION ===
    document.getElementById("heroTitle").textContent = behandling.navn;
    document.getElementById("sektionstitel").textContent = behandling.sektionstitel || behandling.kategori;
    document.getElementById("introText").textContent = behandling.intro_tekst;

    // === INFO CARD (VENSTRE) ===

    // Kundefavorit badge
    if (behandling.kundefavorit) {
      document.getElementById("kundefavoritBadge").style.display = "flex";
    }

    // Varighed + personer
    document.getElementById("varighed").textContent = behandling.varighed;
    document.getElementById("personer").textContent = behandling.personer;

    // Inkluderet liste
    const inkluderetHTML = behandling.inkluderet.map((item) => `<li>${item}</li>`).join("");
    document.getElementById("inkluderetListe").innerHTML = inkluderetHTML;

    // Praktisk liste
    const praktiskHTML = behandling.praktisk.map((item) => `<li>${item}</li>`).join("");
    document.getElementById("praktiskListe").innerHTML = praktiskHTML;

    // Pris
    if (behandling.pris_original) {
      document.getElementById("prisOriginal").textContent = `${behandling.pris_original},-`;
      document.getElementById("prisOriginal").style.display = "inline";
    }
    document.getElementById("prisAktuel").textContent = `${behandling.pris},- pr. person`;

    // === BESKRIVELSE (HØJRE) ===

    // Split beskrivelse på \n\n og wrap i <p> tags
    const beskrivelseHTML = behandling.lang_beskrivelse
      .split("\n\n")
      .map((afsnit) => `<p>${afsnit}</p>`)
      .join("");

    document.getElementById("beskrivelse").innerHTML = beskrivelseHTML;
  } catch (error) {
    console.error("Fejl:", error);
    document.body.innerHTML = `
      <div class="error-page">
        <h1 class="font-editorial">Der skete en fejl</h1>
        <p class="font-hedvig">${error.message}</p>
        <a href="spaoplevelser.html" class="font-hedvig">← Tilbage til oversigt</a>
      </div>
    `;
  }
}

// ==========================================
// STEP 4: INIT
// ==========================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderBehandling);
} else {
  renderBehandling();
}
