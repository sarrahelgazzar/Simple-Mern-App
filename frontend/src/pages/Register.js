import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading ]=useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    //prevents the page from refreshing 
    e.preventDefault();

    if(!name||!email|| !password){
      alert("Please fill in all fields");
      return;
    }
    setLoading(true); // Show loading state

    const req = await fetch("http://localhost:1337/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await req.json();

    if (data.status == "ok") {
      navigate("/login");
    } else {
      alert("Duplicate Email");
    }
    setLoading(false); // Hide loading state
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Register</h1>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
         style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
         style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};
// Styling
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
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

export default Register;
