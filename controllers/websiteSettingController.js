const WebsiteSetting = require("../models/WebsiteSetting");

const cloudinary = require("../config/cloudinary");

const fs = require("fs");

// ======================================
// Get Website Settings
// ======================================

exports.getWebsiteSettings = async (req, res) => {

    try {

        let settings = await WebsiteSetting.findOne();

        if (!settings) {

            settings = await WebsiteSetting.create({});

        }

        res.status(200).json({

            success: true,

            settings,

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

// ======================================
// Update Website Settings
// ======================================

exports.updateWebsiteSettings = async (req, res) => {

    try {

        let settings = await WebsiteSetting.findOne();

        if (!settings) {

            settings = await WebsiteSetting.create({});

        }

        settings.heroStats =
            req.body.heroStats || settings.heroStats;

        settings.aboutStats =
            req.body.aboutStats || settings.aboutStats;

        settings.projectStats =
            req.body.projectStats || settings.projectStats;

        settings.footer =
            req.body.footer || settings.footer;

        await settings.save();

        res.status(200).json({

            success: true,

            message: "Website settings updated successfully.",

            settings,

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};

// ======================================
// Upload Hero Video
// ======================================

exports.uploadHeroVideo = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Please select a video.",

            });

        }

        let settings = await WebsiteSetting.findOne();

        if (!settings) {

            settings = await WebsiteSetting.create({});

        }

        // Delete old video

        if (

            settings.heroVideo &&

            settings.heroVideo.public_id

        ) {

            await cloudinary.uploader.destroy(

                settings.heroVideo.public_id,

                {

                    resource_type: "video",

                }

            );

        }

        // Upload new video

        const result = await cloudinary.uploader.upload(

            req.file.path,

            {

                folder: "United-Bulaqi-Khel/hero-video",

                resource_type: "video",

            }

        );

        // Remove local file

        fs.unlinkSync(req.file.path);

        settings.heroVideo = {

            url: result.secure_url,

            public_id: result.public_id,

        };

        await settings.save();

        res.status(200).json({

            success: true,

            message: "Hero video uploaded successfully.",

            heroVideo: settings.heroVideo,

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message,

        });

    }

};