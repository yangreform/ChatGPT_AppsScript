/*
Author : Jacky   2023/7/10 09:30
Line Bot Webhook & Google Apps script & ChatGTP API
*/

ChatGPT_Access_Token = "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";
Line_Bot_Token = "xEnn+q4vzmS5207UHp6Qyx5s5bj6p6VgZwEqzrRYIRpsOUOYDEG+lx10EBrwfemY/Kbi3eMbwZIFAVQnti7atq4ScZy/wb86LLZ+ZSZAviyIT3ZovggHR+aOWvbMBqMlqYvgy81op+kLDxFv3OKx+wdB04t89/1O/w1cDnyilFU="; 
UUID = "U974efcbaa3f4df1caff9b48e04a8d9e0";

/*preword = "你現在是台灣新竹地方法院所屬的民間公證人的林威伶律師" +
"事務所網頁：   https://weishun.cc " +
"地址：新竹縣竹北市自強南路416號1樓"  +
"電話：036688226" +
"提供公證服務：為新竹縣市的在地鄉親提供服務。包括：身分證、護照等公文書認證。遺囑認證。" +
"提供法律服務：林律師專精民刑事訴訟、土地糾紛、公司法律諮詢、商事與智慧財產權等法律問題 " +
"提供英文服務：有 " +
"服務時間：相當彈性，可以預約假日或夜間，且公證效力和費用與法院相同。" +
"有客戶提出問題："*/
preword = ""

function doPost(e) {
  var oPostData = JSON.parse(e.postData.contents);    //收到的 LINE Bot 提問 
  var sReplyToken = oPostData.events[0].replyToken
  var sUserMsgText = oPostData.events[0].message.text   //  sUserMsgText 就是收到的文字內容

  //要傳給 ChatGPT 的字，前面加上 preword，後面加上 "一段訊息結束的標記符號"
  sUserMsgText = preword + sUserMsgText + "###" 

  // 呼叫ChatGPT API
  sResponse = chatGPT_api(sUserMsgText)

  // 將收到的 chatGPT 回應，傳給 LINE bot
  sResponse = JSON.parse(sGPTReceive.getContentText())["choices"][0]["text"]
  replyLineBotMessage(sResponse, sReplyToken);
  sheet( sUserMsgText, sResponse )
}

// 呼叫ChatGPT API
function chatGPT_api(sUserMsgText) {
   sGPTReceive = UrlFetchApp.fetch('https://api.openai.com/v1/completions', {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ChatGPT_Access_Token,
    },
    'payload': JSON.stringify({
      "model": "text-davinci-003",
      "prompt": sUserMsgText,
      "temperature": 0,
      "max_tokens": 500,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0.6,
      "stop": ["###"]   // 告訴GTP一段訊息結束的標記符號
    }),
  })
  return JSON.parse(sGPTReceive.getContentText())["choices"][0]["text"]
}

// 將收到的 chatGPT 回應，傳給 LINE bot
function replyLineBotMessage(sResponse, sReplyToken){
      
    var linePayload = {
      'replyToken': sReplyToken,
      'messages': [
        {
          'type': 'text',
          'text': sResponse
        }
      ]
    };
    
    var lineOptions = {
      'method': 'post',
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + Line_Bot_Token
      },
      'payload': JSON.stringify(linePayload)
    };
    Line_Bot_API_reply = "https://api.line.me/v2/bot/message/reply";
    UrlFetchApp.fetch(Line_Bot_API_reply, lineOptions);  // 把訊息送出
}
