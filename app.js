//jshint esversion: 6

const express = require('express');
const bp = require('body-parser');
const request = require('request');

const app = express();
app.use(bp.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', (req, res) => {
    let fName = req.body.firstname;
    let lName = req.body.lastname;
    let mail = req.body.email;

    console.log(fName, lName, mail);

    var data = {
        members: [
            {
                email_address: mail,
                status: 'subscribed',
                merge_fields: {
                    FNAME:  fName, 
                    LNAME:  lName
                }
            }
        ]
    }

    jsonData = JSON.stringify(data);

    var options = {
        url: 'https://us1.api.mailchimp.com/3.0/lists/697d076954?skip_merge_validation=<true>&skip_duplicate_check=<false>',
        method: 'POST',
        headers : {
            'Authorization': `hitman17 ${process.env.AUTH}`
        },
        body: jsonData
    }

    request(options, (error, response, body) => {
        if (error){
            console.log(error);
        } 
        else if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        }
        else if (response.statusCode >= 400 & response.statusCode < 500) {
            res.sendFile(__dirname + '/failure.html');
        }

        else{
            console.log(response.statusCode);
        }
    })

    
})

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(3030, () => {
    console.log("Life is good! And all seems well...");
})

//c56515ef8cf4ecb406edec414699bf67-us1
//697d076954 - list id