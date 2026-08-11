const Mineral = require("../models/Mineral");
const Project = require("../models/Project");
const Employee = require("../models/Employee");
const Contact = require("../models/ContactMessage");

exports.getDashboard = async (req, res) => {

    try {
        const totalMinerals =
            await Mineral.countDocuments();

        const totalProjects =
            await Project.countDocuments();

        const totalEmployees =
            await Employee.countDocuments();

        const totalMessages =
            await Contact.countDocuments();

        const activeProjects =
            await Project.countDocuments({
                status: "Active",
            });

        const recentProjects =
            await Project.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select(
                    "projectName status createdAt"
                );

        const recentEmployees =
            await Employee.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select(
                    "fullName designation createdAt"
                );

        res.json({

            success: true,

            statistics: {

                totalMinerals,

                totalProjects,

                totalEmployees,

                totalMessages,

                activeProjects,

                totalVisitors: 0,

            },

            recentProjects,

            recentEmployees,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
