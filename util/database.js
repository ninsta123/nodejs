const Sequelize =  require("sequelize");

const sequelize =  new Sequelize("School", "myserver", "nishtha!123A" ,{
    dialect:"mysql",
    host:"myserver3456.mysql.database.azure.com"
})
module.exports =  sequelize;
