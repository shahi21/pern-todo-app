import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch Todos from the backend
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTodos = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/todos", {
          headers: { "x-auth-token": token },
        });
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, [token,navigate]);

  // Add a new todo
  const addTodo = async () => {
    if (!newTask.trim()) return;
    try {
      const { data } = await axios.post(
        "http://localhost:5000/todos",
        { task: newTask },
        { headers: { "x-auth-token": token } }
      );
      setTodos([...todos, data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Enable editing mode
  const startEdit = (todo) => {
    setEditTask(todo.id);
    setEditText(todo.task);
  };

  // Update a todo
  const updateTodo = async (id) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/todos/${id}`,
        { task: editText },
        { headers: { "x-auth-token": token } }
      );
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
      setEditTask(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Logout Function
  const handleLogout=()=>{
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center">
      <h2>Todo List</h2>
       {/* logout button */}
      <button className="btn btn-danger ms-4" onClick={handleLogout} style={{float:"right"}}>Logout</button>
      </div>
      {/* Add Todo Input */}
      <div className="input-group my-3">
      <input type="text" className="form-control" placeholder="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)}/>
      <button className="btn btn-success ms-3" onClick={addTodo}>Add</button>
      </div>
      {/* Todo List */}
      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center m-3">
            {editTask === todo.id ? (
              <>
                <input type="text" className="form-control" value={editText} onChange={(e) => setEditText(e.target.value)}/>
                <div>
                <button className="btn btn-success mb-2" onClick={() => updateTodo(todo.id)}>Save</button>
                <button className="btn btn-danger" onClick={() => setEditTask(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                {todo.task}
                <div>
                <button className="btn btn-warning me-2" onClick={() => startEdit(todo)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
