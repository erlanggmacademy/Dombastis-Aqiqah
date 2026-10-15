/**
 * AQIQAH DOMBASTIS - MAIN JAVASCRIPT
 * Fitur: Integrasi WhatsApp cerdas, Kalkulator Aqiqah Syar'i,
 * Filter Galeri & Lightbox, Form WhatsApp dinamis, Fallback Copy Number.
 */

document.addEventListener('DOMContentLoaded', function () {
  const WA_PHONE = '6282381052469';
  const DISPLAY_PHONE = '0823-8105-2469';

  // 1. DYNAMIC WHATSAPP LINKS FOR PACKAGE CARDS
  const packageButtons = document.querySelectorAll('[data-package-name]');
  packageButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const packageName = this.getAttribute('data-package-name') || 'Paket Aqiqah';
      const packagePrice = this.getAttribute('data-package-price') || '';
      
      let message = `Halo Aqiqah Dombastis, saya tertarik dengan *${packageName}*`;
      if (packagePrice) {
        message += ` (${packagePrice})`;
      }
      message += `. Mohon informasi rincian menu, ketersediaan jadwal pelaksanaan, dan alur pemesanannya. Terima kasih!`;

      openWhatsApp(message);
    });
  });

  // 2. GENERAL CONSULTATION BUTTONS
  const generalWaButtons = document.querySelectorAll('.btn-wa-general');
  generalWaButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const customTopic = this.getAttribute('data-topic') || 'informasi umum';
      const message = `Halo Aqiqah Dombastis, saya ingin konsultasi mengenai ${customTopic}. Mohon info pilihan paket, pricelist terbaru, dan area layanan yang dijangkau. Terima kasih.`;
      openWhatsApp(message);
    });
  });

  // 3. INTERACTIVE AQIQAH CALCULATOR
  const calcGenderInputs = document.querySelectorAll('input[name="calcGender"]');
  const calcPackageSelect = document.getElementById('calcPackage');
  const calcRiceSelect = document.getElementById('calcRice');
  const calcTotalDisplay = document.getElementById('calcTotalEstimate');
  const calcSheepCountDisplay = document.getElementById('calcSheepCount');
  const calcPortionDisplay = document.getElementById('calcPortionCount');
  const btnCalcWa = document.getElementById('btnCalcWhatsApp');

  function updateCalculator() {
    if (!calcPackageSelect || !calcTotalDisplay) return;

    let gender = 'Laki-laki (2 Ekor Domba)';
    let sheepCount = 2;
    calcGenderInputs.forEach(input => {
      if (input.checked) {
        if (input.value === 'perempuan') {
          gender = 'Perempuan (1 Ekor Domba)';
          sheepCount = 1;
        }
      }
    });

    const selectedOption = calcPackageSelect.options[calcPackageSelect.selectedIndex];
    const basePricePerSheep = parseInt(selectedOption.getAttribute('data-price') || 1750000, 10);
    const basePortionPerSheep = parseInt(selectedOption.getAttribute('data-portion') || 50, 10);
    const packageName = selectedOption.value;

    let riceExtraPerBox = 0;
    let riceName = 'Nasi Putih Sedap';
    if (calcRiceSelect) {
      const riceOption = calcRiceSelect.options[calcRiceSelect.selectedIndex];
      riceExtraPerBox = parseInt(riceOption.getAttribute('data-extra') || 0, 10);
      riceName = riceOption.text;
    }

    const totalPortion = basePortionPerSheep * sheepCount;
    const totalPrice = (basePricePerSheep * sheepCount) + (riceExtraPerBox * totalPortion);

    // Update UI elements
    if (calcSheepCountDisplay) calcSheepCountDisplay.textContent = `${sheepCount} Ekor Domba`;
    if (calcPortionDisplay) calcPortionDisplay.textContent = `± ${totalPortion} Box / Porsi`;
    if (calcTotalDisplay) {
      calcTotalDisplay.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
    }

    // Attach to WhatsApp Button
    if (btnCalcWa) {
      btnCalcWa.onclick = function (e) {
        e.preventDefault();
        const msg = `*SIMULASI ESTIMASI AQIQAH DOMBASTIS*\n` +
          `• Kategori: ${gender}\n` +
          `• Pilihan Paket: ${packageName}\n` +
          `• Jumlah Domba: ${sheepCount} Ekor\n` +
          `• Jenis Nasi: ${riceName}\n` +
          `• Estimasi Porsi: ± ${totalPortion} Porsi/Box\n` +
          `• Estimasi Total: Rp ${totalPrice.toLocaleString('id-ID')}\n\n` +
          `Halo admin Aqiqah Dombastis, mohon konfirmasi jadwal dan rincian pemesanan berdasarkan simulasi paket di atas. Terima kasih!`;
        openWhatsApp(msg);
      };
    }
  }

  if (calcPackageSelect) {
    calcGenderInputs.forEach(radio => radio.addEventListener('change', updateCalculator));
    calcPackageSelect.addEventListener('change', updateCalculator);
    if (calcRiceSelect) calcRiceSelect.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  // 4. QUICK CONSULTATION / ORDER FORM (NO SERVER STORAGE, DIRECT TO WA)
  const waContactForm = document.getElementById('waContactForm');
  if (waContactForm) {
    waContactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const parentName = document.getElementById('formParentName')?.value.trim() || 'Hamba Allah';
      const childGender = document.getElementById('formChildGender')?.value || 'Belum Ditentukan';
      const eventDate = document.getElementById('formEventDate')?.value || '-';
      const packageChoice = document.getElementById('formPackageChoice')?.value || 'Konsultasi Dahulu';
      const address = document.getElementById('formAddress')?.value.trim() || '-';
      const notes = document.getElementById('formNotes')?.value.trim() || 'Mohon dibantu rekomendasi terbaik';

      const compiledMessage = `*FORMULIR KONSULTASI AQIQAH DOMBASTIS*\n` +
        `• Nama Orang Tua: ${parentName}\n` +
        `• Aqiqah Untuk: Anak ${childGender}\n` +
        `• Rencana Tanggal Acara: ${eventDate}\n` +
        `• Pilihan Paket: ${packageChoice}\n` +
        `• Area / Alamat Pengiriman: ${address}\n` +
        `• Catatan Khusus: ${notes}\n\n` +
        `Halo admin Aqiqah Dombastis, saya ingin konfirmasi ketersediaan dan booking paket sesuai data di atas. Mohon arahan selanjutnya.`;

      openWhatsApp(compiledMessage);
    });
  }

  // 5. GALLERY FILTER & LIGHTBOX MODAL
  const galleryFilters = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-col');

  galleryFilters.forEach(btn => {
    btn.addEventListener('click', function () {
      galleryFilters.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filterValue = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Modal Lightbox Trigger
  const lightboxModalEl = document.getElementById('galleryLightboxModal');
  if (lightboxModalEl) {
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const clickableGalleryCards = document.querySelectorAll('.gallery-item');

    clickableGalleryCards.forEach(card => {
      card.addEventListener('click', function () {
        const imgSrc = this.getAttribute('data-img');
        const title = this.getAttribute('data-title');
        const desc = this.getAttribute('data-desc');

        if (lightboxImg && imgSrc) lightboxImg.src = imgSrc;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<h5 class="text-gold mb-1">${title}</h5><p class="text-secondary-custom mb-0 small">${desc}</p>`;
        }
        
        const modalInstance = new bootstrap.Modal(lightboxModalEl);
        modalInstance.show();
      });
    });
  }

  // 6. BLOG SEARCH & CATEGORY FILTER
  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogCards = document.querySelectorAll('.blog-card-col');
  const blogCategoryLinks = document.querySelectorAll('.blog-category-link');

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      filterBlog(query, null);
    });
  }

  blogCategoryLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      blogCategoryLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const cat = this.getAttribute('data-category');
      filterBlog('', cat);
    });
  });

  function filterBlog(query, category) {
    blogCards.forEach(col => {
      const card = col.querySelector('.blog-card');
      const title = card.querySelector('.blog-title').textContent.toLowerCase();
      const desc = card.querySelector('.blog-desc').textContent.toLowerCase();
      const cardCat = col.getAttribute('data-category');

      let matchesQuery = true;
      let matchesCat = true;

      if (query && !title.includes(query) && !desc.includes(query)) {
        matchesQuery = false;
      }
      if (category && category !== 'all' && cardCat !== category) {
        matchesCat = false;
      }

      if (matchesQuery && matchesCat) {
        col.style.display = 'block';
      } else {
        col.style.display = 'none';
      }
    });
  }

  // 7. COPY TO CLIPBOARD FALLBACK (IF WHATSAPP FAILS OR USER PREFERS CALL/MANUAL WA)
  const copyButtons = document.querySelectorAll('.btn-copy-phone');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      navigator.clipboard.writeText('082381052469').then(() => {
        showToast('Nomor 0823-8105-2469 berhasil disalin ke clipboard!');
      }).catch(() => {
        prompt('Silakan salin nomor WhatsApp Aqiqah Dombastis:', '082381052469');
      });
    });
  });

  // HELPER: OPEN WHATSAPP WITH URL ENCODED TEXT
  function openWhatsApp(text) {
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${WA_PHONE}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  // HELPER: SIMPLE TOAST NOTIFIER
  function showToast(message) {
    let toastContainer = document.getElementById('toastNotification');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastNotification';
      toastContainer.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 25px;
        background: #0B1F3A;
        color: #F7F8FA;
        border: 1px solid #C8A96A;
        padding: 12px 22px;
        border-radius: 50px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        z-index: 9999;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(toastContainer);
    }
    toastContainer.innerHTML = `<i class="bi bi-check-circle-fill text-gold"></i> <span>${message}</span>`;
    toastContainer.style.opacity = '1';
    toastContainer.style.display = 'flex';

    setTimeout(() => {
      toastContainer.style.opacity = '0';
      setTimeout(() => {
        toastContainer.style.display = 'none';
      }, 300);
    }, 3500);
  }
});
