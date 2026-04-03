document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-form');
    
    form.onsubmit = function(e) {
        e.preventDefault();

        const getVal = (id) => {
            const el = document.getElementById(id);
            if (!el) {
                alert("⚠️ ناقص عندك في الـ HTML عنصر بالـ ID ده: " + id);
                return null;
            }
            return el.value.trim();
        };

        const idVal = document.getElementById('edit-id')?.value || "";
        const qText = getVal('q-text');
        const opt0 = getVal('opt0');
        const opt1 = getVal('opt1');
        const opt2 = getVal('opt2');
        const opt3 = getVal('opt3');
        const correctIdx = getVal('correct-idx');

        //    تمام كدة يا حافظ   لو في أي حاجة ناقصة ، الكود هيقف هنا ويطلع رسالة بالاسم الناقص
        if (qText === null || opt0 === null || opt1 === null || opt2 === null || opt3 === null || correctIdx === null) return;

        
        let questions = JSON.parse(localStorage.getItem('medical_db')) || [];
        const opts = [opt0, opt1, opt2, opt3];

        //  منع تكرار الإجابات يا م/حافظ (مشكلة Humerus)
        if (new Set(opts.map(o => o.toLowerCase())).size < 4) {
            alert("⚠️ خطأ: لا يمكن تكرار الإجابات!");
            return;
        }

        const qData = {
            id: idVal ? parseInt(idVal) : Date.now(),
            question: qText,
            options: opts,
            correctIndex: parseInt(correctIdx)
        };

        if (idVal) {
            questions = questions.map(q => q.id == idVal ? qData : q);
        } else {
            questions.push(qData);
        }

        localStorage.setItem('medical_db', JSON.stringify(questions));
       alert("Question saved successfully! ✅");

        window.location.href = "index.html"; 

    };
});
