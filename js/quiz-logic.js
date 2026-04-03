let questions = JSON.parse(localStorage.getItem('medical_db')) || [];
let cur = 0, score = 0, sel = null, timer, timeLeft = 30;

function toggleView(id) {
    ['start-view', 'quiz-view', 'result-view'].forEach(v => document.getElementById(v).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function startQuiz() {
    if (questions.length === 0) return alert("No questions available!");
    cur = 0; score = 0;
    toggleView('quiz-view');
    renderQ();
}

function renderQ() {
    sel = null; timeLeft = 30;
    document.getElementById('nxt').disabled = true;
    let qData = questions[cur];
    document.getElementById('p-bar').style.width = ((cur + 1) / questions.length * 100) + "%";
    document.getElementById('q-text').innerText = qData.question;
    document.getElementById('options-box').innerHTML = qData.options.map((opt, i) => 
        `<button class="opt-btn" onclick="selectOpt(${i}, this)">${opt}</button>`
    ).join('');

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) nextQ();
    }, 1000);
}

function selectOpt(i, btn) {
    sel = i;
    document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('nxt').disabled = false;
}

function nextQ() {
    if (sel === questions[cur].correctIndex) score++;
    cur++;
    if (cur < questions.length) renderQ(); else finishQuiz();
}

function finishQuiz() {
    clearInterval(timer);
    toggleView('result-view');
    document.getElementById('res-score').innerText = `${score} / ${questions.length}`;
    if (score / questions.length >= 0.5) {
        document.getElementById('res-msg').innerText = "Congratulations! You Passed! 🎉";
        document.getElementById('pdf-btn').classList.remove('hidden');
    } else {
        document.getElementById('res-msg').innerText = "Failed. Try Again! ❌";
    }
}

function downloadPDF() {
    document.getElementById('cert-score').innerText = `${score} / ${questions.length}`;
    document.getElementById('cert-date').innerText = new Date().toLocaleDateString();
    html2pdf().from(document.getElementById('pdf-content')).save('My_Certificate.pdf');
}
