# Presentasi Seminar Nasional SENTRA PENDIPA 2026

Slide presentasi web interaktif berbasis **Reveal.js** untuk **Seminar Nasional Transformasi Pendidikan IPA (SENTRA PENDIPA) 2026**.

## 📄 Judul Penelitian
> **PENERAPAN MODEL PEMBELAJARAN SEARCH, SOLVE, CREATE, AND SHARE (SSCS) BERBANTUAN FLASHCARD UNTUK MENINGKATKAN KETERAMPILAN PEMECAHAN MASALAH PESERTA DIDIK PADA MATERI SUHU DAN KALOR**

- **Peneliti:** Trissanggrah Nirmala Desinta¹ & Dr. Muhammad Minan Chusni, M.Pd.²
- **Institusi:** S1 Pendidikan Fisika, Universitas Islam Negeri Sunan Gunung Djati Bandung
- **Kontak:** trissanggrahnirmaladesinta@gmail.com

---

## ✨ Fitur Utama Presentasi
- **White & Blue Professional Academic Theme:** Desain bersih, modern, dan berkontras tinggi berorientasi standar seminar nasional.
- **True Fullscreen Presentation Mode:** Tekan **`F`** untuk masuk mode presentasi layar penuh *edge-to-edge* (seperti PowerPoint / Keynote) dengan *smart floating presenter toolbar* yang otomatis memudar saat kursor diam.
- **3D Interactive Flip Flashcards (Slide 5):** Simulasi langsung 4 jenis kartu stimulus *Search, Solve, Create, Share* yang dapat diklik/di-hover untuk membalik dan melihat contoh kasus riil.
- **Live Data Visualizations (Chart.js 4.4):**
  - *Slide 9:* Grouped Bar Chart perbandingan Pretest, Posttest, dan N-Gain kelompok SSCS (0,88) vs PBL (0,82).
  - *Slide 10:* Horizontal Bar Chart capaian N-Gain per submateri (Suhu-Termometer, Kalor & Wujud Zat, Perpindahan Kalor).
  - *Slide 11:* Radar Chart 5 Indikator Heller (mengevaluasi disparitas prosedur matematika vs aplikasi fisika spesifik).
- **KaTeX Typography:** Seluruh formula fisika termal ($Q = mc\Delta T$, $Q = mL$, $H = k \cdot A \cdot \frac{\Delta T}{L}$, Asas Black) dan notasi statistik inferensial ($p < 0,001$, $H_0$) dirender menggunakan KaTeX.
- **Presenter Tools:** Penghitung waktu presentasi (*live stopwatch*), laci navigasi cepat antar-slide (*Slide Jump Drawer*), dan konfeti perayaan di sesi Q&A.

---

## ⌨️ Pintasan Keyboard (Presenter Shortcuts)

| Tombol | Fungsi |
|---|---|
| **`F`** | Masuk / Keluar Mode Layar Penuh (*Fullscreen Presentation Mode*) |
| **`Spasi` / `→` / `PageDown`** | Lanjut ke slide / fragmen berikutnya |
| **`←` / `PageUp`** | Kembali ke slide sebelumnya |
| **`ESC` / `O`** | Membuka kisi ikhtisar seluruh slide (*Overview Grid*) |
| **`J`** | Membuka laci daftar seluruh slide (*Quick Jump Menu*) |
| **Klik Timer (Top Bar)** | *Play* / *Pause* stopwatch presentasi |
| **Double-Click Timer** | *Reset* stopwatch ke `00:00` |
| **Klik Kartu (Slide 5)** | Membalik kartu (*Flip 3D*) melihat implementasi kartu |

---

## 🚀 Cara Menjalankan

### Opsi 1: Buka Langsung (Offline / Local)
Cukup klik dua kali file [`index.html`](index.html) pada peramban web modern mana pun (Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari).

### Opsi 2: Menggunakan Local Web Server
```bash
# Python 3
python -m http.server 8000
```
Buka browser di `http://localhost:8000`.

### Opsi 3: Hosting Gratis via GitHub Pages
1. Buka repositori di GitHub: `https://github.com/rzranz/PPT-SEMINAR`
2. Masuk ke **Settings** > **Pages**.
3. Pada bagian **Build and deployment** > **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
4. Slide presentasi dapat diakses secara daring melalui URL:
   `https://rzranz.github.io/PPT-SEMINAR/`

---

## 📊 Struktur Slide (17 Slide)
1. **Cover / Judul Penelitian**
2. **Ringkasan Eksekutif & Peta Jalan Riset**
3. **Latar Belakang & Masalah Riil (MAN 2 Bandung Baseline)**
4. **Model Pembelajaran SSCS (Pizzini, 1988)**
5. **Inovasi 4 Varian Flashcard Interaktif pada Sintaks SSCS**
6. **5 Indikator Keterampilan Pemecahan Masalah (Heller, 1992)**
7. **Desain & Metodologi Penelitian (Kuasi Eksperimen & ANATES v4.0.5)**
8. **Keterlaksanaan Pembelajaran (Observasi 3 Observer)**
9. **Hasil Utama: Pretest, Posttest, & N-Gain (Chart.js Bar)**
10. **Analisis Capaian per Submateri Fisika (Chart.js Horizontal Bar)**
11. **Anatomi Kognitif: 5 Indikator Heller (Chart.js Radar)**
12. **Uji Hipotesis & Statistik Inferensial (SPSS v26 - Mann-Whitney U)**
13. **Pembahasan Kritis I: Keunggulan Struktural SSCS vs PBL**
14. **Pembahasan Kritis II: Paradoks "Mekanisasi Hitungan"**
15. **Kesimpulan Utama Penelitian**
16. **Rekomendasi Pedagogis & Riset Masa Depan**
17. **Sesi Tanya Jawab (Q&A) & Lembar Antisipasi Penguji**
