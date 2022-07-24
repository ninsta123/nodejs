const Sequelize =  require("sequelize");
const  sequelize =  require("../database");
const Teacher =  sequelize.define("teacher", {
id:{
   type:Sequelize.INTEGER,
   autoIncrement:true,
   allowNull:false,
   primaryKey:true
},
user:{
type:Sequelize.STRING,
allowNull:false
},
password:{
type:Sequelize.STRING,
allowNull:false
}
});

module.exports =  Teacher;