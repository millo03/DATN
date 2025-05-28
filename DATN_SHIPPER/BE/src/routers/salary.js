// routes/salaryRoutes.js
import express from "express";
import { calculateSalary } from "../controllers/Shipper/salary";

const Route_Salary = express.Router();

// Route tính lương cho shipper
Route_Salary.post("/salary/calculate", async (req, res) => {
  const { shipperId, month } = req.body;

  try {
    const salary = await calculateSalary(shipperId, month);
    res.status(200).json({ success: true, salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default Route_Salary;
