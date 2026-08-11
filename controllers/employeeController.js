const Employee = require("../models/Employee");

// =======================================
// Get Employees (Search + Filter + Pagination)
// =======================================

exports.getEmployees = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "";
    const department = req.query.department || "";

    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = department;
    }

    const total = await Employee.countDocuments(filter);

    const employees = await Employee.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      employees,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =======================================
// Get Single Employee
// =======================================

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =======================================
// Create Employee
// =======================================

exports.createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      cnic,
      department,
      designation,
      joiningDate,
      address,
      status,
    } = req.body;

    if (
      !fullName ||
      !department ||
      !designation ||
      !joiningDate
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const lastEmployee = await Employee.findOne().sort({
      createdAt: -1,
    });

    let employeeId = "EMP-0001";

    if (lastEmployee) {
      const lastNumber = parseInt(
        lastEmployee.employeeId.split("-")[1]
      );

      employeeId =
        "EMP-" +
        String(lastNumber + 1).padStart(4, "0");
    }

    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      phone,
      cnic,
      department,
      designation,
      joiningDate,
      address,
      status,
      profileImage: req.file ? req.file.path : "",
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      employee,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =======================================
// Update Employee
// =======================================

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.fullName =
      req.body.fullName || employee.fullName;

    employee.email =
      req.body.email || employee.email;

    employee.phone =
      req.body.phone || employee.phone;

    employee.cnic =
      req.body.cnic || employee.cnic;

    employee.department =
      req.body.department || employee.department;

    employee.designation =
      req.body.designation || employee.designation;

    employee.joiningDate =
      req.body.joiningDate || employee.joiningDate;

    employee.address =
      req.body.address || employee.address;


    employee.status =
      req.body.status || employee.status;

    if (req.file) {
      employee.profileImage = req.file.path;
    }

    await employee.save();

    res.json({
      success: true,
      message: "Employee updated successfully.",
      employee,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =======================================
// Delete Employee
// =======================================

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    await employee.deleteOne();

    res.json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};