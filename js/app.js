/**
 * @file app.js
 * @description Logic điều khiển trung tâm cho Website Tư vấn & Quản lý Bảng hàng Eco Garden.
 * Bao gồm: Bản đồ tương tác VR/Pin Map, Bộ khám phá Mặt bằng & Bóc mái 3D,
 * Bảng hàng trực tuyến 39 căn hộ + 12 Shophouse, Máy tính dòng tiền/lãi vay,
 * và Hệ thống Quản trị Khách hàng (CRM Local + Google Sheets + Email).
 */

document.addEventListener("DOMContentLoaded", () => {
    initContactBindings();
    initVrMap();
    renderCompetitorTable();
    initFloorPlanAndUnits();
    renderSpecialFundTable();
    initInventoryTable();
    renderShophouseTable();
    renderHandoverSpecs();
    initFinancialCalculator();
    initLeadForms();
    initCrmDashboard();
});

/**
 * Định dạng số tiền VNĐ sang chuỗi dễ đọc (VD: 2,858,185,146 -> "2.86 tỷ" hoặc "2.858.185.146 đ")
 */
function formatVND(amount, shortForm = false) {
    if (!amount || isNaN(amount)) return "Liên hệ";
    if (shortForm) {
        const billions = amount / 1e9;
        if (billions >= 1) {
            return billions.toFixed(2).replace(".", ",") + " tỷ";
        }
        const millions = amount / 1e6;
        return Math.round(millions) + " triệu";
    }
    return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + " đ";
}

/**
 * Đồng bộ thông tin Hotline, Zalo, Email từ APP_CONFIG lên toàn bộ giao diện
 */
function initContactBindings() {
    document.querySelectorAll(".js-hotline-text").forEach(el => {
        el.textContent = APP_CONFIG.hotline;
    });
    document.querySelectorAll(".js-hotline-link").forEach(el => {
        el.setAttribute("href", `tel:${APP_CONFIG.hotlineRaw}`);
    });
    document.querySelectorAll(".js-zalo-link").forEach(el => {
        el.setAttribute("href", APP_CONFIG.zaloUrl);
    });
    document.querySelectorAll(".js-target-email").forEach(el => {
        el.textContent = APP_CONFIG.targetEmail;
    });
}

/* ==========================================================================
   1. BẢN ĐỒ VỊ TRÍ TƯƠNG TÁC (VR / PIN MAP) & ĐO KHOẢNG CÁCH, THỜI GIAN
   ========================================================================== */
let activeHotspotId = MAP_HOTSPOTS[0].id;

function initVrMap() {
    const pinsContainer = document.getElementById("vrPinsContainer");
    const listContainer = document.getElementById("vrHotspotList");
    if (!pinsContainer || !listContainer) return;

    // Vẽ tâm dự án Eco Garden
    const centerPin = document.createElement("div");
    centerPin.className = "map-pin map-pin-center";
    centerPin.style.left = `${APP_CONFIG.mapCenter.x}%`;
    centerPin.style.top = `${APP_CONFIG.mapCenter.y}%`;
    centerPin.innerHTML = `
        <div class="map-pin-core">ECO</div>
        <div class="map-pin-tag">★ TÒA THÁP ECO GARDEN</div>
    `;
    pinsContainer.appendChild(centerPin);

    // Vẽ các điểm tiện ích ngoại khu
    MAP_HOTSPOTS.forEach((spot, idx) => {
        const pin = document.createElement("div");
        pin.className = `map-pin js-map-pin ${spot.id === activeHotspotId ? "active" : ""}`;
        pin.dataset.id = spot.id;
        pin.style.left = `${spot.x}%`;
        pin.style.top = `${spot.y}%`;
        pin.innerHTML = `
            <div class="map-pin-core">${idx + 1}</div>
            <div class="map-pin-tag">${spot.distanceKm} • ${spot.timeMin}</div>
        `;
        pin.addEventListener("click", () => selectHotspot(spot.id));
        pin.addEventListener("mouseenter", () => selectHotspot(spot.id));
        pinsContainer.appendChild(pin);

        // Thêm vào danh sách bên phải
        const item = document.createElement("div");
        item.className = `vr-hotspot-item js-hotspot-item ${spot.id === activeHotspotId ? "active" : ""}`;
        item.dataset.id = spot.id;
        item.innerHTML = `
            <div>
                <div class="vr-hotspot-name">${idx + 1}. ${spot.name}</div>
                <div class="vr-hotspot-sub">${spot.categoryLabel}</div>
            </div>
            <div style="text-align:right; flex-shrink:0;">
                <span class="vr-badge-dist">${spot.distanceKm}</span>
                <div style="font-size:0.75rem; color:#e5c453; margin-top:3px;">⏱ ${spot.timeMin}</div>
            </div>
        `;
        item.addEventListener("click", () => selectHotspot(spot.id));
        listContainer.appendChild(item);
    });

    // Chuyển đổi chế độ xem bản đồ (Liên kết vùng / Bản đồ giá / Giao thông ĐT293)
    document.querySelectorAll(".js-map-mode-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".js-map-mode-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const imgPath = btn.dataset.img;
            const showPins = btn.dataset.pins === "true";
            const baseImg = document.getElementById("vrBaseImage");
            const svgOverlay = document.getElementById("vrSvgOverlay");
            if (baseImg) baseImg.src = imgPath;
            if (pinsContainer) pinsContainer.style.display = showPins ? "block" : "none";
            if (svgOverlay) svgOverlay.style.display = showPins ? "block" : "none";
        });
    });

    selectHotspot(activeHotspotId);
}

function selectHotspot(spotId) {
    activeHotspotId = spotId;
    const spot = MAP_HOTSPOTS.find(s => s.id === spotId);
    if (!spot) return;

    document.querySelectorAll(".js-map-pin").forEach(el => {
        el.classList.toggle("active", el.dataset.id === spotId);
    });
    document.querySelectorAll(".js-hotspot-item").forEach(el => {
        el.classList.toggle("active", el.dataset.id === spotId);
    });

    // Cập nhật đường nối SVG từ tâm Eco Garden tới điểm tiện ích
    const routeLine = document.getElementById("vrRouteLine");
    if (routeLine) {
        routeLine.setAttribute("x1", `${APP_CONFIG.mapCenter.x}%`);
        routeLine.setAttribute("y1", `${APP_CONFIG.mapCenter.y}%`);
        routeLine.setAttribute("x2", `${spot.x}%`);
        routeLine.setAttribute("y2", `${spot.y}%`);
    }

    // Cập nhật thẻ chi tiết điểm kết nối
    const detailBox = document.getElementById("vrActiveDetail");
    if (detailBox) {
        detailBox.innerHTML = `
            <div style="font-size:0.76rem; text-transform:uppercase; color:#e5c453; letter-spacing:1px; font-weight:700;">
                ${spot.categoryLabel}
            </div>
            <h4 style="color:#fff; font-size:1.22rem; margin:4px 0 8px;">${spot.name}</h4>
            <div class="vr-active-meta">
                <span class="vr-badge-dist">📍 Khoảng cách: ${spot.distanceKm}</span>
                <span class="vr-badge-time">⏱ Di chuyển: ${spot.timeMin}</span>
            </div>
            <p style="font-size:0.88rem; color:rgba(255,255,255,0.88); line-height:1.55;">
                ${spot.desc}
            </p>
        `;
    }
}

/* ==========================================================================
   2. BẢNG SO SÁNH GIÁ CÁC DỰ ÁN TRONG KHU VỰC
   ========================================================================== */
function renderCompetitorTable() {
    const tbody = document.getElementById("competitorTableBody");
    if (!tbody) return;
    tbody.innerHTML = COMPETITOR_DATA.map(row => `
        <tr class="${row.isEcoGarden ? "highlight-row" : ""}">
            <td>
                <strong>${row.project}</strong>
                ${row.isEcoGarden ? '<span style="background:#d4af37;color:#04221a;font-size:0.7rem;padding:2px 8px;border-radius:99px;margin-left:6px;font-weight:800;">TỐT NHẤT KHU VỰC</span>' : ""}
            </td>
            <td>${row.location}</td>
            <td><strong style="color:${row.isEcoGarden ? "#f3dc8a" : "inherit"}">${row.priceRange}</strong></td>
            <td>${row.total2PN}</td>
            <td>${row.handover}</td>
            <td>${row.greenCert}</td>
            <td>${row.policy}</td>
        </tr>
    `).join("");
}

/* ==========================================================================
   3. MẶT BẰNG TẦNG ĐIỂN HÌNH & LAYOUT BÓC MÁI 3D CĂN HỘ
   ========================================================================== */
function initFloorPlanAndUnits() {
    // Chuyển đổi mặt bằng tầng 3-10 và tầng 11-19
    document.querySelectorAll(".js-floorplan-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".js-floorplan-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const imgEl = document.getElementById("floorplanMainImg");
            const captionEl = document.getElementById("floorplanCaption");
            if (imgEl) imgEl.src = btn.dataset.img;
            if (captionEl) captionEl.textContent = btn.dataset.caption;
        });
    });

    // Khởi tạo các nút chọn loại căn hộ 3D
    const unitTabBar = document.getElementById("unitTypeTabs");
    if (!unitTabBar) return;

    unitTabBar.innerHTML = UNIT_TYPES_DATA.map((u, idx) => `
        <button type="button" class="floor-btn js-unit-tab ${idx === 0 ? "active" : ""}" data-id="${u.id}">
            ${u.code} (${u.area})
        </button>
    `).join("");

    unitTabBar.querySelectorAll(".js-unit-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            unitTabBar.querySelectorAll(".js-unit-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderUnitDetail(btn.dataset.id);
        });
    });

    renderUnitDetail(UNIT_TYPES_DATA[0].id);
}

function renderUnitDetail(unitId) {
    const unit = UNIT_TYPES_DATA.find(u => u.id === unitId);
    if (!unit) return;

    const mainImg = document.getElementById("unitMainPreview");
    const thumbsContainer = document.getElementById("unitThumbsRow");
    const infoContainer = document.getElementById("unitInfoContainer");

    if (mainImg) mainImg.src = unit.image3D;

    if (thumbsContainer) {
        const allImages = [
            { src: unit.image3D, label: "Bóc mái 3D" },
            ...unit.interiorImages.map((src, i) => ({ src, label: `Nội thất ${i + 1}` }))
        ];
        thumbsContainer.innerHTML = allImages.map((img, i) => `
            <div class="unit-thumb ${i === 0 ? "active" : ""}" data-src="${img.src}" title="${img.label}">
                <img src="${img.src}" alt="${img.label}" loading="lazy">
            </div>
        `).join("");

        thumbsContainer.querySelectorAll(".unit-thumb").forEach(thumb => {
            thumb.addEventListener("click", () => {
                thumbsContainer.querySelectorAll(".unit-thumb").forEach(t => t.classList.remove("active"));
                thumb.classList.add("active");
                if (mainImg) mainImg.src = thumb.dataset.src;
            });
        });
    }

    if (infoContainer) {
        infoContainer.innerHTML = `
            <div style="display:inline-block; background:#0b4f3f; color:#f3dc8a; padding:4px 12px; border-radius:99px; font-size:0.78rem; font-weight:700; margin-bottom:8px;">
                Mã trục: ${unit.code} • ${unit.bedrooms}
            </div>
            <h3 style="font-size:1.45rem; margin-bottom:10px;">${unit.name}</h3>
            <p style="font-size:0.9rem; color:#4b5563; margin-bottom:12px;">
                <strong>Diện tích thông thủy:</strong> ${unit.area} &nbsp;|&nbsp;
                <strong>Mật độ:</strong> ${unit.unitsPerFloor}<br>
                <strong>Hướng căn hộ:</strong> ${unit.direction}
            </p>
            <div class="unit-price-badges">
                <div class="unit-price-badge">
                    <small>Giá Vốn tự có (Quỹ đặc biệt)</small>
                    <strong>${unit.specialPriceOwn}</strong>
                </div>
                <div class="unit-price-badge gold">
                    <small>Giá Vay HTLS 0% 24 tháng</small>
                    <strong>${unit.specialPriceLoan}</strong>
                </div>
            </div>
            <h4 style="font-size:0.95rem; margin-bottom:8px; color:#07362a;">Điểm mạnh thiết kế & Công năng:</h4>
            <ul style="padding-left:18px; margin-bottom:20px; font-size:0.88rem; display:flex; flex-direction:column; gap:6px;">
                ${unit.highlights.map(h => `<li>${h}</li>`).join("")}
            </ul>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn btn-gold" onclick="prefillLeadUnit('${unit.code} - ${unit.bedrooms}')">
                    📩 Nhận Bảng Giá Chi Tiết Trục ${unit.code}
                </button>
                <a href="#bang-hang" class="btn btn-emerald">Xem Quỹ Căn Trống</a>
            </div>
        `;
    }
}

/* ==========================================================================
   4. BẢNG QUỸ CĂN ĐẶC BIỆT & BẢNG HÀNG TRỰC TUYẾN 39 CĂN HỘ + 12 SHOPHOUSE
   ========================================================================== */
function renderSpecialFundTable() {
    const tbody = document.getElementById("specialFundTableBody");
    if (!tbody) return;
    tbody.innerHTML = SPECIAL_FUND_SUMMARY.map(item => `
        <tr>
            <td><strong style="color:#07362a;">${item.code}</strong></td>
            <td>${item.type}</td>
            <td><strong>${item.area}</strong></td>
            <td><strong style="color:#059669; font-size:0.98rem;">${item.ownCapPrice}</strong></td>
            <td>${item.loanPrice}</td>
            <td><span class="status-pill status-available">Vốn 30%: ${item.downPayment30}</span></td>
            <td>
                <button type="button" class="btn btn-gold" style="padding:6px 14px; font-size:0.78rem;"
                    onclick="prefillLeadUnit('Quỹ giá đặc biệt ${item.code} (${item.area})')">
                    Giữ suất ưu đãi
                </button>
            </td>
        </tr>
    `).join("");
}

function initInventoryTable() {
    const filterBeds = document.getElementById("filterBeds");
    const filterDirection = document.getElementById("filterDirection");
    const filterStatus = document.getElementById("filterStatus");
    const filterSearch = document.getElementById("filterSearch");

    const triggerRender = () => {
        const bedsVal = filterBeds ? filterBeds.value : "ALL";
        const dirVal = filterDirection ? filterDirection.value : "ALL";
        const statusVal = filterStatus ? filterStatus.value : "ALL";
        const searchVal = filterSearch ? filterSearch.value.trim().toLowerCase() : "";

        const filtered = INVENTORY_DATA.filter(item => {
            if (bedsVal !== "ALL" && item.beds !== bedsVal) return false;
            if (dirVal !== "ALL" && item.direction !== dirVal) return false;
            if (statusVal !== "ALL" && item.status !== statusVal) return false;
            if (searchVal && !item.code.toLowerCase().includes(searchVal) && !item.typeCode.toLowerCase().includes(searchVal)) {
                return false;
            }
            return true;
        });

        renderInventoryRows(filtered);
    };

    [filterBeds, filterDirection, filterStatus].forEach(el => {
        if (el) el.addEventListener("change", triggerRender);
    });
    if (filterSearch) filterSearch.addEventListener("input", triggerRender);

    triggerRender();
}

function renderInventoryRows(rows) {
    const tbody = document.getElementById("inventoryTableBody");
    const countSummary = document.getElementById("inventoryCountSummary");
    if (!tbody) return;

    const availCount = rows.filter(r => r.status === "AVAILABLE").length;
    if (countSummary) {
        countSummary.innerHTML = `Đang hiển thị <strong>${rows.length}</strong> căn (Còn trống <strong style="color:#059669;">${availCount}</strong> căn mở bán trực tiếp)`;
    }

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:26px;">Không tìm thấy căn hộ phù hợp bộ lọc.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(r => {
        const isAvail = r.status === "AVAILABLE";
        return `
            <tr class="${isAvail ? "" : "row-sold"}">
                <td>${r.stt}</td>
                <td><strong style="color:${isAvail ? "#07362a" : "#9ca3af"}">${r.code}</strong></td>
                <td>Tầng ${r.floor}</td>
                <td>${r.typeCode} (${r.beds})</td>
                <td><strong>${r.area} m²</strong></td>
                <td>${r.direction}</td>
                <td><strong style="color:${isAvail ? "#059669" : "#9ca3af"}">${formatVND(r.priceTTS)}</strong></td>
                <td>${formatVND(r.priceStd)}</td>
                <td>${formatVND(r.priceLoan)}</td>
                <td>
                    ${isAvail
                        ? `<span class="status-pill status-available">CHƯA BÁN</span>`
                        : `<span class="status-pill status-sold">ĐÃ BÁN</span>`
                    }
                </td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button type="button" class="btn btn-emerald" style="padding:5px 10px; font-size:0.75rem;"
                            onclick="loadUnitToCalculator('${r.code}')">
                            🖩 Tính vay
                        </button>
                        ${isAvail ? `
                        <button type="button" class="btn btn-gold" style="padding:5px 10px; font-size:0.75rem;"
                            onclick="prefillLeadUnit('Căn ${r.code} - Tầng ${r.floor} (${r.beds} - ${r.area}m2)')">
                            Báo giá
                        </button>` : ""}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function renderShophouseTable() {
    const tbody = document.getElementById("shophouseTableBody");
    if (!tbody) return;
    tbody.innerHTML = SHOPHOUSE_DATA.map(s => `
        <tr>
            <td><strong style="color:#07362a;">${s.code}</strong></td>
            <td>${s.type}</td>
            <td>${s.area1} m²</td>
            <td>${s.area2 > 0 ? s.area2 + " m²" : "-"}</td>
            <td><strong style="color:#b8860b;">${s.totalArea} m²</strong></td>
            <td><span class="status-pill status-available">${s.legal}</span></td>
            <td>${s.note}</td>
            <td>
                <button type="button" class="btn btn-gold" style="padding:6px 12px; font-size:0.76rem;"
                    onclick="prefillLeadUnit('Shophouse khối đế ${s.code} (${s.totalArea}m2 - Sở hữu lâu dài)')">
                    Nhận mặt bằng & Giá
                </button>
            </td>
        </tr>
    `).join("");
}

function renderHandoverSpecs() {
    const container = document.getElementById("handoverSpecsList");
    if (!container) return;
    container.innerHTML = HANDOVER_SPECS.map(item => `
        <div class="usp-card">
            <h4>✦ ${item.category}</h4>
            <p>${item.spec}</p>
        </div>
    `).join("");
}

/* ==========================================================================
   5. CÔNG CỤ TÍNH DÒNG TIỀN, LÃI SUẤT VAY & CAM KẾT THUÊ 24 THÁNG
   ========================================================================== */
function initFinancialCalculator() {
    const unitSelect = document.getElementById("calcUnitSelect");
    const priceInput = document.getElementById("calcPriceInput");
    const loanRatioInput = document.getElementById("calcLoanRatio");
    const loanTermInput = document.getElementById("calcLoanTerm");
    const paymentMethodInput = document.getElementById("calcPaymentMethod");

    if (!unitSelect) return;

    // Đổ danh sách các căn hộ còn trống vào ô chọn nhanh
    const availUnits = INVENTORY_DATA.filter(u => u.status === "AVAILABLE");
    unitSelect.innerHTML = `
        <option value="CUSTOM">-- Tự nhập giá trị căn hộ bất kỳ --</option>
        <option value="SPECIAL_1PN" data-tts="1470000000" data-loan="1740000000" data-std="1600000000">Quỹ đặc biệt: CH12A (1PN - 35.8m²) - Từ 1,47 tỷ</option>
        <option value="SPECIAL_2PN" data-tts="2400000000" data-loan="2840000000" data-std="2620000000">Quỹ đặc biệt: CH11 / CH04 (2PN - 60m²) - Từ 2,40 tỷ</option>
        <option value="SPECIAL_3PN" data-tts="2810000000" data-loan="3330000000" data-std="3050000000">Quỹ đặc biệt: CH01 / CH09 (3PN Góc - 69.3m²) - Từ 2,81 tỷ</option>
        ${availUnits.map(u => `
            <option value="${u.code}" data-tts="${u.priceTTS}" data-loan="${u.priceLoan}" data-std="${u.priceStd}">
                Căn ${u.code} (Tầng ${u.floor} • ${u.beds} • ${u.area}m² • ${u.direction})
            </option>
        `).join("")}
    `;

    // Chọn mặc định căn đầu tiên còn trống
    if (availUnits.length > 0) {
        unitSelect.value = availUnits[0].code;
    }

    const syncPriceFromSelection = () => {
        const selectedOpt = unitSelect.options[unitSelect.selectedIndex];
        const method = paymentMethodInput ? paymentMethodInput.value : "LOAN";
        if (selectedOpt && selectedOpt.value !== "CUSTOM") {
            const pTts = Number(selectedOpt.dataset.tts || 2500000000);
            const pLoan = Number(selectedOpt.dataset.loan || 3200000000);
            const pStd = Number(selectedOpt.dataset.std || 2900000000);
            if (priceInput) {
                priceInput.value = method === "TTS" ? pTts : (method === "STD" ? pStd : pLoan);
            }
        }
        recalculateFinance();
    };

    unitSelect.addEventListener("change", syncPriceFromSelection);
    if (paymentMethodInput) paymentMethodInput.addEventListener("change", syncPriceFromSelection);
    [priceInput, loanRatioInput, loanTermInput].forEach(el => {
        if (el) el.addEventListener("input", recalculateFinance);
    });

    syncPriceFromSelection();
}

function recalculateFinance() {
    const priceInput = document.getElementById("calcPriceInput");
    const loanRatioInput = document.getElementById("calcLoanRatio");
    const loanTermInput = document.getElementById("calcLoanTerm");
    const paymentMethodInput = document.getElementById("calcPaymentMethod");

    const rawPrice = Number(priceInput ? priceInput.value : 2560239529);
    const loanRatio = Number(loanRatioInput ? loanRatioInput.value : 70);
    const loanTermYears = Number(loanTermInput ? loanTermInput.value : 20);
    const method = paymentMethodInput ? paymentMethodInput.value : "LOAN";

    document.getElementById("calcLoanRatioLabel").textContent = `${loanRatio}%`;
    document.getElementById("calcLoanTermLabel").textContent = `${loanTermYears} năm (${loanTermYears * 12} tháng)`;

    const ownCapital = rawPrice * (1 - loanRatio / 100);
    const loanAmount = method === "LOAN" ? rawPrice * (loanRatio / 100) : 0;
    const months = loanTermYears * 12;
    const monthlyRate = (APP_CONFIG.financeDefaults.postHtlsRate / 100) / 12;

    // Gốc trả đều hàng tháng + Lãi theo dư nợ giảm dần sau 24 tháng HTLS 0%
    const monthlyPrincipal = months > 0 ? loanAmount / months : 0;
    const firstMonthInterestAfterHtls = loanAmount * monthlyRate;
    const firstMonthTotalAfterHtls = monthlyPrincipal + firstMonthInterestAfterHtls;

    // Lợi nhuận cam kết thuê 5%/năm trong 24 tháng (tổng 10% giá trị căn hộ)
    const rentalIncome24M = rawPrice * (APP_CONFIG.financeDefaults.rentalGuaranteeRate / 100) * 2;

    document.getElementById("resTotalPrice").textContent = formatVND(rawPrice);
    document.getElementById("resOwnCapital").textContent = formatVND(method === "LOAN" ? ownCapital : rawPrice);
    document.getElementById("resLoanAmount").textContent = method === "LOAN" ? formatVND(loanAmount) : "0 đ (Không vay)";
    document.getElementById("resFirst24Months").textContent = method === "LOAN"
        ? "0 đ/tháng (CĐT hỗ trợ 100% lãi & ân hạn gốc 24 tháng)"
        : "Thanh toán theo đợt chuẩn CĐT";
    document.getElementById("resAfter24Months").textContent = method === "LOAN"
        ? `~${formatVND(firstMonthTotalAfterHtls)}/tháng (Dư nợ giảm dần)`
        : "0 đ/tháng";
    document.getElementById("resRentalIncome").textContent = `+${formatVND(rentalIncome24M)} (5%/năm × 2 năm)`;
}

window.loadUnitToCalculator = function(unitCode) {
    const unitSelect = document.getElementById("calcUnitSelect");
    if (unitSelect) {
        unitSelect.value = unitCode;
        unitSelect.dispatchEvent(new Event("change"));
    }
    const calcSec = document.getElementById("may-tinh-tai-chinh");
    if (calcSec) calcSec.scrollIntoView({ behavior: "smooth" });
};

window.prefillLeadUnit = function(unitText) {
    const noteInputs = document.querySelectorAll(".js-lead-unit-interest");
    noteInputs.forEach(input => {
        input.value = unitText;
    });
    const formSec = document.getElementById("dang-ky-tu-van");
    if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
};

/* ==========================================================================
   6. HỆ THỐNG LƯU TRỮ KHÁCH HÀNG ĐA KÊNH (CRM LOCAL + GOOGLE SHEETS + EMAIL)
   ========================================================================== */
function getStoredLeads() {
    try {
        const raw = localStorage.getItem(APP_CONFIG.localStorageKey);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveLeadToLocal(leadObj) {
    const list = getStoredLeads();
    list.unshift(leadObj);
    localStorage.setItem(APP_CONFIG.localStorageKey, JSON.stringify(list));
    updateCrmBadgeCount();
}

function initLeadForms() {
    document.querySelectorAll(".js-lead-form").forEach(form => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector("button[type='submit']");
            const originalText = submitBtn ? submitBtn.innerHTML : "Gửi thông tin";
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = "⏳ Đang xử lý & lưu hệ thống...";
            }

            const formData = new FormData(form);
            const selectedDocs = [];
            form.querySelectorAll("input[name='docs']:checked").forEach(chk => {
                selectedDocs.push(chk.value);
            });

            const leadRecord = {
                id: "LEAD-" + Date.now(),
                timestamp: new Date().toLocaleString("vi-VN"),
                fullName: (formData.get("fullName") || "").trim(),
                phone: (formData.get("phone") || "").trim(),
                email: (formData.get("email") || "").trim(),
                unitInterest: (formData.get("unitInterest") || "Tư vấn chung Quỹ căn đẹp").trim(),
                financeOption: formData.get("financeOption") || "Vay HTLS 0% 24 tháng",
                requestedDocs: selectedDocs.join(", ") || "Bảng giá + Chính sách bán hàng",
                status: "Mới đăng ký",
                source: form.dataset.formSource || "Form Website Eco Garden"
            };

            // 1. Lưu ngay lập tức vào cơ sở dữ liệu CRM trên trình duyệt
            saveLeadToLocal(leadRecord);

            // 2. Đồng bộ lên Google Sheets CRM (nếu đã cấu hình Webhook Google Apps Script)
            let cloudSaved = false;
            if (APP_CONFIG.googleSheetWebhookUrl && APP_CONFIG.googleSheetWebhookUrl.startsWith("https://")) {
                try {
                    await fetch(APP_CONFIG.googleSheetWebhookUrl, {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(leadRecord)
                    });
                    cloudSaved = true;
                } catch (err) {
                    console.warn("Google Sheet Webhook warning:", err);
                }
            }

            // 3. Gửi thông báo về địa chỉ Email cấu hình (targetEmail) qua FormSubmit AJAX
            let emailSent = false;
            let emailStatusNote = "";
            if (window.location.protocol === "file:") {
                emailStatusNote = "⚠️ Bạn đang mở file trực tiếp từ ổ cứng (file://). Dịch vụ gửi Email tự động yêu cầu chạy qua tên miền Web (http:// hoặc https:// như Netlify) hoặc kết nối Google Sheets.";
            } else if (APP_CONFIG.enableDirectEmailFallback && APP_CONFIG.targetEmail && !APP_CONFIG.targetEmail.startsWith("xxxxxx")) {
                try {
                    const res = await fetch(`https://formsubmit.co/ajax/${APP_CONFIG.targetEmail}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({
                            _subject: `[ECO GARDEN LEAD] Khách hàng mới: ${leadRecord.fullName} - ${leadRecord.phone}`,
                            _template: "table",
                            _captcha: "false",
                            Họ_và_Tên: leadRecord.fullName,
                            Số_Điện_Thoại: leadRecord.phone,
                            Email_Khách: leadRecord.email || "Không điền",
                            Căn_Hộ_Quan_Tâm: leadRecord.unitInterest,
                            Phương_Án_Tài_Chính: leadRecord.financeOption,
                            Tài_Liệu_Yêu_Cầu: leadRecord.requestedDocs,
                            Thời_Gian_Gửi: leadRecord.timestamp
                        })
                    });
                    const resJson = await res.json();
                    if (res.ok && (resJson.success === "true" || resJson.success === true)) {
                        emailSent = true;
                        emailStatusNote = "✅ Đã gửi thông báo thành công về hộp thư!";
                    } else if (resJson && resJson.message) {
                        emailStatusNote = `ℹ️ Thông báo từ máy chủ Email: "${resJson.message}" (Hãy kiểm tra hộp thư Đến / Spam của ${APP_CONFIG.targetEmail} để bấm nút 'Activate Form' trong lần đầu tiên).`;
                    }
                } catch (err) {
                    emailStatusNote = "⚠️ Không thể kết nối máy chủ gửi mail trực tiếp. Dữ liệu vẫn được lưu an toàn trong CRM.";
                    console.warn("Direct email notification fallback notice:", err);
                }
            }

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }

            form.reset();
            showLeadSuccessModal(leadRecord, cloudSaved, emailSent, emailStatusNote);
        });
    });
}

function showLeadSuccessModal(lead, cloudSaved, emailSent, emailStatusNote = "") {
    const modal = document.getElementById("leadSuccessModal");
    const body = document.getElementById("leadSuccessBody");
    if (!modal || !body) return;

    body.innerHTML = `
        <div style="text-align:center; padding:10px 0;">
            <div style="width:64px; height:64px; border-radius:50%; background:#d1fae5; color:#059669; font-size:2rem; display:inline-flex; align-items:center; justify-content:center; margin-bottom:14px;">
                ✓
            </div>
            <h3 style="font-size:1.5rem; margin-bottom:8px;">Đăng Ký Nhận Tư Vấn Thành Công!</h3>
            <p style="color:#4b5563; font-size:0.94rem; margin-bottom:18px;">
                Cảm ơn Quý khách <strong>${lead.fullName}</strong> (SĐT: <strong>${lead.phone}</strong>).
                Hệ thống đã ghi nhận yêu cầu tư vấn: <strong>${lead.unitInterest}</strong>.
            </p>
            <div style="background:#f8faf9; border:1px solid #cbd5e1; border-radius:10px; padding:14px; text-align:left; font-size:0.84rem; margin-bottom:20px; display:flex; flex-direction:column; gap:6px;">
                <div>✅ <strong>Lưu trữ CRM nội bộ:</strong> Đã lưu thành công (Mã: <code>${lead.id}</code>)</div>
                <div>📧 <strong>Email nhận thông báo (<code>${APP_CONFIG.targetEmail}</code>):</strong> ${emailStatusNote || (emailSent ? "Đã gửi tự động" : "Đang chờ kích hoạt")}</div>
                <div>☁️ <strong>Google Sheets Cloud CRM:</strong> ${cloudSaved ? "✅ Đã đồng bộ lên Google Sheets & gửi Gmail" : "Chưa dán link Google Apps Script (Có thể xem & xuất Excel ngay tại mục Quản trị CRM cuối trang)"}</div>
            </div>
            <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                <a href="assets/docs/bang_hang_eco_garden.pdf" target="_blank" class="btn btn-gold">
                    📥 Tải Bảng Hàng PDF Gốc
                </a>
                <a href="assets/docs/chinh_sach_ban_hang.pdf" target="_blank" class="btn btn-emerald">
                    📥 Tải Chính Sách Bán Hàng
                </a>
                <button type="button" class="btn" style="background:#e2e8f0;" onclick="closeModal('leadSuccessModal')">
                    Đóng
                </button>
            </div>
        </div>
    `;
    modal.classList.add("open");
}

/* ==========================================================================
   7. BẢNG QUẢN TRỊ DỮ LIỆU KHÁCH HÀNG (ADMIN CRM MODAL & XUẤT EXCEL CSV)
   ========================================================================== */
function initCrmDashboard() {
    updateCrmBadgeCount();
}

function updateCrmBadgeCount() {
    const count = getStoredLeads().length;
    document.querySelectorAll(".js-crm-count").forEach(el => {
        el.textContent = count;
    });
}

window.openCrmModal = function() {
    const pin = prompt("Nhập mã PIN Quản trị viên để xem Kho dữ liệu Khách hàng (Mặc định: 2026):", "2026");
    if (pin !== APP_CONFIG.adminPin) {
        if (pin !== null) alert("Mã PIN không chính xác!");
        return;
    }
    renderCrmTable();
    const modal = document.getElementById("crmAdminModal");
    if (modal) modal.classList.add("open");
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
};

function renderCrmTable() {
    const tbody = document.getElementById("crmLeadsTableBody");
    const leads = getStoredLeads();
    if (!tbody) return;

    if (leads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:28px; color:#6b7280;">Chưa có dữ liệu khách hàng nào. Hãy thử điền form đăng ký trên trang để kiểm tra!</td></tr>`;
        return;
    }

    tbody.innerHTML = leads.map((l, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td><small>${l.timestamp}</small></td>
            <td><strong>${l.fullName}</strong></td>
            <td><a href="tel:${l.phone}" style="color:#059669; font-weight:700;">${l.phone}</a></td>
            <td>${l.unitInterest}</td>
            <td>${l.financeOption}</td>
            <td>
                <select onchange="updateLeadStatus('${l.id}', this.value)" style="padding:4px 8px; border-radius:6px; border:1px solid #cbd5e1; font-size:0.8rem;">
                    <option value="Mới đăng ký" ${l.status === "Mới đăng ký" ? "selected" : ""}>🟢 Mới đăng ký</option>
                    <option value="Đã gọi tư vấn" ${l.status === "Đã gọi tư vấn" ? "selected" : ""}>🔵 Đã gọi tư vấn</option>
                    <option value="Hẹn xem thực tế" ${l.status === "Hẹn xem thực tế" ? "selected" : ""}>🟠 Hẹn xem thực tế</option>
                    <option value="Đã đặt cọc / Chốt" ${l.status === "Đã đặt cọc / Chốt" ? "selected" : ""}>⭐ Đã đặt cọc / Chốt</option>
                </select>
            </td>
            <td>
                <button type="button" onclick="deleteLead('${l.id}')" style="background:#fee2e2; color:#991b1b; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:0.75rem;">
                    Xóa
                </button>
            </td>
        </tr>
    `).join("");
}

window.updateLeadStatus = function(leadId, newStatus) {
    const leads = getStoredLeads();
    const target = leads.find(l => l.id === leadId);
    if (target) {
        target.status = newStatus;
        localStorage.setItem(APP_CONFIG.localStorageKey, JSON.stringify(leads));
    }
};

window.deleteLead = function(leadId) {
    if (!confirm("Bạn có chắc chắn muốn xóa dữ liệu khách hàng này?")) return;
    const leads = getStoredLeads().filter(l => l.id !== leadId);
    localStorage.setItem(APP_CONFIG.localStorageKey, JSON.stringify(leads));
    updateCrmBadgeCount();
    renderCrmTable();
};

window.exportLeadsCsv = function() {
    const leads = getStoredLeads();
    if (leads.length === 0) {
        alert("Chưa có dữ liệu khách hàng để xuất file!");
        return;
    }
    const headers = ["Mã Lead", "Thời gian", "Họ và Tên", "Số Điện Thoại", "Email", "Căn hộ quan tâm", "Phương án tài chính", "Tài liệu yêu cầu", "Trạng thái", "Nguồn"];
    const csvRows = [
        headers.join(","),
        ...leads.map(l => [
            l.id,
            `"${l.timestamp}"`,
            `"${(l.fullName || "").replace(/"/g, '""')}"`,
            `"${l.phone}"`,
            `"${l.email || ""}"`,
            `"${(l.unitInterest || "").replace(/"/g, '""')}"`,
            `"${(l.financeOption || "").replace(/"/g, '""')}"`,
            `"${(l.requestedDocs || "").replace(/"/g, '""')}"`,
            `"${l.status}"`,
            `"${l.source}"`
        ].join(","))
    ];

    // Thêm BOM \uFEFF để mở bằng Microsoft Excel hiển thị chuẩn tiếng Việt có dấu
    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Danh_Sach_Khach_Hang_Eco_Garden_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

