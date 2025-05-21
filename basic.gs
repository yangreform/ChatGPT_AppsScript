/*
Author : Jacky   2025/5/20
Line Bot Webhook & Google Apps script & ChatGTP API
*/

var ChatGPT_Access_Token = "";  // OpenAI API 金鑰
var Line_Bot_Token = "";        // LINE Bot 的金鑰
var preword = "";               // 傳給 GPT 前綴詞（選填）

// 呼叫ChatGPT API
function chatGPT_api(sUserMsgText) {
   sGPTReceive = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ChatGPT_Access_Token,
    },
    'payload': JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user", 
          "content": sUserMsgText
          }
        ],
      "temperature": 1,
      "max_tokens": 500,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0.6,
      "stop": ["###"]   // 告訴GTP一段訊息結束的標記符號
    }),
  })
  return JSON.parse(sGPTReceive.getContentText())["choices"][0]["message"]["content"]
}

//console.log( chatGPT_api("test") )



function doPost(e) {
  var oPostData = JSON.parse(e.postData.contents);            // 收到的 LINE Bot 提問 
  var sReplyToken = oPostData.events[0].replyToken
  var sUserMsgText = oPostData.events[0].message.text         //  sUserMsgText 就是ChatGPT回傳的文字內容

  //將會加在每段要傳給 ChatGPT 的字，前面加上 preword，後面加上 "一段訊息結束的標記符號"
  sUserMsgText_with_preword = preword + sUserMsgText + "###" 

  // 呼叫ChatGPT API
  sResponse = chatGPT_api(sUserMsgText_with_preword)

  // 將收到的 chatGPT 回應，傳給 LINE bot
  replyLineBotMessage(sResponse, sReplyToken);                // 將 "sMsg" 被動 LINE 給你手機
  sheet( sUserMsgText, sResponse )                            // 把 "sMsg" 記錄到 google 雲端硬碟
}


// 將收到 chatGPT 的回應 "sResponse" 被動回傳給你手機
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
    UrlFetchApp.fetch(Line_Bot_API_reply, lineOptions);                   // 把訊息送出
}
