import Link from 'next/link';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';

const posts: { [key: string]: { title: string; description: string } } = {
    'mua-acc-freefire-gia-re-tai-shop-cu-ti': {
        title: 'Mua Acc FreeFire Giá Rẻ Tại Shop Cu Tí - Uy Tín Hàng Đầu',
        description:
            'Bạn đang tìm kiếm một địa chỉ uy tín để **mua acc FreeFire giá rẻ**? **Shop Cu Tí** chính là lựa chọn hoàn hảo dành cho bạn! Chúng tôi chuyên cung cấp các tài khoản FreeFire chất lượng cao với mức giá hợp lý nhất trên thị trường. Tại **Shop Cu Tí Gaming**, bạn có thể tìm thấy mọi loại acc từ acc thường đến acc VIP, phù hợp với mọi nhu cầu của game thủ. \n\n### Tại sao nên chọn Shop Cu Tí để mua acc FreeFire? \n- **Uy tín hàng đầu**: Chúng tôi đã phục vụ hàng nghìn khách hàng và nhận được nhiều phản hồi tích cực. \n- **Giá cả hợp lý**: Các acc FreeFire tại shop có giá rẻ nhất thị trường, chỉ từ 50.000 VNĐ. \n- **Giao dịch nhanh chóng**: Chỉ cần vài phút, bạn đã có thể sở hữu acc FreeFire trong mơ. \n- **Hỗ trợ tận tình**: Đội ngũ nhân viên của **Shop Cu Tí** luôn sẵn sàng hỗ trợ bạn 24/7. \n\n### Quy trình mua acc FreeFire tại Shop Cu Tí \n1. Truy cập website **Shop Cu Tí Gaming**. \n2. Chọn acc FreeFire phù hợp với nhu cầu của bạn. \n3. Thanh toán qua các hình thức tiện lợi như chuyển khoản, ví điện tử. \n4. Nhận thông tin tài khoản ngay lập tức! \n\nĐừng chần chừ, hãy đến với **Shop Cu Tí** để **mua acc FreeFire** ngay hôm nay và trải nghiệm dịch vụ **shop acc game** tốt nhất!',
    },
    'shop-acc-game-uy-tin-shopcutigaming': {
        title: 'Shop Acc Game Uy Tín - Shopcutigaming Có Gì Hấp Dẫn?',
        description:
            'Nếu bạn đang tìm kiếm một **shop acc game uy tín** để mua acc FreeFire, thì **Shopcutigaming** chính là điểm đến lý tưởng. Chúng tôi tự hào là một trong những **shop acc** hàng đầu, chuyên cung cấp các tài khoản FreeFire chất lượng với giá cả phải chăng. \n\n### Điều gì làm nên sự khác biệt của Shopcutigaming? \n- **Đa dạng tài khoản**: Từ acc FreeFire giá rẻ đến acc VIP với skin hiếm, **Shopcutigaming** có tất cả. \n- **Bảo mật tuyệt đối**: Mọi thông tin giao dịch của bạn đều được bảo mật 100%. \n- **Khuyến mãi hấp dẫn**: Thường xuyên có các chương trình giảm giá acc FreeFire, giúp bạn tiết kiệm chi phí. \n- **Hỗ trợ nhanh chóng**: Đội ngũ hỗ trợ của **Shopcutigaming** luôn sẵn sàng giải đáp mọi thắc mắc. \n\n### Làm thế nào để mua acc tại Shopcutigaming? \nChỉ cần truy cập website **Shopcutigaming**, chọn acc FreeFire ưng ý, thanh toán và nhận tài khoản ngay lập tức. Với **shop acc FreeFire** uy tín như chúng tôi, bạn sẽ không phải lo lắng về vấn đề lừa đảo. Hãy thử ngay hôm nay để trải nghiệm dịch vụ **shop acc game** tốt nhất!',
    },
    'shop-freefire-acc-dep-gia-re': {
        title: 'Shop FreeFire - Chuyên Bán Acc Đẹp Giá Rẻ Nhất 2025',
        description:
            'Bạn muốn sở hữu một tài khoản FreeFire đẹp với skin xịn và rank cao? **Shop FreeFire** của chúng tôi chuyên cung cấp các **acc FreeFire đẹp giá rẻ** nhất trên thị trường năm 2025. Với **Shop Cu Tí Gaming**, bạn sẽ dễ dàng tìm thấy acc phù hợp với phong cách chơi của mình. \n\n### Lý do nên chọn Shop FreeFire của chúng tôi \n- **Acc đẹp, đa dạng**: Từ acc có skin hiếm đến acc rank cao, tất cả đều có tại **Shop FreeFire**. \n- **Giá rẻ nhất**: Chúng tôi cam kết mang đến mức giá tốt nhất cho mọi game thủ. \n- **Giao dịch an toàn**: Mọi giao dịch tại **Shop Cu Tí** đều được bảo mật tuyệt đối. \n- **Hỗ trợ 24/7**: Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào. \n\n### Các loại acc FreeFire tại Shop Cu Tí \n- Acc FreeFire rank Kim Cương, giá chỉ từ 100.000 VNĐ. \n- Acc FreeFire có skin hiếm, giá từ 200.000 VNĐ. \n- Acc FreeFire VIP với full skin, giá từ 500.000 VNĐ. \n\nHãy đến với **Shop FreeFire** của **Shop Cu Tí Gaming** để **mua acc FreeFire** ngay hôm nay và chinh phục mọi trận đấu!',
    },
    'huong-dan-mua-acc-freefire-tai-shop-cu-ti': {
        title: 'Hướng Dẫn Mua Acc FreeFire Tại Shop Cu Tí Đơn Giản Nhất',
        description:
            'Bạn mới chơi FreeFire và muốn sở hữu một tài khoản chất lượng? **Shop Cu Tí** sẽ hướng dẫn bạn cách **mua acc FreeFire** một cách đơn giản và an toàn nhất. Với **Shop Cu Tí Gaming**, việc sở hữu acc FreeFire trong mơ chưa bao giờ dễ dàng đến thế! \n\n### Các bước mua acc FreeFire tại Shop Cu Tí \n1. **Truy cập website**: Vào trang chủ của **Shop Cu Tí Gaming** để xem danh sách acc. \n2. **Chọn acc phù hợp**: Lọc acc theo rank, skin, hoặc giá cả mà bạn mong muốn. \n3. **Thanh toán**: Sử dụng các phương thức thanh toán tiện lợi như chuyển khoản, Momo, hoặc ZaloPay. \n4. **Nhận tài khoản**: Sau khi thanh toán, bạn sẽ nhận được thông tin acc ngay lập tức. \n\n### Lưu ý khi mua acc FreeFire \n- Kiểm tra kỹ thông tin acc trước khi mua. \n- Liên hệ với đội ngũ hỗ trợ của **Shop Cu Tí** nếu có bất kỳ thắc mắc nào. \n- Tránh giao dịch bên ngoài để đảm bảo an toàn. \n\nVới **shop acc FreeFire** uy tín như **Shop Cu Tí**, bạn sẽ có trải nghiệm mua sắm tuyệt vời. Hãy thử ngay hôm nay!',
    },
    'top-5-acc-freefire-re-nhat-tai-shop-cu-ti': {
        title: 'Top 5 Acc FreeFire Rẻ Nhất Tại Shop Cu Tí Gaming 2025',
        description:
            'Bạn đang tìm kiếm **acc FreeFire giá rẻ** để bắt đầu hành trình chinh phục game? **Shop Cu Tí Gaming** giới thiệu danh sách **top 5 acc FreeFire rẻ nhất** năm 2025, phù hợp với mọi game thủ, từ người mới chơi đến người chơi lâu năm. \n\n### Top 5 acc FreeFire giá rẻ tại Shop Cu Tí \n1. **Acc FreeFire rank Đồng** - Giá: 50.000 VNĐ, phù hợp cho người mới. \n2. **Acc FreeFire rank Vàng** - Giá: 80.000 VNĐ, có skin cơ bản. \n3. **Acc FreeFire rank Bạch Kim** - Giá: 120.000 VNĐ, có skin đẹp. \n4. **Acc FreeFire rank Kim Cương** - Giá: 150.000 VNĐ, nhiều vật phẩm giá trị. \n5. **Acc FreeFire rank Thách Đấu** - Giá: 200.000 VNĐ, full skin hiếm. \n\n### Tại sao nên mua acc tại Shop Cu Tí? \n- **Giá rẻ nhất thị trường**: Cam kết giá tốt nhất cho mọi acc FreeFire. \n- **Uy tín hàng đầu**: **Shop Cu Tí** đã được hàng nghìn game thủ tin tưởng. \n- **Hỗ trợ nhanh chóng**: Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn. \n\nHãy đến với **Shop Cu Tí Gaming** để **mua acc FreeFire** giá rẻ ngay hôm nay!',
    },
    'tai-sao-nen-mua-acc-tai-shopcutigaming': {
        title: 'Tại Sao Nên Mua Acc FreeFire Tại Shopcutigaming?',
        description:
            'Khi nói đến **shop acc FreeFire uy tín**, **Shopcutigaming** luôn là cái tên được nhắc đến đầu tiên. Vậy tại sao bạn nên **mua acc FreeFire** tại **Shopcutigaming**? Hãy cùng tìm hiểu lý do ngay dưới đây! \n\n### 5 lý do nên chọn Shopcutigaming \n1. **Uy tín hàng đầu**: **Shopcutigaming** đã hoạt động nhiều năm và được cộng đồng game thủ tin tưởng. \n2. **Đa dạng acc FreeFire**: Từ acc giá rẻ đến acc VIP, bạn có thể tìm thấy mọi thứ tại đây. \n3. **Giá cả cạnh tranh**: Chúng tôi cam kết mang đến mức giá tốt nhất cho mọi tài khoản. \n4. **Giao dịch an toàn**: Mọi thông tin của bạn đều được bảo mật tuyệt đối. \n5. **Hỗ trợ 24/7**: Đội ngũ nhân viên luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào. \n\n### Cách mua acc tại Shopcutigaming \n- Truy cập website **Shopcutigaming**. \n- Chọn acc FreeFire phù hợp với nhu cầu. \n- Thanh toán và nhận tài khoản ngay lập tức. \n\nĐừng bỏ lỡ cơ hội sở hữu acc FreeFire chất lượng tại **Shopcutigaming** - **shop acc game** hàng đầu hiện nay!',
    },
    'shop-acc-freefire-rank-cao-gia-re': {
        title: 'Shop Acc FreeFire Rank Cao Giá Rẻ - Shop Cu Tí Gaming',
        description:
            'Bạn muốn sở hữu một tài khoản FreeFire rank cao để chinh phục mọi trận đấu? **Shop Cu Tí Gaming** chuyên cung cấp **acc FreeFire rank cao giá rẻ**, giúp bạn tiết kiệm thời gian và chi phí. \n\n### Các loại acc FreeFire rank cao tại Shop Cu Tí \n- **Rank Kim Cương**: Giá từ 150.000 VNĐ, có skin cơ bản. \n- **Rank Thách Đấu**: Giá từ 300.000 VNĐ, full skin hiếm. \n- **Rank Đại Sư**: Giá từ 500.000 VNĐ, acc VIP với nhiều vật phẩm giá trị. \n\n### Lợi ích khi mua acc rank cao tại Shop Cu Tí \n- **Tiết kiệm thời gian**: Không cần cày rank từ đầu, bạn có thể tham gia các trận đấu đỉnh cao ngay lập tức. \n- **Giá rẻ**: **Shop Cu Tí** cam kết giá tốt nhất cho acc rank cao. \n- **Uy tín**: Chúng tôi là **shop acc FreeFire** được nhiều game thủ tin tưởng. \n\nHãy đến với **Shop Cu Tí Gaming** để **mua acc FreeFire** rank cao ngay hôm nay và trở thành cao thủ trong game!',
    },
    'kinh-nghiem-mua-acc-freefire-an-toan': {
        title: 'Kinh Nghiệm Mua Acc FreeFire An Toàn Tại Shop Acc Game',
        description:
            'Việc **mua acc FreeFire** có thể gặp rủi ro nếu bạn không chọn đúng **shop acc game** uy tín. Dưới đây là những kinh nghiệm giúp bạn mua acc FreeFire an toàn tại **Shop Cu Tí Gaming** hoặc **Shopcutigaming**. \n\n### Kinh nghiệm mua acc FreeFire an toàn \n1. **Chọn shop uy tín**: Hãy ưu tiên các **shop acc** như **Shop Cu Tí** hoặc **Shopcutigaming**, đã có nhiều năm kinh nghiệm và được cộng đồng tin tưởng. \n2. **Kiểm tra thông tin acc**: Xem kỹ rank, skin, và các vật phẩm trong acc trước khi mua. \n3. **Thanh toán an toàn**: Sử dụng các phương thức thanh toán được bảo mật, tránh giao dịch qua các kênh không rõ nguồn gốc. \n4. **Liên hệ hỗ trợ**: Nếu có vấn đề, hãy liên hệ ngay với đội ngũ hỗ trợ của shop. \n\n### Tại sao nên chọn Shop Cu Tí hoặc Shopcutigaming? \n- Cả hai đều là **shop acc FreeFire** uy tín, cam kết bảo mật thông tin khách hàng. \n- Giá cả hợp lý, giao dịch nhanh chóng. \n- Hỗ trợ tận tình, giải quyết mọi vấn đề của bạn. \n\nHãy áp dụng những kinh nghiệm trên để **mua acc FreeFire** an toàn và hiệu quả!',
    },
    'shop-cu-ti-ban-acc-freefire-vip': {
        title: 'Shop Cu Tí - Chuyên Bán Acc FreeFire VIP Đẹp Nhất',
        description:
            'Bạn muốn sở hữu một tài khoản FreeFire VIP với full skin hiếm và rank cao? **Shop Cu Tí Gaming** là địa chỉ hàng đầu để **mua acc FreeFire VIP** đẹp nhất hiện nay. \n\n### Các loại acc FreeFire VIP tại Shop Cu Tí \n- **Acc VIP rank Thách Đấu**: Full skin hiếm, giá từ 500.000 VNĐ. \n- **Acc VIP có skin giới hạn**: Skin độc quyền, giá từ 700.000 VNĐ. \n- **Acc VIP full vật phẩm**: Bao gồm cả pet và vũ khí hiếm, giá từ 1.000.000 VNĐ. \n\n### Lợi ích khi mua acc VIP tại Shop Cu Tí \n- **Chất lượng cao**: Tất cả acc đều được kiểm tra kỹ lưỡng trước khi giao. \n- **Giá hợp lý**: **Shop Cu Tí** cam kết giá tốt nhất cho acc VIP. \n- **Giao dịch an toàn**: Bảo mật thông tin khách hàng 100%. \n\nHãy đến với **Shop Cu Tí Gaming** để **mua acc FreeFire** VIP ngay hôm nay và trở thành tâm điểm trong mọi trận đấu!',
    },
    'mua-acc-freefire-co-skin-hiem-tai-shopcutigaming': {
        title: 'Mua Acc FreeFire Có Skin Hiếm Tại Shopcutigaming',
        description:
            'Bạn là fan của các skin hiếm trong FreeFire? **Shopcutigaming** chuyên cung cấp **acc FreeFire có skin hiếm** với giá cực kỳ hấp dẫn. Hãy cùng khám phá ngay! \n\n### Các acc FreeFire có skin hiếm tại Shopcutigaming \n- **Acc có skin Sakura**: Giá từ 300.000 VNĐ, rank Bạch Kim. \n- **Acc có skin Titan**: Giá từ 500.000 VNĐ, rank Kim Cương. \n- **Acc có skin giới hạn**: Giá từ 800.000 VNĐ, full vật phẩm hiếm. \n\n### Tại sao nên mua acc tại Shopcutigaming? \n- **Đa dạng skin hiếm**: **Shopcutigaming** có tất cả các skin mà bạn mơ ước. \n- **Giá rẻ**: Cam kết giá tốt nhất cho acc có skin hiếm. \n- **Uy tín**: Là **shop acc FreeFire** được nhiều game thủ tin tưởng. \n\nĐừng bỏ lỡ cơ hội sở hữu acc FreeFire với skin hiếm tại **Shopcutigaming** - **shop acc game** hàng đầu hiện nay!',
    },
    'shop-freefire-acc-gia-re-nhat-thi-truong': {
        title: 'Shop FreeFire - Acc Giá Rẻ Nhất Thị Trường 2025',
        description:
            'Bạn đang tìm kiếm **acc FreeFire giá rẻ nhất thị trường**? **Shop FreeFire** của **Shop Cu Tí Gaming** chính là lựa chọn số 1 dành cho bạn! Chúng tôi cung cấp các tài khoản FreeFire với mức giá không thể rẻ hơn, chỉ từ 30.000 VNĐ. \n\n### Các loại acc FreeFire giá rẻ tại Shop Cu Tí \n- **Acc rank Đồng**: Giá chỉ 30.000 VNĐ, phù hợp cho người mới. \n- **Acc rank Vàng**: Giá 50.000 VNĐ, có skin cơ bản. \n- **Acc rank Bạch Kim**: Giá 80.000 VNĐ, có vật phẩm giá trị. \n\n### Lợi ích khi mua acc tại Shop FreeFire \n- **Giá rẻ nhất**: **Shop Cu Tí** cam kết giá thấp nhất thị trường. \n- **Chất lượng đảm bảo**: Tất cả acc đều được kiểm tra kỹ lưỡng. \n- **Hỗ trợ nhanh chóng**: Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn. \n\nHãy đến với **Shop FreeFire** của **Shop Cu Tí Gaming** để **mua acc FreeFire** giá rẻ ngay hôm nay!',
    },
    'danh-gia-shop-acc-game-cu-ti-gaming': {
        title: 'Đánh Giá Shop Acc Game Cu Tí Gaming - Có Uy Tín Không?',
        description:
            'Bạn đang phân vân không biết **Shop Cu Tí Gaming** có uy tín không? Bài viết này sẽ **đánh giá shop acc game** **Shop Cu Tí** một cách chi tiết để bạn có cái nhìn rõ ràng hơn. \n\n### Đánh giá Shop Cu Tí Gaming \n- **Uy tín**: **Shop Cu Tí** đã hoạt động hơn 5 năm và được hàng nghìn game thủ tin tưởng. \n- **Chất lượng acc**: Tất cả acc FreeFire đều được kiểm tra kỹ lưỡng, đảm bảo không lỗi. \n- **Giá cả**: Giá acc tại **Shop Cu Tí** rất cạnh tranh, phù hợp với mọi đối tượng. \n- **Dịch vụ hỗ trợ**: Đội ngũ hỗ trợ nhiệt tình, giải đáp mọi thắc mắc 24/7. \n\n### Phản hồi từ khách hàng \n- "Tôi đã **mua acc FreeFire** tại **Shop Cu Tí** và rất hài lòng. Acc chất lượng, giao dịch nhanh!" - Nguyễn Văn A. \n- "Shop uy tín, giá rẻ, sẽ tiếp tục ủng hộ!" - Trần Thị B. \n\nVới những đánh giá trên, **Shop Cu Tí Gaming** xứng đáng là **shop acc FreeFire** uy tín mà bạn nên thử!',
    },
    'cach-chon-acc-freefire-phu-hop-tai-shop-cu-ti': {
        title: 'Cách Chọn Acc FreeFire Phù Hợp Tại Shop Cu Tí Gaming',
        description:
            'Việc chọn một tài khoản FreeFire phù hợp có thể ảnh hưởng lớn đến trải nghiệm chơi game của bạn. **Shop Cu Tí Gaming** sẽ hướng dẫn bạn **cách chọn acc FreeFire** phù hợp nhất tại **shop acc** của chúng tôi. \n\n### Cách chọn acc FreeFire tại Shop Cu Tí \n1. **Xác định nhu cầu**: Bạn muốn acc rank cao hay acc có skin đẹp? \n2. **Kiểm tra rank**: Nếu bạn muốn chơi rank cao, hãy chọn acc từ Kim Cương trở lên. \n3. **Xem skin và vật phẩm**: Ưu tiên acc có skin hiếm hoặc vật phẩm giá trị. \n4. **So sánh giá cả**: **Shop Cu Tí** cung cấp nhiều mức giá để bạn lựa chọn. \n\n### Lợi ích khi mua acc tại Shop Cu Tí \n- **Đa dạng acc**: Từ acc giá rẻ đến acc VIP, tất cả đều có tại **Shop Cu Tí Gaming**. \n- **Hỗ trợ tư vấn**: Đội ngũ nhân viên sẽ giúp bạn chọn acc phù hợp nhất. \n- **Giao dịch an toàn**: Bảo mật thông tin khách hàng 100%. \n\nHãy đến với **Shop Cu Tí** để **mua acc FreeFire** phù hợp ngay hôm nay!',
    },
    'shopcutigaming-khuyen-mai-acc-freefire': {
        title: 'Shopcutigaming Khuyến Mãi Acc FreeFire - Giảm Giá Sốc',
        description:
            'Cơ hội vàng để sở hữu acc FreeFire với giá siêu hời! **Shopcutigaming** đang có chương trình **khuyến mãi acc FreeFire** với mức giảm giá lên đến 50%. Nhanh tay để không bỏ lỡ! \n\n### Các acc FreeFire trong chương trình khuyến mãi \n- **Acc rank Vàng**: Giảm từ 100.000 VNĐ còn 50.000 VNĐ. \n- **Acc rank Kim Cương**: Giảm từ 200.000 VNĐ còn 120.000 VNĐ. \n- **Acc VIP full skin**: Giảm từ 800.000 VNĐ còn 500.000 VNĐ. \n\n### Cách tham gia khuyến mãi tại Shopcutigaming \n- Truy cập website **Shopcutigaming**. \n- Chọn acc FreeFire trong danh mục khuyến mãi. \n- Thanh toán và nhận ưu đãi ngay lập tức. \n\n### Lưu ý \n- Chương trình chỉ áp dụng trong thời gian có hạn. \n- Số lượng acc khuyến mãi có giới hạn, nhanh tay để không bỏ lỡ! \n\nHãy đến với **Shopcutigaming** để **mua acc FreeFire** với giá siêu hời ngay hôm nay!',
    },
    'shop-acc-game-freefire-tot-nhat-2025': {
        title: 'Shop Acc Game FreeFire Tốt Nhất 2025 - Shop Cu Tí',
        description:
            'Năm 2025, **Shop Cu Tí Gaming** tự hào là **shop acc game FreeFire tốt nhất**, mang đến cho game thủ những tài khoản chất lượng với giá cả hợp lý. Hãy cùng khám phá lý do tại sao chúng tôi được yêu thích đến vậy! \n\n### Tại sao Shop Cu Tí là shop acc FreeFire tốt nhất? \n- **Uy tín hàng đầu**: **Shop Cu Tí** đã phục vụ hàng nghìn khách hàng với tỷ lệ hài lòng 100%. \n- **Đa dạng acc**: Từ acc giá rẻ đến acc VIP, tất cả đều có tại **Shop Cu Tí Gaming**. \n- **Giá cả cạnh tranh**: Cam kết giá tốt nhất thị trường. \n- **Dịch vụ chuyên nghiệp**: Hỗ trợ 24/7, giao dịch nhanh chóng. \n\n### Các loại acc FreeFire tại Shop Cu Tí \n- Acc rank Đồng: Giá từ 30.000 VNĐ. \n- Acc rank Kim Cương: Giá từ 150.000 VNĐ. \n- Acc VIP full skin: Giá từ 500.000 VNĐ. \n\nHãy đến với **Shop Cu Tí Gaming** để **mua acc FreeFire** và trải nghiệm dịch vụ **shop acc** tốt nhất 2025!',
    },
};

type Params = Promise<{ slug: string }>;
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = posts[resolvedParams.slug];

    if (!post) {
        return {
            title: "Bài viết không tồn tại | Shop Cũ Tí Gaming",
        };
    }

    return {
        title: post.title,
        description: post.description.replace(/\*\*/g, '').replace(/\n/g, ' ').substring(0, 160),
        openGraph: {
            title: post.title,
            description: post.description.replace(/\*\*/g, '').replace(/\n/g, ' ').substring(0, 160),
            type: 'article',
            siteName: 'Shop Cu Tí Gaming',
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description.replace(/\*\*/g, '').replace(/\n/g, ' ').substring(0, 160),
        },
    };
}

export async function generateStaticParams() {
    return Object.keys(posts).map((slug) => ({
        slug,
    }));
}

export default async function PostPage({ params }: { params: Params }) {
    const resolvedParams = await params;
    const post = posts[resolvedParams.slug];

    if (!post) {
        notFound();
    }

    // Convert markdown-like content to HTML
    const convertToHtml = (content: string) => {
        // Replace bold text
        let html = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace headings
        html = html.replace(/### (.*?)\n/g, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
        
        // Replace list items
        html = html.replace(/- (.*?)\n/g, '<li class="mb-2">$1</li>');
        
        // Replace numbered list items
        html = html.replace(/(\d+)\. (.*?)\n/g, '<li class="mb-2">$1. $2</li>');
        
        // Wrap lists in ul/ol tags
        html = html.replace(/<li class="mb-2">(.*?)<\/li>\n/g, '<ul class="list-disc pl-6 mb-4"><li class="mb-2">$1</li></ul>');
        
        // Replace newlines with <br> for proper spacing
        html = html.replace(/\n/g, '<br>');
        
        return html;
    };

    const htmlContent = convertToHtml(post.description);

    return (
        <div className="min-h-screen bg-gray-100 font-sans py-20">
            <main className="container mx-auto px-4">
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex items-center">
                        <li className="mr-2">
                            <Link href="/" className="text-blue-600 hover:underline">
                                Trang chủ
                            </Link>
                        </li>
                        <li className="mx-2 text-gray-500">/</li>
                        <li className="mr-2">
                            <Link href="/bai-viet" className="text-blue-600 hover:underline">
                                Bài viết
                            </Link>
                        </li>
                        <li className="mx-2 text-gray-500">/</li>
                        <li className="text-gray-700">{post.title}</li>
                    </ol>
                </nav>
                
                <article className="bg-white p-6 md:p-8 rounded-lg shadow-md">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center text-gray-600 text-sm">
                            <time dateTime={new Date().toISOString()}>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</time>
                            <span className="mx-2">•</span>
                            <span>Shop Cu Tí Gaming</span>
                        </div>
                    </header>
                    
                    <div 
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                    
                    <footer className="mt-12 pt-6 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4">
                            <Link href="/bai-viet" className="inline-flex items-center text-blue-600 hover:underline">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Quay lại danh sách bài viết
                            </Link>
                            <Link href="/" className="inline-flex items-center text-blue-600 hover:underline">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                Về trang chủ
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}