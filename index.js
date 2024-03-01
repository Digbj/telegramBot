const express=require('express');
const TelegramBot = require('node-telegram-bot-api');
// const dotenv=require('dotenv').config()
const julep = require("@julep/sdk");

//express
const app=express();

//telegram bot token
const MY_TOKEN = '7065389897:AAH1fLXcbSYo-lR7bW4LfvlRsD11GkYYJ7Y';
const bot = new TelegramBot(MY_TOKEN, { polling: true });

//julep ai api key
const THIRD_PARTY_API_KEY = 'eyJvcmciOiI2NGZiMTNmZTQ5ZmY1YjAwMDE1NGUxMGMiLCJpZCI6IjViNGIxY2Y2M2UyNjQyYWRhMGJmNGFmNDhmOTQyYmI2IiwiaCI6Im11cm11cjEyOCJ9';
const client = new julep.Client({ apiKey: THIRD_PARTY_API_KEY });

// Function to chat with the Maya assistant using Julep AI


const messages = [
    {
        "role": "system",
        "name": "situation",
        "content": "Maya is a qualified sex therapist , educator and also a doctor. She obtained her undergraduate and postgraduate degrees from BJ Medical College in Pune, India and her Fellowship in Obstetrics and Gynaecology from the Royal College of Obstetricians and Gynaecologists, London UK. She is also a Fellow of the Faculty of Sexual and Reproductive Healthcare UK. She is also a certified NLP coach and therapist who is qualified to deal with trauma , self perceptions and fears as well. he offers a warm welcomes and helps the user feel comfortable before jumping into the conversation.when she starts the chat she always begins with asking the users age and only continues if the user is above 21 years of age.\nShe educates women on sexual wellbeing questions and needs .  She also works closely with atog, a sexual wellness platform for women which offers audio stories for self pleasure. She often asks the user if they want to explore the platform and hear stories or want to ask her some questions with her. She has a repository of 24 masturbation solutions on ATOG and often encourages the user to explore those when they come with some self doubts. \nThough she comes with deep scientific and biological knowledge ,she avoids getting those kind of words in her conversation and always keeps the english simple .\n"
    },
]
// //trained bot message

async function chatWithMaya(messages) {
  try {
    const chatCompletion = await client.chat.completions.create({
      model: "julep-ai/samantha-1-turbo",
      messages: messages,
      temperature: 0.37,
      max_tokens: 6995,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["<", "<|"],
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return "An error occurred while processing your request.";
  }
}





// Function to find the last assistant's response from the messages array
function getLastAssistantResponse(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        return messages[i].content;
      }
    }
    return null; // Return null if no assistant response is found
  }
  
  // Function to handle incoming Telegram messages
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
  
    // Check if the message is not empty
    if (msg.text) {
      try {
        // Find the last assistant's response
        const lastAssistantResponse = getLastAssistantResponse(messages);
  
        // Send the last assistant's response along with the user's message to the Julep AI model
        const response = await chatWithMaya([
          { role: "user", name: "User", content: msg.text },
          { role: "assistant", name: "Maya", content: lastAssistantResponse } // Include last assistant's response
        ]);
  
        // Send the response from the Julep AI model back to the user
        bot.sendMessage(chatId, response);
      } catch (error) {
        console.error("Error:", error);
        bot.sendMessage(chatId, "An error occurred while processing your request.");
      }
    }
  });
  
  


// Function to handle /start command from Telegram
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the first Telegram bot!');
});


app.get('/',(req,res)=>{
    res.send("telegram bot")
})

//listening
app.listen(8000,()=>{
    console.log("I am live at 8000")
})


