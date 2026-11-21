
// ILM Books — Supabase connected frontend

const SUPABASE_URL = "https://vhrvnoieffuocrbhoxpt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_X5tEnStHRyqJCA8jPkaM2Q_u6Y81MGq";

// Connect to Supabase
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Website elements
const grid = document.querySelector("#bookGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const priceFilter = document.querySelector("#priceFilter");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const categoryGrid = document.querySelector("#categoryGrid");

let books = [];

const colors = [
  "#315c4c", "#8b583e", "#344b70",
  "#a17b3e", "#62537c", "#47736b"
];

// Safely display text
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

// Format book price
function money(book) {
  if (book.is_free) return "Free";

  return `KSh ${Number(book.price_kes).toLocaleString()}`;
}

// Load published books from Supabase
async function loadBooks() {
  if (!grid) {
    console.error("ILM Books: #bookGrid was not found in index.html.");
    return;
  }

  grid.innerHTML = "<p>Loading books...</p>";

  try {
    const { data, error } = await db
      .from("books")
      .select(`
        id,
        title,
        description,
        category,
        language,
        price_kes,
        is_free,
        authors(name)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    books = data || [];

    // Populate category filter
    if (categoryFilter) {
      const categories = [...new Set(
        books.map(book => book.category).filter(Boolean)
      )].sort();

      categoryFilter.innerHTML =
        '<option value="all">All categories</option>';

      categories.forEach(category => {
        categoryFilter.add(new Option(category, category));
      });
    }

    renderBooks();
    renderCategories();

  } catch (error) {
    console.error("ILM Books Supabase error:", error);

    grid.textContent =
      "Unable to load books: " + (error.message || "Unknown error");

    if (resultCount) {
      resultCount.textContent = "Loading failed";
    }
  }
}

// Display and filter books
function renderBooks() {
  if (!grid) return;

  const term = searchInput?.value.trim().toLowerCase() || "";
  const category = categoryFilter?.value || "all";
  const price = priceFilter?.value || "all";

  const filtered = books.filter(book => {
    const author = book.authors?.name || "Unknown author";

    return (
      (category === "all" || book.category === category) &&
      (
        price === "all" ||
        (price === "free" && book.is_free) ||
        (price === "paid" && !book.is_free)
      ) &&
      `${book.title || ""} ${author} ${book.category || ""}`
        .toLowerCase()
        .includes(term)
    );
  });

  if (resultCount) {
    resultCount.textContent = `${filtered.length} books`;
  }

  if (filtered.length === 0) {
    grid.innerHTML =
      '<div class="empty-state">No published books found yet.</div>';
    return;
  }

  grid.innerHTML = filtered.map((book, index) => {
    const title = escapeHTML(book.title || "Untitled book");
    const author = escapeHTML(
      book.authors?.name || "Unknown author"
    );
    const categoryName = escapeHTML(book.category || "General");
    const initial = escapeHTML(
      (book.title || "Book").slice(0, 12).toUpperCase()
    );
    const color = colors[index % colors.length];

    return `
      <article class="book-card">
        <div class="book-cover" style="background:${color}">
          <strong>${initial}</strong>
        </div>

        <div class="book-info">
          <span class="book-tag">
            ${book.is_free ? "FREE" : "PAID"}
          </span>

          <h3>${title}</h3>

          <p class="book-author">
            by ${author} · ${categoryName}
          </p>

          <div class="book-bottom">
            <span class="price">${money(book)}</span>
            <span>${escapeHTML(book.language || "English")}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Display categories
function renderCategories() {
  if (!categoryGrid) return;

  const categories = [...new Set(
    books.map(book => book.category).filter(Boolean)
  )].sort();

  const icons = {
    Education: "✦",
    Literature: "❝",
    History: "◷",
    Philosophy: "◇",
    Science: "⚗"
  };

  categoryGrid.innerHTML = categories.map(category => `
    <button class="category-tile"
      data-category="${escapeHTML(category)}">
      <span class="category-icon">
        ${icons[category] || "✦"}
      </span>
      ${escapeHTML(category)}
      <span>→</span>
    </button>
  `).join("");
}

// Search and filters
[searchInput, categoryFilter, priceFilter]
  .filter(Boolean)
  .forEach(element => {
    element.addEventListener("input", renderBooks);
  });

// Category selection
if (categoryGrid) {
  categoryGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button || !categoryFilter) return;

    categoryFilter.value = button.dataset.category;
    renderBooks();

    document.querySelector("#discover")
      ?.scrollIntoView({ behavior: "smooth" });
  });
}

// Mobile navigation
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });
}

// Newsletter placeholder
const newsletterForm =
  document.querySelector("#newsletterForm");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    const message =
      document.querySelector("#newsletterMessage");

    if (message) {
      message.textContent =
        "Newsletter registration will be available soon.";
    }

    newsletterForm.reset();
  });
}

// Footer year
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Start ILM Books
loadBooks();
