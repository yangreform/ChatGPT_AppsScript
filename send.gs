/*
Author : Jacky   2024/7/1
Line Bot Webhook & Google Apps script & ChatGTP API
*/

ChatGPT_Access_Token = "";      //輸入自己的 Token
Line_Bot_Token = "";                  //輸入自己的 Token

// 將 "sMsg" 主動 LINE 給你手機
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
    UrlFetchApp.fetch(Line_Bot_API_push, lineOptions);         // 把訊息送出給 LINE 伺服器
}
    
// 將 "sMsg" 回應到 LINE
function send() {
  var sUserMsgText = "tell me a joke.";

  // 呼叫ChatGPT API
  //sResponse = chatGPT_api(sUserMsgText)
  
  sResponse = "test";                         //debug用
  console.log( sResponse )                   //在瑩幕上顯示
  pushLineBotMessage(sResponse);             // 將 "sMsg" 主動 LINE 給你手機
  sheet( sUserMsgText, sResponse )           // 把 "sMsg" 記錄到 google 雲端硬碟
}
