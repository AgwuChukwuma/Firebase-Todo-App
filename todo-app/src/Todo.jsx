import React, { useState } from 'react';
import { FaRegTrashAlt, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { db } from './firebase';
import { updateDoc, doc } from 'firebase/firestore';

const Todo = ({ todo, updateStatus, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleSave = async () => {
    if (editedText.trim() !== "" && editedText !== todo.text) {
      const todoRef = doc(db, 'todos', todo.id);
      await updateDoc(todoRef, { text: editedText });
    }

    setIsEditing(false);
    
  };

  return (
    <li className="todo-item">
      <div className="todo-row">
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSave}
            autoFocus
          />
        ) : (
          <p className="todo-text">{todo.text}</p>
        )}
      </div>
      <div className="todo-actions">
        <button onClick={() => deleteTodo(todo.id)}>
          <FaRegTrashAlt />
        </button>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <FaCheckCircle /> : <FaEdit />}
        </button>
        <div className="status-buttons">
          {todo.status !== "completed" && (
            <button className="status-progress" onClick={() => updateStatus(todo.id, "inProgress")}>
              In Progress
            </button>
          )}
          {todo.status !== "completed" && (
            <button className="status-completed" onClick={() => updateStatus(todo.id, "completed")}>
              Complete
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default Todo;
