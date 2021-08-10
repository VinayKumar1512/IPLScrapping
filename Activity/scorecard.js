let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path=require('path');

let currentPath="C:\\Users\\HP\\Documents\\IPLScrapping\\Activity";
let ipldirPath= path.join(currentPath,"IPL");
if(fs.existsSync(ipldirPath)==false){
  fs.mkdirSync(ipldirPath);
}


function singleMatchScorecard(url) {
   request(url, cb);
}

function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else if (response.statusCode == 404) {
    console.log("Your request not get fulfilled");
  } else {
    // console.log(html);
    dataExtractor(html);
  }
}

function dataExtractor(html) {
  let searchTool = cheerio.load(html);

  let ininigsData = searchTool(".Collapsible");

  // let scorecard="";
  let result=searchTool(".match-info .description");
  let resulttext=result.text();
  let datevenueArr=resulttext.split(",");
  let venue=datevenueArr[1];
  let date=datevenueArr[2];
 
  for (let i = 0; i < ininigsData.length; i++) {

    //  scorecard=scorecard + searchTool(ininigsData[i]).html();
    let teamNameElem = searchTool(ininigsData[i]).find("h5");
    let teamName = teamNameElem.text();
    teamName = teamName.split("INNINGS")[0];
    //always trim the content you get from website
    teamName = teamName.trim();

    let opponentTeamName = i == 0 ? searchTool(ininigsData[1]).find('h5') : searchTool(ininigsData[0]).find('h5');
    opponentTeamName=opponentTeamName.text();
    opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();

  let teamdirPath=path.join(ipldirPath,teamName);
    if(fs.existsSync(teamdirPath)==false){
     fs.mkdirSync(teamdirPath);
    }
    // console.log(teamName);

    let batsmanTableallRows = searchTool(ininigsData[i]).find(
      ".table.batsman tbody tr"
    );

    for (let j = 0; j < batsmanTableallRows.length - 1; j++) {
      let numberofTds = searchTool(batsmanTableallRows[j]).find("td");
      //   console.log(cols);

      if (numberofTds.length == 8) {
        // console.log("You are valid")
        let playerName = searchTool(numberofTds[0]).text();
        let runs= searchTool(numberofTds[2]).text();
        let balls= searchTool(numberofTds[3]).text();
        let fours= searchTool(numberofTds[5]).text();
        let sixes= searchTool(numberofTds[6]).text();
        let strikerate= searchTool(numberofTds[7]).text();
        // console.log(playerName);
       let dataArr=[];
        let dataobj={
          TeamName:teamName,
          MatchDate:date,
          Venue:venue,
          OpponentTeam:opponentTeamName,
          Runs:runs,
          Balls:balls,
          Fours:fours,
          Sixes:sixes,
          StrikeRate:strikerate
        }
       dataArr.push(dataobj);
        // let jsonWriteable= JSON.stringify(dataobj);
        let playerfilePath=path.join(teamdirPath,playerName);
        playerfilePath=playerfilePath+".json";

        if(fs.existsSync(playerfilePath)){
          // fs.writeFileSync(playerfilePath,JSON.stringify(dataArr));
          let buffer=fs.readFileSync(playerfilePath);
          dataArr=JSON.parse(buffer);
          dataArr.push(dataobj);
        }

      fs.writeFileSync(playerfilePath,JSON.stringify(dataArr));
    

      }
    }

  
  }

  //    fs.writeFileSync("score.html",scorecard);
}

module.exports = {
  singleMatchScorecard: singleMatchScorecard,
};
