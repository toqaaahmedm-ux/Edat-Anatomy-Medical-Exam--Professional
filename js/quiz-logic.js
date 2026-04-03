

let questions = JSON.parse(localStorage.getItem('medical_db')) || [];
let cur = 0, score = 0, timerInterval, timeLeft = 40 * 60;
let userAnswers = []; //

function toggleView(id) {
    ['start-view', 'quiz-view', 'result-view'].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
}

function startQuiz() {
    const name = document.getElementById('student-name').value;
    if (!name.trim()) return alert("Please enter your name!");
    if (questions.length === 0) return alert("No questions available!");

    cur = 0; score = 0;
    userAnswers = new Array(questions.length).fill(null);
    toggleView('quiz-view');
    renderQ();
    startGlobalTimer();
}

function startGlobalTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        document.getElementById('total-timer').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timeLeft <= 0) finishQuiz();
        timeLeft--;
    }, 1000);
}

function renderQ() {
    let qData = questions[cur];
    document.getElementById('p-bar').style.width = ((cur + 1) / questions.length * 100) + "%";
    document.getElementById('q-text').innerText = qData.question;
    
    const box = document.getElementById('options-box');
    box.innerHTML = qData.options.map((opt, i) =>
        `<button class="opt-btn ${userAnswers[cur] === i ? 'active' : ''}" onclick="selectOpt(${i}, this)">${opt}</button>`
    ).join('');

    document.getElementById('nxt').disabled = (userAnswers[cur] === null);
    document.getElementById('prev-btn').style.visibility = (cur === 0) ? 'hidden' : 'visible';
}

function selectOpt(i, btn) {
    userAnswers[cur] = i;
    document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('nxt').disabled = false;
}

function nextQ() {
    if (cur < questions.length - 1) { cur++; renderQ(); } 
    else { finishQuiz(); }
}

function prevQ() {
    if (cur > 0) { cur--; renderQ(); }
}

function skipQ() { nextQ(); }

function finishQuiz() {
    clearInterval(timerInterval);
    score = 0;
    userAnswers.forEach((ans, i) => { if(ans === questions[i].correctIndex) score++; });

    toggleView('result-view');
    document.getElementById('res-score').innerText = `${score} / ${questions.length}`;
    
    let percent = (score / questions.length) * 100;
    document.getElementById('res-msg').innerText = percent >= 50 ? "Passed! 🎓" : "Failed! 📚";
}

function downloadPDF() {
    const name = document.getElementById('student-name').value;
    const level = document.getElementById('student-level').value;
    const percent = (score / questions.length) * 100;
    
    let grade = "Fail";
    if (percent >= 85) grade = "Excellent";
    else if (percent >= 75) grade = "Very Good";
    else if (percent >= 65) grade = "Good";
    else if (percent >= 50) grade = "Pass";

    document.getElementById('cert-name').innerText = name;
    document.getElementById('cert-level-display').innerText = level;
    document.getElementById('cert-grade').innerText = grade;
    document.getElementById('cert-date').innerText = new Date().toLocaleDateString('en-GB');

    const element = document.getElementById('pdf-content');
    html2pdf().set({
        filename: name + '_Anatomy_Certificate.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    }).from(element).save();
}
