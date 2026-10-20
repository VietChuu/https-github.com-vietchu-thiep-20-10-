// ============================================================================
// CẤU HÌNH THIỆP 20/10 - CHỈNH SỬA NỘI DUNG TẠI ĐÂY
// ============================================================================

window.CARD_CONFIG = {
  // 1. Thông tin người nhận & người gửi
  recipientName: "Em Yêu",
  senderName: "Việt Chu",
  dateText: "20 • 10 • 2026",
  badgeText: "Happy Vietnamese Women's Day",

  // 2. Tiêu đề & Nội dung bức thư
  envelopeTitle: "Gửi Người Con Gái Anh Thương",
  envelopeSubtitle: "Chạm vào phong bì để mở món quà nhỏ từ anh nhé",
  letterGreeting: "Gửi em — cô gái tuyệt vời nhất của anh,",
  letterParagraphs: [
    "Nhân ngày Phụ nữ Việt Nam 20/10, anh muốn gửi tới em ngàn lời yêu thương ngọt ngào nhất. Cảm ơn em vì đã đến bên anh, mang theo nụ cười ấm áp làm dịu đi mọi mệt mỏi và biến những ngày bình thường trở nên thật đặc biệt.",
    "Với anh, em không chỉ là người yêu mà còn là bình yên, là động lực và là điều đẹp đẽ nhất mà anh may mắn có được. Chúc công chúa của anh ngày 20/10 và cả 365 ngày trong năm luôn rạng rỡ như hoa hướng dương, luôn vui vẻ, hạnh phúc và được yêu thương trọn vẹn.",
    "Dù thế giới ngoài kia có bận rộn thế nào, hãy nhớ rằng luôn có anh ở đây thương em, chiều chuộng và đồng hành cùng em qua mọi chặng đường. Yêu em rất nhiều!"
  ],
  letterClosing: "Trọn đời thương em,",

  // 3. Thư viện ảnh kỷ niệm Polaroid (Thay ảnh của 2 bạn vào thư mục assets/photos/)
  galleryTitle: "Khoảnh Khắc Của Chúng Mình",
  gallerySubtitle: "Mỗi bức ảnh là một mảnh ghép hạnh phúc khi có em bên cạnh",
  photos: [
    {
      src: "assets/photos/photo-1.svg",
      caption: "Nụ cười của em làm tim anh tan chảy 💕",
      date: "Kỷ niệm ngọt ngào",
      rotation: "-3deg"
    },
    {
      src: "assets/photos/photo-2.svg",
      caption: "Những buổi hẹn hò bình yên bên nhau ✨",
      date: "Ngày nắng đẹp",
      rotation: "2.5deg"
    },
    {
      src: "assets/photos/photo-3.svg",
      caption: "Nắm tay em đi qua bao mùa yêu thương 🌸",
      date: "Bên em mãi mãi",
      rotation: "-2deg"
    },
    {
      src: "assets/photos/photo-4.svg",
      caption: "Cô gái xinh đẹp nhất trong mắt anh 🌷",
      date: "20/10 Hạnh phúc",
      rotation: "3deg"
    },
    {
      src: "assets/photos/photo-5.svg",
      caption: "Cảm ơn em vì đã luôn ở bên anh ❤️",
      date: "Thương em thật nhiều",
      rotation: "-2.5deg"
    },
    {
      src: "assets/photos/photo-6.svg",
      caption: "Viết tiếp thật nhiều kỷ niệm cùng nhau nhé 🥂",
      date: "Chặng đường phía trước",
      rotation: "2deg"
    }
  ],

  // 4. Lời nhắn bất ngờ cuối trang
  secretMessageTitle: "Món Quà Nhỏ Dành Riêng Cho Em 🎁",
  secretMessageBody: "Hôm nay em chỉ việc thật xinh đẹp và mỉm cười thôi nhé! Mọi thứ còn lại — từ hoa, quà cho tới những cái ôm thật chặt — cứ để anh lo! 💐💖",
  secretVoucherText: "VOUCHER TÌNH YÊU: 1 buổi hẹn hò lãng mạn & bất kỳ món ăn nào em thích (Hạn sử dụng: Mãi mãi)",

  // 5. Đường dẫn nhạc nền (để trống sẽ dùng giai điệu Music Box lãng mạn tích hợp sẵn)
  // Bạn có thể chép file nhạc .mp3 vào thư mục assets/music.mp3 rồi điền "assets/music.mp3"
  customMusicUrl: "",

  // 6. Đường dẫn trang thiệp sau khi deploy (dùng để tạo QR)
  deployedUrl: "https://vietchuu.github.io/https-github.com-vietchu-thiep-20-10-/"
};
