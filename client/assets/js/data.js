/*
 * Dữ liệu demo cho Chuyên trang Sách nói & Nội dung số.
 * Đây là dữ liệu minh hoạ tĩnh, không phải kết nối CSDL thật.
 */

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "van-hoc", label: "Văn học" },
  { id: "triet-hoc", label: "Triết học" },
  { id: "ho-chi-minh", label: "Chủ tịch Hồ Chí Minh" },
  { id: "dia-chi", label: "Địa chí Vĩnh Long" },
];

const AUDIOBOOKS = [
  {
    id: "ngon-den-cuoi-ben",
    title: "Ngọn Đèn Cuối Bến",
    category: "van-hoc",
    type: "Truyện ngắn",
    duration: "10 phút",
    voice: "Phạm Tuyên",
    listens: 1240,
    description:
      "Truyện ngắn được chuyển thành sách nói bằng AI, minh hoạ khả năng đọc toàn văn tự động.",
    src: "assets/audio/ngon-den-cuoi-ben.mp3",
    cover: { g1: "#173a46", g2: "#0a1c24", accent: "#e9b64c", motif: "lighthouse" },
  },
  {
    id: "ngon-den-cuoi-ben-ocr",
    title: "Ngọn Đèn Cuối Bến",
    subtitle: "Bản phục dựng từ tài liệu quét OCR",
    category: "van-hoc",
    type: "Truyện ngắn",
    duration: "38 phút",
    voice: "Phạm Tuyên",
    listens: 860,
    description:
      "Cùng tác phẩm nhưng xử lý từ bản PDF quét OCR, minh hoạ khả năng chuẩn hoá văn bản lỗi OCR.",
    src: "assets/audio/ngon-den-cuoi-ben-ocr.mp3",
    cover: { g1: "#16352b", g2: "#08201a", accent: "#d7a441", motif: "lighthouse" },
  },
  {
    id: "truyen-ngan-a4",
    title: "Tuyển tập truyện ngắn",
    subtitle: "Những trang viết chọn lọc",
    category: "van-hoc",
    type: "Truyện ngắn",
    duration: "40 phút",
    voice: "Phạm Tuyên",
    listens: 540,
    description: "Tài liệu ngắn minh hoạ pipeline xử lý tài liệu nhiều trang.",
    src: "assets/audio/truyen-ngan-a4.mp3",
    cover: { g1: "#4c2130", g2: "#2a1017", accent: "#dd8f5c", motif: "pages" },
  },
  {
    id: "triet-hoc-mac-lenin",
    title: "Triết học Mác - Lênin",
    subtitle: "Trích đoạn chuyên khảo",
    category: "triet-hoc",
    type: "Sách chuyên khảo",
    duration: "11 phút",
    voice: "Minh Triết",
    listens: 2130,
    description:
      "Trích đoạn tài liệu học thuật, minh hoạ khả năng đọc nội dung chuyên sâu, nhiều thuật ngữ.",
    src: "assets/audio/book-sample.mp3",
    cover: { g1: "#5d1626", g2: "#320f19", accent: "#e2c463", motif: "column" },
  },
];

const PODCASTS = [
  {
    id: "podcast-diem-sach-ngon-den",
    title: "Điểm sách: Ngọn Đèn Cuối Bến",
    category: "van-hoc",
    duration: "10 phút",
    listens: 430,
    episode: "Số 01",
    description: "Số phát demo dùng giọng đọc AI trên nền tài liệu văn học.",
    src: "assets/audio/ngon-den-cuoi-ben.mp3",
    cover: { g1: "#123642", g2: "#0a2029", accent: "#e9b64c", motif: "mic" },
  },
  {
    id: "podcast-gioi-thieu-triet-hoc",
    title: "Giới thiệu tài liệu triết học",
    category: "triet-hoc",
    duration: "11 phút",
    listens: 310,
    episode: "Số 02",
    description: "Số phát demo giới thiệu nội dung sách chuyên khảo.",
    src: "assets/audio/book-sample.mp3",
    cover: { g1: "#4a1723", g2: "#2c0e16", accent: "#e2c463", motif: "mic" },
  },
];

const VIDEOS = [
  {
    id: "video-gioi-thieu-sach-1",
    title: "Giới thiệu sách: Ngọn Đèn Cuối Bến",
    kind: "Giới thiệu sách",
    category: "van-hoc",
    status: "Sắp ra mắt",
    note: "Đang được sản xuất",
    cover: { g1: "#173a46", g2: "#0a1c24", accent: "#e9b64c", motif: "lighthouse" },
  },
  {
    id: "video-tom-tat-tac-pham-1",
    title: "Tóm tắt tác phẩm văn học",
    kind: "Tóm tắt tác phẩm",
    category: "van-hoc",
    status: "Sắp ra mắt",
    note: "Đang được sản xuất",
    cover: { g1: "#4c2130", g2: "#2a1017", accent: "#dd8f5c", motif: "pages" },
  },
  {
    id: "video-chuyen-de-ho-chi-minh",
    title: "Video chuyên đề về Chủ tịch Hồ Chí Minh",
    kind: "Video chuyên đề",
    category: "ho-chi-minh",
    status: "Sắp ra mắt",
    note: "Thuộc lộ trình 500 tài liệu",
    cover: { g1: "#7a1420", g2: "#3d0d14", accent: "#f2cf4a", motif: "star" },
  },
];

const CMS_DOCUMENTS = [
  {
    title: "Ngọn Đèn Cuối Bến",
    category: "Văn học",
    type: "Sách nói",
    duration: "10:02",
    status: "Đã xuất bản",
  },
  {
    title: "Ngọn Đèn Cuối Bến (OCR)",
    category: "Văn học",
    type: "Sách nói",
    duration: "38:41",
    status: "Đã xuất bản",
  },
  {
    title: "Truyện ngắn 2-3 trang A4",
    category: "Văn học",
    type: "Sách nói",
    duration: "40:15",
    status: "Đã xuất bản",
  },
  {
    title: "Triết học Mác - Lênin (trích đoạn)",
    category: "Triết học",
    type: "Sách nói",
    duration: "11:20",
    status: "Đã xuất bản",
  },
  {
    title: "Tiểu sử Chủ tịch Hồ Chí Minh - Tập 1",
    category: "Hồ Chí Minh",
    type: "Sách nói",
    duration: "—",
    status: "Chờ xử lý",
  },
  {
    title: "Địa chí Vĩnh Long - Chương 3",
    category: "Địa chí",
    type: "Sách nói",
    duration: "—",
    status: "Nháp",
  },
];

const PIPELINE_STEPS = [
  {
    title: "Tách trang PDF",
    detail: "Chia tài liệu gốc thành từng batch trang (PyMuPDF).",
  },
  {
    title: "Chuyển PDF sang Markdown",
    detail: "Trích xuất nội dung văn bản, loại bỏ hình ảnh (marker-pdf).",
  },
  {
    title: "Chia đoạn văn bản",
    detail: "Cắt nội dung thành các đoạn phù hợp cho xử lý AI.",
  },
  {
    title: "Chuẩn hoá văn bản bằng LLM",
    detail:
      "Chuẩn hoá chính tả, mở rộng viết tắt, chuyển số La Mã sang tiếng Việt.",
  },
  {
    title: "Sinh giọng đọc (Text-to-Speech)",
    detail: "Tạo audio từ văn bản đã chuẩn hoá (Vieneu TTS).",
  },
  {
    title: "Gộp thành audiobook hoàn chỉnh",
    detail: "Ghép các đoạn audio thành một file sách nói hoàn chỉnh (ffmpeg).",
  },
];
