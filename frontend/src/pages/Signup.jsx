import { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    usertype: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/signup", formData, {
        withCredentials: true,
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        {["username", "fullname", "email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            className="mb-3 p-2 border w-full rounded"
            required
          />
        ))}
        <select
          name="usertype"
          value={formData.usertype}
          onChange={handleChange}
          className="mb-3 p-2 border w-full rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
