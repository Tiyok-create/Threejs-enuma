# NEON VELOCITY — Futuristic Sportscar (Three.js)

Project ini membuat mobil sport futuristik langsung menggunakan geometri Three.js. Tidak membutuhkan file model eksternal atau file GLB untuk menampilkan mobil demo.

## Fitur
- Model mobil sport 3D procedural: bodi aerodinamis, kokpit, kaca, spoiler, diffuser, empat roda, rim, lampu depan/belakang, dan neon.
- Showroom 3D dengan lantai grid, cincin cahaya, partikel, dan pencahayaan.
- Kamera dapat diputar dengan drag dan di-zoom dengan scroll.
- Tombol `ACTIVATE DRIVE` / `STOP DRIVE`: mengaktifkan animasi drive, gerakan bodi, roda berputar, dan indikator energi.
- Tombol `LIGHTS: ON/OFF`: mengubah lampu neon dan pencahayaan.
- HUD informasi kendaraan dan desain responsive.

## Struktur
```text
neon-velocity-threejs/
├── index.html
├── style.css
├── main.js
├── README.md
└── assets/
    └── README.txt
```

## Cara menjalankan di Windows
1. Ekstrak ZIP.
2. Buka folder `neon-velocity-threejs` di VS Code.
3. Pasang extension `Live Server` jika belum ada.
4. Klik kanan `index.html` → `Open with Live Server`.
5. Pastikan internet aktif karena Three.js diimpor dari CDN jsDelivr.

## Upload ke GitHub
Buka terminal VS Code di folder project. Buat repository kosong di GitHub terlebih dahulu, misalnya `neon-velocity-threejs`. Jangan menambahkan README otomatis di GitHub karena project ini sudah memiliki README.

```powershell
git init
git add .
git commit -m "Initial commit - Neon Velocity"
git branch -M main
git remote add origin https://github.com/USERNAME/neon-velocity-threejs.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub milikmu. Jika remote `origin` sudah ada, gunakan:
```powershell
git remote set-url origin https://github.com/USERNAME/neon-velocity-threejs.git
git push -u origin main
```

Jika Git memberi tahu `nothing to commit`, perubahan sudah tersimpan pada commit saat ini. Jika file baru/diubah setelahnya, lakukan `git add .` dan `git commit -m "Update project"`.

## Deploy ke Vercel
1. Login ke https://vercel.com menggunakan GitHub.
2. Pilih `Add New` → `Project`.
3. Import repository `neon-velocity-threejs`.
4. Framework Preset: `Other`.
5. Root Directory: `./`.
6. Biarkan Build Command, Output Directory, dan Install Command kosong.
7. Klik `Deploy`.
8. Setelah selesai, buka URL yang diberikan Vercel dan uji tombol serta kontrol kamera.

## Catatan
Mobil ini adalah model procedural yang dibuat dari bentuk dasar Three.js, jadi langsung tampil tanpa download model dari Sketchfab. Bila tugas sekolah secara khusus mewajibkan model yang diunduh dari Sketchfab, kamu bisa mengganti atau menambahkannya kemudian dan tetap mencantumkan atribusi sesuai lisensi.
