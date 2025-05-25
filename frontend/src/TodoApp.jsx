import React, { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";
import "./styles.css";

const TodoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editText, setEditText] = useState("");
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const fetchTasks = async () => {
        try {
            const response = await getTasks();
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleAddTask = async () => {
        if (newTask.trim() === "") return;
        await addTask({ title: newTask, completed: false });
        setNewTask("");
        fetchTasks();
    };

    const handleToggleComplete = async (id, completed, title) => {
        try {
            await updateTask(id, { title, completed: !completed });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setEditText(task.title);
    };

    const handleSaveEdit = async (id) => {
        if (editText.trim() === "") return;
        try {
            await updateTask(id, { title: editText, completed: tasks.find(task => task.id === id).completed });
            setEditingTaskId(null);
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className={`todo-container ${darkMode ? "dark-mode" : "light-mode"}`}>   
            <h1>TODO LIST</h1>
            <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "☀️" : "🌙"}
            </button>

            <input
                type="text"
                className="task-input"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new task"
            />
            <button className="add-task" onClick={handleAddTask}>+</button>

            <ul>
                {tasks.map(task => (
                    <li key={task.id} className={task.completed ? "completed" : ""}>
                        {editingTaskId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button className="save-task" onClick={() => handleSaveEdit(task.id)}>Save</button>
                                <button className="cancel-edit" onClick={() => setEditingTaskId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{task.title}</span>
                                <button className="complete-task" onClick={() => handleToggleComplete(task.id, task.completed, task.title)}>
                                    {task.completed ? "Undo" : "Complete"}
                                </button>
                                <button className="edit-task" onClick={() => handleEditClick(task)}>Edit</button>
                                <button className="delete-task" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;