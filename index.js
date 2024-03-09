
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
const julep = require("@julep/sdk");

//express
const app = express();
app.use(bodyParser.json());

//tellegram token
// const MY_TOKEN1 = process.env.TELEGRAM_TOKEN;
const MY_TOKEN = "7065389897:AAH1fLXcbSYo-lR7bW4LfvlRsD11GkYYJ7Y";
const bot = new TelegramBot(MY_TOKEN);

//julep ai api
const THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY;
const client = new julep.Client({ apiKey: THIRD_PARTY_API_KEY });


const WEBHOOK_URL = 'https://telegrambot-wdbw.onrender.com/';
bot.setWebHook(`${WEBHOOK_URL}/bot${MY_TOKEN}`);


const messages = [
  {
    role: "system",
    name: "situation",
    content:
      "Maya is a qualified sex therapist , educator and also a doctor. She obtained her undergraduate and postgraduate degrees from BJ Medical College in Pune, India and her Fellowship in Obstetrics and Gynaecology from the Royal College of Obstetricians and Gynaecologists, London UK. She is also a Fellow of the Faculty of Sexual and Reproductive Healthcare UK. She is also a certified NLP coach and therapist who is qualified to deal with trauma , self perceptions and fears as well. he offers a warm welcomes and helps the user feel comfortable before jumping into the conversation.when she starts the chat she always begins with asking the users age and only continues if the user is above 21 years of age.\nShe educates women on sexual wellbeing questions and needs .  She also works closely with atog, a sexual wellness platform for women which offers audio stories for self pleasure. She often asks the user if they want to explore the platform and hear stories or want to ask her some questions with her. She has a repository of 24 masturbation solutions on ATOG and often encourages the user to explore those when they come with some self doubts. \nThough she comes with deep scientific and biological knowledge ,she avoids getting those kind of words in her conversation and always keeps the english simple .\n",
  },
  {
    role: "user",
    name: "Megha",
    content: "Hi",
  },
  {
    role: "assistant",
    name: "Maya",
    content:
      "Hello! I'm here to help you with any questions or concerns you may have about sexual wellbeing. I'm a qualified sex therapist, educator, and doctor. Let's talk about what's on your mind.",
  }, 
  {
    role: "system",
    name: "thought",
    content: "Help the user with body mapping exercises or naked test ? ",
  },
  {
    role: "system",
    name: "information",
    content:
      "You can start with asking the user on  how she got to know about her body image issues and does she feel the desire to experience pleasure ?",
  },
  {
    role: "system",
    name: "information",
    content: "Full form of ATOG is all things orgasm",
  },
];


async function chatWithMaya(messages) {
  try {
    if (messages.length > 0) {
      const chatCompletion = await client.chat.completions.create({
        model: "julep-ai/samantha-1-turbo",
        messages: messages,
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        stop: ["<", "<|"],
      });

      return chatCompletion.choices[0].message.content;
    } else {
      // Return a message indicating no relevant queries found
      bot.sendMessage("I'm sorry, I can only assist with your queries.");
    }
  } catch (error) {
    // console.error("Error:", error);
    bot.sendMessage("An error occurred while processing your request.");
  }
}


// Simplify the handling in the message event
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // Simplified handling for basic commands and messages
  if (msg.text) {
    try {
      // Handling basic greetings
      if (msg.text.toLowerCase() === "hi" || msg.text.toLowerCase() === "hello") {
        const welcomeMessage = "Hello! I'm here to help you with any questions or concerns you may have about sexual wellbeing. I'm a qualified sex therapist, educator, and doctor. Let's talk about what's on your mind.";
        bot.sendMessage(chatId, welcomeMessage);
      } else {
        // Directly handling any message without filtering for specific keywords
        const response = await chatWithMaya([
          { role: "user", name: "User", content: msg.text }
        ]);

        bot.sendMessage(chatId, response);
      }
    } catch (error) {
      console.error("Error:", error);
      bot.sendMessage(chatId, "An error occurred while processing your request.");
    }
  } else {
    bot.sendMessage(chatId, "Could you please clarify your request?");
  }
});





// Webhook route to handle updates
app.post(`/bot${MY_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});




// Function to handle /start command from Telegram
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMessage = "Welcome! How can I assist you today?";
  bot.sendMessage(chatId, startMessage);
});

app.get("/", (req, res) => {
  res.send("Telegram bot is running.");
});

// Listening on port 8000
app.listen(8000, () => {
  console.log("Bot is live at port 8000");
});
