
// ILM Books — Supabase connected frontend

const SUPABASE_URL = "https://vhrvnoieffuocrbhoxpt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_X5tEnStHRyqJCA8jPkaM2Q_u6Y81MGq";

// Connect to Supabase
const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const grid = document.querySelector("#bookGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const priceFilter = document.querySelector("#priceFilter");
const searchInput = document.querySelector("#searchInput");

let books = [];

const colors = [
  "#315c4c", "#8b583e", "#344b70",
  "#a17b3e", "#62537c", "#47736b"
];

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function money(book) {
  return book.is_free 
    ? "Free"
    : `KSh ${Number(book.price_kes).toLocaleString()}`;
}

// Retrieve published books from Supabase
async function loadBooks() {
  grid.innerHTML = '<p>Loading books...</p>';

  const { data, error } = await db
    .from("books")
    .select("id, title, description, category, language, price_kes, is_free, authors(name)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    grid.innerHTML =
      '<p class="empty-state">Unable to load books. Please try again later.</p>';
    document.querySelector("#resultCount").textContent = "Connection error";
    return;
  }

  books = data || [];

  // Populate categories from real books
  const categories = [...new Set(
    books.map(book => book.category).filter(Boolean)
  )].sort();

  categoryFilter.innerHTML =
    '<option value="all">All categories</option>';

  categories.forEach(category => {
    categoryFilter.add(
      new Option(category, category)
    );
  });

  renderBooks();
}

// Display books
function renderBooks() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;

  const filtered = books.filter(book => {
    const author = book.authors?.name || "Unknown author";

    return (
      (category === "all" || book.category === category) &&
      (price === "all" ||
        (price === "free" && book.is_free) ||
        (price === "paid" && !book.is_free)) &&
      `${book.title} ${author} ${book.category || ""}`
        .toLowerCase().includes(term)
    );
  });

  document.querySelector("#resultCount").textContent =
    `${filtered.length} books`;

  grid.innerHTML = filtered.length
    ? filtered.map((book, index) => {
        const title = escapeHTML(book.title);
        const author = escapeHTML(
          book.authors?.name || "Unknown author"
        );
        const categoryName = escapeHTML(
          book.category || "General"
        );
        const initial = escapeHTML(
          book.title.slice(0, 12).toUpperCase()
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
      }).join("")
    : '<div class="empty-state">No published books found yet.</div>';
}

// Categories
function renderCategories() {
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

  document.querySelector("#categoryGrid").innerHTML =
    categories.map(category => `
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
  .forEach(element =>
    element.addEventListener("input", renderBooks)
  );

// Category selection
document.querySelector("#categoryGrid")
  .addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    categoryFilter.value = button.dataset.category;
    renderBooks();

    document.querySelector("#discover")
      .scrollIntoView({ behavior: "smooth" });
  });

// Mobile navigation
document.querySelector("#menuToggle")
  .addEventListener("click", () => {
    document.querySelector("#mainNav")
      .classList.toggle("open");
  });

document.querySelectorAll("#mainNav a")
  .forEach(link => {
    link.addEventListener("click", () => {
      document.querySelector("#mainNav")
        .classList.remove("open");
    });
  });

// Newsletter placeholder
document.querySelector("#newsletterForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    document.querySelector("#newsletterMessage")
      .textContent =
      "Newsletter registration will be available soon.";

    event.target.reset();
  });

// Footer year
document.querySelector("#year").textContent =
  new Date().getFullYear();

// Start the application
loadBooks().then(() => renderCategories());
