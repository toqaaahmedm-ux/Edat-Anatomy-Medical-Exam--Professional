

function renderTable() {
    let questions = JSON.parse(localStorage.getItem('medical_db')) || [];
    const body = document.getElementById('manage-list-body');
    const countBox = document.getElementById('total-count');

    if (countBox) countBox.innerText = questions.length;
    if (!body) return;

    body.innerHTML = "";

    if (questions.length === 0) {
        body.innerHTML = '<tr><td colspan="3" class="text-center py-5 text-muted">No questions found. Click "Add New" to start!</td></tr>';
        return;
    }

    questions.forEach(q => {
        const correctText = q.options[q.correctIndex] || 'N/A';
        body.innerHTML += `
                    <tr>
                        <td class="fw-bold text-secondary">${q.question}</td>
                        <td><span class="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">${correctText}</span></td>
                        <td class="text-center">
                            <i class="material-icons text-warning me-3" style="cursor:pointer" onclick="location.href='admin.html?edit=${q.id}'">edit</i>
                            <i class="material-icons text-danger" style="cursor:pointer" onclick="deleteQ(${q.id})">delete</i>
                        </td>
                    </tr>`;
    });
}

window.deleteQ = (id) => {
    if (confirm("Delete this question?")) {
        let questions = JSON.parse(localStorage.getItem('medical_db')) || [];
        questions = questions.filter(q => q.id != id);
        localStorage.setItem('medical_db', JSON.stringify(questions));
        renderTable();
    }
};


document.addEventListener('DOMContentLoaded', renderTable);