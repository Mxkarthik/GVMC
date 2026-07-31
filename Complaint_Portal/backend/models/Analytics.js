const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
    {
        totalVisitors : {
            type : Number,
            default : 0,
        },
        totalProjectViews : {
            type : Number,
            default : 0,
        },
        lastVisitAt: {
            type : Date,
            default : null,
        },
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.model("Analytics", analyticsSchema);