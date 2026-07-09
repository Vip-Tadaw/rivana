document.addEventListener("DOMContentLoaded", () => {
    
    // ================= 1. إدارة التنقل والـ Active Class تلقائياً =================
    const currentPage = window.location.pathname.split("/").pop() || "home.html";
    const navItems = document.querySelectorAll('.nav-item, [data-redirect]');

    navItems.forEach(item => {
        const targetPage = item.getAttribute('data-redirect');
        
        // إذا كان العنصر يمثل الصفحة الحالية، أضف له الكلاس النشط
        if (targetPage === currentPage && item.classList.contains('nav-item')) {
            item.classList.add('active');
        }

        // إضافة تأثيرات النقر والانتقال الاحترافي
        item.style.cursor = "pointer";
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (targetPage && targetPage !== '#') {
                // إضافة تأثير اختفاء تدريجي خفيف قبل الانتقال لجمالية التصميم
                document.body.style.opacity = "0.6";
                document.body.style.transition = "opacity 0.2s ease";
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 150);
            }
        });
    });

    // ================= 2. ربط استمارة تحويل الأموال بالتليجرام =================
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع الصفحة من إعادة التحميل الافتراضية

            // معلومات البوت الخاص بك (قم باستبدالها بالتوكن والمعرف الخاصين بك)
            const TELEGRAM_TOKEN = "YOUR_BOT_TOKEN"; 
            const CHAT_ID = "YOUR_CHAT_ID";

            // جلب البيانات المدخلة من واجهة تحويل الأموال التي أرسلتها
            const recipientSelect = this.elements['saved_recipient'].value;
            const recipientSearch = this.elements['search_recipient'].value;
            const amount = this.elements['amount'].value;
            const message = this.elements['message'].value;
            const method = this.elements['transfer_method'].value;

            if(!amount || amount <= 0) {
                alert("يرجى إدخال مبلغ تحويل صحيح");
                return;
            }

            // صياغة رسالة التليجرام بشكل منظم واحترافي
            const telegramMessage = `
🚨 *طلب تحويل أموال جديد - Rivana* 🚨
━━━━━━━━━━━━━━━━━━
👤 *المستلم المختار:* ${recipientSelect || 'لم يتم الاختيار'}
🔍 *البحث عن مستلم:* ${recipientSearch || 'لا يوجد'}
💰 *المبلغ بالـ IQD:* ${Number(amount).toLocaleString()} IQD
📝 *الرسالة:* ${message || 'بدون رسالة'}
⚡ *طريقة التحويل:* ${method}
━━━━━━━━━━━━━━━━━━
⚙️ *حالة العملية:* قيد المعالجة تلقائياً
            `;

            // إرسال البيانات إلى التليجرام باستخدام Fetch API
            fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown'
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.ok) {
                    alert("تم إرسال طلب التحويل بنجاح وجاري المعالجة!");
                    this.reset(); // تصفير الحقول بعد النجاح
                } else {
                    alert("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("فشل الاتصال بالخادم.");
            });
        });
    }
});
