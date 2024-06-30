document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        addNoteToDOM(note);
    });
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNewNote() {
    const noteTitle = prompt("Enter the note title:");
    const noteContent = prompt("Enter the note content:");
    const date = new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    if (noteTitle && noteContent) {
        const note = {
            id: Date.now(),
            title: noteTitle,
            content: noteContent,
            date: date
        };

        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(note);
        saveNotes(notes);

        addNoteToDOM(note);
    } else {
        alert("Both title and content are required to create a new note.");
    }
}

function addNoteToDOM(note) {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.dataset.id = note.id;
    noteElement.innerHTML = `
        <h2>${note.title}</h2>
        <p>${note.content}</p>
        <p class="date">${note.date}</p>
        <div class="note-buttons">
            <button onclick="editNote(this)">Edit</button>
            <button onclick="deleteNote(this)">Delete</button>
        </div>
    `;
    document.querySelector('.main-content').appendChild(noteElement);
}

function editNote(button) {
    const noteElement = button.closest('.note');
    const id = noteElement.dataset.id;
    const newTitle = prompt("Edit the note title:", noteElement.querySelector('h2').textContent);
    const newContent = prompt("Edit the note content:", noteElement.querySelector('p').textContent);

    if (newTitle && newContent) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const note = notes.find(note => note.id == id);
        note.title = newTitle;
        note.content = newContent;
        saveNotes(notes);

        noteElement.querySelector('h2').textContent = note.title;
        noteElement.querySelector('p').textContent = note.content;
    } else {
        alert("Both title and content are required to edit the note.");
    }
}

function deleteNote(button) {
    const noteElement = button.closest('.note');
    const id = noteElement.dataset.id;

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedNotes = notes.filter(note => note.id != id);
    saveNotes(updatedNotes);

    noteElement.remove();
}