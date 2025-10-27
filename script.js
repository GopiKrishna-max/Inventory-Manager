
let current = JSON.parse(localStorage.getItem("inv_current")) || [];
let incoming = JSON.parse(localStorage.getItem("inv_incoming")) || [];
let outgoing = JSON.parse(localStorage.getItem("inv_outgoing")) || [];


const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".section");


const curTableBody = document.querySelector("#currentTable tbody");
const incTableBody = document.querySelector("#incomingTable tbody");
const outTableBody = document.querySelector("#outgoingTable tbody");


const curName = document.getElementById("curName");
const curBrand = document.getElementById("curBrand");
const curQty = document.getElementById("curQty");
const curPrice = document.getElementById("curPrice");
const curAddBtn = document.getElementById("curAddBtn");
const curResetBtn = document.getElementById("curResetBtn");
const clearInventoryBtn = document.getElementById("clearInventory");


const incName = document.getElementById("incName");
const incBrand = document.getElementById("incBrand");
const incQty = document.getElementById("incQty");
const incPrice = document.getElementById("incPrice");
const incAddBtn = document.getElementById("incAddBtn");
const incResetBtn = document.getElementById("incResetBtn");


const outName = document.getElementById("outName");
const outBrand = document.getElementById("outBrand");
const outQty = document.getElementById("outQty");
const outPrice = document.getElementById("outPrice");
const outAddBtn = document.getElementById("outAddBtn");
const outResetBtn = document.getElementById("outResetBtn");


document.getElementById("clearAll").addEventListener("click", () => {
  if (!confirm("Clear ALL saved data (all lists)?")) return;
  localStorage.removeItem("inv_current");
  localStorage.removeItem("inv_incoming");
  localStorage.removeItem("inv_outgoing");
  current = []; incoming = []; outgoing = [];
  renderAll();
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.target;
    sections.forEach(s => {
      if (s.id === target) s.classList.add("active");
      else s.classList.remove("active");
    });
  });
});


function saveAll() {
  localStorage.setItem("inv_current", JSON.stringify(current));
  localStorage.setItem("inv_incoming", JSON.stringify(incoming));
  localStorage.setItem("inv_outgoing", JSON.stringify(outgoing));
}

function renderCurrent() {
  curTableBody.innerHTML = "";
  current.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${item.name}</td>
      <td>${item.brand}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editCurrent(${i})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteCurrent(${i})">Delete</button>
        <button class="action-btn move-btn" onclick="moveToOutgoing(${i})">Move → Outgoing</button>
      </td>
    `;
    curTableBody.appendChild(tr);
  });
}

function renderIncoming() {
  incTableBody.innerHTML = "";
  incoming.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${item.name}</td>
      <td>${item.brand}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editIncoming(${i})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteIncoming(${i})">Delete</button>
        <button class="action-btn move-btn" onclick="receiveIncoming(${i})">Receive → Current</button>
      </td>
    `;
    incTableBody.appendChild(tr);
  });
}

function renderOutgoing() {
  outTableBody.innerHTML = "";
  outgoing.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${item.name}</td>
      <td>${item.brand}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editOutgoing(${i})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteOutgoing(${i})">Delete</button>
        <button class="action-btn move-btn" onclick="dispatchOutgoing(${i})">Dispatch → (remove)</button>
      </td>
    `;
    outTableBody.appendChild(tr);
  });
}

function renderAll() {
  renderCurrent();
  renderIncoming();
  renderOutgoing();
  saveAll();
}


curAddBtn.addEventListener("click", () => {
  const name = curName.value.trim(), brand = curBrand.value.trim();
  const quantity = Number(curQty.value), price = Number(curPrice.value);
  if (!name || !brand || !quantity || !price) { alert("Fill all fields"); return; }
  current.push({ name, brand, quantity, price });
  clearCurrentForm(); renderAll();
});
curResetBtn.addEventListener("click", clearCurrentForm);
clearInventoryBtn.addEventListener("click", () => { if(confirm("Clear CURRENT inventory?")) { current = []; renderAll(); }});
function clearCurrentForm(){ curName.value=""; curBrand.value=""; curQty.value=""; curPrice.value=""; }
window.editCurrent = function(i){
  const it = current[i];
  curName.value = it.name; curBrand.value = it.brand; curQty.value = it.quantity; curPrice.value = it.price;
  
  curAddBtn.onclick = function update(){ 
    const name = curName.value.trim(), brand = curBrand.value.trim(), quantity = Number(curQty.value), price = Number(curPrice.value);
    if(!name||!brand||!quantity||!price){ alert("Fill all fields"); return; }
    current[i] = {name,brand,quantity,price}; curAddBtn.onclick = null;
    curAddBtn.addEventListener("click", () => {});
    clearCurrentForm(); renderAll(); 
    
    curAddBtn.onclick = null;
    curAddBtn.addEventListener("click", ()=>{ 
      const n = curName.value.trim(), b = curBrand.value.trim(), q = Number(curQty.value), p = Number(curPrice.value);
      if (!n||!b||!q||!p){ alert("Fill all fields"); return; }
      current.push({name:n,brand:b,quantity:q,price:p}); clearCurrentForm(); renderAll();
    }, { once: true } );
    
  };
}
window.deleteCurrent = function(i){
  if(!confirm("Delete this current item?")) return;
  current.splice(i,1); renderAll();
}
window.moveToOutgoing = function(i){
  const item = current.splice(i,1)[0];
  outgoing.push(item);
  renderAll();
}


incAddBtn.addEventListener("click", () => {
  const name = incName.value.trim(), brand = incBrand.value.trim();
  const quantity = Number(incQty.value), price = Number(incPrice.value);
  if (!name || !brand || !quantity || !price) { alert("Fill all fields"); return; }
  incoming.push({ name, brand, quantity, price });
  clearIncomingForm(); renderAll();
});
incResetBtn.addEventListener("click", clearIncomingForm);
function clearIncomingForm(){ incName.value=""; incBrand.value=""; incQty.value=""; incPrice.value=""; }
window.editIncoming = function(i){
  const it = incoming[i];
  incName.value = it.name; incBrand.value = it.brand; incQty.value = it.quantity; incPrice.value = it.price;
  incAddBtn.onclick = function update(){
    const name = incName.value.trim(), brand = incBrand.value.trim(), quantity = Number(incQty.value), price = Number(incPrice.value);
    if(!name||!brand||!quantity||!price){ alert("Fill all fields"); return; }
    incoming[i] = {name,brand,quantity,price}; incAddBtn.onclick = null; renderAll(); clearIncomingForm();
  };
}
window.deleteIncoming = function(i){
  if(!confirm("Delete this incoming item?")) return;
  incoming.splice(i,1); renderAll();
}
window.receiveIncoming = function(i){
  const item = incoming.splice(i,1)[0];
 
  const idx = current.findIndex(it => it.name===item.name && it.brand===item.brand);
  if(idx>=0){
    current[idx].quantity = Number(current[idx].quantity) + Number(item.quantity);
  } else current.push(item);
  renderAll();
}


outAddBtn.addEventListener("click", () => {
  const name = outName.value.trim(), brand = outBrand.value.trim();
  const quantity = Number(outQty.value), price = Number(outPrice.value);
  if (!name || !brand || !quantity || !price) { alert("Fill all fields"); return; }
  outgoing.push({ name, brand, quantity, price });
  clearOutgoingForm(); renderAll();
});
outResetBtn.addEventListener("click", clearOutgoingForm);
function clearOutgoingForm(){ outName.value=""; outBrand.value=""; outQty.value=""; outPrice.value=""; }
window.editOutgoing = function(i){
  const it = outgoing[i];
  outName.value = it.name; outBrand.value = it.brand; outQty.value = it.quantity; outPrice.value = it.price;
  outAddBtn.onclick = function update(){ 
    const name = outName.value.trim(), brand = outBrand.value.trim(), quantity = Number(outQty.value), price = Number(outPrice.value);
    if(!name||!brand||!quantity||!price){ alert("Fill all fields"); return; }
    outgoing[i] = {name,brand,quantity,price}; outAddBtn.onclick = null; renderAll(); clearOutgoingForm();
  };
}
window.deleteOutgoing = function(i){
  if(!confirm("Delete this outgoing item?")) return;
  outgoing.splice(i,1); renderAll();
}
window.dispatchOutgoing = function(i){
  
  if(!confirm("Dispatch this outgoing order? This will remove it from outgoing.")) return;
  outgoing.splice(i,1); renderAll();
}


renderAll();




const navLinks = document.querySelectorAll(".nav-links a");
const allSections = document.querySelectorAll(".section");


navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("data-page");

    allSections.forEach(sec => {
      if (sec.id === target) sec.classList.add("active");
      else sec.classList.remove("active");
    });

  
    tabs.forEach(t => t.classList.remove("active"));
  });
});


document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const msg = document.getElementById("loginMessage");

  if (!user || !pass) {
    msg.textContent = "⚠️ Please fill in both fields.";
    msg.style.color = "red";
  } else {
    msg.textContent = `✅ Welcome back, ${user}!`;
    msg.style.color = "green";
  }
});

document.getElementById("loginReset").addEventListener("click", () => {
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
  document.getElementById("loginMessage").textContent = "";
});

document.getElementById("registerBtn").addEventListener("click", () => {
  const user = document.getElementById("regUser").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPass").value.trim();
  const msg = document.getElementById("registerMessage");

  if (!user || !email || !pass) {
    msg.textContent = "⚠️ Please fill all fields.";
    msg.style.color = "red";
  } else {
    msg.textContent = `✅ Registration successful for ${user}!`;
    msg.style.color = "green";
  }
});

document.getElementById("registerReset").addEventListener("click", () => {
  document.getElementById("regUser").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regPass").value = "";
  document.getElementById("registerMessage").textContent = "";
});

