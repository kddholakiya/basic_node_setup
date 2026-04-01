
const app = require('express').Router();

module.exports = (function () {

    var authRoutes = require("./v1/auth.route");
    app.use('/auth', authRoutes);    

    var adminRoutes = require("./v1/admin.route");
    app.use('/admin', adminRoutes);
    
    return app;
})();

