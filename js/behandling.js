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
// RENDER BEHANDLING DETAIL
// ==========================================
async function renderBehandling() {
  try {
    const behandling = await getBehandling(slug);

    // Hvis ikke fundet
    if (!behandling) {
      document.body.innerHTML = `
        <div style="padding: var(--spacing-5xl); text-align: center; background-color: var(--breeze); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <h1 class="font-editorial" style="font-size: var(--text-6xl); margin-bottom: var(--spacing-md);">Behandling ikke fundet</h1>
          <a href="spaoplevelser.html" class="font-hedvig" style="color: var(--terracotta); font-size: var(--text-xl);">← Tilbage til oversigt</a>
        </div>
      `;
      return;
    }

    // === HERO ===
    document.getElementById("heroTitle").textContent = behandling.navn;
    document.getElementById("introText").textContent = behandling.kort_intro_tekst || "";

    // === SIDEBAR ===

    // Kundefavorit badge
    if (behandling.kundefavorit) {
      document.getElementById("kundefavoritBadge").style.display = "flex";
    }

    // VARIGHED - Titel og liste
    document.getElementById("varighedTitel").textContent = `${behandling.varighed}:`;

    // Varighed beskrivelse
    if (behandling.varighed_beskrivelse && behandling.varighed_beskrivelse.length > 0) {
      const varighedHTML = behandling.varighed_beskrivelse
        .map(
          (item) => `<li>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
          <path d="M0 1.51402C1.34146 3.8271 3.08943 6.26635 7.11382 8.45327V9.54673C3.08943 11.7336 1.34146 14.1729 0 16.4439L1.58536 18C3.57724 14.2991 5.93496 11.5654 10 9.50467V8.45327C5.93496 6.39252 3.57724 3.70093 1.58536 0L0 1.51402Z" fill="#321600"/>
        </svg>
        <span>${item}</span>
      </li>`
        )
        .join("");
      document.getElementById("varighedListe").innerHTML = varighedHTML;
    }

    // Inkluderet liste
    const inkluderetHTML = behandling.inkluderet
      .map(
        (item) => `<li>
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
        <path d="M0 1.51402C1.34146 3.8271 3.08943 6.26635 7.11382 8.45327V9.54673C3.08943 11.7336 1.34146 14.1729 0 16.4439L1.58536 18C3.57724 14.2991 5.93496 11.5654 10 9.50467V8.45327C5.93496 6.39252 3.57724 3.70093 1.58536 0L0 1.51402Z" fill="#321600"/>
      </svg>
      <span>${item}</span>
    </li>`
      )
      .join("");
    document.getElementById("inkluderetListe").innerHTML = inkluderetHTML;

    // Praktisk liste
    const praktiskHTML = behandling.praktisk
      .map(
        (item) => `<li>
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
        <path d="M0 1.51402C1.34146 3.8271 3.08943 6.26635 7.11382 8.45327V9.54673C3.08943 11.7336 1.34146 14.1729 0 16.4439L1.58536 18C3.57724 14.2991 5.93496 11.5654 10 9.50467V8.45327C5.93496 6.39252 3.57724 3.70093 1.58536 0L0 1.51402Z" fill="#321600"/>
      </svg>
      <span>${item}</span>
    </li>`
      )
      .join("");
    document.getElementById("praktiskListe").innerHTML = praktiskHTML;

    // PRIS
    if (behandling.pris_original) {
      document.getElementById("prisOriginal").textContent = `${behandling.pris_original},- pr. person`;
      document.getElementById("prisOriginal").style.display = "block";
    }
    document.getElementById("prisAktuel").textContent = `${behandling.pris},- pr. person`;

    // === BESKRIVELSE ===
    const beskrivelseHTML = behandling.lang_beskrivelse
      .split("\n\n")
      .map((afsnit) => `<p>${afsnit}</p>`)
      .join("");
    document.getElementById("beskrivelse").innerHTML = beskrivelseHTML;
  } catch (error) {
    console.error("Fejl:", error);
    document.body.innerHTML = `
      <div style="padding: var(--spacing-5xl); text-align: center; background-color: var(--breeze); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 class="font-editorial" style="font-size: var(--text-6xl); margin-bottom: var(--spacing-md);">Der skete en fejl</h1>
        <p class="font-hedvig" style="font-size: var(--text-xl); margin-bottom: var(--spacing-md);">${error.message}</p>
        <a href="spaoplevelser.html" class="font-hedvig" style="color: var(--terracotta); font-size: var(--text-xl);">← Tilbage til oversigt</a>
      </div>
    `;
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
