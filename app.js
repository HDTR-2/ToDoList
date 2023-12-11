const newNote = document.querySelector('.new-note');
const newNotePopup = document.querySelector('.new-note__container');
const addNewNoteButton = document.querySelector('.todo__add');
const cancle = document.querySelector('.cancle');
const empty = document.querySelector('.todo__empty');
//Оформление========================================================================================================================================================
const todo = document.querySelector('.todo');
const ligthMode = document.querySelector('.mode');
//Создание задачи========================================================================================================================================================
const input = document.querySelector('#input-form');
const notesList = document.querySelector('.todo__notes');
//========================================================================================================================================================
const title = document.querySelector('#title');
const searchList = document.querySelector('.search__list');

let notes = [];

if (localStorage.getItem('notes')) {
  notes = JSON.parse(localStorage.getItem('notes'));
}

notes.forEach(function (note) {
  renderNote(note);
});

checkEmpty();
//========================================================================================================================================================

addNewNoteButton.addEventListener('click', () => {
  newNote.classList.add('open');
});
cancle.addEventListener('click', () => {
  newNote.classList.remove('open');
});

//========================================================================================================================================================

ligthMode.addEventListener('click', () => {
  if (todo.classList.contains('dark-mode')) {
    todo.classList.remove('dark-mode');
    newNotePopup.classList.remove('dark-mode');
    ligthMode.textContent = 'dark_mode';
  } else {
    todo.classList.add('dark-mode');
    newNotePopup.classList.add('dark-mode');
    ligthMode.textContent = 'light_mode';
  }
});
//========================================================================================================================================================

newNotePopup.addEventListener('submit', addNote);

notesList.addEventListener('click', deleteNote);

notesList.addEventListener('click', editNote);

notesList.addEventListener('click', doneNote);

function addNote(event) {
  event.preventDefault();
  const noteText = input.value;

  const newTask = {
    id: Date.now(),
    text: noteText,
    done: false,
    check: false,
  };

  notes.push(newTask);

  if (input.value != '') {
    renderNote(newTask);
    newNote.classList.remove('open');
    input.value = '';
    checkEmpty();
    saveToLocalStorage();
  }
}
function deleteNote(event) {
  if (event.target.dataset.action !== 'delete') return;
  else {
    const parentNode = event.target.closest('.todo__note');

    const id = Number(parentNode.id);

    //удаление задачи через фильтрацию массива
    notes = notes.filter((note) => note.id !== id);

    parentNode.remove();
  }
  checkEmpty();
  saveToLocalStorage();
}
function editNote(event) {
  if (event.target.dataset.action !== 'edit') return;
  else {
    const parentNode = event.target.closest('.todo__note');
    const id = Number(parentNode.id);
    const note = notes.find((note) => note.id === id);
    const textT = (notes.text = prompt('Переименование задачи'));
    note.text = textT;
    location.reload();
    if (notesList.children.length === 0) {
      empty.style.display = '';
    }
  }
  saveToLocalStorage();
}
function doneNote(event) {
  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.todo__note');
  const id = Number(parentNode.id);
  const note = notes.find((note) => note.id === id);
  note.done = !note.done;
  note.check = !note.check;

  const title = parentNode.querySelector('h2');
  const doneSpan = parentNode.querySelector('span');
  if (title.classList.contains('done')) {
    doneSpan.textContent = 'check_box_outline_blank';
    title.classList.remove('done');
    title.classList.add('incompleat');
  } else {
    doneSpan.textContent = 'check_box';
    title.classList.add('done');
    title.classList.remove('incompleat');
  }
  saveToLocalStorage();
}

title.addEventListener('click', () => {
  const expand = document.querySelector('#expand');
  if (searchList.style.visibility != 'visible') {
    searchList.style.visibility = 'visible';
    expand.textContent = 'expand_less';
  } else {
    searchList.style.visibility = 'hidden';
    expand.textContent = 'expand_more';
  }
});

searchList.addEventListener('click', selectFilter);

function selectFilter(event) {
  const note = document.querySelectorAll('.todo__note');
  if (event.target.tagName !== 'LI') return false;
  let filterClass = event.target.dataset['f'];
  note.forEach((elem) => {
    if (!elem.classList.contains(filterClass)) {
      elem.classList.add('hide');
    } else {
      elem.classList.remove('hide');
    }
  });
  if (filterClass == 'all') {
    title.textContent = 'ВСЕ';
    searchList.style.visibility = 'hidden';
  } else if (filterClass == 'com') {
    title.textContent = 'Выполнено';
    searchList.style.visibility = 'hidden';
  } else {
    title.textContent = 'Не выполнено';
    searchList.style.visibility = 'hidden';
  }
}

function checkEmpty() {
  if (notes.length === 0) {
    const emptyListHTML = `
    <div class="todo__empty">
    <img src="img/empty.png" alt="" />
    <h2>Пусто...</h2>
  </div>
    `;
    notesList.insertAdjacentHTML('afterbegin', emptyListHTML);
  } else {
    const emptyListEl = document.querySelector('.todo__empty');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNote(note) {
  const cssClass = note.done ? 'title__h done' : 'title__h';
  const checkContent = note.check ? 'check_box ' : 'check_box_outline_blank';
  const filterClasses = note.done ? 'todo__note all com' : 'todo__note all incom';
  const noteHTML = `
    <div id="${note.id}" class="${filterClasses}">
                <div class="todo__title">
                  <span data-action="done" class="material-symbols-outlined"> ${checkContent}</span>
                  <h2 class="${cssClass}">${note.text}</h2>
                </div>
                <div class="todo__actions">
                  <span data-action="edit" class="material-symbols-outlined"> edit </span>
                  <span data-action="delete" class="material-symbols-outlined"> delete </span>
                </div>
              </div>`;

  notesList.insertAdjacentHTML('beforeend', noteHTML);
}
