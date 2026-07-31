const Hero = require("../models/Hero");
const uploadImage = require("../services/uploadServices");


const getHero = async(req,res) => {
    try {
        const hero = await Hero.findOne({});

        if (!hero)
        {
            return res.status(404).json({
                success: false,
                message : "Hero Content not Found",
            })
        }

        return res.status(200).json({
            success : true,
            hero,
        })
    }
    catch (error)
    {
        return res.status(500).json({
            success : false,
            message : error.message,
        });
    }
};

const updateHero = async(req,res)=> {
    try 
    {
        let hero = await Hero.findOne({});
        if (!hero)
        {
            hero = await Hero.create(req.body)
            return res.status(201).json({
                success : true,
                message : "Hero Content Created",
                hero,
            })
        }

        hero = await Hero.findOneAndUpdate(
            {},
            req.body,
            {
                new : true,
                runValidators : true,
            }
        )
        return res.status(200).json({
            success : true,
            message : "Hero Updated",
            hero,
        })
        
    }
    catch (error)
    {
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}


const uploadHeroImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided.",
            });
        }

        const result = await uploadImage(req.file, {
            folder: "hero",
        });

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: result.url,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getHero,
    updateHero,
    uploadHeroImage,
};