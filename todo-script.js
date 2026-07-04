// To-Do List Application with Local Storage
class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add task
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Clear buttons
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            input.focus();
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleDateString()
        };

        this.todos.push(todo);
        this.saveToLocalStorage();
        input.value = '';
        input.focus();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    editTodo(id) {
        this.editingId = id;
        this.render();
    }

    saveTodo(id, newText) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo && newText.trim() !== '') {
            todo.text = newText.trim();
            this.saveToLocalStorage();
        }
        this.editingId = null;
        this.render();
    }

    cancelEdit() {
        this.editingId = null;
        this.render();
    }

    changePriority(id, priority) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.priority = priority;
            this.saveToLocalStorage();
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) return;

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveToLocalStorage();
            this.render();
        }
    }

    clearAll() {
        if (this.todos.length === 0) return;

        if (confirm('Delete all tasks? This cannot be undone.')) {
            this.todos = [];
            this.saveToLocalStorage();
            this.render();
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    getStats() {
        return {
            total: this.todos.length,
            active: this.todos.filter(todo => !todo.completed).length,
            completed: this.todos.filter(todo => todo.completed).length
        };
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem('todos');
        this.todos = stored ? JSON.parse(stored) : [];
    }

    render() {
        this.updateStats();
        this.renderTodoList();
        this.updateButtonStates();
    }

    updateStats() {
        const stats = this.getStats();
        document.getElementById('totalCount').textContent = stats.total;
        document.getElementById('activeCount').textContent = stats.active;
        document.getElementById('completedCount').textContent = stats.completed;
    }

    renderTodoList() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;

            if (this.editingId === todo.id) {
                li.innerHTML = `
                    <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} disabled>
                    <input type="text" class="todo-text" value="${this.escapeHtml(todo.text)}" id="editInput">
                    <button class="save-btn" onclick="app.saveTodo(${todo.id}, document.getElementById('editInput').value)">Save</button>
                    <button class="cancel-btn" onclick="app.cancelEdit()">Cancel</button>
                `;
                setTimeout(() => document.getElementById('editInput').focus(), 0);
            } else {
                li.innerHTML = `
                    <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                    <span class="todo-date">${todo.createdAt}</span>
                    <div class="todo-actions">
                        <button class="edit-btn" title="Edit">✏️</button>
                        <button class="delete-btn" title="Delete">🗑️</button>
                    </div>
                `;

                const checkbox = li.querySelector('.checkbox');
                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

                const editBtn = li.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => this.editTodo(todo.id));

                const deleteBtn = li.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            }

            todoList.appendChild(li);
        });
    }

    updateButtonStates() {
        const completedCount = this.todos.filter(t => t.completed).length;
        document.getElementById('clearCompletedBtn').disabled = completedCount === 0;
        document.getElementById('clearAllBtn').disabled = this.todos.length === 0;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});