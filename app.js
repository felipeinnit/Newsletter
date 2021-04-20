//require modules installed
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//app to use the parse
app.use(bodyParser.urlencoded({
    extended:true
}));

//load static files
app.use(express.static("public"));

//setup express
app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

//post route
app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    
    const url = "https://us20.api.mailchimp.com/3.0/lists/6c76ac6b14";

    const options = {
        method: "POST",
        auth: ":api_key"
    }
    
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }

        else {
            res.sendFile(__dirname + "/fail.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/success", function(req,res){
    res.redirect("/")
})

app.post("/fail", function(req,res){
    res.redirect("/")
})


//print that is working 3000 and heroku
app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
})
