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
  coupleAvatarLeft: "assets/photos/avatar-left.jpg",
  coupleAvatarRight: "assets/photos/avatar-right.jpg",

  // 3. Tiêu đề & Nội dung bức thư
  envelopeTitle: "Gửi Người Con Gái Anh Thương",
  envelopeSubtitle: "Chạm vào phong bì để mở món quà nhỏ từ anh nhé",
  letterGreeting: "Gửi em — cô gái tuyệt vời nhất của anh,",
  letterParagraphs: [
    "Nhân ngày Phụ nữ Việt Nam 20/10, anh muốn gửi tới em ngàn lời yêu thương ngọt ngào nhất. Cảm ơn em vì đã đến bên anh, mang theo nụ cười ấm áp làm dịu đi mọi mệt mỏi và biến những ngày bình thường trở nên thật đặc biệt.",
    "Với anh, có em bên cạnh là điều bình yên và may mắn nhất. Chúc cô gái của anh ngày 20/10 và cả những ngày sau nữa lúc nào cũng vui vẻ, tươi tắn và hạnh phúc nhé.",
    "Dù thế giới ngoài kia có bận rộn thế nào, hãy nhớ rằng luôn có anh ở đây thương em, chiều chuộng và đồng hành cùng em qua mọi chặng đường. Yêu em rất nhiều!"
  ],
  letterClosing: "Thương em nhiều,",

  // 4. Mini-game tương tác "Em có yêu anh không?"
  loveQuestionTitle: "Câu Hỏi Quan Trọng Ngày 20/10 😳",
  loveQuestionPrompt: "Trả lời thật lòng nha: Em có thương và yêu anh nhiều không?",
  loveYesText: "Thương anh nhất 💖",
  loveNoTexts: [
    "Hông thèm đâu 😜",
    "Ơ kìa, bấm nhầm hả? 🥺",
    "Nút này bị liệt rồi! 😂",
    "Đừng cố bấm nút này nữa 😤",
    "Bấm nút màu hồng bên kia kìa! 💕",
    "Chạy đâu cho thoát 🏃‍♂️💨",
    "Thôi nhận đi đừng ngại 😘"
  ],
  loveSuccessMessage: "Biết ngay là không bấm nút kia được mà 😆 Cảm ơn em vì đã luôn ở bên cạnh và thông cảm cho anh. Thương em nhiều lắm, cứ mãi vui vẻ bên nhau như vậy nha! ❤️",

  // 5. Máy Ảnh Instax & Album Ảnh Kỷ Niệm (Tự động hiển thị full khung ngang/dọc, không cần chú thích từng ảnh)
  galleryTitle: "Khoảnh Khắc Của Chúng Mình 📸",
  gallerySubtitle: "Bấm máy ảnh để chụp ngẫu nhiên, lướt cuộn phim hoặc chạm vào bất kỳ tấm ảnh nào để xem trọn vẹn nhé!",
  photos: [
    "assets/photos/1792466461888_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792466461917_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792466461944_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792466461969_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792466461995_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792466462019_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792472020633_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483918730_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483918784_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483918831_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483918859_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483918932_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483918957_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483918983_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483919037_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483919062_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483919088_2199372916196262329_2672750711596410923_h.jpg",
    "assets/photos/1792483919112_2199372916196262329_2672750711596410923_h.jpg"
  ],

  // 6. Thẻ Cào Bí Mật (Scratch Card)
  scratchTitle: "Thẻ Cào Bí Mật 20/10 ✨",
  scratchSubtitle: "Dùng ngón tay hoặc chuột cào lớp nhũ lấp lánh bên dưới để mở điều anh giấu bên trong nhé!",
  scratchCoverText: "✨ CÀO NHẸ TẠI ĐÂY ✨",
  scratchCoverSubtext: "Vuốt qua lại để mở bí mật 💌",
  scratchImage: "assets/photos/1792471660428_2199372916196262329_2672750711596410923_h.jpg",
  scratchSecretHeadline: "Bắt quả tang một chiếc mặt quạu siêu cấp đáng yêu! 🐻‍❄️😆",
  scratchSecretMessage: "Nhìn mặt kìa, dỗi hay nhăn mặt nhìn vẫn cứ là cưng nhất quả đất! Ngày 20/10 bớt quạu với anh lại nha, thương nhiều lắm! ❤️",
  scratchSecretBadge: "🎟️ Đặc quyền: 1 buổi đi chơi bù thật vui & 1000 cái ôm",

  // 7. Lọ Sao Tâm Sự (Love Jar - Chạm để bốc từng tờ giấy nhỏ)
  jarTitle: "Lọ Sao Tâm Sự 🌟",
  jarSubtitle: "Trong chiếc lọ này có 10 điều nhỏ anh muốn nhắn gửi. Chạm vào lọ thuỷ tinh để bốc từng ngôi sao nhé!",
  jarNotes: [
    "Thích nhất là lúc hai đứa ngồi cạnh nhau cười tít cả mắt, bao nhiêu mệt mỏi trong ngày đều tan biến hết. ✨",
    "Lúc em làm mặt quạu hay nhăn mũi nhìn vừa buồn cười vừa đáng yêu, muốn giận cũng không giận nổi luôn. 😆",
    "Cảm ơn em vì lúc nào cũng hiểu chuyện, thông cảm và ở bên cạnh anh cả những lúc giản dị nhất. ❤️",
    "Đi đâu cũng được, làm gì cũng vui, miễn là hôm đó có em đi cùng anh. 🛵💕",
    "Thích cảm giác đèo em ngồi sau xe đi dạo phố, hai đứa vừa đi vừa kể đủ thứ chuyện trên đời. 🌆",
    "Mỗi lần mở điện thoại nhìn lại mấy tấm ảnh nhí nhố của hai đứa là anh lại bất giác cười một mình. 📸",
    "Cảm ơn em từ ngày 25/03/2026 đã bước vào cuộc sống của anh và làm mọi thứ trở nên ấm áp hơn hẳn. 🌸",
    "Đôi khi anh hơi vụng về hoặc chưa chu đáo hết được, cảm ơn em vì vẫn luôn kiên nhẫn và thương anh. 🤗",
    "Chúc cô gái của anh ngày 20/10 và mỗi ngày sau này đều giữ được nụ cười tươi tắn như hiện tại nha. 🌷",
    "Ngôi sao đặc biệt: Anh nợ em một buổi đi chơi bù thật vui, nhớ chụp màn hình ngôi sao này để đòi nha! 🎟️💖"
  ],

  // 8. Vòng Quay Đặc Quyền 20/10 (Lucky Spin Wheel)
  wheelTitle: "Vòng Quay Đặc Quyền 20/10 🎡",
  wheelSubtitle: "Quay trúng ô nào anh thực hiện ô đó nha! Bấm nút QUAY ở giữa vòng tròn để thử vận may nhé!",
  wheelPrizes: [
    {
      label: "🧋 1 ly nước thích",
      color: "#ffccd5",
      detail: "Quay trúng: 1 ly trà sữa hoặc đồ uống em yêu thích — thích uống quán nào, topping gì cứ bảo anh nha! 🧋✨"
    },
    {
      label: "🎬 1 buổi xem phim",
      color: "#fff0f3",
      detail: "Quay trúng: 1 buổi đi xem phim cùng nhau vào đợt tới — em toàn quyền chọn bộ phim em muốn xem! 🎬🍿"
    },
    {
      label: "🛍️ Đi lựa đồ cùng",
      color: "#ffb3c6",
      detail: "Quay trúng: Đi dạo, đi lựa đồ cùng em — cam kết tư vấn có tâm, xách đồ phụ và tuyệt đối không hối về! 🛍️😊"
    },
    {
      label: "📦 Chốt 1 món nhỏ",
      color: "#ffe5ec",
      detail: "Quay trúng: Chốt đơn tặng em 1 món đồ nhỏ xinh trong giỏ hàng vào đợt tới nha! 📦💖"
    },
    {
      label: "🍜 Ăn món em thèm",
      color: "#ffccd5",
      detail: "Quay trúng: 1 buổi đi ăn bù món em đang thèm nhất — em chọn quán, chọn món thoải mái luôn! 🍜😋"
    },
    {
      label: "🙋‍♂️ Sai vặt 1 việc",
      color: "#fff0f3",
      detail: "Quay trúng: Đặc quyền sai vặt hợp pháp — nhờ anh làm giúp 1 việc bất kỳ mà em đang lười làm! 🙋‍♂️💪"
    }
  ],

  // 9. Lời nhắn bất ngờ cuối trang
  secretMessageTitle: "Lời Nhắn Nhỏ Cuối Thư 💌",
  secretMessageBody: "Ngày 20/10 nhớ cười thật nhiều và luôn tươi tắn nhé! Cảm ơn em vì lúc nào cũng hiểu chuyện và đồng hành cùng anh. Hẹn em một buổi đi chơi bù thật vui nha! 🤗💖",
  secretVoucherText: "ĐẶC QUYỀN CỦA EM: 1000 cái ôm thật chặt, luôn được anh nhường nhịn & 1 buổi hẹn hò bù thật xịn (Hạn sử dụng: Mãi mãi)",

  // 7. Đường dẫn nhạc nền (để trống sẽ dùng giai điệu Music Box lãng mạn tích hợp sẵn)
  customMusicUrl: "",

  // 10. Đường dẫn trang thiệp sau khi deploy (dùng để tạo QR)
  deployedUrl: "https://vietchuu.github.io/https-github.com-vietchu-thiep-20-10-/",

  // 11. Kênh Realtime Tracking cho Dashboard
  trackingTopic: "vietchuu-2010-card-tracker-8826"
};
