// Database Film Awal (Simulasi Default)
let movieList = [
    { title: "Big Buck Bunny (Demo HD)", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { title: "Contoh Video MP4 Langsung", url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" }
];

const videoGrid = document.getElementById('video-grid');
const bulkUploadBtn = document.getElementById('bulk-upload-btn');
const bulkInput = document.getElementById('bulk-input');
const searchInput = document.getElementById('search-input');
const videoModal = document.getElementById('video-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const playerContainer = document.getElementById('player-container');

// Fungsi Pindah Tab
function switchTab(tabName) {
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));

    if (tabName === 'home') {
        document.getElementById('home-tab').classList.add('active');
        document.querySelector('.nav-menu li:nth-child(1)').classList.add('active');
        renderMovies(movieList);
    } else {
        document.getElementById('admin-tab').classList.add('active');
        document.querySelector('.nav-menu li:nth-child(2)').classList.add('active');
    }
}

// Render Daftar Film ke Halaman Beranda
function renderMovies(movies) {
    videoGrid.innerHTML = '';
    if (movies.length === 0) {
        videoGrid.innerHTML = `<p style="color: #777;">Belum ada video atau film yang diunggah.</p>`;
        return;
    }

    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.classList.add('video-card');
        card.innerHTML = `
            <div class="thumbnail-box"><i class="fa-solid fa-play"></i></div>
            <div class="video-info">
                <h3>${escapeHTML(movie.title)}</h3>
                <p>Klik untuk mulai nonton</p>
            </div>
        `;
        card.addEventListener('click', () => openPlayer(movie));
        videoGrid.appendChild(card);
    });
}

// Fitur Mass Upload (Mendukung Link Mentah Sekaligus)
bulkUploadBtn.addEventListener('click', () => {
    const rawText = bulkInput.value.trim();
    if (!rawText) {
        alert('Masukkan link terlebih dahulu!');
        return;
    }

    const lines = rawText.split('\n');
    let addedCount = 0;

    lines.forEach((line, index) => {
        line = line.trim();
        if (!line) return;

        let title, url;
        // Cek apakah pakai format "Judul | Link" atau cuma link mentah
        if (line.includes('|')) {
            const parts = line.split('|');
            title = parts[0] ? parts[0].trim() : `Video ${movieList.length + 1}`;
            url = parts[1] ? parts[1].trim() : '';
        } else {
            // Kalau cuma link mentah, otomatis buatkan judul
            url = line;
            // Tambahkan protokol https:// jika belum ada
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            title = `Koleksi Video #${movieList.length + 1}`;
        }

        if (url) {
            movieList.push({ title, url });
            addedCount++;
        }
    });

    if (addedCount > 0) {
        alert(`Berhasil menambahkan ${addedCount} video secara massal!`);
        bulkInput.value = '';
        switchTab('home');
    } else {
        alert('Gagal memproses link.');
    }
});

// Buka Pemutar Video di Dalam Web (Modal)
function openPlayer(movie) {
    modalTitle.textContent = movie.title;
    
    // Pastikan link video diputar dengan benar
    let embedUrl = movie.url;
    if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
        // Ubah link youtube biasa jadi embed jika user nempel link biasa
        if (!embedUrl.includes('embed/')) {
            const videoId = embedUrl.split('/').pop().split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        playerContainer.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
    } else {
        playerContainer.innerHTML = `<video controls autoplay><source src="${embedUrl}" type="video/mp4">Browser Anda tidak mendukung pemutar video.</video>`;
    }

    videoModal.style.display = 'flex';
}

// Tutup Modal Video
closeModal.addEventListener('click', () => {
    videoModal.style.display = 'none';
    playerContainer.innerHTML = ''; 
});

// Fitur Pencarian Real-Time
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = movieList.filter(m => m.title.toLowerCase().includes(keyword));
    renderMovies(filtered);
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

renderMovies(movieList);
