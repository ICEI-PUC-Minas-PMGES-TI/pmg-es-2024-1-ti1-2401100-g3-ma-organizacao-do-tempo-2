document.addEventListener('DOMContentLoaded', function() {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteList = document.getElementById('note-list');

    // Carregar as notas do LocalStorage quando a página carregar
    loadNotes();

    // Adicionar evento de clique ao botão "Adicionar"
    addNoteBtn.addEventListener('click', function() {
        addNote();
    });

    // Função para carregar as notas do LocalStorage
    function loadNotes() {
        noteList.innerHTML = '';
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(function(note) {
            addNoteToList(note);
        });
    }

    // Função para adicionar uma nova nota
    function addNote() {
        const noteText = noteInput.value.trim();
        if (noteText !== '') {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            const newNote = {
                id: Date.now(),
                content: noteText
            };
            notes.push(newNote);
            localStorage.setItem('notes', JSON.stringify(notes));
            addNoteToList(newNote);
            noteInput.value = '';
        }
    }

    // Função para adicionar uma nota à lista
    function addNoteToList(note) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="note-content">${note.content}</span>
            <button class="delete-btn" onclick="deleteNote(${note.id})">Excluir</button>
        `;
        noteList.appendChild(li);
    }

    // Função para excluir uma nota
    function deleteNote(id) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(function(note) {
            return note.id !== id;
        });
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
});
