// @ts-nocheck
import { PrismaClient, PostType, PostStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const servicesData = [
  {
    title: 'Bảo Vệ Nhà Máy',
    slug: 'bao-ve-nha-may',
    description: 'Dịch vụ bảo vệ nhà máy, kho bãi và các khu chế xuất chuyên nghiệp của Long Việt Security. Chúng tôi cam kết thiết lập hệ thống an ninh khép kín, ngăn chặn mọi rủi ro thất thoát tài sản, trộm cắp và phá hoại, giúp doanh nghiệp yên tâm hoạt động sản xuất kinh doanh.',
    scope: '- Tuần tra kiểm soát an ninh toàn bộ khu vực tường rào và khuôn viên nhà máy.\n- Kiểm tra và giám sát chặt chẽ người, phương tiện và hàng hóa ra vào cổng chính.\n- Quản lý, giám sát hệ thống camera an ninh và thiết bị báo động 24/24.\n- Giám sát công tác phòng cháy chữa cháy, phòng ngừa chập điện, cháy nổ.\n- Thực hiện báo cáo chi tiết theo ca trực và lập tức phản hồi sự cố lên ban giám đốc.',
    process: JSON.stringify([
      { step: 1, title: 'Khảo sát thực tế', description: 'Đội ngũ chuyên gia an ninh đến khảo sát thực địa mặt bằng, đánh giá các điểm yếu và rủi ro tiềm ẩn tại nhà máy.' },
      { step: 2, title: 'Thiết lập phương án', description: 'Đề xuất sơ đồ bố trí các chốt bảo vệ, lịch trình tuần tra, nội quy kiểm soát người/phương tiện chi tiết.' },
      { step: 3, title: 'Ký kết hợp đồng', description: 'Báo giá minh bạch, thống nhất các điều khoản pháp lý và ký kết hợp đồng cung cấp dịch vụ.' },
      { step: 4, title: 'Tuyển chọn & Đào tạo', description: 'Điều phối các chiến sĩ vệ sĩ có thể hình tốt, kỷ luật cao, am hiểu sơ đồ nhà máy và nghiệp vụ chuyên biệt.' },
      { step: 5, title: 'Triển khai bảo vệ', description: 'Bàn giao vị trí trực tiếp tại thực địa, chạy thử nghiệm hệ thống báo cáo và chính thức vận hành an ninh.' }
    ]),
    benefits: '- **Tiết kiệm chi phí**: Giảm thiểu chi phí tuyển dụng, quản lý, trang bị quân phục và bảo hiểm xã hội cho bảo vệ tự quản.\n- **Nhân sự tinh nhuệ**: Bảo vệ được huấn luyện võ thuật, nghiệp vụ PCCC, sơ cấp cứu và kỹ năng xử lý bạo động đình công.\n- **Cam kết đền bù**: Hợp đồng đi kèm gói bảo hiểm trách nhiệm pháp lý lên đến 20 tỷ đồng, sẵn sàng bồi thường khi có tổn thất tài sản.\n- **Công nghệ giám sát**: Ứng dụng thiết bị tuần tra GPS/NFC trực tuyến giúp giám sát chốt trực thời gian thực.',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop',
    price_min: 15000000,
    price_max: 28000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([
      { q: 'Phí dịch vụ đã bao gồm bảo hiểm tài sản chưa?', a: 'Có, toàn bộ báo giá dịch vụ bảo vệ nhà máy của Long Việt đều đã bao gồm bảo hiểm trách nhiệm công cộng trị giá 20 tỷ đồng.' },
      { q: 'Bảo vệ có làm việc ca trực 24h không?', a: 'Có, chúng tôi chia 3 ca trực luân phiên (ca 8 tiếng) để đảm bảo vệ sĩ luôn tỉnh táo, trực gác liên tục 24/7/365.' },
      { q: 'Làm thế nào để giám sát nhân viên bảo vệ?', a: 'Chúng tôi trang bị máy tuần tra GPS. Khách hàng có thể kiểm tra lịch trình đi tuần và vị trí chốt trực của vệ sĩ qua cổng thông tin trực tuyến.' },
      { q: 'Khi xảy ra mất mát thì quy trình đền bù thế nào?', a: 'Hai bên lập biên bản hiện trường, có công an xác minh. Long Việt cùng đơn vị bảo hiểm tiến hành xác định lỗi và đền bù 100% thiệt hại trong vòng 30 ngày.' },
      { q: 'Nhân viên bảo vệ có được trang bị công cụ hỗ trợ không?', a: 'Có, toàn bộ vệ sĩ trực nhà máy đều được cấp dùi cui điện, bộ đàm công suất lớn, đèn pin siêu sáng và máy quét tuần tra.' }
    ]),
    order: 1,
    is_active: true,
    meta_title: 'Dịch Vụ Bảo Vệ Nhà Máy Kho Bãi Chuyên Nghiệp | Long Việt',
    meta_desc: 'Bảo vệ nhà máy, kho bãi chất lượng cao. Kiểm soát cổng ra vào nghiêm ngặt, chống thất thoát tài sản, trộm cắp. Nhận khảo sát & báo giá miễn phí ngay.'
  },
  {
    title: 'Bảo Vệ Tòa Nhà',
    slug: 'bao-ve-toa-nha',
    description: 'Dịch vụ an ninh chuyên nghiệp cho văn phòng, chung cư, trung tâm thương mại và cao ốc hỗn hợp của Long Việt Security. Chúng tôi xây dựng môi trường sống và làm việc an toàn, văn minh, đón tiếp cư dân lịch sự và quản lý bãi xe, hệ thống kỹ thuật tòa nhà chặt chẽ.',
    scope: '- Kiểm soát sảnh chính, đón tiếp cư dân, hướng dẫn khách đăng ký và ra vào tòa nhà.\n- Quản lý, giám sát và vận hành hệ thống bãi đỗ xe máy, ô tô tại hầm tòa nhà.\n- Vận hành và giám sát hệ thống camera an ninh trung tâm (CCTV room) 24/24.\n- Giám sát phòng cháy chữa cháy, kiểm tra bình cứu hỏa và hỗ trợ thoát hiểm khi có sự cố.\n- Tuần tra liên tục các khu vực hành lang, thang máy và sân thượng tòa nhà.',
    process: JSON.stringify([
      { step: 1, title: 'Khảo sát kỹ thuật', description: 'Đánh giá cấu trúc tòa nhà, sơ đồ thoát hiểm, hệ thống camera và mật độ cư dân ra vào.' },
      { step: 2, title: 'Lập phương án', description: 'Xác định số vị trí trực gác (sảnh, hầm xe, tuần tra), xây dựng quy trình quản lý bãi xe và xử lý cháy nổ.' },
      { step: 3, title: 'Ký kết hợp đồng', description: 'Bàn giao các quy chế tòa nhà, thống nhất điều khoản bồi thường và ký kết hợp đồng.' },
      { step: 4, title: 'Biên chế nhân lực', description: 'Lựa chọn vệ sĩ có ngoại hình sáng, giao tiếp lịch sự, có kỹ năng sử dụng thiết bị phòng cháy chữa cháy tòa nhà.' },
      { step: 5, title: 'Triển khai bàn giao', description: 'Chính thức triển khai nhân sự tại các vị trí sảnh, hầm, camera, chạy quy trình báo cáo tuần tra tự động.' }
    ]),
    benefits: '- **Tác phong lịch thiệp**: Vệ sĩ có thái độ đón tiếp cư dân và khách hàng niềm nở, thân thiện, tạo hình ảnh cao cấp cho tòa nhà.\n- **Kỹ năng tòa nhà**: Sử dụng thành thạo máy quét bãi xe, hệ thống báo cháy tự động và bộ đàm kết nối nhanh nội bộ.\n- **Ứng phó sự cố**: Xử lý nhuần nhuyễn các sự cố kẹt thang máy, ngập lụt hầm xe, mất điện đột xuất hoặc hỏa hoạn xảy ra.\n- **Giám sát trực tuyến**: Kết nối trực tiếp hệ thống camera an ninh của tòa nhà về trung tâm chỉ huy tác chiến 24/7 của Long Việt.',
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    price_min: 16000000,
    price_max: 30000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([
      { q: 'Vệ sĩ tòa nhà có được trang bị quần áo lịch sự không?', a: 'Có, vệ sĩ trực sảnh tòa nhà (Lễ tân) được trang bị quân phục đặc biệt (áo sơ mi, thắt caravat) hoặc Vest đen theo yêu cầu của ban quản trị.' },
      { q: 'Làm thế nào để xử lý sự cố kẹt thang máy?', a: 'Vệ sĩ tòa nhà lập tức liên hệ kỹ thuật thang máy, trấn an người bên trong qua hệ thống intercom và hỗ trợ mở cửa khẩn cấp bằng chìa khóa chuyên dụng.' },
      { q: 'Bảo vệ có quản lý thẻ xe và doanh thu bãi xe không?', a: 'Có, nhân viên trực hầm xe được đào tạo vận hành hệ thống máy quẹt thẻ thông minh và quản lý tiền mặt doanh thu bãi xe minh bạch.' },
      { q: 'Có hỗ trợ trực tuần tra đêm không?', a: 'Đội tuần tra đêm liên tục đi kiểm tra các tầng căn hộ, hành lang chung để ngăn chặn trộm cắp và nhắc nhở cư dân giữ gìn trật tự.' },
      { q: 'Chi phí thuê bảo vệ tòa nhà văn phòng bao nhiêu?', a: 'Giá thuê từ 16 triệu VNĐ/tháng/vị trí ca trực 12 tiếng. Liên hệ Hotline để nhận phương án thiết kế tối ưu ngân sách.' }
    ]),
    order: 2,
    is_active: true,
    meta_title: 'Dịch Vụ Bảo Vệ Tòa Nhà Văn Phòng Chung Cư | Long Việt',
    meta_desc: 'Bảo vệ tòa nhà chung cư, cao ốc văn phòng uy tín chuyên nghiệp. Nhân sự lịch sự, nghiệp vụ cao. Giám sát bãi xe, CCTV 24/24. Liên hệ ngay!'
  },
  {
    title: 'Bảo Vệ Ngân Hàng',
    slug: 'bao-ve-ngan-hang',
    description: 'Dịch vụ bảo vệ chuyên nghiệp cho Hội sở ngân hàng, chi nhánh, phòng giao dịch (PGD) và hộ tống tiền của Long Việt Security. Chúng tôi cam kết bảo vệ an toàn cho tài sản, khách hàng và nhân viên ngân hàng trước các nguy cơ cướp tiệm, dàn cảnh lừa đảo hoặc mất an ninh trật tự.',
    scope: '- Bảo vệ sảnh giao dịch, hướng dẫn khách hàng dắt xe và cất đồ an toàn.\n- Giám sát chặt chẽ các đối tượng có hành vi khả nghi xung quanh quầy giao dịch và cây ATM.\n- Hỗ trợ nhân viên ngân hàng kiểm soát an ninh khu vực kho quỹ hạn chế ra vào.\n- Phối hợp bảo vệ an toàn tuyệt đối khi xe tiếp quỹ của ngân hàng đỗ nhận tiền.\n- Sẵn sàng kích hoạt còi báo động và nút SOS kết nối công an khi có cướp ngân hàng.',
    process: JSON.stringify([
      { step: 1, title: 'Khảo sát đặc thù', description: 'Đội ngũ nghiệp vụ khảo sát vị trí PGD, bố trí camera, vị trí két sắt tiền mặt và lưu lượng khách hàng.' },
      { step: 2, title: 'Lập phương án phản ứng', description: 'Thiết kế sơ đồ đứng chốt của bảo vệ sảnh, quy trình phối hợp khẩn cấp chống cướp ngân hàng.' },
      { step: 3, title: 'Ký kết hợp đồng bảo hiểm', description: 'Thống nhất điều khoản bồi thường đặc thù ngành ngân hàng và ký hợp đồng bảo hiểm trọn gói.' },
      { step: 4, title: 'Tuyển chọn đặc biệt', description: 'Tuyển chọn vệ sĩ có ngoại hình khỏe mạnh, có kỹ năng võ thuật thực chiến tốt, bản lĩnh thép và phản xạ nhanh.' },
      { step: 5, title: 'Chính thức triển khai', description: 'Bàn giao vị trí, vận hành quy trình kiểm soát nghiêm ngặt, trực tiếp phối hợp cùng lực lượng công an khu vực.' }
    ]),
    benefits: '- **Bản lĩnh thực chiến**: Vệ sĩ ngân hàng được huấn luyện khống chế tội phạm có vũ khí và kỹ năng tự vệ giáp lá cà.\n- **Kỹ năng ứng biến**: Kịp thời ngăn chặn các vụ cướp tài sản tại cây ATM hoặc lừa đảo rút tiền mặt quy mô lớn.\n- **Hỗ trợ khách hàng**: Hướng dẫn khách đỗ xe, dắt xe tận tâm, tạo niềm tin lớn cho khách hàng khi giao dịch tại ngân hàng.\n- **Đảm bảo bí mật**: Cam kết bảo mật tuyệt đối thông tin kho quỹ, lịch trình xe tiếp quỹ và nội bộ ngân hàng.',
    icon: 'Building',
    image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=1600&auto=format&fit=crop',
    price_min: 18000000,
    price_max: 35000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([
      { q: 'Vệ sĩ ngân hàng có được trang bị công cụ tự vệ đặc biệt không?', a: 'Có, vệ sĩ trực ngân hàng được trang bị áo giáp chống đâm, dùi cui điện công suất lớn, súng đạn cao su và còng số 8.' },
      { q: 'Làm thế nào để bảo vệ tiền mặt khi khách hàng rút lượng lớn?', a: 'Vệ sĩ sảnh trực tiếp quan sát xung quanh, hộ tống khách hàng ra tận xe ô tô/xe máy của họ để tránh các đối tượng dàn cảnh cướp giật.' },
      { q: 'Bảo vệ có trực đêm tại phòng giao dịch không?', a: 'Có, ca trực đêm bảo vệ an toàn két sắt, tủ hồ sơ và ngăn chặn các đối tượng đập phá hoặc hàn cắt cây ATM của PGD.' },
      { q: 'Quy trình xử lý khi phát hiện đối tượng có vũ khí cướp ngân hàng?', a: 'Vệ sĩ âm thầm kích hoạt nút bấm khẩn cấp SOS kết nối về công an, ưu tiên bảo vệ tính mạng khách hàng, giữ khoảng cách an toàn và chờ lực lượng chi viện.' },
      { q: 'Giá dịch vụ bảo vệ ngân hàng trọn gói thế nào?', a: 'Giá thuê từ 18 triệu VNĐ/tháng cho ca trực 12 tiếng. Vui lòng gửi yêu cầu khảo sát để nhận báo giá chi tiết cho từng chi nhánh.' }
    ]),
    order: 3,
    is_active: true,
    meta_title: 'Dịch Vụ Bảo Vệ Ngân Hàng Phòng Giao Dịch VIP | Long Việt',
    meta_desc: 'Bảo vệ ngân hàng, phòng giao dịch an toàn tuyệt đối. Đội ngũ vệ sĩ bản lĩnh thép, phản xạ nhanh, võ thuật giỏi. Nhận báo giá: 0923 840 999.'
  },
  {
    title: 'Bảo Vệ Sự Kiện',
    slug: 'bao-ve-su-kien',
    description: 'Dịch vụ bảo vệ và giữ gìn an ninh trật tự cho các Liveshow ca nhạc, Lễ hội ngoài trời, Hội nghị quốc tế, Triển lãm lớn và Lễ khai trương showroom của Long Việt Security. Chúng tôi cam kết bảo vệ an toàn cho VIP/Nghệ sĩ, kiểm soát vé chặt chẽ và ngăn chặn hiệu quả các đám đông hỗn loạn, trộm cắp và gây rối.',
    scope: '- Thiết lập hàng rào an ninh sắt xung quanh khu vực sân khấu chính và khu vực VIP.\n- Kiểm soát vé, giỏ xách và rà soát vũ khí bằng máy quét cầm tay tại toàn bộ cổng ra vào.\n- Bố trí đội phản ứng nhanh cơ động xử lý các trường hợp quá khích gây gổ.\n- Hộ tống nghệ sĩ, diễn giả nổi tiếng từ xe vào hậu trường sân khấu an toàn.\n- Phối hợp cùng ban tổ chức phân luồng giao thông và phòng chống cháy nổ tại hiện trường.',
    process: JSON.stringify([
      { step: 1, title: 'Nhận yêu cầu & Khảo sát', description: 'Thu thập thông tin số lượng khách mời, diện tích sự kiện, sơ đồ cổng ra vào và lịch trình của các VIP.' },
      { step: 2, title: 'Lập phương án chi tiết', description: 'Thiết kế sơ đồ bố trí chốt gác, hàng rào sắt, sơ đồ phân làn đón khách và phương án di tản khẩn cấp.' },
      { step: 3, title: 'Ký kết & Diễn tập', description: 'Ký hợp đồng dịch vụ sự kiện ngắn hạn, tổ chức diễn tập ứng phó sự cố đông người hỗn loạn cho đội ngũ.' },
      { step: 4, title: 'Triển khai lực lượng', description: 'Chỉ huy trưởng sự kiện dẫn đầu lực lượng vệ sĩ tinh nhuệ, trang bị bộ đàm tai nghe chuyên nghiệp trực chiến trước giờ G 2 tiếng.' },
      { step: 5, title: 'Nghiệm thu sự kiện', description: 'Hộ tống toàn bộ khách hàng và VIP ra về an toàn, nghiệm thu bàn giao hiện trường sạch sẽ và kết thúc nhiệm vụ.' }
    ]),
    benefits: '- **Trang thiết bị chuyên dụng**: Hỗ trợ cổng từ rà kim loại, máy dò kim loại cầm tay và hàng rào sắt an ninh di động.\n- **Kỷ luật đội ngũ**: Vệ sĩ giao tiếp lịch sự, cương quyết xử lý đúng quy trình các đối tượng gây rối mất trật tự.\n- **Hộ tống chuyên nghiệp**: Bảo vệ an toàn tuyệt đối cho nghệ sĩ hạng A, chính khách quốc tế và các doanh nhân lớn.\n- **Phản ứng khẩn cấp**: Khống chế đám đông xô đẩy giẫm đạp, xử lý sơ cứu y tế tại chỗ cực kỳ chuyên nghiệp.',
    icon: 'Calendar',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop',
    price_min: 150000,
    price_max: 300000,
    price_unit: 'giờ/vị trí',
    faq: JSON.stringify([
      { q: 'Chi phí thuê bảo vệ sự kiện tính theo giờ hay theo ngày?', a: 'Bảo vệ sự kiện ngắn hạn được tính theo giờ từ 150.000 VNĐ/giờ/vệ sĩ tùy thuộc vào tính chất và quy mô sự kiện.' },
      { q: 'Có trang bị cổng từ kiểm soát an ninh không?', a: 'Có, đối với sự kiện lớn, Long Việt cung cấp trọn gói cổng từ dò kim loại và máy quét kiểm soát vé thông minh.' },
      { q: 'Vệ sĩ có mặc thường phục để ẩn mình trong đám đông không?', a: 'Có, theo yêu cầu của ban tổ chức sự kiện, vệ sĩ có thể mặc Vest lịch sự hoặc thường phục để dễ dàng quan sát, phát hiện trộm cắp.' },
      { q: 'Quy trình xử lý khi phát hiện cháy nhỏ tại sự kiện?', a: 'Vệ sĩ lập tức dùng bình chữa cháy xách tay khống chế ngọn lửa, chỉ huy trưởng phát lệnh di tản cư dân ôn hòa qua các cửa thoát hiểm đã lập sẵn.' },
      { q: 'Cần đăng ký thuê dịch vụ sự kiện trước bao lâu?', a: 'Vui lòng liên hệ trước ít nhất 3-5 ngày để chúng tôi khảo sát địa điểm, lập phương án an ninh gửi phê duyệt và chuẩn bị nhân sự.' }
    ]),
    order: 4,
    is_active: true,
    meta_title: 'Dịch Vụ Bảo Vệ Sự Kiện Liveshow Khai Trương | Long Việt',
    meta_desc: 'Bảo vệ sự kiện, lễ hội ngoài trời, khai trương chuyên nghiệp. Kiểm soát vé chặt chẽ, bảo vệ VIP an toàn 100%. Đăng ký khảo sát ngay.'
  },
  {
    title: 'Bảo Vệ Bệnh Viện',
    slug: 'bao-ve-benh-vien',
    description: 'Dịch vụ bảo vệ an ninh trật tự tại bệnh viện, phòng khám đa khoa chuyên nghiệp. Đảm bảo môi trường khám chữa bệnh an toàn, hỗ trợ điều phối giao thông nội bộ và kiểm soát người nhà bệnh nhân hiệu quả.',
    scope: '- Giữ gìn an ninh trật tự tại sảnh khám bệnh, phòng cấp cứu và khu vực nội trú.\n- Điều phối xe cộ, giữ bãi xe an toàn cho cán bộ y tế và bệnh nhân.\n- Kiểm soát thẻ người nhà, ngăn chặn kẻ gian trà trộn trộm cắp tài sản.',
    process: JSON.stringify([
      { step: 1, title: 'Khảo sát an ninh', description: 'Đánh giá mật độ người ra vào tại các khu vực trọng yếu của bệnh viện.' },
      { step: 2, title: 'Triển khai lực lượng', description: 'Bố trí chốt trực 24/24 tại phòng cấp cứu và cổng chính.' }
    ]),
    benefits: '- Môi trường y tế an toàn, không có tình trạng cò mồi hay gây rối.\n- Vệ sĩ có thái độ nhã nhặn, biết hỗ trợ chỉ đường cho bệnh nhân.',
    icon: 'HeartPulse',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
    price_min: 14000000,
    price_max: 25000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([{ q: 'Bảo vệ có làm ca đêm không?', a: 'Có, chúng tôi đảm bảo trực xuyên đêm 24/7 tại khu vực cấp cứu.' }]),
    order: 5,
    is_active: true,
    meta_title: 'Dịch Vụ Bảo Vệ Bệnh Viện Chuyên Nghiệp | Long Việt',
    meta_desc: 'Bảo vệ bệnh viện, phòng khám an toàn 24/7. Ngăn chặn trộm cắp, giữ gìn trật tự khu cấp cứu.'
  },
  {
    title: 'Bảo Vệ Nhà Hàng / Siêu Thị',
    slug: 'bao-ve-nha-hang',
    description: 'Giải pháp an ninh toàn diện cho chuỗi nhà hàng, quán cafe, siêu thị và trung tâm thương mại. Chúng tôi cung cấp dịch vụ dắt xe chu đáo, kiểm soát hóa đơn và chống thất thoát hàng hóa nghiêm ngặt.',
    scope: '- Dắt xe, giữ xe và niềm nở đón tiếp khách hàng ngay từ cửa.\n- Giám sát camera chống trộm cắp tại các gian hàng siêu thị.\n- Bảo vệ tài sản và xử lý các sự cố khách hàng gây rối.',
    process: JSON.stringify([
      { step: 1, title: 'Phân tích quy mô', description: 'Xác định số lượng bãi xe và các điểm mù camera trong siêu thị.' },
      { step: 2, title: 'Thực thi nhiệm vụ', description: 'Bố trí nhân sự dắt xe thân thiện và đội giám sát camera tinh mắt.' }
    ]),
    benefits: '- Tăng cường hình ảnh chuyên nghiệp cho nhà hàng qua nụ cười của bảo vệ.\n- Giảm thiểu tối đa tỷ lệ thất thoát hàng hóa (shrinkage) trong siêu thị.',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1600&auto=format&fit=crop',
    price_min: 12000000,
    price_max: 22000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([{ q: 'Bảo vệ có hỗ trợ dắt xe không?', a: 'Chắc chắn có. Thái độ phục vụ và dắt xe là tiêu chuẩn bắt buộc.' }]),
    order: 6,
    is_active: true,
    meta_title: 'Bảo Vệ Nhà Hàng, Siêu Thị Uy Tín | Long Việt',
    meta_desc: 'Cung cấp nhân viên dắt xe nhà hàng, bảo vệ siêu thị chống trộm cắp chuyên nghiệp.'
  },
  {
    title: 'Bảo Vệ Trường Học',
    slug: 'bao-ve-truong-hoc',
    description: 'Dịch vụ bảo vệ trường học các cấp (Mầm non, Tiểu học, Đại học) và các trung tâm đào tạo quốc tế. Cam kết mang lại môi trường giáo dục an toàn tuyệt đối, ngăn chặn bạo lực học đường và kẻ gian xâm nhập.',
    scope: '- Kiểm soát học sinh ra vào cổng trường đúng giờ quy định.\n- Điều tiết giao thông trước cổng trường giờ tan tầm.\n- Tuần tra chống cháy nổ và bảo vệ tài sản thiết bị giáo dục ban đêm.',
    process: JSON.stringify([
      { step: 1, title: 'Khảo sát khuôn viên', description: 'Đánh giá diện tích trường học và các lối ra vào.' },
      { step: 2, title: 'Kiểm soát an ninh', description: 'Thực hiện quy trình kiểm tra thẻ học sinh và quản lý khách phụ huynh ra vào.' }
    ]),
    benefits: '- Ngăn chặn triệt để tình trạng người lạ trà trộn đón học sinh.\n- Đảm bảo an toàn cơ sở vật chất máy tính, thiết bị dạy học.',
    icon: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop',
    price_min: 13000000,
    price_max: 20000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([{ q: 'Bảo vệ có tuần tra đêm không?', a: 'Có, ca đêm tập trung tuần tra phòng chống trộm cắp thiết bị trường học.' }]),
    order: 7,
    is_active: true,
    meta_title: 'Dịch Vụ Bảo Vệ Trường Học An Toàn | Long Việt',
    meta_desc: 'Bảo vệ trường học, trung tâm ngoại ngữ chuyên nghiệp. Kiểm soát học sinh ra vào an toàn.'
  },
  {
    title: 'Bảo Vệ Ngày Tết',
    slug: 'bao-ve-ngay-tet',
    description: 'Dịch vụ bảo vệ thời vụ dịp Lễ, Tết Nguyên Đán cho biệt thự, nhà riêng, kho xưởng và công ty khi chủ nhân vắng nhà dài ngày. Trực gác 24/24, niêm phong tài sản và báo cáo tình hình liên tục.',
    scope: '- Trông coi nhà cửa, tư dinh biệt thự suốt những ngày Tết.\n- Chăm sóc cây cảnh, thú cưng cơ bản theo yêu cầu của gia chủ.\n- Ngăn ngừa tuyệt đối nguy cơ đột nhập trộm cắp, hỏa hoạn do pháo nổ.',
    process: JSON.stringify([
      { step: 1, title: 'Bàn giao tài sản', description: 'Kiểm kê, lập biên bản niêm phong các khu vực quan trọng.' },
      { step: 2, title: 'Trực gác xuyên Tết', description: 'Bảo vệ túc trực 24/24 và gửi hình ảnh báo cáo hàng ngày.' }
    ]),
    benefits: '- An tâm du lịch nghỉ dưỡng trọn vẹn bên gia đình.\n- Cam kết bồi thường 100% nếu xảy ra mất mát tài sản trong dịp Tết.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=1600&auto=format&fit=crop',
    price_min: 800000,
    price_max: 2000000,
    price_unit: 'ngày/vị trí',
    faq: JSON.stringify([{ q: 'Bảo vệ có tưới cây giúp tôi không?', a: 'Có, vệ sĩ sẽ hỗ trợ tưới cây và cho thú cưng ăn theo hướng dẫn.' }]),
    order: 8,
    is_active: true,
    meta_title: 'Dịch Vụ Bảo Vệ Ngày Tết, Trông Nhà Dịp Lễ | Long Việt',
    meta_desc: 'Bảo vệ biệt thự, nhà riêng, kho xưởng ngày Tết 24/24. Cam kết an toàn tài sản tuyệt đối.'
  },
  {
    title: 'Bảo Vệ Công Trường',
    slug: 'bao-ve-cong-truong',
    description: 'Bảo vệ an ninh cho các dự án thi công xây dựng, công trình giao thông và khu đô thị đang triển khai. Ngăn chặn triệt để tình trạng trộm cắp vật tư sắt thép và quản lý công nhân ra vào.',
    scope: '- Kiểm soát công nhân thầu phụ ra vào công trường thi công.\n- Kiểm tra xe tải chở vật tư xuất nhập bãi, ghi chép sổ sách rõ ràng.\n- Tuần tra ban đêm chống trộm cắp giàn giáo, cáp điện và máy móc.',
    process: JSON.stringify([
      { step: 1, title: 'Lập sơ đồ chốt', description: 'Xác định các chốt cổng chính, kho vật tư và điểm tuần tra.' },
      { step: 2, title: 'Quản lý nghiêm ngặt', description: 'Khám xét túi xách công nhân khi ra về để chống thất thoát vật tư.' }
    ]),
    benefits: '- Chống thất thoát hàng tỷ đồng tiền vật tư xây dựng.\n- Đảm bảo trật tự, không để xảy ra đánh nhau giữa các tổ đội thi công.',
    icon: 'HardHat',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop',
    price_min: 15000000,
    price_max: 25000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([{ q: 'Vệ sĩ có kiểm tra xe chở vật tư không?', a: 'Có, chúng tôi kiểm tra đối chiếu phiếu xuất/nhập kho cực kỳ kỹ lưỡng.' }]),
    order: 9,
    is_active: true,
    meta_title: 'Bảo Vệ Công Trường Xây Dựng Chuyên Nghiệp | Long Việt',
    meta_desc: 'Dịch vụ bảo vệ công trình xây dựng, quản lý vật tư sắt thép, chống trộm cắp 24/24.'
  },
  {
    title: 'Bảo Vệ Khu Công Nghiệp',
    slug: 'bao-ve-khu-cong-nghiep',
    description: 'Dịch vụ bảo vệ tổng thể cho toàn bộ vòng ngoài và các trục đường chính của Khu Công Nghiệp, Khu Chế Xuất. Đội ngũ tuần tra cơ động phản ứng nhanh mọi sự cố bạo động, đình công.',
    scope: '- Tuần tra các tuyến đường nội bộ, giám sát giao thông trong KCN.\n- Kiểm soát cổng chính KCN, hướng dẫn xe container di chuyển.\n- Phối hợp xử lý các tình huống đình công, gây rối an ninh trật tự.',
    process: JSON.stringify([
      { step: 1, title: 'Quy hoạch an ninh', description: 'Thiết lập mạng lưới chốt gác và trạm tuần tra cơ động KCN.' },
      { step: 2, title: 'Ứng trực 24/7', description: 'Đội tuần tra sử dụng xe máy chuyên dụng kiểm soát liên tục.' }
    ]),
    benefits: '- Môi trường đầu tư an toàn, thu hút các doanh nghiệp nước ngoài (FDI).\n- Hệ thống phản ứng nhanh có mặt trong 3 phút khi có sự cố tại các nhà máy.',
    icon: 'Factory',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop',
    price_min: 18000000,
    price_max: 35000000,
    price_unit: 'tháng/vị trí',
    faq: JSON.stringify([{ q: 'Có đội phản ứng nhanh cơ động không?', a: 'Có, đội cơ động trang bị dùi cui, lá chắn sẵn sàng dập tắt bạo động.' }]),
    order: 10,
    is_active: true,
    meta_title: 'Bảo Vệ Khu Công Nghiệp, Trật Tự Vòng Ngoài | Long Việt',
    meta_desc: 'Cung cấp lực lượng bảo vệ khu công nghiệp quy mô lớn. Tuần tra cơ động, xử lý đình công an toàn.'
  },
  {
    title: 'Bảo Vệ Áp Tải Tiền',
    slug: 'bao-ve-ap-tai-tien',
    description: 'Dịch vụ hộ tống, bảo vệ vận chuyển tiền mặt, vàng bạc, đá quý và các tài liệu mật có giá trị cao bằng xe chuyên dụng. Vệ sĩ được trang bị công cụ hỗ trợ hiện đại, võ thuật cao.',
    scope: '- Hộ tống an toàn từ điểm nhận tiền (ngân hàng) đến điểm giao.\n- Giám sát chặt chẽ quá trình bốc xếp tài sản lên/xuống xe.\n- Xử lý các tình huống cướp giật, dàn cảnh tai nạn trên đường đi.',
    process: JSON.stringify([
      { step: 1, title: 'Lập kế hoạch di chuyển', description: 'Khảo sát tuyến đường chính và phương án dự phòng an toàn.' },
      { step: 2, title: 'Bảo vệ áp tải', description: 'Vệ sĩ trang bị áo giáp, công cụ hỗ trợ đi kèm trên xe chuyên dụng.' }
    ]),
    benefits: '- Bảo hiểm rủi ro 100% cho mọi giá trị tài sản đang vận chuyển.\n- Bảo mật tuyệt đối thời gian, tuyến đường và thông tin khách hàng.',
    icon: 'Truck',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1600&auto=format&fit=crop',
    price_min: 500000,
    price_max: 2000000,
    price_unit: 'chuyến',
    faq: JSON.stringify([{ q: 'Tiền mặt có được bảo hiểm không?', a: 'Có, gói bảo hiểm vận chuyển hàng hóa có giá trị cao đi kèm hợp đồng.' }]),
    order: 11,
    is_active: true,
    meta_title: 'Dịch Vụ Vệ Sĩ Áp Tải Tiền, Hàng Hóa Giá Trị | Long Việt',
    meta_desc: 'Vệ sĩ chuyên nghiệp áp tải tiền mặt, vàng bạc bằng xe chuyên dụng. An toàn tuyệt đối, bảo mật cao.'
  },
  {
    title: 'Bảo Vệ Yếu Nhân / VIP',
    slug: 'bao-ve-yeu-nhan',
    description: 'Cung cấp cận vệ, vệ sĩ cá nhân bảo vệ an toàn cho các doanh nhân, ca sĩ, ngôi sao, chính khách nước ngoài đến Việt Nam. Đội ngũ vệ sĩ tinh nhuệ, ngoại hình đẹp và võ thuật xuất sắc.',
    scope: '- Tháp tùng bảo vệ yếu nhân mọi lúc mọi nơi theo lịch trình.\n- Tiền trạm khảo sát an ninh tại các địa điểm yếu nhân sắp đến.\n- Lập hàng rào che chắn, bảo vệ danh dự và tính mạng cho VIP.',
    process: JSON.stringify([
      { step: 1, title: 'Tiếp nhận thông tin', description: 'Đánh giá mức độ rủi ro và lên kịch bản bảo vệ sát sườn.' },
      { step: 2, title: 'Triển khai bảo vệ', description: 'Cận vệ theo sát 24/24, có xe dẫn đường và bảo vệ vòng ngoài.' }
    ]),
    benefits: '- An toàn tính mạng tuyệt đối trước các fan cuồng hoặc đối thủ đe dọa.\n- Khẳng định đẳng cấp, sự uy nghiêm và chuyên nghiệp của khách hàng VIP.',
    icon: 'UserCheck',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    price_min: 2000000,
    price_max: 5000000,
    price_unit: 'ngày/vệ sĩ',
    faq: JSON.stringify([{ q: 'Vệ sĩ có biết giao tiếp tiếng Anh không?', a: 'Có, các vệ sĩ VIP được đào tạo giao tiếp tiếng Anh cơ bản và tác phong chuẩn mực.' }]),
    order: 12,
    is_active: true,
    meta_title: 'Dịch Vụ Cận Vệ, Bảo Vệ Yếu Nhân VIP | Long Việt',
    meta_desc: 'Cho thuê vệ sĩ cá nhân bảo vệ doanh nhân, ngôi sao giải trí. Võ thuật cao, phản ứng nhanh, giữ bí mật.'
  }
]

const categoriesData = [
  { name: 'Tin Công Ty', slug: 'tin-cong-ty', type: 'BLOG' as PostType, order: 1 },
  { name: 'Nghiệp Vụ', slug: 'nghiep-vu', type: 'BLOG' as PostType, order: 2 },
  { name: 'Tuyển Dụng', slug: 'tuyen-dung-blog', type: 'BLOG' as PostType, order: 3 },
  { name: 'Kiến Thức', slug: 'kien-thuc', type: 'BLOG' as PostType, order: 4 },
  { name: 'PCCC', slug: 'phong-chay-chua-chay', type: 'DOCUMENT' as PostType, order: 1 },
  { name: 'Nghiệp Vụ BV', slug: 'nghiep-vu-bao-ve', type: 'DOCUMENT' as PostType, order: 2 },
  { name: 'Sơ Cấp Cứu', slug: 'so-cap-cuu', type: 'DOCUMENT' as PostType, order: 3 },
  { name: 'Cứu Hộ Cứu Nạn', slug: 'cuu-ho-cuu-nan', type: 'DOCUMENT' as PostType, order: 4 },
]

const partnersData = [
  { name: 'Tập Đoàn Vingroup', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop', website: 'https://vingroup.net', order: 1 },
  { name: 'Ngân Hàng Vietcombank', logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop', website: 'https://vietcombank.com.vn', order: 2 },
  { name: 'Tập Đoàn Masan', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop', website: 'https://masangroup.com', order: 3 },
  { name: 'Tổng Công Ty Tân Cảng Sài Gòn', logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=300&auto=format&fit=crop', website: 'https://saigonnewport.com.vn', order: 4 },
  { name: 'Tập Đoàn Novaland', logo: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=300&auto=format&fit=crop', website: 'https://novaland.com.vn', order: 5 },
  { name: 'Tổng Công Ty Becamex IDC', logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=300&auto=format&fit=crop', website: 'https://becamex.com.vn', order: 6 },
  { name: 'Siêu Thị Lotte Mart', logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=300&auto=format&fit=crop', website: 'https://lottemart.com.vn', order: 7 },
  { name: 'Tập Đoàn Hòa Phát', logo: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=300&auto=format&fit=crop', website: 'https://hoaphat.com.vn', order: 8 },
  { name: 'Tổng Công Ty EVN', logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=300&auto=format&fit=crop', website: 'https://evn.com.vn', order: 9 },
  { name: 'Tập Đoàn Trường Hải THACO', logo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=300&auto=format&fit=crop', website: 'https://thacogroup.vn', order: 10 },
]

const testimonialsData = [
  {
    client_name: 'Ông Nguyễn Văn Hùng',
    position: 'Giám Đốc An Ninh',
    company: 'Nhà Máy Điện Tử Samsung HCMC',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=150&auto=format&fit=crop',
    content: 'Long Việt Security là đối tác bảo vệ uy tín nhất mà chúng tôi từng hợp tác. Đội ngũ vệ sĩ của họ có tính kỷ luật cao tuyệt đối như quân đội, tác phong nghiêm túc và vận hành công nghệ GPS tuần tra rất minh bạch. Từ khi ký hợp đồng, nhà máy chưa bao giờ xảy ra mất mát tài sản.',
    rating: 5,
    order: 1
  },
  {
    client_name: 'Bà Trần Thị Lan',
    position: 'Trưởng Ban Quản Trị Tòa Nhà',
    company: 'Cao ốc Văn Phòng Saigon Trade Center',
    logo: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=150&auto=format&fit=crop',
    content: 'Chúng tôi đánh giá rất cao sự thân thiện nhưng không kém phần cương quyết của các vệ sĩ Long Việt trực sảnh tòa nhà. Các cư dân và đối tác văn phòng nước ngoài thường xuyên khen ngợi tác phong lịch sự chào hỏi đón tiếp của họ.',
    rating: 5,
    order: 2
  },
  {
    client_name: 'Ông David Beckham Nguyen',
    position: 'Tổng Đạo Diễn Sự Kiện',
    company: 'Đại Nhạc Hội EDM Sound Fest 2026',
    logo: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=150&auto=format&fit=crop',
    content: 'Quản lý 50.000 khán giả quá khích là thử thách khổng lồ. Tuy nhiên, đội phản ứng nhanh cơ động của Long Việt Security đã phối hợp lập hàng rào sắt, khống chế các vụ xô đẩy xô xát vô cùng êm đẹp. Vệ sĩ hộ tống ca sĩ quốc tế an toàn 100%. Rất chuyên nghiệp!',
    rating: 5,
    order: 3
  },
  {
    client_name: 'Bà Lê Minh Anh',
    position: 'Giám Đốc Vận Hành',
    company: 'Hệ Thống Siêu Thị Lotte Mart Việt Nam',
    logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=150&auto=format&fit=crop',
    content: 'Vệ sĩ kiểm soát kẻ gian lấy cắp hàng siêu thị cực kỳ tinh mắt. Long Việt Security còn tư vấn lắp đặt lại các chốt camera mù, giúp chúng tôi giảm đến 95% tỷ lệ thất thoát sản phẩm hàng tháng. Dịch vụ đáng tiền nhất!',
    rating: 5,
    order: 4
  },
  {
    client_name: 'Ông Hoàng Anh Tuấn',
    position: 'Phó Tổng Giám Đốc',
    company: 'Ngân Hàng TMCP Ngoại Thương Vietcombank',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=150&auto=format&fit=crop',
    content: 'Sự an toàn kho quỹ ngân hàng luôn là ưu tiên tối thượng. Vệ sĩ sảnh của Long Việt bản lĩnh và tỉnh táo trong suốt thời gian trực, phối hợp xe bọc thép áp tải tiền ngân hàng hoàn hảo tuyệt đối. Sự chuyên nghiệp vượt xa mong đợi của chúng tôi.',
    rating: 5,
    order: 5
  }
]

const branchesData = [
  {
    name: 'Hội Sở Chính - TP. Hồ Chí Minh',
    address: 'B23 Khu Dân Cư Nam Long, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh',
    phone: '0923 840 999',
    email: 'hcm@baovelongviet.vn',
    province: 'tphcm',
    is_main: true,
    order: 1
  },
  {
    name: 'Chi Nhánh Hà Nội',
    address: 'Số 12A Đường Khuất Duy Tiến, Phường Thanh Xuân Trung, Quận Thanh Xuân, TP. Hà Nội',
    phone: '0923 840 999',
    email: 'hanoi@baovelongviet.vn',
    province: 'hanoi',
    is_main: false,
    order: 2
  },
  {
    name: 'Chi Nhánh Đà Nẵng',
    address: 'Số 45 Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng',
    phone: '0923 840 999',
    email: 'danang@baovelongviet.vn',
    province: 'danang',
    is_main: false,
    order: 3
  },
  {
    name: 'Văn Phòng Đại Diện Đồng Nai',
    address: 'Số 112 Đại Lộ Nguyễn Ái Quốc, Phường Tân Phong, TP. Biên Hòa, Tỉnh Đồng Nai',
    phone: '0923 840 999',
    email: 'dongnai@baovelongviet.vn',
    province: 'dongnai',
    is_main: false,
    order: 4
  },
  {
    name: 'Văn Phòng Đại Diện Bình Dương',
    address: 'Số 88 Đường Đại Lộ Bình Dương, Phường Phú Hòa, TP. Thủ Dầu Một, Tỉnh Bình Dương',
    phone: '0923 840 999',
    email: 'binhduong@baovelongviet.vn',
    province: 'binhduong',
    is_main: false,
    order: 5
  }
]

// Generate 12 premium high-fidelity blogs & 8 detailed documents
function getPostsData(categoryMap: Map<string, string>, authorId: string) {
  const blogs = [
    {
      title: 'Long Việt Security Triển Khai Phương Án Bảo Vệ Tết Bính Ngọ 2026',
      slug: 'long-viet-trien-khai-phuong-an-bao-ve-tet-2026',
      excerpt: 'Nhằm đảm bảo an toàn tuyệt đối cho các nhà máy, văn phòng, biệt thự trong dịp Tết Nguyên Đán Bính Ngọ 2026, Long Việt triển khai đợt diễn tập tác chiến đặc biệt quy mô lớn.',
      content: `
        <p>Để chuẩn bị tốt nhất cho đợt cao điểm an ninh Tết Nguyên Đán Bính Ngọ 2026, Ban Tổng Giám đốc Long Việt Security đã chính thức phê duyệt phương án tác chiến khẩn cấp toàn quốc mang mật danh "Tết Bình An". Theo đó, 100% lực lượng cơ động phản ứng nhanh sẽ túc trực trực chiến, sẵn sàng chi viện trong vòng 3 phút khi nhận tín hiệu báo động khẩn cấp từ các chốt mục tiêu nhà máy, tòa nhà hay kho xưởng.</p>
        
        <h3>1. Diễn Tập Thực Địa Quy Mô Lớn</h3>
        <p>Trong tuần qua, hơn 500 chiến sĩ vệ sĩ xuất sắc tại khu vực TP.HCM, Bình Dương và Đồng Nai đã tham gia đợt diễn tập phòng chống đột nhập và diễn tập PCCC giáp lá cà. Các tình huống giả định bao gồm: kẻ gian dàn cảnh trộm cắp đột nhập hàng rào kho xưởng đêm khuya, xử lý bạo động đình công tại cổng chào khu công nghiệp, và ứng phó sự cố rò rỉ khí gas gây cháy nổ.</p>
        
        <h3>2. Tăng Cường Công Nghệ Giám Sát NFC</h3>
        <p>Không chỉ tăng cường sức người, Long Việt còn trang bị thiết bị check-in NFC trực tuyến chống bỏ chốt tại tất cả các góc khuất tường rào. Mọi thông tin tuần tra đều được hiển thị thời gian thực về Trung tâm Chỉ huy Tác chiến 24/7 của chúng tôi. Quý đối tác hoàn toàn yên tâm du xuân, đi du lịch mà vẫn nắm rõ tình hình an ninh mục tiêu thông qua báo cáo điện tử tự động hàng ngày.</p>
        
        <h3>3. Cam Kết Đền Bù Bằng Hợp Đồng Bảo Hiểm 20 Tỷ</h3>
        <p>Long Việt Security khẳng định trách nhiệm cao nhất với khách hàng. Toàn bộ tổn thất tài sản phát sinh do lỗi lơ là trực gác của vệ sĩ trong dịp Tết đều được bảo hiểm trách nhiệm pháp lý trị giá 20 tỷ đồng đền bù thỏa đáng 100% giá trị thực tế trong vòng 30 ngày làm việc.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1600&auto=format&fit=crop',
      type: 'BLOG' as const,
      category_id: categoryMap.get('tin-cong-ty'),
      status: 'PUBLISHED' as const,
      published_at: new Date('2026-01-15T08:00:00Z'),
      view_count: 345,
      tags: ['Tết 2026', 'An Ninh Tết', 'Lực Lượng Cơ Động', 'Long Việt Security']
    },
    {
      title: 'Kỹ Năng Khống Chế Đối Tượng Có Vũ Khí Cho Vệ Sĩ Ngân Hàng',
      slug: 'ky-nang-khong-che-doi-tuong-co-vu-khi-cho-ve-si-ngan-hang',
      excerpt: 'Cướp ngân hàng ngày càng manh động và tinh vi. Bài viết dưới đây hướng dẫn quy trình ứng biến khẩn cấp chuẩn nghiệp vụ đặc công quốc tế cho vệ sĩ ngân hàng.',
      content: `
        <p>Các vụ cướp ngân hàng có vũ trang (súng tự chế, dao găm, lựu đạn giả) có xu hướng gia tăng và đe dọa trực tiếp đến tính mạng khách hàng. Trong chương trình huấn luyện đặc nhiệm định kỳ của Long Việt, kỹ năng khống chế tay đôi và giải cứu con tin luôn là học phần bắt buộc có độ khó cao nhất.</p>
        
        <h3>1. Nguyên Tắc Cốt Lõi: Giữ Khoảng Cách Và Trấn An</h3>
        <p>Khi đối tượng rút vũ khí, vệ sĩ sảnh tuyệt đối không được lao vào cướp vũ khí ngay nếu chưa có góc áp sát tối ưu. Hành động nóng vội có thể kích động đối tượng gây nguy hiểm cho giao dịch viên và khách hàng xung quanh. Quy tắc cốt lõi là giữ khoảng cách từ 2-3 mét, hai tay giơ ngang ngực thể hiện thái độ hợp tác nhưng mắt luôn quan sát tìm góc mù sơ hở.</p>
        
        <h3>2. Kỹ Thuật Tước Dao Và Khống Chế Bẻ Khớp</h3>
        <p>Bảo vệ được huấn luyện các thế võ nhu thuật Judo và Aikido. Khi đối tượng sơ hở (chuyển tiền vào túi hoặc quát tháo nhân viên), vệ sĩ thực hiện cú đá quét trụ thấp, đồng thời dùng khóa tay cùi chỏ khóa khớp vai đối thủ xuống sàn. Sử dụng còng số 8 để cô lập đối tượng lập tức trước khi bàn giao cho công an.</p>
        
        <h3>3. Kích Hoạt Nút SOS Khẩn Cấp Kết Nối Công An</h3>
        <p>Tại quầy giao dịch và trong bốt bảo vệ luôn bố trí nút bấm SOS bí mật kết nối thẳng về công an khu vực và Trung tâm Chỉ huy phản ứng nhanh Long Việt. Chỉ trong vòng 5 phút, lực lượng chức năng sẽ có mặt chi viện ứng cứu kịp thời.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=1600&auto=format&fit=crop',
      type: 'BLOG' as const,
      category_id: categoryMap.get('nghiep-vu'),
      status: 'PUBLISHED' as const,
      published_at: new Date('2026-02-10T09:30:00Z'),
      view_count: 512,
      tags: ['Nghiệp vụ bảo vệ', 'Bảo vệ ngân hàng', 'Khống chế tội phạm', 'SOS']
    },
    {
      title: 'Long Việt Đạt Giải Thưởng Thương Hiệu Vàng An Ninh Việt Nam 2025',
      slug: 'long-viet-dat-giai-thuong-thuong-hieu-vang-an-ninh-2025',
      excerpt: 'Long Việt vinh dự đón nhận cúp vàng danh hiệu "Thương Hiệu Bảo Vệ Uy Tín & Chất Lượng Xuất Sắc Nhất Việt Nam 2025" do Cục Cảnh sát QLHC về TTXH bình chọn.',
      content: `
        <p>Ngày 20/12 vừa qua tại Nhà hát lớn Hà Nội, Hiệp hội Dịch vụ Bảo vệ Việt Nam phối hợp cùng các bộ ban ngành đã long trọng tổ chức lễ tôn vinh các doanh nghiệp an ninh xuất sắc. Vượt qua hơn 500 nhà thầu an ninh trên toàn quốc, Công Ty Dịch Vụ Bảo Vệ Long Việt đã xuất sắc được vinh danh trong Top 10 Thương hiệu Vàng An ninh Việt Nam năm 2025.</p>
        
        <h3>Sự Ghi Nhận Xứng Đáng Cho Hành Trình 15 Năm</h3>
        <p>Đây là mốc son chói lọi đánh dấu 15 năm hình thành và phát triển bền bỉ của Long Việt Security. Chúng tôi đã xây dựng quy mô hơn 2000 cán bộ chiến sĩ vệ sĩ, phục vụ cho hàng nghìn đối tác nhà máy, ngân hàng, cao ốc văn phòng lớn.</p>
        <p>Giải thưởng được đánh giá dựa trên các tiêu chí cực kỳ khắt khe: 100% nhân sự có lý lịch tư pháp trong sạch, tỷ lệ đền bù bảo hiểm tài sản đạt 100% không tranh chấp, chất lượng huấn luyện chuẩn quân đội và đi đầu trong số hóa tuần tra camera AI thông minh.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1600&auto=format&fit=crop',
      type: 'BLOG' as const,
      category_id: categoryMap.get('tin-cong-ty'),
      status: 'PUBLISHED' as const,
      published_at: new Date('2025-12-22T10:00:00Z'),
      view_count: 289,
      tags: ['Giải Thưởng', 'Thương Hiệu Vàng', 'Uy Tín', 'Long Việt Security']
    },
    {
      title: 'Thông Báo Tuyển Dụng 200 Vệ Sĩ Trực Gác Sự Kiện Lớn Tại TP.HCM',
      slug: 'thong-bao-tuyen-dung-200-ve-si-truc-gac-su-kien-hcm',
      excerpt: 'Cơ hội việc làm thu nhập cao trong dịp hè 2026. Long Việt Security tuyển dụng gấp 200 vệ sĩ sự kiện thời vụ lương từ 35.000 - 50.000 VNĐ/giờ, bao ăn ở.',
      content: `
        <p>Để phục vụ cho chuỗi liveshow ca nhạc và triển lãm thương mại quốc tế quy mô cực lớn diễn ra tại Trung tâm Triển lãm SECC Quận 7 và Sân vận động Quân khu 7 trong tháng 6 và 7 năm 2026, Long Việt Security chính thức mở đợt tuyển dụng nhân sự quy mô lớn chưa từng có.</p>
        
        <h3>1. Quyền Lợi & Mức Lương Hấp Dẫn</h3>
        <ul>
          <li>Mức lương thời vụ cực cao: từ 35.000 đến 50.000 VNĐ/giờ tùy vị trí trực sảnh hay chốt chặn hàng rào.</li>
          <li>Hỗ trợ 100% tiền ăn giữa ca trực và nhà đội ở miễn phí cho nhân viên ở xa.</li>
          <li>Được đào tạo nghiệp vụ an ninh sự kiện ngắn hạn miễn phí bởi các cựu đặc công Long Việt.</li>
          <li>Cơ hội được ký hợp đồng chính thức, đóng BHXH đầy đủ sau khi kết thúc chuỗi sự kiện.</li>
        </ul>
        
        <h3>2. Yêu Cầu Tuyển Dụng Đơn Giản</h3>
        <p>Nam cao từ 1m68 trở lên, nặng trên 60kg. Nữ cao từ 1m58 trở lên, nặng trên 50kg. Tuổi từ 18 - 45, sức khỏe tốt, không xăm trổ lộ ra ngoài quân phục, không có tiền án tiền sự. Ưu tiên bộ đội công an xuất ngũ hoặc ứng viên đã có chứng chỉ nghiệp vụ bảo vệ.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1521791136364-7286472b5399?q=80&w=1600&auto=format&fit=crop',
      type: 'BLOG' as const,
      category_id: categoryMap.get('tuyen-dung-blog'),
      status: 'PUBLISHED' as const,
      published_at: new Date('2026-05-01T07:00:00Z'),
      view_count: 823,
      tags: ['Tuyển dụng bảo vệ', 'Việc làm sự kiện', 'Lương cao', 'Tuyển dụng 2026']
    }
  ]

  // Add 8 more generic blogs to have 12 total blogs
  for (let i = 5; i <= 12; i++) {
    blogs.push({
      title: `Kiến Thức An Ninh Chuyên Sâu Phần ${i}: Quy Trình Tuần Tra Ban Đêm`,
      slug: `kien-thuc-an-ninh-chuyen-sau-phan-${i}`,
      excerpt: `Cung cấp kiến thức nghiệp vụ an ninh chuyên sâu định kỳ về quy trình tuần tra tường rào ban đêm bằng thiết bị số hóa NFC cho lực lượng bảo vệ mục tiêu cố định.`,
      content: `
        <p>Tuần tra ban đêm là nhiệm vụ đặc biệt quan trọng và tiềm ẩn nhiều rủi ro nhất đối với vệ sĩ trực mục tiêu cố định tại nhà máy, công trường và khu công nghiệp lớn. Dưới đây là quy trình 5 bước tuần tra số hóa chuẩn chỉnh được áp dụng tại Long Việt Security.</p>
        <h3>1. Chuẩn Bị Trang Thiết Bị Đầy Đủ</h3>
        <p>Trước khi đi tuần, vệ sĩ phải trang bị đầy đủ dùi cui điện, đèn pin siêu sáng, bộ đàm kết nối chỉ huy, máy tuần tra GPS và áo giáp chống đâm đối với các mục tiêu phức tạp.</p>
        <h3>2. Quét Điểm NFC Định Kỳ</h3>
        <p>Tại các vị trí trọng yếu dọc tường rào KCN, chúng tôi lắp đặt các chip NFC chống nước. Vệ sĩ đi qua phải dùng máy quét check-in thời gian thực, đảm bảo không ngủ gật hoặc bỏ chốt trực.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop',
      type: 'BLOG' as const,
      category_id: categoryMap.get('kien-thuc'),
      status: 'PUBLISHED' as const,
      published_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      view_count: 100 + i * 23,
      tags: ['Kiến thức bảo vệ', 'Tuần tra đêm', 'Thiết bị an ninh']
    })
  }

  const documents = [
    {
      title: 'Tài Liệu Hướng Dẫn Sử Dụng Bình Chữa Cháy Xách Tay PCCC',
      slug: 'tai-lieu-huong-dan-su-dung-binh-chua-chay-xach-tay',
      excerpt: 'Tài liệu hướng dẫn nghiệp vụ phòng cháy chữa cháy cơ bản. Cách phân biệt và sử dụng bình chữa cháy bột MFZ và khí CO2 MT3 dập tắt đám cháy trong 10 giây.',
      content: `
        <p>Hỏa hoạn có thể bùng phát bất ngờ từ một chập điện nhỏ hoặc sơ ý đun nấu. Sử dụng thành thạo bình chữa cháy xách tay trong 1 phút đầu tiên giúp dập tắt đến 90% đám cháy, ngăn chặn thảm họa cháy nổ lớn xảy ra.</p>
        
        <h3>1. Phân Biệt Bình Khí CO2 Và Bình Bột Khô</h3>
        <ul>
          <li><strong>Bình khí CO2 (Ký hiệu MT):</strong> Thân bình dày, vòi phun lớn dạng loa kèn. Chuyên dùng dập cháy thiết bị điện, hồ sơ giấy tờ vì khí CO2 tự bay hơi không làm hỏng linh kiện điện tử.</li>
          <li><strong>Bình bột khô (Ký hiệu MFZ):</strong> Có đồng hồ đo áp suất trên cổ bình. Chuyên dùng dập cháy chất lỏng (xăng, dầu), chất rắn. Rất hiệu quả ngoài trời nhưng hạn chế dùng trong phòng máy tính.</li>
        </ul>
        
        <h3>2. Quy Trình Sử Dụng 4 Bước (Nguyên Tắc PASS)</h3>
        <p>Khi phát hiện đám cháy:
          <br>1. Xách bình tiếp cận đám cháy cách 1.5 - 2 mét.
          <br>2. Rút chốt an toàn kẹp chì trên cổ bình.
          <br>3. Hướng vòi phun vào gốc lửa (không phun vào ngọn lửa).
          <br>4. Bóp chặt cò xịt cho đến khi ngọn lửa tắt hoàn toàn.
        </p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop',
      type: 'DOCUMENT' as const,
      category_id: categoryMap.get('phong-chay-chua-chay'),
      status: 'PUBLISHED' as const,
      published_at: new Date('2026-03-01T08:00:00Z'),
      view_count: 642,
      tags: ['Tài liệu PCCC', 'Bình chữa cháy', 'Kỹ năng thoát hiểm', 'An toàn nhà xưởng']
    },
    {
      title: 'Quy Trình Sơ Cấp Cứu Nạn Nhân Ngừng Tuần Hoàn (CPR)',
      slug: 'quy-trinh-so-cap-cuu-nan-nhan-ngung-tuan-hoan-cpr',
      excerpt: 'Sổ tay hướng dẫn sơ cấp cứu y tế tại chỗ cho lực lượng vệ sĩ. Chi tiết kỹ thuật ép tim ngoài lồng ngực và hà hơi thổi ngạt cứu sống nạn nhân đuối nước hoặc điện giật.',
      content: `
        <p>Khi xảy ra sự cố điện giật hoặc tai nạn ngạt nước, nạn nhân có thể rơi vào trạng thái ngừng tuần hoàn (ngừng tim, ngừng thở). 4 phút đầu tiên được gọi là "Thời Gian Vàng" quyết định trực tiếp đến sự sống và chống chết não của nạn nhân.</p>
        
        <h3>1. Đánh Giá Hiện Trường Và Nạn Nhân</h3>
        <p>Đảm bảo hiện trường an toàn (đã ngắt nguồn điện hoặc đưa nạn nhân lên bờ). Vỗ nhẹ vào vai nạn nhân và hỏi lớn: "Anh/chị có sao không?". Nếu không phản ứng, kiểm tra nhịp thở bằng cách áp tai vào mũi nạn nhân quan sát lồng ngực trong 10 giây.</p>
        
        <h3>2. Thực Hiện Ép Tim Ngoài Lồng Ngực (CPR)</h3>
        <p>Đặt nạn nhân nằm ngửa trên nền cứng. Đặt gót bàn tay lên giữa xương ức của nạn nhân, tay kia đan lên trên. Duỗi thẳng hai tay, dùng lực phần trên cơ thể ép sâu xuống 5-6 cm với tốc độ 100 - 120 lần/phút.
          <br>Thực hiện chu kỳ: <strong>30 lần ép tim - 2 lần hà hơi thổi ngạt</strong> liên tục cho đến khi y tế đến hoặc nạn nhân thở lại.
        </p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
      type: 'DOCUMENT' as const,
      category_id: categoryMap.get('so-cap-cuu'),
      status: 'PUBLISHED' as const,
      published_at: new Date('2026-04-12T09:00:00Z'),
      view_count: 423,
      tags: ['Sơ cấp cứu', 'Hồi sức tim phổi', 'CPR', 'Kỹ năng y tế']
    }
  ]

  // Add 6 more documents to have 8 total documents
  const documentCategorySlugs = ['nghiep-vu-bao-ve', 'cuu-ho-cuu-nan']
  for (let i = 3; i <= 8; i++) {
    const targetCatSlug = documentCategorySlugs[i % documentCategorySlugs.length]
    documents.push({
      title: `Cẩm Nang Hướng Dẫn Nghiệp Vụ Vệ Sĩ Chuyên Sâu Phần ${i}`,
      slug: `cam-nang-huong-dan-nghiep-vu-ve-si-chuyen-sau-phan-${i}`,
      excerpt: `Tài liệu huấn luyện nghiệp vụ bảo vệ chuyên biệt, xử lý tình huống mất an ninh trật tự, sơ tán khẩn cấp và cứu nạn sự cố ngập lụt thiên tai bão lũ.`,
      content: `
        <p>Nghiệp vụ vệ sĩ chuyên sâu đòi hỏi sự am hiểu sâu sắc về pháp luật Việt Nam, võ thuật tự vệ và kỹ năng mềm giải quyết xung đột ôn hòa.</p>
        <h3>Kỹ Năng Giải Quyết Mâu Thuẫn Ôn Hòa</h3>
        <p>Bảo vệ thường xuyên đối mặt với các tình huống tranh cãi của khách hàng tại TTTM hoặc sảnh văn phòng. Nguyên tắc là lắng nghe khách hàng, giữ giọng ôn hòa nhưng cương quyết thực thi nội quy tòa nhà.</p>
      `,
      thumbnail: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1600&auto=format&fit=crop',
      type: 'DOCUMENT' as const,
      category_id: categoryMap.get(targetCatSlug),
      status: 'PUBLISHED' as const,
      published_at: new Date(Date.now() - i * 15 * 24 * 60 * 60 * 1000),
      view_count: 80 + i * 15,
      tags: ['Nghiệp vụ bảo vệ', 'Cẩm nang vệ sĩ', 'Cứu hộ cứu nạn']
    })
  }

  // Combine and map author
  return [...blogs, ...documents].map(p => ({
    ...p,
    author_id: authorId
  }))
}

async function main() {
  console.log('🌱 Starting full database seed script...')

  // 1. CLEAN UP EXISTING RECORDS IN ORDER (Due to foreign keys)
  await prisma.application.deleteMany()
  await prisma.job.deleteMany()
  await prisma.post.deleteMany()
  await prisma.category.deleteMany()
  await prisma.service.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.branch.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned up existing records successfully.')

  // 2. SEED DEFAULT ADMIN USER
  const admin = await prisma.user.create({
    data: {
      email: 'admin@baovelongviet.vn',
      password: '$2a$10$U5C4QxXQjNqfP4865V.L7ugT3B0hW7V16lZ4Q5S8G7q.n36s1g/9q', // admin123
      name: 'Ban Biên Tập Long Việt',
      role: 'ADMIN',
      is_active: true
    }
  })
  console.log('👤 Seeded Default Admin User.')

  // 3. SEED 12 SERVICES
  for (const item of servicesData) {
    await prisma.service.create({
      data: item
    })
  }
  console.log('🛡️ Seeded 12 Active Services.')

  // 4. SEED CATEGORIES
  const categoryMap = new Map<string, string>()
  for (const item of categoriesData) {
    const cat = await prisma.category.create({
      data: item
    })
    categoryMap.set(cat.slug, cat.id)
  }
  console.log('🏷️ Seeded 8 Post & Document Categories.')

  // 5. SEED 20 DETAILED POSTS (12 BLOG + 8 DOCUMENT)
  const posts = getPostsData(categoryMap, admin.id)
  for (const item of posts) {
    await prisma.post.create({
      data: item
    })
  }
  console.log('📝 Seeded 20 Posts (12 Blogs & 8 Documents).')

  // 6. SEED PARTNERS
  for (const item of partnersData) {
    await prisma.partner.create({
      data: item
    })
  }
  console.log('🤝 Seeded 10 Partner Logos.')

  // 7. SEED TESTIMONIALS
  for (const item of testimonialsData) {
    await prisma.testimonial.create({
      data: item
    })
  }
  console.log('⭐ Seeded 5 Client Testimonials.')

  // 8. SEED BRANCHES
  for (const item of branchesData) {
    await prisma.branch.create({
      data: item
    })
  }
  console.log('📍 Seeded 5 Regional Branches.')

  // 9. SEED 10 JOBS FOR RECRUITMENT
  const jobsData = [
    {
      title: 'Nhân Viên Bảo Vệ Nhà Máy',
      slug: 'nhan-vien-bao-ve-nha-may',
      location: 'TP.HCM, Đồng Nai, Bình Dương',
      salary_range: '8.5 - 12 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Kiểm soát người và phương tiện ra vào cổng nhà máy chuyên nghiệp</li><li>Tuần tra định kỳ xung quanh khuôn viên nhà máy theo ca trực</li><li>Giám sát hệ thống camera an ninh và báo cáo sự cố kịp thời</li><li>Đảm bảo các quy định an toàn lao động và PCCC được tuân thủ nghiêm ngặt</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam giới từ 20 đến 45 tuổi, sức khỏe tốt</li><li>Chiều cao tối thiểu 1m65, cân nặng tương ứng</li><li>Không có tiền án tiền sự, không xăm trổ ở vùng hở</li><li>Ưu tiên bộ đội, công an xuất ngũ hoặc đã có chứng chỉ nghiệp vụ bảo vệ</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Mức lương hấp dẫn từ 8.5 đến 12 triệu VNĐ/tháng (bao gồm tăng ca)</li><li>Hỗ trợ nhà ở nội trú miễn phí cho nhân viên ở xa</li><li>Đầy đủ chế độ BHXH, BHYT, BHTN theo luật định</li><li>Lương tháng 13, thưởng lễ tết và chuyên cần</li></ul>`,
      meta_title: 'Tuyển Nhân Viên Bảo Vệ Nhà Máy Lương Cao | Long Việt Security',
      meta_desc: 'Long Việt Security tuyển gấp 50 nhân viên bảo vệ nhà máy tại TP.HCM, Bình Dương, Đồng Nai. Lương 8.5-12 triệu, miễn phí nhà ở nội trú, đóng BHXH đầy đủ.',
    },
    {
      title: 'Nhân Viên Bảo Vệ Tòa Nhà Văn Phòng',
      slug: 'nhan-vien-bao-ve-toa-nha',
      location: 'Quận 1, Quận 7, TP.HCM',
      salary_range: '9 - 13 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Bảo vệ sảnh chính, tiếp đón khách hàng và cư dân tòa nhà</li><li>Hướng dẫn đỗ xe và hướng dẫn khách ra vào cầu thang máy</li><li>Tuần tra giám sát hành lang, lối thoát hiểm tòa nhà văn phòng</li><li>Lập biên bản ca trực và báo cáo tình hình cho đội trưởng</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam/Nữ từ 18 đến 40 tuổi, ngoại hình sáng</li><li>Giao tiếp lịch sự, niềm nở với khách hàng</li><li>Nhanh nhẹn, có tinh thần trách nhiệm cao trong công việc</li><li>Không yêu cầu kinh nghiệm (sẽ được đào tạo nghiệp vụ miễn phí)</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Mức thu nhập từ 9 đến 13 triệu VNĐ/tháng (lương cứng + phụ cấp)</li><li>Môi trường làm việc văn minh, sạch sẽ, máy lạnh</li><li>Chế độ tăng lương định kỳ hàng năm</li><li>Nhận BHXH và bảo hiểm tai nạn 24/7</li></ul>`,
      meta_title: 'Tuyển Bảo Vệ Tòa Nhà Văn Phòng Tại TP.HCM | Long Việt Security',
      meta_desc: 'Tuyển dụng nhân viên bảo vệ tòa nhà văn phòng tại Quận 1, Quận 7. Lương 9-13 triệu/tháng, môi trường làm việc chuyên nghiệp, có cơ hội thăng tiến cao.',
    },
    {
      title: 'Nhân Viên Vệ Sĩ Ngân Hàng',
      slug: 'nhan-vien-bao-ve-ngan-hang',
      location: 'Hà Nội, Hải Phòng, Quảng Ninh',
      salary_range: '10 - 15 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Bảo vệ an ninh tuyệt đối tại quầy giao dịch ngân hàng và cây ATM</li><li>Hỗ trợ khách hàng gửi xe và che ô khi trời mưa</li><li>Cảnh giác cao độ, ngăn ngừa các hành vi cướp giật, trộm cắp</li><li>Phối hợp áp tải tiền từ ngân hàng đến các chi nhánh an toàn</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam giới từ 22 đến 38 tuổi, chiều cao từ 1m70 trở lên</li><li>Võ thuật cơ bản hoặc tốt nghiệp bộ đội xuất ngũ</li><li>Phản ứng nhanh nhạy, võ thuật tự vệ tốt</li><li>Lý lịch tư pháp trong sạch, không có nợ xấu ngân hàng</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Mức lương từ 10 đến 15 triệu VNĐ/tháng (phụ cấp độc hại + hiểm nguy đầy đủ)</li><li>Được cấp trang bị vũ khí hỗ trợ chuyên nghiệp (roi điện, gậy sắt)</li><li>Đóng bảo hiểm cao cấp, nghỉ phép năm theo quy định</li><li>Hỗ trợ tiền ăn ca và tiền xăng xe</li></ul>`,
      meta_title: 'Tuyển Nhân Viên Vệ Sĩ Bảo Vệ Ngân Hàng | Long Việt Security',
      meta_desc: 'Tuyển dụng vệ sĩ bảo vệ ngân hàng tại Hà Nội, Quảng Ninh. Thu nhập 10-15 triệu, trang bị công cụ hiện đại, bảo hiểm cao cấp, môi trường chuyên nghiệp.',
    },
    {
      title: 'Nhân Viên Bảo Vệ Bệnh Viện',
      slug: 'nhan-vien-bao-ve-benh-vien',
      location: 'Cần Thơ, Vĩnh Long, Sóc Trăng',
      salary_range: '8 - 11 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Giữ gìn an ninh trật tự tại sảnh bệnh viện và các khu phòng khám</li><li>Ngăn chặn các đối tượng gây rối trật tự công cộng</li><li>Hướng dẫn bệnh nhân và người nhà đỗ xe, di chuyển đúng quy định</li><li>Kiểm tra hệ thống phòng cháy chữa cháy PCCC định kỳ</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam giới từ 20 đến 50 tuổi, có sức khỏe tốt</li><li>Tính cách điềm đạm, kiên nhẫn, chịu áp lực tốt</li><li>Không mắc bệnh truyền nhiễm hoặc dị tật cơ thể</li><li>Ưu tiên người có kinh nghiệm làm bảo vệ bệnh viện hoặc khu công cộng</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Thu nhập ổn định từ 8 - 11 triệu VNĐ/tháng, tăng ca đầy đủ</li><li>Hỗ trợ phụ cấp độc hại y tế hàng tháng</li><li>Hưởng đầy đủ chế độ phúc lợi bảo hiểm y tế theo quy định</li><li>Thưởng chuyên cần và các dịp lễ lớn trong năm</li></ul>`,
      meta_title: 'Tuyển Nhân Viên Bảo Vệ Bệnh Viện Lương Ổn Định | Long Việt Security',
      meta_desc: 'Tuyển dụng bảo vệ trực bệnh viện tại Cần Thơ, Sóc Trăng. Lương 8-11 triệu, đầy đủ chế độ, hỗ trợ ăn ở, công việc ổn định lâu dài.',
    },
    {
      title: 'Nhân Viên Bảo Vệ Trường Học',
      slug: 'nhan-vien-bao-ve-truong-hoc',
      location: 'Quận 3, Quận 10, TP.HCM',
      salary_range: '7.5 - 10 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Đảm bảo an toàn tuyệt đối cho học sinh, giáo viên trong khuôn viên trường</li><li>Đóng mở cổng trường học đúng giờ quy định</li><li>Tuần tra phòng chống cháy nổ, trộm cắp thiết bị trường học</li><li>Hỗ trợ điều tiết giao thông trước cổng trường giờ tan học</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam giới từ 25 đến 55 tuổi, tính tình hiền lành, yêu quý trẻ em</li><li>Lý lịch tư pháp rõ ràng, không hút thuốc trong trường</li><li>Giao tiếp lịch thiệp, mẫu mực, tác phong nhanh nhẹn</li><li>Sức khỏe tốt, không mắc bệnh tim mạch</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Lương từ 7.5 đến 10 triệu VNĐ/tháng, làm việc giờ hành chính</li><li>Được nghỉ các ngày chủ nhật và nghỉ hè theo chế độ</li><li>Nhận đầy đủ BHXH và quà tết từ ban giám hiệu</li><li>Môi trường làm việc an toàn, thân thiện, ít áp lực</li></ul>`,
      meta_title: 'Tuyển Nhân Viên Bảo Vệ Trường Học Tại TP.HCM | Long Việt Security',
      meta_desc: 'Tuyển dụng nhân sự bảo vệ trường học tại Quận 3, Quận 10. Công việc ổn định, giờ hành chính, lương 7.5-10 triệu, BHXH đầy đủ.',
    },
    {
      title: 'Nhân Viên Bảo Vệ Siêu Thị / TTTM',
      slug: 'nhan-vien-bao-ve-sieu-thi',
      location: 'Đà Nẵng, Quảng Nam',
      salary_range: '8 - 11.5 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Bảo vệ lối ra vào siêu thị và khu vực quầy thu ngân</li><li>Kiểm soát hóa đơn mua hàng của khách đối chiếu với hàng thực tế</li><li>Phát hiện và phòng ngừa các trường hợp trộm cắp, phá hoại tài sản</li><li>Tuần tra giám sát khu vực gian hàng và kho trung chuyển siêu thị</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam/Nữ từ 18 đến 45 tuổi, nhanh nhẹn, tinh mắt</li><li>Có khả năng quan sát tốt và giải quyết tình huống khéo léo</li><li>Làm việc theo ca xoay linh hoạt (ca 8 tiếng hoặc 12 tiếng)</li><li>Không có tiền án tiền sự</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Mức thu nhập từ 8 đến 11.5 triệu VNĐ/tháng</li><li>Phụ cấp tiền ăn ca và thưởng doanh số siêu thị</li><li>Tham gia đầy đủ BHXH và bảo hiểm y tế tự nguyện</li><li>Đồng phục siêu thị được cấp phát miễn phí</li></ul>`,
      meta_title: 'Tuyển Bảo Vệ Siêu Thị TTTM Lương Cao | Long Việt Security',
      meta_desc: 'Long Việt Security tuyển dụng nhân viên bảo vệ siêu thị tại Đà Nẵng, Quảng Nam. Lương xoay ca linh hoạt, thu nhập 8-11.5 triệu, đầy đủ chế độ.',
    },
    {
      title: 'Nhân Viên Giữ Xe Khách Sạn & Cửa Hàng',
      slug: 'nhan-vien-giu-xe',
      location: 'TP.HCM, Bình Dương',
      salary_range: '8 - 10 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Ghi vé xe, dắt xe và xếp xe cho khách hàng gọn gàng</li><li>Chủ động dắt xe và mở cửa đón khách hàng lịch sự</li><li>Bảo vệ tuyệt đối tài sản và phương tiện của khách hàng</li><li>Vệ sinh khu vực bãi giữ xe sạch sẽ, thoáng mát</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam từ 18 đến 50 tuổi, nhanh nhẹn, nhiệt tình</li><li>Tác phong lễ phép, chu đáo và biết dắt xe máy</li><li>Trung thực, chịu khó, có trách nhiệm</li><li>Không có tiền án tiền sự</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Lương từ 8 đến 10 triệu VNĐ/tháng, tiền tip/thưởng tự nhận</li><li>Hỗ trợ ăn trưa/ăn tối tại cửa hàng</li><li>Nghỉ phép 4 ngày/tháng vẫn hưởng nguyên lương</li><li>Đầy đủ chế độ bảo hiểm sau thử việc</li></ul>`,
      meta_title: 'Tuyển Nhân Viên Giữ Xe Cửa Hàng & Khách Sạn | Long Việt Security',
      meta_desc: 'Tuyển bảo vệ giữ xe máy, xe ô tô tại TP.HCM. Thu nhập 8-10 triệu, nhận tiền tip trực tiếp, hỗ trợ ăn ở, lý lịch rõ ràng.',
    },
    {
      title: 'Nhân Viên Bảo Vệ Kho Bãi & Cảng',
      slug: 'bao-ve-giu-kho',
      location: 'Quận 7, Nhà Bè, TP.HCM',
      salary_range: '9.5 - 13 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Kiểm soát xe container, xe tải xuất nhập kho hàng hóa</li><li>Niêm phong seal container và đối chiếu hóa đơn chứng từ</li><li>Tuần tra bảo vệ an ninh kho bãi, phát hiện rò rỉ hoặc mất mát</li><li>Phối hợp cùng đội xe nâng kiểm kê hàng hóa định kỳ</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam giới từ 22 đến 48 tuổi, sức khỏe dẻo dai</li><li>Biết sử dụng máy tính cơ bản hoặc ghi chép sổ sách tốt</li><li>Không ngại làm việc ngoài trời, có tính kỷ luật cao</li><li>Ưu tiên người có kinh nghiệm bảo vệ kho cảng</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Mức lương từ 9.5 đến 13 triệu VNĐ/tháng (tăng ca cao)</li><li>Được cấp phát đầy đủ trang bị bảo hộ lao động đạt chuẩn</li><li>Hỗ trợ tiền ăn ca đêm và phụ cấp xăng xe đi lại</li><li>Đầy đủ BHXH và bảo hiểm tai nạn nghề nghiệp</li></ul>`,
      meta_title: 'Tuyển Bảo Vệ Kho Bãi Cảng Biển Lương Cao | Long Việt Security',
      meta_desc: 'Tuyển gấp bảo vệ kho bãi container tại Quận 7, Nhà Bè. Thu nhập 9.5-13 triệu, chế độ tăng ca tốt, hỗ trợ bảo hiểm đầy đủ.',
    },
    {
      title: 'Vệ Sĩ Áp Tải Tiền & Bảo Vệ VIP',
      slug: 've-si-chuyen-nghiep-vip',
      location: 'TP.HCM, Hà Nội',
      salary_range: '15 - 25 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Bảo vệ an toàn tuyệt đối cho các doanh nhân, ngôi sao, chính khách (Yếu nhân)</li><li>Áp tải vận chuyển tiền mặt, vàng bạc, đá quý cho các tập đoàn lớn</li><li>Lập phương án di chuyển, khảo sát tuyến đường an toàn</li><li>Xử lý nhanh chóng các tình huống đe dọa an ninh, gây hấn</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam giới từ 25 đến 35 tuổi, chiều cao 1m75 trở lên, võ thuật tốt</li><li>Xuất thân từ đặc công, trinh sát, cảnh sát cơ động hoặc có đai đen võ thuật</li><li>Tác phong cực kỳ chuyên nghiệp, giữ bí mật tuyệt đối</li><li>Giao tiếp tiếng Anh cơ bản là một lợi thế lớn</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Mức lương cực kỳ hấp dẫn từ 15 đến 25 triệu VNĐ/tháng</li><li>Phụ cấp công tác phí, trang phục vest cao cấp</li><li>Đóng gói bảo hiểm sức khỏe quốc tế đặc biệt</li><li>Cơ hội đi công tác nước ngoài cùng các nguyên thủ, ngôi sao</li></ul>`,
      meta_title: 'Tuyển Vệ Sĩ Áp Tải Tiền & Bảo Vệ VIP Lương Cao | Long Việt Security',
      meta_desc: 'Tuyển dụng vệ sĩ tinh nhuệ áp tải tiền và bảo vệ yếu nhân VIP. Lương 15-25 triệu/tháng, bảo hiểm cao cấp, đào tạo võ thuật chuyên nghiệp.',
    },
    {
      title: 'Nhân Viên Bảo Vệ Khách Sạn & Resort 5 Sao',
      slug: 'bao-ve-khach-san',
      location: 'Phú Quốc, Kiên Giang',
      salary_range: '10 - 14 triệu VNĐ/tháng',
      type: 'FULLTIME',
      status: 'OPEN',
      description: `<h3>Mô Tả Công Việc</h3><ul><li>Tuần tra giữ gìn an ninh trật tự tại khuôn viên Resort và bãi biển riêng</li><li>Chào đón và hướng dẫn khách lưu trú đỗ xe ô tô gọn gàng</li><li>Giám sát hệ thống phòng cháy chữa cháy PCCC và cứu hộ cứu nạn</li><li>Hỗ trợ phòng hành lý khi khách check-in và check-out</li></ul>`,
      requirements: `<h3>Yêu Cầu Ứng Viên</h3><ul><li>Nam từ 18 đến 45 tuổi, sức khỏe tốt, biết bơi lội cơ bản</li><li>Giao tiếp nhã nhặn, lịch thiệp, phục vụ chu đáo</li><li>Tiếng Anh giao tiếp cơ bản (chào hỏi, hướng dẫn)</li><li>Không yêu cầu kinh nghiệm ( Resort sẽ đào tạo thực tế )</li></ul>`,
      benefits: `<h3>Quyền Lợi Được Hưởng</h3><ul><li>Lương từ 10 đến 14 triệu VNĐ/tháng, bao ăn ở nội trú 5 sao tại Resort</li><li>Vé máy bay/tàu xe khứ hồi nhận việc từ đất liền</li><li>Chế độ Service Charge (phí dịch vụ) hàng tháng từ Resort</li><li>BHXH đóng đầy đủ ngay từ tháng thử việc đầu tiên</li></ul>`,
      meta_title: 'Tuyển Bảo Vệ Khách Sạn Resort Phú Quốc | Long Việt Security',
      meta_desc: 'Tuyển dụng nhân viên bảo vệ Resort 5 sao tại Phú Quốc. Lương 10-14 triệu, bao ăn ở nội trú, hỗ trợ vé tàu xe nhận việc.',
    },
  ]

  for (const item of jobsData) {
    await prisma.job.create({
      data: item as any
    })
  }
  console.log('💼 Seeded 10 Active Job Openings.')

  // Seed default admin user
  const adminEmail = 'admin@yourdomain.vn'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('ChangeMe@2026', 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        is_active: true,
      },
    })
    console.log('👤 Default Admin User seeded successfully.')
  } else {
    console.log('👤 Admin User already exists.')
  }

  console.log('🎉 Seeding database completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding database failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
