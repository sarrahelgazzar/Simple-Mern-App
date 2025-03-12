import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

const Dashboard = () => {
  const [tempGoal, setTempGoal] = useState("");
  const [goal, setGoal] = useState("");

  const populateDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const req = await fetch("http://localhost:1337/api/dashboard", {
        headers: { "x-access-token": token },
      });

      const data = await req.json();

      if (data.status === "ok") {
        setGoal(data.goal);
      } else {
        alert("Invalid Token");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Fetch goals from the database
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && decodeToken(token)) {
      populateDashboard();
    } else {
      alert("Invalid or expired token. Please log in again.");
    }
  }, []);

  const addGoal = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!tempGoal) {
      alert("Please enter a goal before submitting.");
      return;
    }

    try {
      const req = await fetch("http://localhost:1337/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-token": token },
        body: JSON.stringify({ tempGoal }),
      });

      const data = await req.json();

      if (data.status === "ok") {
        setGoal(tempGoal);
        setTempGoal("");
      } else {
        alert("Invalid Token");
      }
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      <h2 style={styles.goal}>{goal || "No goal found"}</h2>
      <form onSubmit={addGoal} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Add a Goal"
          value={tempGoal}
          onChange={(e) => setTempGoal(e.target.value)}
          type="text"
        />
        <button style={styles.button} type="submit">
          Add Goal
        </button>
      </form>
    </div>
  );
};

// Styling
const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: "26px",
    marginBottom: "15px",
  },
  goal: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default Dashboard;
