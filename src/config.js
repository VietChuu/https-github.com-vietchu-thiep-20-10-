// ============================================================================
// CẤU HÌNH THIỆP 20/10 - CHỈNH SỬA NỘI DUNG TẠI ĐÂY
// ============================================================================

window.CARD_CONFIG = {
  // 1. Thông tin người nhận & người gửi
  recipientName: "Em Yêu",
  senderName: "Việt Chu",
  dateText: "20 • 10 • 2026",
  badgeText: "Happy Vietnamese Women's Day",

  // 2. Đồng hồ đếm ngày yêu (Định dạng: YYYY-MM-DD)
  // Sửa ngày bắt đầu của 2 bạn tại đây:
  loveStartDate: "2026-03-25",
  loveStartLabel: "✨ Bên nhau từ ngày 25/03/2026 ✨",
  loveCounterTitle: "Hành Trình Bên Nhau Của Chúng Mình",
  loveCounterSubtitle: "Từng giây phút trôi qua bên em đều là những kỷ niệm vô giá",
  coupleAvatarLeft: "assets/photos/1792466461944_2199372916196262329_2672750711596410923_h.jpg",
  coupleAvatarRight: "assets/photos/1792466461969_2199372916196262329_2672750711596410923_h.jpg",

  // 3. Tiêu đề & Nội dung bức thư
  envelopeTitle: "Gửi Người Con Gái Anh Thương",
  envelopeSubtitle: "Chạm vào phong bì để mở món quà nhỏ từ anh nhé",
  letterGreeting: "Gửi em — cô gái tuyệt vời nhất của anh,",
  letterParagraphs: [
    "Nhân ngày Phụ nữ Việt Nam 20/10, anh muốn gửi tới em ngàn lời yêu thương ngọt ngào nhất. Cảm ơn em vì đã đến bên anh, mang theo nụ cười ấm áp làm dịu đi mọi mệt mỏi và biến những ngày bình thường trở nên thật đặc biệt.",
    "Với anh, em không chỉ là người yêu mà còn là bình yên, là động lực và là điều đẹp đẽ nhất mà anh may mắn có được. Chúc công chúa của anh ngày 20/10 và cả 365 ngày trong năm luôn rạng rỡ như hoa hướng dương, luôn vui vẻ, hạnh phúc và được yêu thương trọn vẹn.",
    "Dù thế giới ngoài kia có bận rộn thế nào, hãy nhớ rằng luôn có anh ở đây thương em, chiều chuộng và đồng hành cùng em qua mọi chặng đường. Yêu em rất nhiều!"
  ],
  letterClosing: "Trọn đời thương em,",

  // 4. Mini-game tương tác "Em có yêu anh không?"
  loveQuestionTitle: "Câu Hỏi Quan Trọng Ngày 20/10 😳",
  loveQuestionPrompt: "Trả lời thật lòng nha: Em có thương và yêu anh nhiều không?",
  loveYesText: "Yêu anh nhất trên đời 💖",
  loveNoTexts: [
    "Hông thèm đâu 😜",
    "Ơ kìa, bấm nhầm hả? 🥺",
    "Nút này bị hư rồi! 😭",
    "Đừng bấm nút này mà 😤",
    "Bấm nút màu hồng bên kia kìa! 💕",
    "Chạy đằng trời cũng không thoát đâu 🏃‍♂️💨",
    "Thôi đừng dối lòng nữa 😘"
  ],
  loveSuccessMessage: "Anh biết ngay mà! Anh cũng yêu công chúa của anh nhiều gấp vạn lần! Hôm nay đi chơi anh chiều em hết nấc nha! 🥰💖💐",

  // 5. Thư viện ảnh kỷ niệm Polaroid của 2 bạn
  galleryTitle: "Khoảnh Khắc Của Chúng Mình",
  gallerySubtitle: "Mỗi bức ảnh là một mảnh ghép hạnh phúc khi có em bên cạnh (Chạm vào ảnh để xem rõ hơn nhé)",
  photos: [
    {
      src: "assets/photos/1792466461888_2199372916196262329_2672750711596410923_h.jpg",
      caption: "Ngại ngùng cười tít mắt bên nhau dưới trời đêm ✨",
      date: "Đêm bình yên bên em",
      rotation: "-2.5deg",
      position: "center center"
    },
    {
      src: "assets/photos/1792466461917_2199372916196262329_2672750711596410923_h.jpg",
      caption: "Vi vu khắp phố phường & cùng nhau đi làm gốm 🛵🏺",
      date: "Kỷ niệm đáng nhớ",
      rotation: "2.2deg",
      position: "center center"
    },
    {
      src: "assets/photos/1792466461944_2199372916196262329_2672750711596410923_h.jpg",
      caption: "Tựa đầu vào nhau, thế giới bỗng hoá dịu dàng 💕",
      date: "Thương em thật nhiều",
      rotation: "-2deg",
      position: "center 85%"
    },
    {
      src: "assets/photos/1792466461969_2199372916196262329_2672750711596410923_h.jpg",
      caption: "Biểu cảm đáng yêu số một của hai đứa mình 😘",
      date: "Khoảnh khắc nhí nhố",
      rotation: "2.8deg",
      position: "center 60%"
    },
    {
      src: "assets/photos/1792466461995_2199372916196262329_2672750711596410923_h.jpg",
      caption: "Nắm tay em đi dạo chơi khắp thế gian ✌️💖",
      date: "Ngày hẹn hò vui vẻ",
      rotation: "-2.5deg",
      position: "center 65%"
    },
    {
      src: "assets/photos/1792466462019_2199372916196262329_2672750711596410923_h.jpg",
      caption: "Mỗi khung hình bên em đều tràn ngập tiếng cười 🌷",
      date: "20/10 Hạnh phúc",
      rotation: "2deg",
      fit: "contain",
      position: "center center"
    }
  ],

  // 6. Lời nhắn bất ngờ cuối trang
  secretMessageTitle: "Món Quà Nhỏ Dành Riêng Cho Em 🎁",
  secretMessageBody: "Hôm nay em chỉ việc thật xinh đẹp và mỉm cười thôi nhé! Mọi thứ còn lại — từ hoa, quà cho tới những cái ôm thật chặt — cứ để anh lo! 💐💖",
  secretVoucherText: "VOUCHER TÌNH YÊU: 1 buổi hẹn hò lãng mạn & bất kỳ món ăn nào em thích (Hạn sử dụng: Mãi mãi)",

  // 7. Đường dẫn nhạc nền (để trống sẽ dùng giai điệu Music Box lãng mạn tích hợp sẵn)
  customMusicUrl: "",

  // 8. Đường dẫn trang thiệp sau khi deploy (dùng để tạo QR)
  deployedUrl: "https://vietchuu.github.io/https-github.com-vietchu-thiep-20-10-/"
};
