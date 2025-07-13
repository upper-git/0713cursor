// Todo 리스트를 저장할 배열
let todos = [];

// DOM 요소 가져오기
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// 로컬스토리지에서 todos 불러오기
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
    }
}

// todos를 로컬스토리지에 저장
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 할 일 렌더링
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';

        const left = document.createElement('div');
        left.className = 'd-flex align-items-center flex-grow-1';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input me-2';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => {
            todos[idx].completed = !todos[idx].completed;
            saveTodos();
            renderTodos();
        });

        const span = document.createElement('span');
        span.className = 'todo-text' + (todo.completed ? ' todo-completed' : '');
        span.textContent = todo.text;

        left.appendChild(checkbox);
        left.appendChild(span);

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '🗑';
        delBtn.setAttribute('aria-label', '삭제');
        delBtn.addEventListener('click', () => {
            Swal.fire({
                title: '정말 삭제할까요?',
                text: '이 할 일은 복구할 수 없습니다.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '삭제',
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    todos.splice(idx, 1);
                    saveTodos();
                    renderTodos();
                    Swal.fire('삭제됨!', '할 일이 삭제되었습니다.', 'success');
                }
            });
        });

        li.appendChild(left);
        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
}

// 할 일 추가
addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        renderTodos();
        todoInput.value = '';
        todoInput.focus();
        Swal.fire({
            icon: 'success',
            title: '추가 완료!',
            text: '할 일이 추가되었습니다.',
            timer: 1000,
            showConfirmButton: false
        });
    } else {
        Swal.fire({
            icon: 'info',
            title: '할 일을 입력하세요!',
            timer: 1000,
            showConfirmButton: false
        });
    }
});

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// 초기화
loadTodos();
renderTodos();
