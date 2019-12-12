const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");


const writeFileAsync = util.promisify(fs.writeFile);

var rName;
var uLocation = "";
var uBlog = "";
var uBio;
var color;

inquirer
  .prompt([{
    message: "Enter your GitHub username",
    name: "username"
  }
  // ,{
  //   message: "Enter profile card coloring: green,pink,blue,orange",
  //   name: "backgroundC"
  // }
])
  .then(function({backgroundC}){

    
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}`;
    axios //----------------------------------------------//
      .get(queryUrl)
      .then(function(iter){
        axios //-------------------------//
          .get((queryUrl+"/starred"))
          .then(function(iter2){
            checkValues(iter);
            return writeFileAsync('profile.html', profileMade(iter,iter2));


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



//    https://www.google.com/maps/place/<User Location>


checkValues = (x) => {


  if (x.data.name == null){
    rName = x.data.login;
  }
  else {
    rName = x.data.name;
  }

  if (x.data.uLocation != null){
    uLocation = `<a class="links" href="${"https://www.google.com/maps/place/"+x.data.location}"><p>Location</p></a>`
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

profileMade = (x,y) => {`
        <html>

          <head>
              <title>
                ${x.data.login} Profile
              </title>
              <link rel="stylesheet" type="text/css" href="./assets/style.css"/>
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
        
        
        `};