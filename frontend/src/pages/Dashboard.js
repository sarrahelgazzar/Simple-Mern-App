import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [updatedGoal, setUpdatedGoal] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("Personal");
  const [updatedPriority, setUpdatedPriority] = useState("Medium");
  const [updatedDeadline, setUpdatedDeadline] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && decodeToken(token)) {
      fetchGoals();
    } else {
      alert("Invalid or expired token. Please log in again.");
    }
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/`, {
        headers: { "x-access-token": token },
      });
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const addGoal = async (e) => {
    e.preventDefault();
    if (!newGoal || !deadline) {
      return alert("Please fill in all fields");
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/addGoal`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-token": token },
        body: JSON.stringify({ text: newGoal, category, priority, deadline }),
      });
      if (response.ok) {
        setNewGoal("");
        setCategory("Personal");
        setPriority("Medium");
        setDeadline("");
        fetchGoals();
      }
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delete/${goalId}`, {
        method: "DELETE",
        headers: { "x-access-token": token },
      });
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const toggleFavorite = async (goalId) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/${goalId}`, {
        method: "PUT",
        headers: { "x-access-token": token },
      });
      fetchGoals();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const startEditing = (goal) => {
    setEditingGoal(goal._id);
    setUpdatedGoal(goal.text);
  };

  const updateGoal = async (goalId) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/update/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-access-token": token },
        body: JSON.stringify({ text: updatedGoal }),
      });
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Goals </h1>
      <form onSubmit={addGoal} style={styles.form}>
        <input style={styles.input} placeholder="Goal" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} />
        <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
          {["Health", "Career", "Education", "Finance", "Personal"].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select style={styles.input} value={priority} onChange={(e) => setPriority(e.target.value)}>
          {["Low", "Medium", "High"].map(prio => (
            <option key={prio} value={prio}>{prio}</option>
          ))}
        </select>
        <input style={styles.input} placeholder="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <button style={styles.button} type="submit">Add Goal</button>
      </form>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Text</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal._id}>
              <td>{editingGoal === goal._id ? <input value={updatedGoal} onChange={(e) => setUpdatedGoal(e.target.value)} /> : goal.text}</td>
              <td>{editingGoal === goal._id ? <select value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)}>{["Health", "Career", "Education", "Finance", "Personal"].map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select> : goal.category}</td>
              <td>{editingGoal === goal._id ? <select value={updatedPriority} onChange={(e) => setUpdatedPriority(e.target.value)}>{["Low", "Medium", "High"].map(prio => (<option key={prio} value={prio}>{prio}</option>))}</select> : goal.priority}</td>
              <td>{editingGoal === goal._id ? <input type="date" value={updatedDeadline} onChange={(e) => setUpdatedDeadline(e.target.value)} /> : goal.deadline}</td>
              <td>
                {editingGoal === goal._id ? (
                  <button style={styles.actionButton} onClick={() => updateGoal(goal._id)}>Save</button>
                ) : (
                  <button style={styles.actionButton} onClick={() => { setEditingGoal(goal._id); setUpdatedGoal(goal.text); setUpdatedCategory(goal.category); setUpdatedPriority(goal.priority); setUpdatedDeadline(goal.deadline); }}>Edit</button>
                )}
                <button style={styles.actionButton} onClick={() => deleteGoal(goal._id)}>Delete</button>
                <button style={styles.actionButton} onClick={() => toggleFavorite(goal._id)}>{goal.isFavorite ? "Completed" : "Uncompleted"}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "50px auto", padding: "20px", textAlign: "center", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", backgroundColor: "#f8f9fa" },
  title: { fontSize: "26px", marginBottom: "15px" },
  form: { display: "flex", flexDirection: "column", marginBottom: "20px" },
  input: { padding: "10px", margin: "5px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "16px" },
  button: { padding: "10px", margin: "5px", borderRadius: "5px", border: "none", backgroundColor: "#007bff", color: "white", fontSize: "16px", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  actionButton: { padding: "5px 10px", margin: "2px", borderRadius: "5px", border: "none", cursor: "pointer", backgroundColor: "#28a745", color: "white" }
};

export default Dashboard;