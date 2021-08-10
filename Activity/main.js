let request = require("request");
let cheerio = require("cheerio");
let singleMatchScorecardObj = require("./scorecard");
console.log("Before");

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595", cb);

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

  let elementRep = searchTool(".list-unstyled .widget-items .label");
  //getting text of the element
  // console.log(elementRep);
  let link = elementRep.attr("href");
  let fullMatchPagelink = `https://www.espncricinfo.com${link}`;
  // console.log(fulllink);
  request(fullMatchPagelink, allmatchcb);
}

//newcb function for nextpage link req
function allmatchcb(err, response, html) {
  if (err) {
    console.log(err);
  } else if (response.statusCode == 404) {
    console.log("Request not fulfilled");
  } else {
    // console.log(html);
    getAllMatchesScoreCard(html);
  }
}

function getAllMatchesScoreCard(html) {
  let searchTool = cheerio.load(html);

  let elementRepArr = searchTool("a[data-hover='Scorecard']");

  for (let i = 0; i < elementRepArr.length; i++) {
    let link = searchTool(elementRepArr[i]).attr("href");
    let scorecardPagelink = `https://www.espncricinfo.com${link}`;
    //    console.log(scorecardPagelink);
    singleMatchScorecardObj.singleMatchScorecard(scorecardPagelink);
  }
}

console.log("After");
