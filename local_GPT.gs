/*
Author : Jacky   2023/8/23 09:30
Line Bot Webhook & Google Apps script & ChatGTP API
*/

sUserMsgText="你們的電話與地址?"


function chatGPT_local(sUserMsgText) {
  var url = "https://6a58-34-105-88-132.ngrok.io/v1/chat/completions";
  preword = "你現在是台灣新竹地方法院所屬的民間公證人的林威伶律師" +
            "事務所網頁：   https://weishun.cc " +
            "地址：新竹縣竹北市自強南路416號1樓"  +
            "電話：036688226" +
            "提供公證服務：為新竹縣市的在地鄉親提供服務。包括：身分證、護照等公文書認證。遺囑認證。" +
            "提供法律服務：林律師專精民刑事訴訟、土地糾紛、公司法律諮詢、商事與智慧財產權等法律問題 " +
            "提供英文服務：有 " +
            "服務時間：相當彈性，可以預約假日或夜間，且公證效力和費用與法院相同。" +
            "有客戶提出問題："
  
  //要傳給 ChatGPT 的字，前面加上 preword，後面加上 "一段訊息結束的標記符號"
  sUserMsgText = preword + sUserMsgText + "###" 

  var prompt = {
    "messages": [
      {"role": "user","content": sUserMsgText}
    ],
    "repetition_penalty": 1.0
  };
  var params = {
    "contentType": "application/json",
    "payload": JSON.stringify(prompt),
    "muteHttpExceptions": true,
  };
  var response = UrlFetchApp.fetch(url, params);
  return JSON.parse(response.getContentText()).choices[1].message.content;
}

/*
function doPost(e) {
  var oPostData = JSON.parse(e.postData.contents);    //收到的 LINE Bot 提問 
  var sReplyToken = oPostData.events[0].replyToken
  var sUserMsgText = oPostData.events[0].message.text   //  sUserMsgText 就是收到的文字內容

  //要傳給 ChatGPT 的字，前面加上 preword，後面加上 "一段訊息結束的標記符號"
  sUserMsgText = preword + sUserMsgText + "###" 

  // 呼叫ChatGPT API
  sResponse = chatGPT_local(sUserMsgText)

  // 將收到的 chatGPT 回應，傳給 LINE bot
  replyLineBotMessage(sResponse, sReplyToken);
  sheet( sUserMsgText, sResponse )
}
*/
