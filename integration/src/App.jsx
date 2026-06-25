import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeCard from "./components/EmployeeCard";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({});

  const getAllEmployee = async () => {
    let res = await axios.get("http://localhost:3000/api/employees");
    setEmployees(res.data.data);
    console.log("all employees", res);
  };
  useEffect(() => {
    getAllEmployee();
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res = await axios.post(
        "http://localhost:3000/api/employees/create",
        formData
      );
      console.log("res->", res);
    } catch (error) {
      console.log("error in api call", error);
    }
  };

  return (
    <div>
      <h1>Hello</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          width: "300px",
          flexDirection: "column",
        }}
        action=""
      >
        <input
          onChange={handleChange}
          name="employeeName"
          type="text"
          placeholder="Name"
        />
        <input
          onChange={handleChange}
          name="email"
          type="text"
          placeholder="email"
        />
        <input
          onChange={handleChange}
          name="mobile"
          type="text"
          placeholder="mobile"
        />
        <input
          onChange={handleChange}
          name="address"
          type="text"
          placeholder="address"
        />
        <input
          onChange={handleChange}
          name="company"
          type="text"
          placeholder="company"
        />
        <input
          onChange={handleChange}
          name="designation"
          type="text"
          placeholder="designation"
        />
        <input
          name="employeeId"
          onChange={handleChange}
          type="text"
          placeholder="Employee id"
        />
        <button>Submit</button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {employees.map((val) => {
          return <EmployeeCard employee={val} />;
        })}
      </div>
    </div>
  );
};

export default App;
