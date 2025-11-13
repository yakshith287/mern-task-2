import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first!");
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          alert(data.err || "Session expired, please login again.");
          handleLogout();
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [navigate]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "150px" }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "150px" }}>
      <h1>This is Home Page</h1>
      {user ? (
        <>
          <p>Welcome, <b>{user.name || user.email}</b>!</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
