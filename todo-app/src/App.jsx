import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [showInput, setShowInput] = useState({ todo: false, inProgress: false, completed: false });
  const [newTask, setNewTask] = useState({ todo: "", inProgress: "", completed: "" });
  const [showActions, setShowActions] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");


  const inputRefs = {
    todo: useRef(null),
    inProgress: useRef(null),
    completed: useRef(null),
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options); // 'en-GB' gives the format "24 Jan 2025"
  };

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach(async (doc) => {
        const todo = doc.data();
        if (!todo.date) {
          await updateDoc(doc.ref, { date: formatDate(new Date()) });
        }
        todosArr.push({ ...todo, id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const hanleClickOutside = (e) => {
      for (const status in inputRefs) {
        if (inputRefs[status].current && !inputRefs[status].current.contains(e.target)) {
          setShowInput((prev) => ({ ...prev, [status]: false}));
        }
      }
    };
    document.addEventListener("mousedown", hanleClickOutside);
    return () => document.removeEventListener("mousedown", hanleClickOutside);
  },[]);

  const addTask = async (column) => {
    if (newTask[column].trim() === "") return alert("Enter a valid task");

    const currentDate = formatDate(new Date());

    await addDoc(collection(db, "todos"), {
      text: newTask[column],
      status: column,
      date: currentDate,
    });

    setNewTask({ ...newTask, [column]: "" });
    setShowInput({ ...showInput, [column]: false });
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "todos", id));
    }
  };

  const updateTask = async (id, newText) => {
    if (newText.trim() === "") return;

    const updatedDate = formatDate(new Date());

    await updateDoc(doc(db, "todos", id), {
      text: newText,
      date: updatedDate,
    });

    setEditId(null);
  };

  const changeTaskStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "todos", id), { status: newStatus });
  };

  const groupedTodos = {
    todo: todos.filter((t) => t.status === "todo"),
    inProgress: todos.filter((t) => t.status === "inProgress"),
    completed: todos.filter((t) => t.status === "completed"),
  };

  return (
    <div className="app-wrapper">
      <h3 className="todo-heading">Todo App</h3>
      <div className="app-container">
        <div className="kanban-board">
          {["todo", "inProgress", "completed"].map((status) => (
            <div
              key={status}
              className="kanban-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData("text/plain");
                changeTaskStatus(id, status);
              }}
            >
              <h3>
                {status === "todo" ? "To Do" : status === "inProgress" ? "In Progress" : "Completed"}
                <span className="task-count">{groupedTodos[status].length}</span>
              </h3>

              {groupedTodos[status].map((task) => (
                <div
                  key={task.id}
                  className="todo-item"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
                  onClick={() => setShowActions(task.id === showActions ? null : task.id)}
                >
                  {editId === task.id ? (
                    <input
                      className="edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => updateTask(task.id, editText)}
                      autoFocus
                    />
                  ) : (
                    <div>
                      <p className="todo-text">{task.text}</p>
                      <span className="task-date"> Due {task.date}</span>
                    </div>
                  )}

                  {showActions === task.id && (
                    <div className="todo-actions">
                      <button onClick={() => setEditId(task.id) || setEditText(task.text)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteTask(task.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {showInput[status] ? (
                <div className="todo-form" ref={inputRefs[status]}>
                  <input
                    value={newTask[status]}
                    onChange={(e) => setNewTask({ ...newTask, [status]: e.target.value })}
                    className="todo-input"
                    type="text"
                    placeholder="Add Task"
                  />
                  <button className="todo-button" onClick={() => addTask(status)}>
                    <AiOutlineCheck size={20} />
                  </button>
                </div>
              ) : (
                <button className="add-task-btn" onClick={() => setShowInput({ ...showInput, [status]: true })}>
                 <AiOutlinePlus size = {20} /> Add task
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
