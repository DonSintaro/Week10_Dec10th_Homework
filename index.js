const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const pdf = require('html-pdf');


const writeFileAsync = util.promisify(fs.writeFile);

var rName;
var uLocation = "";
var uBlog = "";
var uBio;
var color = "style"; // default
var placeArray = null;

//orange,blue,pink,green
const colorF = ["#ce936b;","#4a77aa;","#ad55a6;","#4aaaa5;"];
const colorB = ["rgb(255, 241, 253);","rgb(255, 241, 244);","rgb(241, 242, 255);","beige;"]
const colorCH = ["#ce936b;","#4a77aa;","#ad55a6;","#4aaaa5;"]
const colorMN = ["#ce936b;","#4a77aa;","#ad55a6;","#4aaaa5;"]
const colorBody = ["rgb(238, 227, 212);","rgb(191, 191, 211);","rgb(235, 221, 227);","rgb(206, 211, 191);"]

function fillIn(x){ return `
 
#footerTail{border-top: 8px solid ${colorF[x]}}
.blockThis{background-color: ${colorB[x]}}
#contentHead{color:${colorCH[x]}}
#myName{background-color: ${colorMN[x]}}
body{background-color: ${colorBody[x]}}

`
}

const defaultColor = `
 
#footerTail{border-top: 8px solid #aaaaaa;}
.blockThis{background-color: rgb(238, 238, 238);}
#contentHead{color:#aaaaaa;}
#myName{background-color: #aaaaaa;}
body{background-color: rgb(216, 216, 216);}

`;

var placeIn;

inquirer
  .prompt([{
    message: "Enter your GitHub username: ",
    name: "username"
  }
  ,{
    message: "Type profile card coloring: default(greyscale), green, pink, blue, or orange: ",
    name: "bColor"
  }
])
  .then(function({bColor,username}){
    if (bColor == "orange"){
      color = bColor;
      placeArray = 0;
    }
    else if(bColor =="blue"){
      color = bColor;
      placeArray = 1;
    }
    else if(bColor =="pink"){
      color = bColor;
      placeArray = 2;
    }
    else if(bColor =="green"){
      color = bColor;
      placeArray = 3;
    }

    if (placeArray != null){
        placeIn = fillIn(placeArray);
    }
    else{
      placeIn = defaultColor;
    }

    console.log(color);  
    console.log(username); 
    const queryUrl = `https://api.github.com/users/${username}`;
    axios //----------------------------------------------//
      .get(queryUrl)
      .then(function(iter){
        axios //-------------------------//
          .get((queryUrl+"/starred"))
          .then(function(iter2){
            checkValues(iter);
            pdf.create(profileMade(iter,iter2)).toFile('./profile.pdf', function (err, res) {
              if (err) {
                return console.log(err);
              }
              console.log(res);
            });
            writeFileAsync('profile.html', profileMade(iter,iter2));


          })
          .catch(function(err){
            console.log("failure2");
            console.log(err);
            console.log("failure2");
          })
          //-------------------------------//


      })
      .catch(function(err){
        console.log("failure1, no such username found");
        console.log(err);
        console.log("failure1, no such username found");
      })
  })//-------------------------------------------------//
  .catch(function(err){
    console.log("failure0");
    console.log(err);
    console.log("failure0");
  });


checkValues = (x) => {


  if (x.data.name == null){
    rName = x.data.login;
  }
  else {
    rName = x.data.name;
  }

  if (x.data.location != null){

    uLocation = `<a class="links" href="${"https://www.google.com/maps/place/"+x.data.location}"><p>${x.data.location}</p></a>`
  }
  if (x.data.blog != ""){
    uBlog = `<a class="links" href="${x.data.blog}"><p>Blog</p></a>`
  }

  if (x.data.bio == null){
    uBio = "No User biography defined";
  }
  else{
    uBio = x.data.bio;
  }

}

profileMade = (x,y) => `
        <html>

          <head>
              <title>
                ${x.data.login} Profile
              </title>
              <style>
              html{
                height: 100%;
                box-sizing: border-box;
            }
            body{
                background-color: rgb(216, 216, 216);
                min-height: 100%;
                position: relative;
                margin:0;
                padding:0;
                color: #777777;
            }
            
            p{
                font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
            }
            
            h1{
                font-family: 'Georgia', Times, 'Times New Roman', serif;
            }
            
            #headingArea{ 
                position: fixed;
                left: 0;
                top: 0;
                z-index: 10;
                width:100%;
                height: 150px;
                margin-bottom: 0;
                background-color: #ffffff;
                border-bottom: 3px solid;
                border-color: #cccccc;
            }
            
            .links {
                display: inline-block;
                margin-left: 10px;
            
            }
            .links:visited{
                color:#777777;
                text-decoration: none;
            
            }
            
            .links:link {
                text-decoration: none;
                color:#777777;
            }
            
            .portLinks:visited{
                color:#ffffff;
            }
            
            .portLinks:link{
                color:#ffffff;
            }
            #myName{ 
                position:absolute;
                background-color: #aaaaaa;
                color: #ffffff;
                left: 0;
                bottom: 0;
            
                margin-left: calc(50% - 345px);
                padding-left: 15px;
                padding-right: 15px;
                padding-top:15px;
                padding-bottom: 15px;
            }
            #linksHead{
                position:absolute;
                color:grey;
                right:0;
                bottom: 0;  
                margin-bottom: 30px;
                margin-right: calc(50% - 345px);
            }
            #headArea{
                height:165px;
                width: 100%;
                margin-bottom: 25px;
            }
            /*-------------content------------------*/
            #content{
            
                
            
                padding-right: 15px;
                padding-left: 15px;  
                padding-top: 15px;
                padding-bottom: 15px;
                margin-right: calc(50% - 345px);
                margin-left: calc(50% - 345px);
                background-color: #ffffff; 
            }
            #contentHead{
                height: 60px;
                width:100%;
                border-bottom: 3px #dddddd solid;
                margin-bottom: 40px;
                color:#aaaaaa;
                margin-top:0;
            }
            
            /*-----------index------------*/
            #profilePic{
                border-radius: 15px;
                width: 200px; 
                object-fit: contain;
                margin-right: 15px;
                float:left;
            }
            #pAbout{
                display:block;
                line-height: 2rem;
            }
            #h3About{
                display:block;
            
            }
            
            .blockThis{
                border-radius: 15px;
                background-color: rgb(238, 238, 238);
                display:inline-block;
                width: calc(100% - 20px);
                margin-bottom: 15px;
                padding: 10px;
            }
            .blockThis h3{
                
                display:inline-block;
                margin-right:15px;
            }
            .blockThis p{
                display:inline-block;
            }
            .unblockThis{
                display: inline-block;
                width: calc(50% - 2px);
                text-align:left;
            }
            .unblockThis:nth-child(2){
                text-align:right;

            }
            /*--------------footer-----------------*/
            
            #footerArea{
                height:90px;
                width:100%; 
            }
            
            #footerTail{
                border-top: 8px solid #aaaaaa;
                position:absolute;
                bottom:0;
                height: 45px;
                width:100%; 
                padding-right: 0;
                padding-left: 0;
                background-color: #666666;
                text-align: center;
                color: white;
            }
              
              </style>


              <style>
              

              ${placeIn}


              </style>



          </head>
            <body>
                <section id="headingArea">
                    <div id="myName">
                        <h1>${rName}</h1>
                    </div>
                    <div id="linksHead">
                        <a class="links" href="${x.data.html_url}"><p>Github</p></a>
                        ${uLocation}
                        ${uBlog}
                    </div>    
                </section>        
                <div id="headArea"></div>
                <section id="content">
                    <div id="contentHead">
                        <h1>
                            About
                        </h1>
                    </div>
                    <div id="contentBody">
                        <div class="blockThis">
                            <img id="profilePic" src="${x.data.avatar_url}" alt="Image of Dev"/>

                            <div id="aboutText">
                                <h3 id="h3About">Bio: </h3><p id="pAbout">${uBio}</p>
                            </div>
                        </div>

                        <div class="blockThis">
                          <div class="unblockThis">
                            <h3>Number of Public repositories: </h3><p> ${x.data.public_repos}</p></br></br>
                            <h3>Number of Followers: </h3><p> ${x.data.followers}</p></br></br>
                          </div>

                          <div class="unblockThis">
                            <h3>Number of GitHub stars: </h3><p> ${y.data[0].stargazers_count}</p></br></br>
                            <h3>Number of Users following: </h3><p> ${x.data.following}</p></br></br>
                          </div>
                        </div>
 
                    </div>
                </section>
                <div id="footerArea"></div>
                <section id="footerTail">
                    <p>
                        Copyright @
                    </p>
                </section>
              </body>
            </html>
        
        
        `;