require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Employee = require('../models/Employee');

async function seed() {
  await connectDB();

  try {
    // Clear existing sample employees with a specific marker? We'll avoid deleting all employees.

    const employeesDef = [
      // Directors / Board
      { employeeId: 'EMP-9001', fullName: 'Board of Directors', designation: 'Board', department: 'Management', office: 'Head Office', status: 'Active', order: 1 },
      { employeeId: 'EMP-9002', fullName: 'Haji Noor Kamal', designation: 'Managing Director', department: 'Management', office: 'Head Office', status: 'Active', message: 'Welcome to United Bulaqi Khel Enterprises.', order: 1, reportsToEmployeeId: 'EMP-9001' },
      { employeeId: 'EMP-9003', fullName: 'Said Jalal', designation: 'General Manager', department: 'Management', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9002', order: 1 },

      // Departmental Managers (Head Office)
      { employeeId: 'EMP-9100', fullName: 'Muhammad Anwar', designation: 'Audit Manager', department: 'Audit', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9101', fullName: 'Muhammad Shafi', designation: 'Audit Manager', department: 'Audit', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9110', fullName: 'Wajid Khan', designation: 'Purchase Manager', department: 'Purchase', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9111', fullName: 'Allah Din', designation: 'Purchase Manager', department: 'Purchase', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9120', fullName: 'Muhammad Asim', designation: 'Sales Manager', department: 'Sales', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9130', fullName: 'Muhammad Jamil', designation: 'Administration Manager', department: 'Administration', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9140', fullName: 'Abdur Rauf', designation: 'Information Manager', department: 'Information', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9150', fullName: 'Said Muhammad', designation: 'Safety & Security Manager', department: 'Safety', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9003' },
      { employeeId: 'EMP-9160', fullName: 'Personal Assistant to MD', designation: 'PA to MD', department: 'Administration', office: 'Head Office', status: 'Active', reportsToEmployeeId: 'EMP-9002' },

      // Chitral Office Key Personnel
      { employeeId: 'EMP-7001', fullName: 'Muhammad Shahab', designation: 'Project Manager', department: 'Projects', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-9002' },
      { employeeId: 'EMP-7002', fullName: 'Syed Hussain', designation: 'Mining Manager', department: 'Mining', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7001' },
      { employeeId: 'EMP-7003', fullName: 'Muhammad Waqas', designation: 'Mining Engineer', department: 'Mining', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7002' },
      { employeeId: 'EMP-7004', fullName: 'Muhammad Tariq', designation: 'Operational Manager', department: 'Operations', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7001' },
      { employeeId: 'EMP-7005', fullName: 'Aliem Raza', designation: 'Supervisor', department: 'Operations', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7004' },
      { employeeId: 'EMP-7006', fullName: 'Mobin', designation: 'Supervisor', department: 'Operations', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7004' },
      { employeeId: 'EMP-7007', fullName: 'Muhammad Zahid', designation: 'Supervisor', department: 'Operations', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7004' },
      { employeeId: 'EMP-7008', fullName: 'Raham Din', designation: 'Supervisor', department: 'Operations', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7004' },
      { employeeId: 'EMP-7009', fullName: 'Nivaz Ullah', designation: 'Camp In-Charge', department: 'Operations', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7004' },
      { employeeId: 'EMP-7010', fullName: 'Esmat Ullah', designation: 'Accountant / Computer Operator', department: 'Finance', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7001' },
      { employeeId: 'EMP-7011', fullName: 'Ibad Ullah', designation: 'Geologist', department: 'Geology', office: 'Chitral', status: 'Active', reportsToEmployeeId: 'EMP-7001' },

      // Darra Office Key Personnel
      { employeeId: 'EMP-8001', fullName: 'Muhammad Qasim', designation: 'Personal Assistant to MD', department: 'Administration', office: 'Darra', status: 'Active', reportsToEmployeeId: 'EMP-9002' },
      { employeeId: 'EMP-8002', fullName: 'Wisal Muhammad', designation: 'Accountant / Computer Operator', department: 'Finance', office: 'Darra', status: 'Active', reportsToEmployeeId: 'EMP-9002' },
    ];

    // Insert employees without reportsTo populated (we'll set references after creation)
    const creationData = employeesDef.map((e) => {
      const copy = { ...e };
      copy.reportsToEmployeeId = e.reportsToEmployeeId || e.reportsToEmployeeId; // keep for later
      // remove reportsTo field if exists
      delete copy.reportsTo;
      return copy;
    });

    // Create or upsert by employeeId to avoid duplicates
    const created = [];
    for (const item of creationData) {
      const existing = await Employee.findOne({ employeeId: item.employeeId });
      if (existing) {
        // update basic fields
        existing.fullName = item.fullName;
        existing.email = item.email || '';
        existing.phone = item.phone || '';
        existing.cnic = item.cnic || '';
        existing.department = item.department || '';
        existing.designation = item.designation || '';
        existing.joiningDate = item.joiningDate || new Date();
        existing.address = item.address || '';
        existing.status = item.status || 'Active';
        existing.office = item.office || 'Head Office';
        existing.message = item.message || existing.message || '';
        existing.order = item.order || existing.order || 0;
        await existing.save();
        created.push(existing);
      } else {
        const toCreate = {
          employeeId: item.employeeId,
          fullName: item.fullName,
          email: item.email || '',
          phone: item.phone || '',
          cnic: item.cnic || '',
          department: item.department || '',
          designation: item.designation || '',
          joiningDate: item.joiningDate || new Date(),
          address: item.address || '',
          status: item.status || 'Active',
          office: item.office || 'Head Office',
          message: item.message || '',
          order: item.order || 0,
          profileImage: item.profileImage || '',
        };
        const doc = await Employee.create(toCreate);
        created.push(doc);
      }
    }

    // Build map by employeeId
    const map = {};
    for (const doc of created) {
      map[doc.employeeId] = doc._id;
    }

    // Now set reportsTo based on reportsToEmployeeId
    for (const def of employeesDef) {
      if (def.reportsToEmployeeId) {
        const doc = await Employee.findOne({ employeeId: def.employeeId });
        if (doc && map[def.reportsToEmployeeId]) {
          doc.reportsTo = map[def.reportsToEmployeeId];
          await doc.save();
        }
      }
    }

    console.log('Seeding completed. Inserted/updated:', created.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
