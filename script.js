/* ===================================================================
   ASTROFISH — script.js
   Índice rápido de este archivo:
   1) CONFIG     -> tus IDs/keys y números de respaldo
   2) contentData -> AQUÍ AÑADES CADA VIDEO/MOD NUEVO
   3) Render del catálogo + filtros
   4) Contadores de YouTube y TikTok (en vivo)
   5) Menú móvil + arranque
=================================================================== */

/* ===================================================================
   1) CONFIG
   Rellena esto con tus propios datos. Mientras no conectes
   una API real, los números "fallback" son los que se
   muestren en pantalla (edítaloS a mano cuando quieras).
=================================================================== */
const CONFIG = {
  youtube: {
    channelId: "PON_AQUI_TU_CHANNEL_ID", // Ej: UCxxxxxxxxxxxxxxxxxxxxxxxxxxx (NO es el @handle)
    apiKey: "",                           // Tu API key de YouTube Data API v3
    fallbackCount: "285",                 // Número que se muestra si no hay API conectada
  },
  tiktok: {
    username: "astrofishxd",
    fallbackCount: "48",                  // Número que se muestra si no hay API conectada
  },
};

/* ===================================================================
   2) CONTENT DATA — tu catálogo de videos/mods
   -----------------------------------------------------------
   Para añadir un video o mod nuevo, copia un objeto entero
   (desde { hasta }; ) y pégalo dentro de los corchetes de
   abajo, luego edita sus valores. No necesitas tocar nada
   más del archivo.

   Campos:
   - id                identificador único (cualquier texto/número)
   - section:          "video" (va en la sección "Videos", sin filtros
                       ni botones de descarga) o "descarga" (va en la
                       sección "Descargar Addons", con filtro por tag
                       y botones de descarga)
   - title:            título de la tarjeta
   - tag:              una de "java" | "addon" | "textura" | "shader"
                       (debe coincidir con los data-filter del HTML;
                       en items de tipo "video" solo se usa para la
                       etiqueta visual, no filtra nada)
   - tagLabel:         texto que se ve en la etiqueta de la tarjeta
   - thumbnail:        ruta o URL de la miniatura
   - videoUrl:         link al vídeo de YouTube
   - description:      descripción corta (1-2 frases)
   - date:             fecha de publicación (YYYY-MM-DD) para ordenar
                       automáticamente los videos más nuevos primero
   - gameVersion:      versión de Minecraft compatible (ej. "1.21")
                       para que el usuario sepa si es compatible
   - downloads:        lista de botones de descarga, cada uno con
                       { label: "texto del botón", url: "link" }
                       Puedes dejar el arreglo vacío [] si el vídeo
                       no tiene descarga asociada (lo normal para
                       section: "video").
=================================================================== */
const contentData = [
  {
    id: "video-001",
    section: "video",
    title: "Me pasé Minecraft",
    tag: "java",
    tagLabel: "Vídeo",
    thumbnail: "assets/thumb-generic.png",
    videoUrl: "https://www.youtube.com/@AstrofishXD",
    description: "Playthrough completo: del día 1 hasta vencer al Ender Dragon.",
    date: "2026-08-20",
    gameVersion: "1.21",
    downloads: [],
  },
  {
    id: "addon-002",
    section: "descarga",
    title: "Addon de terror (Java)",
    tag: "java",
    tagLabel: "Java",
    thumbnail: "assets/thumb-terror.png",
    videoUrl: "https://www.youtube.com/@AstrofishXD",
    description: "Un addon de terror para pasar miedo en tu mundo de Java.",
    date: "2026-08-19",
    gameVersion: "1.20.1",
    downloads: [
      { label: "Descargar addon", url: "#" },
    ],
  },
  {
    id: "java-001",
    section: "descarga",
    title: "Top 5 mods de Java que cambian el juego",
    tag: "java",
    tagLabel: "Java",
    thumbnail: "assets/thumb-java.png",
    videoUrl: "https://www.youtube.com/@AstrofishXD",
    description: "Los mods de Java que más uso ahora mismo, con enlaces directos a cada uno.",
    date: "2026-08-18",
    gameVersion: "1.20.1",
    downloads: [
      { label: "Descargar mod 1", url: "#" },
      { label: "Descargar mod 2", url: "#" },
    ],
  },
  {
    id: "addon-001",
    section: "descarga",
    title: "Addon de dragones para Bedrock",
    tag: "addon",
    tagLabel: "Bedrock / Addon",
    thumbnail: "assets/thumb-addon.png",
    videoUrl: "https://www.youtube.com/@AstrofishXD",
    description: "Nuevas criaturas, huevos y mecánicas de crianza para tu mundo de Bedrock.",
    date: "2026-08-17",
    gameVersion: "1.21",
    downloads: [
      { label: "Descargar .mcaddon", url: "#" },
    ],
  },
  {
    id: "textura-001",
    section: "descarga",
    title: "Pack de texturas realista 32x",
    tag: "textura",
    tagLabel: "Texturas",
    thumbnail: "assets/thumb-textura.png",
    videoUrl: "https://www.youtube.com/@AstrofishXD",
    description: "Texturas más realistas sin perder el rendimiento en gama media.",
    date: "2026-08-16",
    gameVersion: "1.21",
    downloads: [
      { label: "Descargar pack", url: "#" },
    ],
  },
  {
    id: "shader-001",
    section: "descarga",
    title: "El shader más liviano para PC de gama baja",
    tag: "shader",
    tagLabel: "Shaders",
    thumbnail: "assets/thumb-shader.png",
    videoUrl: "https://www.youtube.com/@AstrofishXD",
    description: "Sombras, agua y luces mejoradas sin matar tus FPS.",
    date: "2026-08-15",
    gameVersion: "1.21",
    downloads: [
      { label: "Descargar shader", url: "#" },
    ],
  },
  {
    id: "java-002",
    section: "descarga",
    title: "Cómo instalar Forge paso a paso (2026)",
    tag: "java",
    tagLabel: "Java",
    thumbnail: "assets/thumb-generic.png",
    videoUrl: "https://www.youtube.com/@AstrofishXD",
    description: "Tutorial completo para dejar Forge funcionando en menos de 5 minutos.",
    date: "2026-08-14",
    gameVersion: "1.20.1",
    downloads: [],
  },
];

/* ===================================================================
   3) RENDER DEL CATÁLOGO + FILTROS
=================================================================== */

/** Construye el HTML de una sola tarjeta a partir de un objeto de contentData */
function buildCardHTML(item) {
  const downloadsHTML = item.downloads
    .map(
      (d) =>
        `<a class="btn btn--ghost btn--small" href="${d.url}" target="_blank" rel="noopener">${d.label}</a>`
    )
    .join("");

  const gameVersionLabel = item.gameVersion ? `<span class="card__game-version">v${item.gameVersion}</span>` : "";

  return `
    <article class="card" data-tag="${item.tag}">
      <div class="card__thumb-wrap">
        <img class="card__thumb" src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
        <span class="card__tag card__tag--${item.tag}">${item.tagLabel}</span>
        ${gameVersionLabel}
      </div>
      <div class="card__body">
        <h3 class="card__title">${item.title}</h3>
        <p class="card__desc">${item.description}</p>
        <div class="card__actions">
          <a class="btn btn--primary btn--small" href="${item.videoUrl}" target="_blank" rel="noopener">Ver vídeo</a>
          ${downloadsHTML}
        </div>
      </div>
    </article>
  `;
}

/** Pinta la sección "Vídeos": todo item con section: "video", sin filtros */
function renderVideos() {
  const grid = document.getElementById("videos-grid");
  const items = contentData.filter((item) => item.section === "video");

  if (items.length === 0) {
    grid.innerHTML = `<p class="cards-grid__empty">Todavía no hay vídeos cargados.</p>`;
    return;
  }

  // Ordena por fecha (más nuevos primero)
  items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  grid.innerHTML = items.map(buildCardHTML).join("");
}

/** Pinta la sección "Descargar Addons": solo section: "descarga", filtrando por tag ("all" = sin filtro) */
function renderAddons(filter = "all") {
  const grid = document.getElementById("cards-grid");
  const pool = contentData.filter((item) => item.section === "descarga");
  const items = filter === "all" ? pool : pool.filter((item) => item.tag === filter);

  if (items.length === 0) {
    grid.innerHTML = `<p class="cards-grid__empty">Todavía no hay contenido con esta etiqueta.</p>`;
    return;
  }

  // Ordena por fecha (más nuevos primero)
  items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  grid.innerHTML = items.map(buildCardHTML).join("");
}

/** Conecta los botones de filtro: clic -> re-renderiza sin recargar la página */
function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderAddons(btn.dataset.filter);
    });
  });
}

/* ===================================================================
   4) CONTADORES DE YOUTUBE Y TIKTOK EN VIVO
   -----------------------------------------------------------
   Por defecto la web muestra los números "fallback" de CONFIG.
   Cuando quieras datos en vivo, sigue una de estas dos vías:

   VÍA A — YouTube Data API v3 (oficial, gratis, con cuota diaria)
      1. Crea un proyecto en Google Cloud Console y activa
         "YouTube Data API v3".
      2. Genera una API key y pégala en CONFIG.youtube.apiKey.
      3. Pon tu channelId real (no el @handle) en
         CONFIG.youtube.channelId. Lo encuentras en la sección
         "Acerca de" de tu canal o con herramientas online.
      4. Descomenta el bloque fetch() de fetchYouTubeStats().

   ⚠️ OJO: exponer una API key en JS del lado del cliente la
      deja visible para cualquiera que vea el código fuente.
      Para un canal pequeño normalmente no pasa nada grave
      (restringe la key a "YouTube Data API v3" y a tu dominio
      en Google Cloud), pero si prefieres ocultarla del todo,
      monta un pequeño backend/proxy (Vercel Functions,
      Cloudflare Workers, etc.) que guarde la key en el servidor
      y tu página llame a TU endpoint en vez de a Google directo.

   VÍA B — TikTok
      TikTok no ofrece una API pública simple para "seguidores
      de un perfil" sin aprobación de desarrollador. Opciones:
         - Usar un servicio de terceros tipo RapidAPI que
           exponga "TikTok user info" (busca "TikTok API"
           en RapidAPI) y llamarlo igual que el ejemplo de abajo.
         - Mantener tu propio endpoint (por ejemplo una función
           serverless que scrapea o usa una librería no oficial)
           y apuntar fetch() ahí.
         - O, más simple para un canal chico: actualizar
           CONFIG.tiktok.fallbackCount a mano cada semana.
=================================================================== */

async function fetchYouTubeStats() {
  const el = document.getElementById("yt-sub-count");
  const elBig = document.getElementById("yt-sub-count-big");

  // Mientras no haya API conectada, se usa el número de respaldo.
  if (!CONFIG.youtube.apiKey || !CONFIG.youtube.channelId || CONFIG.youtube.channelId.startsWith("PON_AQUI")) {
    el.textContent = CONFIG.youtube.fallbackCount;
    elBig.textContent = CONFIG.youtube.fallbackCount;
    return;
  }

  try {
    // --- DESCOMENTA ESTE BLOQUE CUANDO TENGAS API KEY + CHANNEL ID ---
    /*
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CONFIG.youtube.channelId}&key=${CONFIG.youtube.apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const raw = data.items[0].statistics.subscriberCount; // número exacto, ej "1234"
    const formatted = formatCount(raw);
    el.textContent = formatted;
    elBig.textContent = formatted;
    return;
    */

    // Mientras el bloque de arriba esté comentado, cae aquí:
    el.textContent = CONFIG.youtube.fallbackCount;
    elBig.textContent = CONFIG.youtube.fallbackCount;
  } catch (err) {
    console.error("No se pudo obtener el conteo de YouTube:", err);
    el.textContent = CONFIG.youtube.fallbackCount;
    elBig.textContent = CONFIG.youtube.fallbackCount;
  }
}

async function fetchTikTokStats() {
  const el = document.getElementById("tiktok-follower-count");
  const elBig = document.getElementById("tiktok-follower-count-big");

  try {
    // --- EJEMPLO con un endpoint propio o de terceros ---
    // Sustituye la URL por tu endpoint real (backend propio o
    // el que te dé tu servicio de RapidAPI, etc.)
    /*
    const res = await fetch(`https://TU-ENDPOINT.ejemplo.com/tiktok/${CONFIG.tiktok.username}`);
    const data = await res.json();
    const formatted = formatCount(data.followerCount);
    el.textContent = formatted;
    elBig.textContent = formatted;
    return;
    */

    // Sin endpoint conectado, se usa el número de respaldo:
    el.textContent = CONFIG.tiktok.fallbackCount;
    elBig.textContent = CONFIG.tiktok.fallbackCount;
  } catch (err) {
    console.error("No se pudo obtener el conteo de TikTok:", err);
    el.textContent = CONFIG.tiktok.fallbackCount;
    elBig.textContent = CONFIG.tiktok.fallbackCount;
  }
}

/** Convierte 12345 -> "12.3K" para que los badges no se vean gigantes */
function formatCount(n) {
  const num = Number(n);
  if (isNaN(num)) return n;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return String(num);
}

/* ===================================================================
   5) MENÚ MÓVIL + ARRANQUE
=================================================================== */
function setupMobileNav() {
  const toggle = document.getElementById("navbar-toggle");
  const links = document.getElementById("navbar-links");

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Cierra el menú al tocar un link (útil en móvil)
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderVideos();
  renderAddons("all");
  setupFilters();
  setupMobileNav();
  fetchYouTubeStats();
  fetchTikTokStats();

  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
