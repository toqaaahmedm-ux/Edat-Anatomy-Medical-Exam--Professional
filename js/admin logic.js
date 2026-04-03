        let questions = JSON.parse(localStorage.getItem('medical_db')) || [];
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');

        // ID (Edit Mode)
        if (editId) {
            const q = questions.find(item => item.id == editId);
            if (q) {
                document.getElementById('edit-id').value = q.id;
                document.getElementById('q-text').value = q.question;
                q.options.forEach((val, i) => document.getElementById(`opt${i}`).value = val);
                document.getElementById('correct-idx').value = q.correctIndex;

                document.getElementById('page-title').innerText = "Update Question";
                document.getElementById('submit-btn').innerText = "Update Now ✅";
                document.getElementById('submit-btn').className = "btn btn-info w-100 py-3 rounded-pill fw-bold text-white shadow-sm";
            }
        }

        document.getElementById('admin-form').onsubmit = (e) => {
            e.preventDefault();
            const idVal = document.getElementById('edit-id').value;

            const qData = {
                id: idVal ? parseInt(idVal) : Date.now(), 
                question: document.getElementById('q-text').value.trim(),
                options: Array.from(document.querySelectorAll('.opt')).map(i => i.value.trim()),
                correctIndex: parseInt(document.getElementById('correct-idx').value)
            };

            if (idVal) {
                // up date question
                questions = questions.map(q => q.id == idVal ? qData : q);
            } else {
                //add new question
                questions.push(qData);
            }

            localStorage.setItem('medical_db', JSON.stringify(questions));
            window.location.href = "manage.html"; 
        };