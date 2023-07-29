/*
Author : Jacky   2023/7/10 09:30
Line Bot Webhook & Google Apps script & ChatGTP API
*/

Line_Bot_Token = "";
ChatGPT_Access_Token = "";
UUID = "";

function doPost(e) {
  var oPostData = JSON.parse(e.postData.contents);    //收到的 LINE Bot 提問 
  var sReplyToken = oPostData.events[0].replyToken
  var sUserMsgText = oPostData.events[0].message.text   //  sUserMsgText 就是收到的文字內容

  // 呼叫ChatGPT API
  sGPTReceive = chatGPT_api(sUserMsgText)

  // 將收到的 chatGPT 回應，傳給 LINE bot
  sResponse = JSON.parse(sGPTReceive.getContentText())["choices"][0]["text"]
  replyLineBotMessage(sResponse, sReplyToken);
}

// 呼叫ChatGPT API
function chatGPT_api(sMsg) {
  return UrlFetchApp.fetch('https://api.openai.com/v1/completions', {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ChatGPT_Access_Token,
    },
    'payload': JSON.stringify({
      "model": "text-davinci-003",
      "prompt": sMsg,
      "temperature": 0,
      "max_tokens": 300,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0.6,
      "stop": ["###"]   // 告訴GTP一段訊息結束的標記符號
    }),
  })
}

// 將收到的 chatGPT 回應，傳給 LINE bot
function replyLineBotMessage(sMsg, sReplyToken){
      
    var linePayload = {
      'replyToken': sReplyToken,
      'messages': [
        {
          'type': 'text',
          'text': sMsg
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
