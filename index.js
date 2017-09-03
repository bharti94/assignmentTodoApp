var express=require("express");
var bodyparser=require("body-parser");
var dbdata=require("./datafile.js");


var app=express();

app.use("/",express.static("public"));
app.use("/",bodyparser.urlencoded({extended:false}));

//Just for checking
app.use("/",function (req,res,next)
{
    console.log("hello1");
    next();
});

// 1 GET /api/todos
app.get("/api/todos",function (req,res)
{
    console.log("got a get request");
    res.json(dbdata.todosobject);
});

// 2 POST /api/todos
// Post in the form inputedtitle=" "
app.post("/api/todos",function (req,res)
{
    var newtitle=req.body.inputedtitle;
    if (!newtitle || newtitle == "" || newtitle.trim() == "")
    {
        res.status(400).json({error : "Todo Title Can't Be Empty"});
    }else
    {
        var tempobj={title:newtitle,status:"Active"};
        dbdata.todosobject[dbdata.nexttodoid]=tempobj;
        dbdata.nexttodoid++;
        res.json(dbdata.todosobject);
    }
});

// 3 PUT /api/todos/:id
// Put in the form newtitle=" "& newstatus=" "
app.put("/api/todos/:id",function (req,res)
{
    var idnum=req.params.id;
    var temp=dbdata.todosobject[idnum];
    if (!temp)
    {
        res.status(400).json({error: "Can't modify a todo that doesnt exist"});
    }else
    {
        var nt=req.body.newtitle;
        var ns=req.body.newstatus;

        if(nt && nt!="" && nt.trim()!="")
        {
          dbdata.todosobject[idnum].title=nt;
        }
        if(ns &&(ns =="Active" ||ns =="active"||ns =="ACTIVE"||ns== "COMPLETED"||ns== "completed"||ns== "Completed"))
        {
            dbdata.todosobject[idnum].status=ns;
        }
        res.json(dbdata.todosobject);
    }
});

// 4 DELETE /api/todos/:id
app.delete("/api/todos/:id",function (req,res)
{
    var idnum=req.params.id;
    var temp=dbdata.todosobject[idnum];
    if(!temp)
    {
        res.status(400);
        res.send("error");
    }else
    {
        console.log("hello2");
        dbdata.todosobject[idnum].status="Deleted";
        res.json(dbdata.todosobject);
    }
});


app.listen(3000);