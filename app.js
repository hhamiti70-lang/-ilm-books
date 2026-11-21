// ILM Books starter frontend. Demo catalogue only; connect Supabase in a later step.
const books = [
  {title:"The Art of Learning",author:"A. Rahman",category:"Education",price:0,tag:"FREE",color:"#315c4c",initial:"LEARN"},
  {title:"Paths of Wisdom",author:"M. Hassan",category:"Philosophy",price:250,tag:"POPULAR",color:"#8b583e",initial:"WISDOM"},
  {title:"A Short History of Ideas",author:"N. Yusuf",category:"History",price:350,tag:"NEW",color:"#344b70",initial:"IDEAS"},
  {title:"The Writer's Notebook",author:"S. Ali",category:"Literature",price:0,tag:"FREE",color:"#a17b3e",initial:"WRITE"},
  {title:"Foundations of Knowledge",author:"I. Ahmed",category:"Education",price:400,tag:"FEATURED",color:"#62537c",initial:"KNOWLEDGE"},
  {title:"Stories Across Worlds",author:"F. Omar",category:"Literature",price:180,tag:"NEW",color:"#47736b",initial:"STORIES"},
  {title:"The World of Science",author:"H. Noor",category:"Science",price:300,tag:"POPULAR",color:"#48677b",initial:"SCIENCE"},
  {title:"Understanding Society",author:"A. Osman",category:"History",price:0,tag:"FREE",color:"#8c6654",initial:"SOCIETY"}
];
const categories = ["Education","Literature","History","Philosophy","Science"];
const grid = document.querySelector("#bookGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const priceFilter = document.querySelector("#priceFilter");
const searchInput = document.querySelector("#searchInput");
categories.forEach(c => categoryFilter.add(new Option(c,c)));
document.querySelector("#year").textContent = new Date().getFullYear();

function renderBooks(){
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;
  const filtered = books.filter(b =>
    (category==="all" || b.category===category) &&
    (price==="all" || (price==="free" ? b.price===0 : b.price>0)) &&
    `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(term)
  );
  document.querySelector("#resultCount").textContent = `${filtered.length} books`;
  grid.innerHTML = filtered.length ? filtered.map(b => `
    <article class="book-card">
      <div class="book-cover" style="background:${b.color}"><strong>${b.initial}</strong></div>
      <div class="book-info"><span class="book-tag">${b.tag}</span><h3>${b.title}</h3>
      <p class="book-author">by ${b.author} · ${b.category}</p>
      <div class="book-bottom"><span class="price">${b.price===0?"Free":`KSh ${b.price}`}</span><span>Details coming soon</span></div></div>
    </article>`).join("") : `<div class="empty-state">No books match your search. Try another title or category.</div>`;
}
function renderCategories(){
  const icons = {"Education":"✦","Literature":"❝","History":"◷","Philosophy":"◇","Science":"⚗"};
  document.querySelector("#categoryGrid").innerHTML = categories.map(c =>
    `<button class="category-tile" data-category="${c}"><span class="category-icon">${icons[c]}</span>${c}<span>→</span></button>`
  ).join("");
}
[searchInput,categoryFilter,priceFilter].forEach(el=>el.addEventListener("input",renderBooks));
renderCategories(); renderBooks();
document.querySelector("#categoryGrid").addEventListener("click",e=>{
  const button=e.target.closest("[data-category]"); if(!button)return;
  categoryFilter.value=button.dataset.category; renderBooks();
  document.querySelector("#discover").scrollIntoView({behavior:"smooth"});
});
document.querySelector("#menuToggle").addEventListener("click",()=>document.querySelector("#mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.querySelector("#mainNav").classList.remove("open")));
document.querySelector("#newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.querySelector("#newsletterMessage").textContent="Thanks! Newsletter signup will be connected when the backend is added.";
  e.target.reset();
});
