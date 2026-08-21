const Employee = require("../models/Employee");

// =======================================
// Get Employees
// Search + Filter + Pagination
// =======================================

exports.getEmployees = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "";
    const department = req.query.department || "";
    const office = req.query.office || "";
    const employeeType = req.query.employeeType || "";
    const section = req.query.section || "";

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { section: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (status) {
      filter.status = status;
    }

    if (department) {
      filter.department = department;
    }

    if (office) {
      filter.office = office;
    }

    if (employeeType) {
      filter.employeeType = employeeType;
    }

    if (section) {
      filter.section = section;
    }

    const total = await Employee.countDocuments(filter);

    const employees = await Employee.find(filter)
      .populate(
        "reportsTo",
        "_id fullName designation employeeType section office"
      )
      .sort({
        order: 1,
        createdAt: 1,
      })
      .skip(skip)
      .limit(limit);

    res.json({
      employees,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Get employees error:", err);

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
    const employee = await Employee.findById(req.params.id).populate(
      "reportsTo",
      "_id fullName designation employeeType section office"
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);
  } catch (err) {
    console.error("Get employee error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// =======================================
// Get Organization
// Used by Public Administration Page
// =======================================

exports.getOrganization = async (req, res) => {
  try {
    const employees = await Employee.find({
      status: "Active",
    })
      .populate(
        "reportsTo",
        "_id fullName designation employeeType section office"
      )
      .sort({
        order: 1,
        createdAt: 1,
      });

    // -------------------------------
    // Managing Director
    // -------------------------------

    const managingDirector = employees.find(
      (employee) => employee.isManagingDirector === true
    );

    // -------------------------------
    // Management
    // -------------------------------

    const management = employees.filter(
      (employee) =>
        employee.employeeType === "Management" &&
        !employee.isManagingDirector
    );

    // -------------------------------
    // Departments
    // -------------------------------

    const departmentEmployees = employees.filter(
      (employee) => employee.employeeType === "Department"
    );

    // Group departmental employees by section
    const departments = {};

    departmentEmployees.forEach((employee) => {
      const sectionName =
        employee.section ||
        employee.department ||
        "General";

      if (!departments[sectionName]) {
        departments[sectionName] = [];
      }

      departments[sectionName].push(employee);
    });

    // -------------------------------
    // Danin Chitral
    // -------------------------------

    const chitralEmployees = employees.filter(
      (employee) => employee.employeeType === "Danin Chitral"
    );

    const chitralSections = {};

    chitralEmployees.forEach((employee) => {
      const sectionName =
        employee.section || "General";

      if (!chitralSections[sectionName]) {
        chitralSections[sectionName] = [];
      }

      chitralSections[sectionName].push(employee);
    });

    // -------------------------------
    // Dara Adam Khel
    // -------------------------------

    const daraEmployees = employees.filter(
      (employee) => employee.employeeType === "Dara Adam Khel"
    );

    const daraSections = {};

    daraEmployees.forEach((employee) => {
      const sectionName =
        employee.section || "General";

      if (!daraSections[sectionName]) {
        daraSections[sectionName] = [];
      }

      daraSections[sectionName].push(employee);
    });

    // -------------------------------
    // Response
    // -------------------------------

    res.json({
      success: true,

      managingDirector: managingDirector || null,

      management,

      departments,

      locations: {
        daninChitral: chitralSections,
        daraAdamKhel: daraSections,
      },

      employees,
    });
  } catch (err) {
    console.error("Get organization error:", err);

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

      employeeType,
      section,

      department,
      designation,

      office,
      reportsTo,

      isManagingDirector,

      message,
      order,

      joiningDate,
      address,
      status,
    } = req.body;

    // -------------------------------
    // Required fields
    // -------------------------------

    if (
      !fullName ||
      !employeeType ||
      !designation ||
      !joiningDate
    ) {
      return res.status(400).json({
        message:
          "Please fill all required employee fields.",
      });
    }

    // -------------------------------
    // Prevent multiple Managing Directors
    // -------------------------------

    if (isManagingDirector === "true" || isManagingDirector === true) {
      const existingMD = await Employee.findOne({
        isManagingDirector: true,
        status: "Active",
      });

      if (existingMD) {
        return res.status(400).json({
          message:
            "A Managing Director already exists. Please edit the existing Managing Director instead.",
        });
      }
    }

    // -------------------------------
    // Generate Employee ID
    // -------------------------------

    const lastEmployee = await Employee.findOne().sort({
      createdAt: -1,
    });

    let employeeId = "EMP-0001";

    if (lastEmployee && lastEmployee.employeeId) {
      const parts = lastEmployee.employeeId.split("-");

      const lastNumber = parseInt(parts[1], 10);

      if (!isNaN(lastNumber)) {
        employeeId =
          "EMP-" +
          String(lastNumber + 1).padStart(4, "0");
      }
    }

    // -------------------------------
    // Convert values
    // -------------------------------

    const mdValue =
      isManagingDirector === "true" ||
      isManagingDirector === true;

    const orderValue =
      order !== undefined &&
      order !== null &&
      order !== ""
        ? Number(order)
        : 0;

    // -------------------------------
    // Create employee
    // -------------------------------

    const employee = await Employee.create({
      employeeId,

      fullName,
      email,
      phone,
      cnic,

      employeeType,
      section,

      department,
      designation,

      office,

      reportsTo:
        reportsTo && reportsTo !== ""
          ? reportsTo
          : null,

      isManagingDirector: mdValue,

      message: message || "",

      order: orderValue,

      joiningDate,

      address: address || "",

      status: status || "Active",

      profileImage: req.file
        ? req.file.path
        : "",
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      employee,
    });
  } catch (err) {
    console.error("Create employee error:", err);

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
    const employee = await Employee.findById(
      req.params.id
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // -------------------------------
    // Prevent multiple Managing Directors
    // -------------------------------

    const mdValue =
      req.body.isManagingDirector === "true" ||
      req.body.isManagingDirector === true;

    if (mdValue) {
      const existingMD = await Employee.findOne({
        _id: { $ne: employee._id },
        isManagingDirector: true,
        status: "Active",
      });

      if (existingMD) {
        return res.status(400).json({
          message:
            "Another Managing Director already exists.",
        });
      }
    }

    // -------------------------------
    // Personal information
    // -------------------------------

    if (req.body.fullName !== undefined) {
      employee.fullName = req.body.fullName;
    }

    if (req.body.email !== undefined) {
      employee.email = req.body.email;
    }

    if (req.body.phone !== undefined) {
      employee.phone = req.body.phone;
    }

    if (req.body.cnic !== undefined) {
      employee.cnic = req.body.cnic;
    }

    // -------------------------------
    // Organizational information
    // -------------------------------

    if (req.body.employeeType !== undefined) {
      employee.employeeType =
        req.body.employeeType;
    }

    if (req.body.section !== undefined) {
      employee.section = req.body.section;
    }

    if (req.body.department !== undefined) {
      employee.department =
        req.body.department;
    }

    if (req.body.designation !== undefined) {
      employee.designation =
        req.body.designation;
    }

    if (req.body.reportsTo !== undefined) {
      employee.reportsTo =
        req.body.reportsTo || null;
    }

    if (
      req.body.isManagingDirector !== undefined
    ) {
      employee.isManagingDirector = mdValue;
    }

    if (req.body.order !== undefined) {
      employee.order =
        req.body.order === ""
          ? 0
          : Number(req.body.order);
    }

    // -------------------------------
    // Location
    // -------------------------------

    if (req.body.office !== undefined) {
      employee.office = req.body.office;
    }

    // -------------------------------
    // Additional information
    // -------------------------------

    if (req.body.joiningDate !== undefined) {
      employee.joiningDate =
        req.body.joiningDate;
    }

    if (req.body.address !== undefined) {
      employee.address = req.body.address;
    }

    if (req.body.status !== undefined) {
      employee.status = req.body.status;
    }

    if (req.body.message !== undefined) {
      employee.message = req.body.message;
    }

    // -------------------------------
    // Profile image
    // -------------------------------

    if (req.file) {
      employee.profileImage =
        req.file.path;
    }

    await employee.save();

    res.json({
      success: true,
      message: "Employee updated successfully.",
      employee,
    });
  } catch (err) {
    console.error("Update employee error:", err);

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
    const employee = await Employee.findById(
      req.params.id
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    // -------------------------------
    // Prevent deleting employee
    // who has subordinates
    // -------------------------------

    const subordinates =
      await Employee.countDocuments({
        reportsTo: employee._id,
      });

    if (subordinates > 0) {
      return res.status(400).json({
        message:
          "This employee has other employees reporting to them. Reassign those employees before deleting this employee.",
      });
    }

    await employee.deleteOne();

    res.json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (err) {
    console.error("Delete employee error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};