const express = require("express");
const app = express();
const path  =  require("path");
const Sequelize =  require("sequelize");
const  sequelize =  require("./util/database")
const Teacher = require("./util/models/teacher")
const Student= require("./util/models/student")
const PORT  =  process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname+ '/public')));
app.use((req,res,next)=>{
console.log(`${req.method} - ${req.url}`);
next();
})
 const session  =  require('express-session')
 app.use(session({
 secret:'some secret',
 cookie:{maxAge:300000},
 saveUninitialized:false
 }))

app.get("/", function(req, res){
    if(req.session.has){
        res.redirect("/admin")
    }else{
    res.render("index.ejs");
    }
})
app.get("/teacher", (req,res)=>{
    res.render("login.ejs")
})

app.get("/student", (req,res)=>{
    res.render('studForm.ejs')
})
app.post("/login",(req,res)=>{
    var User =  req.body.userEmail;
    var pass =  req.body.userPassword;
    User = User.trim();
    pass =  pass.trim();
    sequelize.sync().then(itr=>{
     return Teacher.findAll({where: {user: User, password:pass}}).then(item=>{
            if(item.length!=0){
                console.log("logined successfully"); 
                req.session.has = true;
				req.session.username = User;
                res.status(200).redirect('/admin');       
               
            }
            else{              
            
                const msg  = "try checking your user and password again!!"
                res.render("login.ejs", {msg:msg})
            }
        })        
    })        
})
//admin route
app.get('/admin', (req,res)=>{
    if(req.session.has){
    sequelize.sync().then(itr=>{
        return Student.findAll().then(item=>{
            console.log(item)
            res.render('admin.ejs', {item:item} );
        })})  
    }else{
        console.log("you are not logged in")
        res.redirect("/");
    }      
})
app.post("/result",(req,res)=>{
    var name =  req.body.name;
    var id =  req.body.id;
    name = name.trim();
    id =  id.trim();
    sequelize.sync().then(itr=>{
    return Student.findAll({where: {id: id}}).then(item=>{
        if(item.length!=0)
     res.render('showResult.ejs', {item:item[0]})
     else{
         res.render("studForm.ejs",{msg:"Result not Found!."})
     }
    })
    })
})
app.get("/add", (req,res)=>{
    if(req.session.has){
    res.render('add.ejs', {track:"admin.ejs"}) 
    }else{
        res.redirect("/")
    }
 })
 app.post("/additem", (req,res)=>{

     var USER = "xyz123";
     var PASS ="xyz123"
     console.log(req.body)
     sequelize.sync().then(stud=>{
        Teacher.create({user:USER,password:PASS}).then(result=>{
             res.status(200).send("item added")
         })
     })
    })
 app.post("/add", (req,res)=>{
    if(req.session.has){
     var NAME =  req.body.name;
     var DOB =  req.body.dob;
     var SCORE  = req.body.score;
     sequelize.sync().then(stud=>{
         Student.create({name:NAME, dob:DOB, score:SCORE}).then(result=>{
             res.redirect('/admin');
         })
     })}
     else{
         res.redirect("/")
     }
    
 })
 //edit functions
 app.post('/edit', (req,res)=>{
    if(req.session.has){
     console.log(req.body)
     var id  =  req.body.id;
     var name =  req.body.name;
     var dob =  req.body.dob;
     var score  = req.body.score;
     res.render('edit.ejs',{id:id, name:name, dob:dob,score:score})
    }else{
        res.redirect("/")
    }
 })
 app.post('/doedit', function(req,res){
    if(req.session.has){
     var ID = req.body.id
     var NAME =  req.body.name;
     var DOB =  req.body.dob;
     var SCORE  = req.body.score;
     sequelize.sync().then(stud=>{
         Student.update({name:NAME, dob:DOB, score:SCORE}, {where: {id:ID}}).then(result=>{
             res.redirect('/admin');
         })
     })
    }else{
        res.redirect("/");
    }
 })
 
 app.post('/delete', function(req,res){
    if(req.session.has){
    var ID  =  req.body.ID;
 Student.destroy({ where: { id: ID } }).then(result=>{
     res.redirect('/admin')
 })
}else{
    res.redirect("/")
}
 })
 
//logout
app.get('/logout', (req,res)=>{
    req.session.has =  false;
    res.redirect("/")
})

 app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`)
})