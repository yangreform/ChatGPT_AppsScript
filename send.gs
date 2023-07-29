/*
Author : Jacky   2023/7/29 09:30
Line Bot Webhook & Google Apps script & ChatGTP API
*/

ChatGPT_Access_Token = "";
Line_Bot_Token = "";
UUID = "";

// reply "sMsg" to LINE
function pushLineBotMessage(sMsg){
      
    var linePayload = {
      'to':UUID,
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
    Line_Bot_API_push = "https://api.line.me/v2/bot/message/push";
    UrlFetchApp.fetch(Line_Bot_API_push, lineOptions);  // 把訊息送出
}
    

function send() {
  var sUserMsgText = "tell me a joke.";

  // 呼叫ChatGPT API
  sGPTReceive = chatGPT_api(sUserMsgText)
  // 將收到的 chatGPT 回應 sGPTReceive，傳給 LINE bot
  sResponse = JSON.parse(sGPTReceive.getContentText())["choices"][0]["text"]
  
  //sResponse = "test";   //debug用
  console.log( sResponse )
  pushLineBotMessage(sResponse);
}
