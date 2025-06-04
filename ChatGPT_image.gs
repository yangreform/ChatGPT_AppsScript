
var ChatGPT_Access_Token = "";  // OpenAI API 金鑰
var UUID = "";
var Line_Bot_Token = "";   // LINE Bot 的金鑰
var preword = ""                           // 傳給 GPT 前綴詞（選填）         


// 呼叫ChatGPT API
function chatGPT_api(sUserMsgText) {
   sGPTReceive = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ChatGPT_Access_Token,
    },
    'payload': JSON.stringify({
      //"model": "gpt-3.5-turbo",
      "model": "gpt-4.1-nano-2025-04-14",
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

function chatGPT_api_with_image(messagesArray, sReplyToken) {
  //replyLineBotMessage("處理圖片中...", sReplyToken);
  
  var response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ChatGPT_Access_Token,
    },
    'payload': JSON.stringify({
      "model": "gpt-4.1-nano-2025-04-14",  // 使用支援圖片的模型
      "messages": messagesArray,
      "max_tokens": 500
    }),
  });

  var content = JSON.parse(response.getContentText())["choices"][0]["message"]["content"];
  
  // 假設你從 GPT 回傳的內容中找到了類似 image:https://... 這樣的連結
  var imageMatch = content.match(/image:\s*(https?:\/\/\S+)/i);
  if (imageMatch) {
    var imageUrl = imageMatch[1];
    return {
      "type": "image",
      "originalContentUrl": imageUrl,
      "previewImageUrl": imageUrl
    };
  }

  // fallback text
  return {
    "type": "text",
    "text": content
  };
}

// 將 LINE 的圖片轉換為 base64
function getImageAsBase64(messageId) {
  var url = "https://api-data.line.me/v2/bot/message/" + messageId + "/content";
  var response = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + Line_Bot_Token
    }
  });
  
  var imageBlob = response.getBlob();
  return Utilities.base64Encode(imageBlob.getBytes());
}

function doPost(e) {
  var oPostData = JSON.parse(e.postData.contents);
  var sReplyToken = oPostData.events[0].replyToken;
  
  if (oPostData.events[0].message.type === "image") {
    var messageId = oPostData.events[0].message.id;
    
    // 將圖片轉換為 base64
    var image_base64 = getImageAsBase64(messageId);
    
    var image_prompt = {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "這是一張圖片，請分析內容" + "###"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64," + image_base64
          }
        }
      ]
    };
    
    sResponse = chatGPT_api_with_image([image_prompt], sReplyToken);
  } else {
    var sUserMsgText = oPostData.events[0].message.text;
    sUserMsgText_with_preword = preword + sUserMsgText + "###";
    sResponse = chatGPT_api(sUserMsgText_with_preword);
  }

  // 將收到的 chatGPT 回應，傳給 LINE bot
  if (typeof sResponse === 'object') {
    replyLineBotMessageWithImage(sResponse, sReplyToken);
  } else {
    replyLineBotMessage(sResponse, sReplyToken);
  }
  
  if (typeof sResponse === 'string') {
    sheet(sUserMsgText, sResponse);
  }
}

// 將收到 chatGPT 的回應 "sResponse" 被動回傳給你手機
function replyLineBotMessage(sResponse, sReplyToken) {
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
  UrlFetchApp.fetch(Line_Bot_API_reply, lineOptions);
}

// 新增一個函數來處理圖片回應
function replyLineBotMessageWithImage(sResponse, sReplyToken) {
  var linePayload = {
    'replyToken': sReplyToken,
    'messages': [sResponse]
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
  UrlFetchApp.fetch(Line_Bot_API_reply, lineOptions);
} 
