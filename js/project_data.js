/**
 * @file project_data.js
 * @description Cơ sở dữ liệu tĩnh đầy đủ của dự án Chung cư Thương mại Eco Garden (Bắc Ninh / Bắc Giang).
 * Toàn bộ số liệu được trích xuất nguyên bản 100% từ bộ tài liệu chính thức của Chủ đầu tư Capital House:
 * - Bảng hàng chung Eco Garden áp dụng từ 26/07/2026 (39 căn hộ thương mại)
 * - Quỹ căn giá đặc biệt & Chính sách bán hàng 4 KHÔNG - 4 CÓ
 * - Bảng hàng 12 căn Shophouse khối đế sở hữu lâu dài
 * - Bản đồ liên kết vùng & So sánh giá các dự án lân cận
 */

// 1. DỮ LIỆU ĐIỂM KẾT NỐI TRÊN BẢN ĐỒ TƯƠNG TÁC (VR / PIN MAP)
// Tọa độ (x, y) tính theo % trên ảnh nền assets/maps/map_01.jpg
const MAP_HOTSPOTS = [
    {
        id: "aeon-mall",
        name: "TTTM Aeon Mall & Trung tâm Hành chính mới",
        category: "shopping",
        categoryLabel: "Thương mại - Hành chính",
        distanceKm: "0.15 km",
        timeMin: "1 phút đi bộ",
        x: 47.0,
        y: 78.0,
        highlight: true,
        desc: "Chỉ cách 100m - 150m. Đại siêu thị Aeon Mall quy mô bậc nhất khu vực kết hợp Trung tâm Hành chính mới tỉnh Bắc Ninh, bảo chứng tiềm năng tăng giá và cho thuê vượt trội."
    },
    {
        id: "fpt-school",
        name: "Trường Liên cấp FPT Bắc Giang",
        category: "education",
        categoryLabel: "Giáo dục",
        distanceKm: "0.2 km",
        timeMin: "1 phút",
        x: 56.5,
        y: 80.5,
        highlight: true,
        desc: "Cách dự án chỉ vài bước chân (~200m). Môi trường giáo dục chuẩn quốc tế từ Tiểu học đến THPT ngay sát thềm nhà."
    },
    {
        id: "lotte-cinema",
        name: "Lotte Cinema & Big C (GO!) Bắc Giang",
        category: "shopping",
        categoryLabel: "Mua sắm - Giải trí",
        distanceKm: "0.35 km",
        timeMin: "1 - 2 phút",
        x: 61.5,
        y: 68.5,
        highlight: false,
        desc: "Tổ hợp rạp chiếu phim Lotte Cinema và trung tâm thương mại sầm uất hiện hữu ngay khu đô thị phía Nam."
    },
    {
        id: "cv-tuoi-tre",
        name: "Công viên Tuổi Trẻ & Quảng trường",
        category: "park",
        categoryLabel: "Công viên - Sinh thái",
        distanceKm: "0.4 km",
        timeMin: "2 phút",
        x: 45.5,
        y: 59.0,
        highlight: false,
        desc: "Lá phổi xanh kế cận dự án, mang lại tầm nhìn thoáng đãng và không gian dạo bộ, thể thao mỗi ngày cho cư dân."
    },
    {
        id: "tinh-uy",
        name: "Trụ sở Tỉnh ủy & Quảng trường 3/2",
        category: "admin",
        categoryLabel: "Hành chính - Văn hóa",
        distanceKm: "1.8 km",
        timeMin: "4 phút",
        x: 42.5,
        y: 35.0,
        highlight: false,
        desc: "Kết nối thẳng qua trục đường chính tới lõi trung tâm hành chính - chính trị của tỉnh."
    },
    {
        id: "cv-hoang-hoa-tham",
        name: "Công viên Hoàng Hoa Thám",
        category: "park",
        categoryLabel: "Công viên - Giải trí",
        distanceKm: "1.5 km",
        timeMin: "3 phút",
        x: 34.0,
        y: 44.5,
        highlight: false,
        desc: "Quần thể công viên cây xanh, hồ điều hòa và khu vui chơi văn hóa lớn tại trung tâm thành phố."
    },
    {
        id: "benh-vien-da-khoa",
        name: "Bệnh viện Đa khoa Tỉnh & BV Sản Nhi",
        category: "medical",
        categoryLabel: "Y tế",
        distanceKm: "2.2 km",
        timeMin: "5 phút",
        x: 29.5,
        y: 34.5,
        highlight: false,
        desc: "Hệ thống y tế tuyến đầu của tỉnh gồm Bệnh viện Đa khoa, Bệnh viện Sản Nhi, Bệnh viện Nội tiết trong bán kính 5 phút di chuyển."
    },
    {
        id: "cao-toc-hn-ls",
        name: "Cao tốc Hà Nội - Bắc Giang - Lạng Sơn & ĐT 293",
        category: "traffic",
        categoryLabel: "Giao thông huyết mạch",
        distanceKm: "0.8 km",
        timeMin: "2 phút",
        x: 68.0,
        y: 55.0,
        highlight: true,
        desc: "Nằm ngay giao điểm đại lộ ĐT 293 và Quốc lộ 1A / Cao tốc Hà Nội - Bắc Giang, dễ dàng kết nối tới các KCN lớn (Quang Châu, Vân Trung, Đình Trám, Song Khê - Nội Hoàng) và Thủ đô Hà Nội (45 phút)."
    }
];

// 2. BẢNG SO SÁNH GIÁ CÁC DỰ ÁN TRONG KHU VỰC (Từ Slide Đào tạo & Bản đồ giá)
const COMPETITOR_DATA = [
    {
        project: "Eco Garden (Capital House)",
        location: "KĐT phía Nam (Cách Aeon Mall 100m)",
        priceRange: "39 - 45 triệu/m²",
        total2PN: "Từ 2.40 - 2.82 tỷ/căn",
        handover: "Quý IV/2026 (Sẵn sàng bàn giao)",
        greenCert: "Chứng chỉ Xanh Quốc tế EDGE (SGS)",
        policy: "HTLS 0% 24 tháng + Cam kết thuê 5%/năm (24 tháng) hoặc CK tới 23%",
        isEcoGarden: true
    },
    {
        project: "Royal Mansion (Tuta)",
        location: "Ngã 6 trung tâm KĐT phía Nam",
        priceRange: "70 - 80 triệu/m²",
        total2PN: "4.8 - 5.5 tỷ/căn",
        handover: "Đang triển khai",
        greenCert: "Tiêu chuẩn thương mại",
        policy: "Theo tiến độ CĐT",
        isEcoGarden: false
    },
    {
        project: "Vinhomes Sky Park",
        location: "Đường Ngô Gia Tự, Trung tâm TP",
        priceRange: "55 - 65 triệu/m²",
        total2PN: "3.8 - 4.6 tỷ/căn",
        handover: "Đã bàn giao (2024)",
        greenCert: "Tiêu chuẩn Vinhomes",
        policy: "Chuyển nhượng thứ cấp",
        isEcoGarden: false
    },
    {
        project: "HP Intermix Tower",
        location: "Phố đi bộ KĐT phía Nam",
        priceRange: "50 - 70 triệu/m²",
        total2PN: "3.5 - 4.8 tỷ/căn",
        handover: "Đang xây dựng",
        greenCert: "Tiêu chuẩn thương mại",
        policy: "HTLS theo đợt",
        isEcoGarden: false
    },
    {
        project: "Luxora Bắc Giang",
        location: "Phố đi bộ KĐT phía Nam",
        priceRange: "50 - 65 triệu/m²",
        total2PN: "3.6 - 4.5 tỷ/căn",
        handover: "Đang xây dựng",
        greenCert: "Tiêu chuẩn thương mại",
        policy: "HTLS theo đợt",
        isEcoGarden: false
    },
    {
        project: "Mascity Tower",
        location: "KĐT phía Nam (Cạnh ĐT 293)",
        priceRange: "45 - 50 triệu/m²",
        total2PN: "3.0 - 3.5 tỷ/căn",
        handover: "Đang hoàn thiện",
        greenCert: "Tiêu chuẩn thương mại",
        policy: "HTLS 12-18 tháng",
        isEcoGarden: false
    }
];

// 3. DỮ LIỆU MẶT BẰNG & LAYOUT BÓC MÁI 3D TỪNG LOẠI CĂN HỘ
const UNIT_TYPES_DATA = [
    {
        id: "3pn-goc",
        code: "CH01 & CH09",
        name: "Căn Góc 3 Phòng Ngủ - Gia Đình Đa Thế Hệ",
        bedrooms: "3PN + 2WC + 2 Logia",
        area: "69.2 - 69.3 m²",
        direction: "Ban công Tây Bắc - Cửa Đông Nam (2 mặt thoáng)",
        unitsPerFloor: "02 căn/sàn (Trục 01 & 09)",
        specialPriceOwn: "2.81 - 2.92 tỷ",
        specialPriceLoan: "3.33 - 3.45 tỷ",
        image3D: "assets/floorplans/ch01_09.jpg",
        interiorImages: [
            "assets/interiors/can09_3pn_goc.jpg",
            "assets/interiors/can01_1.jpg",
            "assets/interiors/can01_2.jpg",
            "assets/interiors/can01_4.jpg"
        ],
        highlights: [
            "Sở hữu căn hộ 3 phòng ngủ diện tích tối ưu 69.3m² với tổng giá chỉ tương đương căn 2PN dự án khác.",
            "Vị trí góc 2 mặt thoáng, 100% phòng ngủ và phòng khách đón ánh sáng & gió tự nhiên.",
            "Thiết kế '3 KHÔNG': Không góc chết - Không phòng tối - Không khe hút gió.",
            "Phù hợp hoàn hảo cho gia đình đa thế hệ hoặc chuyên gia nước ngoài thuê ở dài hạn."
        ]
    },
    {
        id: "2pn-goc",
        code: "CH02 & CH08",
        name: "Căn Góc 2 Phòng Ngủ Đẳng Cấp - View Công Viên & Aeon Mall",
        bedrooms: "2PN + 2WC + 2 Logia",
        area: "61.9 m²",
        direction: "Ban công Đông Nam mát mẻ - Cửa Tây Bắc",
        unitsPerFloor: "02 căn/sàn (Trục 02 & 08)",
        specialPriceOwn: "2.64 - 2.82 tỷ",
        specialPriceLoan: "3.12 - 3.34 tỷ",
        image3D: "assets/floorplans/ch02_08.jpg",
        interiorImages: [
            "assets/interiors/can02_2pn_goc.jpg",
            "assets/interiors/can08_1.jpg",
            "assets/interiors/can08_2.jpg",
            "assets/interiors/can08_3.jpg"
        ],
        highlights: [
            "Căn góc 2PN diện tích 61.9m² rộng rãi, ban công hướng Đông Nam đón gió mát mùa hè, ấm áp mùa đông.",
            "Tầm nhìn Panorama trực diện về phía Aeon Mall và Công viên nội khu.",
            "Bếp tách biệt kết nối trực tiếp ra logia phụ, ngăn mùi tuyệt đối cho phòng khách.",
            "Thanh khoản số 1 dự án cả về mua ở thực lẫn khai thác cho thuê chuyên gia Hàn Quốc/Trung Quốc."
        ]
    },
    {
        id: "2pn-thuong",
        code: "CH04, CH05, CH06, CH07, CH11",
        name: "Căn 2 Phòng Ngủ Tiêu Chuẩn & 1PN+ Đa Năng (CH12)",
        bedrooms: "2PN + 2WC (CH04-07,11) | 1PN+1 (CH12)",
        area: "59.7 - 60.1 m² (CH12: 45.4 m²)",
        direction: "Ban công Đông Nam (CH04-07) / Tây Bắc (CH11-12)",
        unitsPerFloor: "06 căn/sàn",
        specialPriceOwn: "2.40 - 2.61 tỷ (CH12: 1.83 tỷ)",
        specialPriceLoan: "2.84 - 3.08 tỷ (CH12: 2.16 tỷ)",
        image3D: "assets/floorplans/ch04_12.jpg",
        interiorImages: [
            "assets/interiors/can02_2pn_goc.jpg",
            "assets/interiors/can08_1.jpg"
        ],
        highlights: [
            "Mặt bằng vuông vức, tối ưu từng mét vuông diện tích thông thủy.",
            "Các trục CH04, CH05, CH06, CH07 sở hữu ban công Đông Nam cực hiếm trong phân khúc trên dưới 2.5 tỷ.",
            "Riêng trục CH12 (45.4m²) thiết kế 1PN+1 thông minh: dễ dàng bố trí thêm phòng làm việc hoặc giường trẻ em với tầm giá chỉ từ 1.83 tỷ."
        ]
    },
    {
        id: "1pn-ch03-10",
        code: "CH03 & CH10",
        name: "Căn 1 Phòng Ngủ Tiêu Chuẩn (Tầng 3 - 19)",
        bedrooms: "1PN + 1WC + 1 Logia",
        area: "36.8 m² (CH10) - 38.0 m² (CH03)",
        direction: "Ban công Tây Bắc - View Quảng trường & Thành phố",
        unitsPerFloor: "02 căn/sàn (Trục 03 & 10)",
        specialPriceOwn: "1.57 - 1.74 tỷ",
        specialPriceLoan: "1.88 - 2.06 tỷ",
        image3D: "assets/floorplans/ch03_10.jpg",
        interiorImages: [
            "assets/interiors/can08_2.jpg",
            "assets/interiors/can08_3.jpg"
        ],
        highlights: [
            "Suất đầu tư vừa túi tiền nhất khu đô thị phía Nam Bắc Giang: Vốn tự có 30% chỉ từ ~500 triệu sở hữu ngay.",
            "Hưởng trọn cam kết thuê lại 5%/năm trong 24 tháng từ Chủ đầu tư Capital House.",
            "Thiết kế phòng ngủ riêng biệt (không phải Studio trống), đảm bảo sự riêng tư và sang trọng."
        ]
    },
    {
        id: "1pn-ch12a",
        code: "CH12A",
        name: "Căn 1 Phòng Ngủ Tối Ưu (Tầng 11 - 19)",
        bedrooms: "1PN + 1WC + 1 Logia",
        area: "35.8 m²",
        direction: "Ban công Tây Bắc (Tầng cao 11 - 19 thoáng đãng)",
        unitsPerFloor: "01 căn/sàn (Từ tầng 11 - 19)",
        specialPriceOwn: "1.47 - 1.48 tỷ",
        specialPriceLoan: "1.74 - 1.76 tỷ",
        image3D: "assets/floorplans/ch12a.jpg",
        interiorImages: [
            "assets/interiors/can08_3.jpg"
        ],
        highlights: [
            "Mức giá khởi điểm tốt nhất toàn dự án: Chỉ từ 1.47 tỷ/căn hộ thương mại sở hữu lâu dài.",
            "Tọa lạc tại các tầng cao (11 - 19), tầm nhìn không giới hạn, không bụi và tiếng ồn.",
            "Sản phẩm 'gà đẻ trứng vàng' cho nhà đầu tư khai thác dòng tiền cho thuê chuyên gia KCN."
        ]
    }
];

// 4. BẢNG TỔNG HỢP KHOẢNG GIÁ QUỸ CĂN ĐẶC BIỆT (Theo Slide Chính sách bán hàng)
const SPECIAL_FUND_SUMMARY = [
    { code: "CH12A", type: "1PN (Tầng 11-19)", area: "35.8 m²", ownCapPrice: "1.47 - 1.48 tỷ", loanPrice: "1.74 - 1.76 tỷ", downPayment30: "~520 triệu" },
    { code: "CH10", type: "1PN", area: "36.8 m²", ownCapPrice: "Từ 1.57 tỷ", loanPrice: "Từ 1.88 tỷ", downPayment30: "~560 triệu" },
    { code: "CH03", type: "1PN", area: "38.0 m²", ownCapPrice: "1.69 - 1.74 tỷ", loanPrice: "2.00 - 2.06 tỷ", downPayment30: "~600 triệu" },
    { code: "CH12", type: "1PN+ / 2PN nhỏ", area: "45.4 m²", ownCapPrice: "1.83 - 1.84 tỷ", loanPrice: "2.16 - 2.18 tỷ", downPayment30: "~650 triệu" },
    { code: "CH11", type: "2PN", area: "59.7 m²", ownCapPrice: "2.40 - 2.44 tỷ", loanPrice: "2.84 - 2.88 tỷ", downPayment30: "~850 triệu" },
    { code: "CH04", type: "2PN (Đông Nam)", area: "60.0 m²", ownCapPrice: "2.42 - 2.49 tỷ", loanPrice: "2.86 - 2.95 tỷ", downPayment30: "~860 triệu" },
    { code: "CH05, CH06, CH07", type: "2PN (Đông Nam)", area: "60.1 m²", ownCapPrice: "2.42 - 2.61 tỷ", loanPrice: "2.86 - 3.08 tỷ", downPayment30: "~860 triệu" },
    { code: "CH02, CH08", type: "2PN Góc (Đông Nam)", area: "61.9 m²", ownCapPrice: "2.64 - 2.82 tỷ", loanPrice: "3.12 - 3.34 tỷ", downPayment30: "~935 triệu" },
    { code: "CH01, CH09", type: "3PN Góc (2 mặt thoáng)", area: "69.2 - 69.3 m²", ownCapPrice: "2.81 - 2.92 tỷ", loanPrice: "3.33 - 3.45 tỷ", downPayment30: "~995 triệu" }
];

// 5. BẢNG HÀNG CHI TIẾT 39 CĂN HỘ (Trích xuất chính xác từng con số từ Bảng hàng chung áp dụng từ 26/07)
// status: "AVAILABLE" (Chưa bán - Nền trắng trên PDF) | "SOLD" (Đã bán - Nền đỏ trên PDF)
const INVENTORY_DATA = [
    { stt: 1, tower: "NOTM", floor: 5, code: "A-0501", typeCode: "CH01", area: 69.3, beds: "3PN", direction: "Tây Bắc", priceTTS: 2766138570, priceLoan: 3808350677, priceStd: 3464074327, status: "SOLD" },
    { stt: 2, tower: "NOTM", floor: 9, code: "A-0901", typeCode: "CH01", area: 69.3, beds: "3PN", direction: "Tây Bắc", priceTTS: 3089587709, priceLoan: 3974824421, priceStd: 3615529244, status: "AVAILABLE" },
    { stt: 3, tower: "NOTM", floor: 17, code: "A-1701", typeCode: "CH01", area: 69.3, beds: "3PN", direction: "Tây Bắc", priceTTS: 2873839844, priceLoan: 3956327338, priceStd: 3598700920, status: "SOLD" },
    { stt: 4, tower: "NOTM", floor: 3, code: "A-0302", typeCode: "CH02", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 2858185146, priceLoan: 3676943870, priceStd: 3344597115, status: "AVAILABLE" },
    { stt: 5, tower: "NOTM", floor: 12, code: "A-12A02", typeCode: "CH02", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 2913436937, priceLoan: 4009898846, priceStd: 3647513761, status: "SOLD" },
    { stt: 6, tower: "NOTM", floor: 19, code: "A-1902", typeCode: "CH02", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 3074177479, priceLoan: 3954437162, priceStd: 3597055686, status: "AVAILABLE" },
    { stt: 7, tower: "NOTM", floor: 4, code: "A-0404", typeCode: "CH04", area: 60.0, beds: "2PN", direction: "Đông Nam", priceTTS: 2492898817, priceLoan: 3207495819, priceStd: 2917520549, status: "AVAILABLE" },
    { stt: 8, tower: "NOTM", floor: 7, code: "A-0704", typeCode: "CH04", area: 60.0, beds: "2PN", direction: "Đông Nam", priceTTS: 2631111556, priceLoan: 3385062807, priceStd: 3079067906, status: "AVAILABLE" },
    { stt: 9, tower: "NOTM", floor: 9, code: "A-0904", typeCode: "CH04", area: 60.0, beds: "2PN", direction: "Đông Nam", priceTTS: 2530130385, priceLoan: 3483039142, priceStd: 3168205072, status: "SOLD" },
    { stt: 10, tower: "NOTM", floor: 13, code: "A-12B04", typeCode: "CH04", area: 60.0, beds: "2PN", direction: "Đông Nam", priceTTS: 2482297107, priceLoan: 3417318390, priceStd: 3108413475, status: "SOLD" },
    { stt: 11, tower: "NOTM", floor: 14, code: "A-1404", typeCode: "CH04", area: 60.0, beds: "2PN", direction: "Đông Nam", priceTTS: 2494739629, priceLoan: 3434413850, priceStd: 3123966627, status: "SOLD" },
    { stt: 12, tower: "NOTM", floor: 18, code: "A-1804", typeCode: "CH04", area: 60.0, beds: "2PN", direction: "Đông Nam", priceTTS: 2576202928, priceLoan: 3546340725, priceStd: 3225795751, status: "SOLD" },
    { stt: 13, tower: "NOTM", floor: 19, code: "A-1904", typeCode: "CH04", area: 60.0, beds: "2PN", direction: "Đông Nam", priceTTS: 2621807351, priceLoan: 3373109352, priceStd: 3068192861, status: "AVAILABLE" },
    { stt: 14, tower: "NOTM", floor: 5, code: "A-0505", typeCode: "CH05", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2598151057, priceLoan: 3342725204, priceStd: 3040548886, status: "AVAILABLE" },
    { stt: 15, tower: "NOTM", floor: 17, code: "A-1705", typeCode: "CH05", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2512375281, priceLoan: 3469334988, priceStd: 3154945009, status: "SOLD" },
    { stt: 16, tower: "NOTM", floor: 6, code: "A-0606", typeCode: "CH06", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2524201720, priceLoan: 3474904684, priceStd: 3160803478, status: "SOLD" },
    { stt: 17, tower: "NOTM", floor: 11, code: "A-1106", typeCode: "CH06", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2559118797, priceLoan: 3522879163, priceStd: 3204449824, status: "SOLD" },
    { stt: 18, tower: "NOTM", floor: 19, code: "A-1906", typeCode: "CH06", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2726565190, priceLoan: 3507703562, priceStd: 3190643327, status: "AVAILABLE" },
    { stt: 19, tower: "NOTM", floor: 3, code: "A-0307", typeCode: "CH07", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2560239529, priceLoan: 3294018870, priceStd: 2996236710, status: "AVAILABLE" },
    { stt: 20, tower: "NOTM", floor: 5, code: "A-0507", typeCode: "CH07", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2565805041, priceLoan: 3301169087, priceStd: 3002741853, status: "AVAILABLE" },
    { stt: 21, tower: "NOTM", floor: 6, code: "A-0607", typeCode: "CH07", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2549380021, priceLoan: 3509498526, priceStd: 3192276353, status: "SOLD" },
    { stt: 22, tower: "NOTM", floor: 7, code: "A-0707", typeCode: "CH07", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2537928051, priceLoan: 3493764039, priceStd: 3177961391, status: "SOLD" },
    { stt: 23, tower: "NOTM", floor: 13, code: "A-12B07", typeCode: "CH07", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2562158008, priceLoan: 3527054901, priceStd: 3208248838, status: "SOLD" },
    { stt: 24, tower: "NOTM", floor: 19, code: "A-1907", typeCode: "CH07", area: 60.1, beds: "2PN", direction: "Đông Nam", priceTTS: 2753746010, priceLoan: 3542623761, priceStd: 3222413116, status: "AVAILABLE" },
    { stt: 25, tower: "NOTM", floor: 3, code: "A-0308", typeCode: "CH08", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 2921644585, priceLoan: 3758472546, priceStd: 3418770486, status: "AVAILABLE" },
    { stt: 26, tower: "NOTM", floor: 4, code: "A-0408", typeCode: "CH08", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 2936279109, priceLoan: 3777274056, priceStd: 3435875773, status: "AVAILABLE" },
    { stt: 27, tower: "NOTM", floor: 6, code: "A-0608", typeCode: "CH08", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 3059166815, priceLoan: 3935152410, priceStd: 3579510754, status: "AVAILABLE" },
    { stt: 28, tower: "NOTM", floor: 7, code: "A-0708", typeCode: "CH08", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 3099032753, priceLoan: 3986369647, priceStd: 3626107305, status: "AVAILABLE" },
    { stt: 29, tower: "NOTM", floor: 13, code: "A-12B08", typeCode: "CH08", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 2923956681, priceLoan: 4024352497, priceStd: 3660663442, status: "SOLD" },
    { stt: 30, tower: "NOTM", floor: 19, code: "A-1908", typeCode: "CH08", area: 61.9, beds: "2PN", direction: "Đông Nam", priceTTS: 3088076503, priceLoan: 3972293750, priceStd: 3613301299, status: "AVAILABLE" },
    { stt: 31, tower: "NOTM", floor: 3, code: "A-0309", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 2741073195, priceLoan: 3773900731, priceStd: 3432733371, status: "SOLD" },
    { stt: 32, tower: "NOTM", floor: 5, code: "A-0509", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 3021373468, priceLoan: 3887179115, priceStd: 3535792075, status: "AVAILABLE" },
    { stt: 33, tower: "NOTM", floor: 7, code: "A-0709", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 3173671330, priceLoan: 4082841779, priceStd: 3713802563, status: "AVAILABLE" },
    { stt: 34, tower: "NOTM", floor: 8, code: "A-0809", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 3177254743, priceLoan: 4087445521, priceStd: 3717990968, status: "AVAILABLE" },
    { stt: 35, tower: "NOTM", floor: 11, code: "A-1109", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 2983123170, priceLoan: 4106466409, priceStd: 3735295841, status: "SOLD" },
    { stt: 36, tower: "NOTM", floor: 12, code: "A-12A09", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 3080392415, priceLoan: 4240109935, priceStd: 3856882397, status: "SOLD" },
    { stt: 37, tower: "NOTM", floor: 17, code: "A-1709", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 3234234223, priceLoan: 4160649154, priceStd: 3784590360, status: "SOLD" },
    { stt: 38, tower: "NOTM", floor: 18, code: "A-1809", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 3251281144, priceLoan: 4182549961, priceStd: 3804515333, status: "AVAILABLE" },
    { stt: 39, tower: "NOTM", floor: 19, code: "A-1909", typeCode: "CH09", area: 69.2, beds: "3PN", direction: "Tây Bắc", priceTTS: 3250434796, priceLoan: 4181462626, priceStd: 3803526095, status: "AVAILABLE" }
];

// 6. DỮ LIỆU 12 CĂN SHOPHOUSE KHỐI ĐẾ SỞ HỮU LÂU DÀI (Từ tài liệu SHOP TMDV ECO GARDEN)
const SHOPHOUSE_DATA = [
    { code: "A-0101", type: "Shophouse 2 Tầng (Căn Góc)", area1: 66.5, area2: 71.4, totalArea: 137.9, legal: "Sổ hồng lâu dài", note: "Mặt sảnh chính & đường nội khu lớn" },
    { code: "A-0102", type: "Shophouse 2 Tầng", area1: 59.3, area2: 64.2, totalArea: 123.5, legal: "Sổ hồng lâu dài", note: "Mặt tiền trực diện đường lớn" },
    { code: "A-0103", type: "Shophouse 2 Tầng", area1: 35.4, area2: 40.6, totalArea: 76.0, legal: "Sổ hồng lâu dài", note: "Diện tích vừa phải, tối ưu vốn đầu tư" },
    { code: "A-0104", type: "Shophouse 2 Tầng", area1: 59.1, area2: 61.2, totalArea: 120.3, legal: "Sổ hồng lâu dài", note: "Cạnh sảnh đón cư dân tòa thương mại" },
    { code: "A-0105", type: "Shophouse 2 Tầng", area1: 63.3, area2: 67.3, totalArea: 130.6, legal: "Sổ hồng lâu dài", note: "Phù hợp Cafe, Ngân hàng, Showroom" },
    { code: "A-0106", type: "Shophouse 2 Tầng", area1: 65.1, area2: 68.6, totalArea: 133.7, legal: "Sổ hồng lâu dài", note: "Mặt tiền thoáng rộng, trần cao 2 tầng" },
    { code: "A-0107", type: "Shophouse 2 Tầng", area1: 65.1, area2: 68.6, totalArea: 133.7, legal: "Sổ hồng lâu dài", note: "Đón trọn 3.000 cư dân nội khu (1.265 căn hộ)" },
    { code: "A-0108", type: "Shophouse 2 Tầng", area1: 66.6, area2: 71.0, totalArea: 137.6, legal: "Sổ hồng lâu dài", note: "Phù hợp Siêu thị mini, Nhà hàng, Phòng khám" },
    { code: "A-0109", type: "Shophouse 2 Tầng (Căn Góc)", area1: 66.9, area2: 71.5, totalArea: 138.4, legal: "Sổ hồng lâu dài", note: "Căn góc 2 mặt tiền diện tích lớn nhất" },
    { code: "A-0110", type: "Shop 1 Tầng", area1: 43.8, area2: 0, totalArea: 43.8, legal: "Sổ hồng lâu dài", note: "Giá từ 2.8x tỷ - Vốn tự có chỉ từ 850 triệu" },
    { code: "A-0111", type: "Shop 1 Tầng", area1: 59.8, area2: 0, totalArea: 59.8, legal: "Sổ hồng lâu dài", note: "Đối diện cụm tiện ích nội khu & tòa E1, E2" },
    { code: "A-0112", type: "Shop 1 Tầng", area1: 34.2, area2: 0, totalArea: 34.2, legal: "Sổ hồng lâu dài", note: "Suất đầu tư nhỏ nhất, phù hợp Hiệu thuốc, Trà sữa, Spa" }
];

// 7. DANH MỤC VẬT LIỆU BÀN GIAO CAO CẤP (Trích từ Phụ lục Tiêu chuẩn bàn giao)
const HANDOVER_SPECS = [
    { category: "Cửa chính & Khóa từ", spec: "Cửa gỗ công nghiệp chống cháy An Cường / Galaxy. Khóa thông minh đa năng tích hợp vân tay, mã số, thẻ từ, chìa cơ (Hafele / Adel / Kaadas hoặc tương đương)." },
    { category: "Sàn & Trần nội thất", spec: "Phòng khách & Phòng ngủ lát sàn gỗ công nghiệp cao cấp chống ẩm 12mm (An Cường / Newsky). Trần thạch cao khung xương chìm Vĩnh Tường, sơn nước hoàn thiện Jotun / Dulux." },
    { category: "Hệ thống Điều hòa", spec: "Bàn giao sẵn điều hòa 2 chiều (Multi hoặc cục bộ) tại Phòng khách và tất cả các Phòng ngủ thương hiệu Casper / Midea / Gree / Hisense." },
    { category: "Thiết bị Vệ sinh", spec: "Trang bị đầy đủ Sen cây tắm đứng, Lavabo bàn đá, Bồn cầu nguyên khối, Bình nóng lạnh Ferroli/Ariston, Quạt hút mùi, Vách kính tắm đứng cường lực thương hiệu INAX / TOTO / Bravat." },
    { category: "Hệ cửa kính & Ban công", spec: "Hệ cửa nhôm kính cường lực cao cấp Việt Pháp / Xingfa cách âm cách nhiệt, giảm bức xạ nhiệt theo tiêu chuẩn công trình xanh Quốc tế EDGE." },
    { category: "Thang máy & An ninh", spec: "03 thang máy tốc độ cao Mitsubishi / Hyundai / Hitachi (Mật độ cực thoáng: ~4 căn/thang/tầng). Sảnh chờ rộng 2.4m, kiểm soát thẻ từ phân tầng và Camera an ninh 24/7." }
];

