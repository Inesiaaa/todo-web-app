import { useEffect, useState } from "react"
import './TodoApp.css'

interface Todo {
    id: number
    title: string
    note: string
    completed: boolean
    dateCreated?: Date
}

const STORAGE_KEY = 'todoApp.todos'
const THEME_STORAGE_KEY = 'todoApp.theme'

const loadTodosFromStorage = (): Todo[] => {
    try {
        const storedTodo = localStorage.getItem(STORAGE_KEY)
        if (storedTodo) {
            const todos = JSON.parse(storedTodo)
            return todos.map((todo: any) => ({
                ...todo,
                dateCreated: todo.dateCreated ? new Date(todo.dateCreated) : undefined
            }))
        }
        return []
    } catch (error) {
        console.error('Failed to load todos from storage:', error)
        return []
    }
}

const saveTodosToStorage = (todosToSave: Todo[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todosToSave))
    } catch (error) {
        console.error('Failed to save todos to storage:', error)
    }
}

function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>(loadTodosFromStorage())
    const [inputTitle, setInputTitle] = useState('')
    const [inputNote, setInputNote] = useState('')
    const [showInputs, setShowInputs] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        return savedTheme === 'dark'
    })

    const sortedTodos = [...todos].sort((a, b) => {
        const dateA = a.dateCreated ? new Date(a.dateCreated).getTime() : 0
        const dateB = b.dateCreated ? new Date(b.dateCreated).getTime() : 0
        return dateB - dateA
    })

    useEffect(() => {
        saveTodosToStorage(todos)
    }, [todos])

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, isDarkTheme ? 'dark' : 'light')
        document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme'
    }, [isDarkTheme])

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme)
    }

    const toggleInputFields = () => {
        setShowInputs(!showInputs)
    }

    const addTodo = () => {
        if (inputTitle.trim() !== '' && inputNote.trim() !== '') {
            const newTodo: Todo = {
                id: Date.now(),
                title: inputTitle,
                note: inputNote,
                completed: false,
                dateCreated: new Date()
            }
            setTodos([...todos, newTodo])
            setInputTitle('')
            setInputNote('')
            setShowInputs(false)
        }
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        ))
    }

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    return <>
        <div className="header-container">
            Taskify.
            <span>
                <label className="theme-toggle">
                    <input
                        type="checkbox"
                        checked={isDarkTheme}
                        onChange={toggleTheme}
                    />
                    <span className="slider"></span>
                </label>
            </span>
        </div>
        <div className="content-container">
            <div className="input-container">
                <i 
                    onClick={toggleInputFields} 
                    className={`fa-solid ${showInputs ? 'fa-minus' : 'fa-plus'} plus-icon`}
                ></i>
                <div className={`input-content ${showInputs ? 'show' : ''}`}>
                    <input
                        className="input-field input-title"
                        type="text"
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                        placeholder="Item Title"/>
                    <textarea
                        className="input-field input-note"
                        value={inputNote}
                        onChange={(e) => setInputNote(e.target.value)}
                        placeholder="Item Note"
                        rows={5}
                        />
                    <button className="add-button" onClick={addTodo}>Add Task</button> 
                </div>
            </div>

            <div className="todo-grid">
                {sortedTodos.map(todo => (
                    <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                        <div className="todo-card-content">
                            <label className="todo-date">
                                {todo.dateCreated?.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit'
                                })} {todo.dateCreated?.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </label>
                            <h3 className="todo-title" onClick={() => toggleTodo(todo.id)}>
                                {todo.title}
                            </h3>
                            <p className="todo-note" onClick={() => toggleTodo(todo.id)}>
                                {todo.note}
                            </p>
                        </div>
                        <div className="todo-footer">
                            <div className="todo-status">
                                <span className={`status-badge ${todo.completed ? 'done' : 'pending'}`}>
                                    {todo.completed ? 'Done' : 'Pending'}
                                </span>
                            </div>

                            <div className="todo-actions">
                                <button 
                                    className="toggle-btn"
                                    onClick={() => toggleTodo(todo.id)}
                                    title={todo.completed ? 'Mark as Pending' : 'Mark as Done'}
                                >
                                    <i className={`fa-solid ${todo.completed ? 'fa-undo' : 'fa-check'}`}></i>
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => deleteTodo(todo.id)}
                                    title="Delete Todo"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
}

export default TodoApp