let currentCategory = 'All';
let capturedImage = "";

window.onload = () => renderMarket();

function toggleDropdown() { 
    // Toggles the "show-menu" class defined in CSS
    document.getElementById("categoryDrop").classList.toggle("show-menu"); 
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.drop-btn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show-menu')) {
                dropdowns[i].classList.remove('show-menu');
            }
        }
    }
}

function toggleModal(id, show) {
    document.getElementById(id).style.display = show ? 'flex' : 'none';
}

function handleImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            capturedImage = e.target.result;
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveToMarket() {
    const title = document.getElementById('listingTitle').value;
    const phone = document.getElementById('listingPhone').value;
    const price = document.getElementById('listingPrice').value;
    
    if(!title || !phone) return alert("Missing Title or WhatsApp Number!");

    const newItem = {
        id: Date.now(),
        category: document.getElementById('listingCategory').value,
        title: title,
        price: price,
        phone: phone,
        image: capturedImage || 'https://via.placeholder.com/300?text=Promart'
    };

    let data = JSON.parse(localStorage.getItem('promart_db')) || [];
    data.push(newItem);
    localStorage.setItem('promart_db', JSON.stringify(data));
    
    toggleModal('postModal', false);
    renderMarket();
    // Reset image preview
    document.getElementById('imagePreview').style.display = 'none';
    capturedImage = "";
}

function renderMarket() {
    const grid = document.getElementById('marketGrid');
    grid.innerHTML = '';
    let data = JSON.parse(localStorage.getItem('promart_db')) || [];
    
    const filtered = data.filter(item => currentCategory === 'All' || item.category === currentCategory);

    filtered.reverse().forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" class="card-img">
            <div class="card-body">
                <span style="color:var(--primary-green); font-size:10px; font-weight:800; text-transform:uppercase;">${item.category}</span>
                <h4 style="margin:4px 0; font-size:16px;">${item.title}</h4>
                <p style="font-weight:800; margin:0; color:var(--dark-green);">₦${item.price}</p>
                <button style="width:100%; background:var(--dark-green); color:white; border:none; padding:10px; border-radius:8px; margin-top:8px; font-weight:bold;" 
                        onclick="window.open('https://wa.me/${item.phone}')">WhatsApp</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterBy(cat) { 
    currentCategory = cat; 
    renderMarket(); 
}

function searchMarket() {
    let q = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.card').forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(q) ? 'block' : 'none';
    });
}
