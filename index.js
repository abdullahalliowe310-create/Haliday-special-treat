/* Replace with your real WhatsApp number: country code + number, no plus or spaces */
var WA_NUMBER = "2349042414897";

/* HOW TO ADD YOUR PHOTOS: each dish has an img: field. Replace it with your own
   file path (e.g. "images/jollof.jpg") or a full image link. */
var HERO_IMG = "images/hero.jpg";

var MENU = [
  {id:1,img:"images/jollof-chicken.jpg",n:"Party Jollof & Chicken",d:"Smoky party jollof with grilled chicken and fried plantain.",p:3500,c:"Rice",e:"🍛",bg:"#ffd9c2"},
  {id:2,img:"images/fried-rice-turkey.jpg",n:"Fried Rice & Turkey",d:"Veggie-loaded fried rice with peppered turkey.",p:4000,c:"Rice",e:"🍚",bg:"#fff0b8"},
  {id:3,img:"images/pounded-yam-egusi.jpg",n:"Pounded Yam & Egusi",d:"Soft pounded yam with rich egusi and assorted meat.",p:4500,c:"Swallow",e:"🥘",bg:"#d8ecc8"},
  {id:4,img:"images/amala-gbegiri.jpg",n:"Amala, Gbegiri & Ewedu",d:"Classic Yoruba combo with stew and beef.",p:3800,c:"Swallow",e:"🍲",bg:"#e6d5c0"},
  {id:5,img:"images/small-chops.jpg",n:"Small Chops Platter",d:"Puff-puff, samosa, spring rolls and peppered gizzard.",p:6500,c:"Small chops",e:"🍤",bg:"#ffd1d9"},
  {id:6,img:"images/suya-wrap.jpg",n:"Suya Wrap",d:"Spicy beef suya, onions and cool cabbage in a warm wrap.",p:2800,c:"Small chops",e:"🌯",bg:"#ffe2b0"},
  {id:7,img:"images/grilled-fish.jpg",n:"Grilled Fish & Chips",d:"Whole grilled tilapia with spicy sauce and yam chips.",p:5500,c:"Grills",e:"🐟",bg:"#cfe8f3"},
  {id:8,img:"images/bbq-wings.jpg",n:"BBQ Chicken Wings",d:"Sticky honey-pepper wings, six pieces.",p:3200,c:"Grills",e:"🍗",bg:"#ffd9c2"},
  {id:9,img:"images/zobo-chapman.jpg",n:"Zobo & Chapman Jug",d:"Chilled zobo and chapman, 1 litre.",p:2500,c:"Drinks",e:"🍹",bg:"#ffc9d4"},
  {id:10,img:"images/cake-slice.jpg",n:"Celebration Cake Slice",d:"Moist vanilla cake with buttercream.",p:2000,c:"Desserts",e:"🍰",bg:"#f3dcff"},
    {id:11,img:"images/birthday-cake.jpg",n:"Birthday Cake (8 inch)",d:"Soft vanilla or chocolate cake with buttercream and your custom message. Serves 10 to 15.",p:35000,c:"Cakes",e:"🎂",bg:"#ffd1e8"},
  {id:12,img:"images/ceremony-cake.jpg",n:"Ceremony Tiered Cake",d:"Two-tier cake for weddings, naming ceremonies and anniversaries, decorated to match your colours. Serves 40 to 60.",p:120000,c:"Cakes",e:"🎂",bg:"#e8dcff"},
  {id:13,img:"images/custom-cake.jpg",n:"Custom Design Cake",d:"Any theme you like, from graduation to baby shower. Send us your idea and we will quote it. Serves 20 to 30.",p:65000,c:"Cakes",e:"🧁",bg:"#ffe2b0"}
];

var cart = {};
var cat = "All";

function $(s){ return document.querySelector(s); }
function naira(n){ return "₦" + n.toLocaleString("en-NG"); }
function findItem(id){ return MENU.filter(function(x){ return x.id == id; })[0]; }
function pic(m){
  return '<img src="' + m.img + '" alt="' + m.n + '" loading="lazy" data-e="' + m.e + '">';
}

/* If a photo is missing, show the emoji instead of a broken image */
document.addEventListener("error", function(e){
  var t = e.target;
  if (t.tagName === "IMG" && t.dataset.e) {
    var span = document.createElement("span");
    span.textContent = t.dataset.e;
    t.replaceWith(span);
  }
}, true);

function renderFilters(){
  var cats = ["All"];
  MENU.forEach(function(m){ if (cats.indexOf(m.c) < 0) cats.push(m.c); });
  $("#filters").innerHTML = cats.map(function(c){
    return '<button class="' + (c === cat ? "on" : "") + '" data-c="' + c + '">' + c + '</button>';
  }).join("");
}

function renderGrid(){
  $("#grid").innerHTML = MENU.filter(function(m){
    return cat === "All" || m.c === cat;
  }).map(function(m){
    return '<article class="item">' +
      '<div class="pic" style="background:' + m.bg + '">' + pic(m) + '</div>' +
      '<div class="body"><h3>' + m.n + '</h3><p>' + m.d + '</p>' +
      '<div class="row"><span class="price">' + naira(m.p) + '</span>' +
      '<button class="add" data-add="' + m.id + '" aria-label="Add ' + m.n + '">+</button></div></div>' +
      '</article>';
  }).join("");
}

function renderCart(){
  var ids = Object.keys(cart), count = 0, sum = 0;
  ids.forEach(function(id){
    count += cart[id];
    sum += findItem(id).p * cart[id];
  });
  $("#count").textContent = count;
  $("#total").textContent = naira(sum);
  $("#lines").innerHTML = ids.length ? ids.map(function(id){
    var m = findItem(id);
    return '<div class="line"><span class="e">' + pic(m) + '</span>' +
      '<div><strong>' + m.n + '</strong><br><small>' + naira(m.p) + '</small></div>' +
      '<div class="qty"><button data-dec="' + id + '" aria-label="Remove one">−</button>' +
      '<span>' + cart[id] + '</span>' +
      '<button data-inc="' + id + '" aria-label="Add one">+</button></div></div>';
  }).join("") : '<p class="empty">Your cart is empty. Add a dish from the menu to start.</p>';
}

function openCart(open){
  $("#drawer").classList.toggle("on", open);
  $("#veil").classList.toggle("on", open);
}

/* One click handler for filters, add, plus, minus and package buttons */
document.addEventListener("click", function(e){
  var t = e.target;
  if (t.dataset.c) { cat = t.dataset.c; renderFilters(); renderGrid(); }
  if (t.dataset.add) {
    cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1;
    renderCart();
    $("#openCart").animate([{transform:"scale(1.15)"},{transform:"scale(1)"}], {duration:250});
  }
  if (t.dataset.inc) { cart[t.dataset.inc]++; renderCart(); }
  if (t.dataset.dec) {
    cart[t.dataset.dec]--;
    if (cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec];
    renderCart();
  }
  if (t.dataset.pkg) {
    $("#ft").value = "Event catering";
    $("#fm").value = "Package: " + t.dataset.pkg;
    location.hash = "contact";
  }
  if (t.id === "checkout") openCart(false);
});

$("#openCart").onclick = function(){ openCart(true); };
$("#closeCart").onclick = $("#veil").onclick = function(){ openCart(false); };
$("#findBtn").addEventListener("click", function(){ $("#fa").value = $("#addr").value; });

/* Send the order to WhatsApp */
$("#orderForm").addEventListener("submit", function(e){
  e.preventDefault();
  var lines = Object.keys(cart).map(function(id){
    var m = findItem(id);
    return "• " + cart[id] + " x " + m.n + " (" + naira(m.p * cart[id]) + ")";
  });
  var msg = "Hello Haliday Special Treat! I would like to order.\n\n" +
    "Name: " + $("#fn").value +
    "\nAddress: " + $("#fa").value +
    "\nType: " + $("#ft").value +
    "\nWhen: " + ($("#fd").value || "As soon as possible") +
    (lines.length ? "\n\nCart:\n" + lines.join("\n") + "\nTotal: " + $("#total").textContent : "") +
    ($("#fm").value ? "\n\nDetails: " + $("#fm").value : "");
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
});

/* Start the page */
$("#heroImg").src = HERO_IMG;
renderFilters();
renderGrid();
renderCart();