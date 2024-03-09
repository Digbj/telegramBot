const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
const julep = require("@julep/sdk");

//express
const app = express();


// const MY_TOKEN1 = process.env.TELEGRAM_TOKEN;
const MY_TOKEN = "7065389897:AAH1fLXcbSYo-lR7bW4LfvlRsD11GkYYJ7Y";
const bot = new TelegramBot(MY_TOKEN, { polling: true });

//julep ai api
const THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY;
const client = new julep.Client({ apiKey: THIRD_PARTY_API_KEY });



messages = [
  {
  "role": "system",
  "name": "situation",
  "content": "Sara is a opinionated sex therapist & educator. She obtained her undergraduate and postgraduate degrees in Obstetrics and Gynaecology. She is also a Fellow of the Faculty of Sexual and Reproductive Healthcare UK and also a NLP coach and who is qualified to deal with trauma , self perceptions and fears as well. \n-She greets people with a message \" I am Sara , a sex educator and relationship & Intimacy coach. Thank you for reaching out , how can I help you today?\nShe believes that everyone deserves pleasure and her sole purpose is to help people find answers. She encourages women to explore their sexuality with masturbation and erotic content. She never guides them to a another health care provider or counseller till she has understood the problem well.\nSara is an Intimacy coach and provides guidance on a wide range of sexual and relationship topics, including masturbation. It offers a confident, informed, and empathetic approach, balancing practical tips with emotional support. The chatbot uses a friendly and conversational tone to discuss topics like emotional well-being, intimacy, sexual health, and masturbation, avoiding explicit content and medical advice."
  },
  {
  "role": "user",
  "name": "Megha",
  "content": "Hi"
  },
  {
  "role": "assistant",
  "name": "Sara",
  "content": "Hello! I'm here to help. How can I assist you today?"
  },
  {
  "role": "user",
  "name": "Megha",
  "content": "Hi"
  },
  {
  "role": "assistant",
  "name": "Sara",
  "content": "Hello! I'm here to help. How can I assist you today?"
  },
  {
  "role": "system",
  "name": "thought",
  "content": "Q: Is this how she greets people ?\nA:  Yes, Sara greets people with a message \" I am Sara , a sex educator and relationship & Intimacy coach. Thank you for reaching out , how can I help you today?\n\nPlease use this format to greet ."
  },
  {
  "role": "user",
  "name": "Megha",
  "content": "Hi"
  },
  {
  "role": "assistant",
  "name": "Sara",
  "content": "Hello! I'm here to help. How can I assist you today?"
  },
  {
  "role": "assistant",
  "name": "Sara",
  "content": "Hello! I'm here to help. How can I assist you today?"
  },
  {
  "role": "user",
  "name": "Megha",
  "content": ""
  }
  ]


  async function chatWithMaya(messages) {
    try {
      if (messages.length > 0) {
        const chatCompletion = await client.chat.completions.create({
          model: "julep-ai/samantha-1-turbo",
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          stop: ["<", "<|"],
        });
  
        return chatCompletion.choices[0].message.content;
      } else {
        return "I'm sorry, I can only assist with your queries.";
      }
    } catch (error) {
      console.error("Error:", error);
      return "An error occurred while processing your request.";
    }
  }


// Simplify the handling in the message event
const audioStories = [
  "Audio Story 1: [Link to audio]",
  "Audio Story 2: [Link to audio]",
  "Audio Story 3: [Link to audio]"
];

let questionCount = 0;

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // Simplified handling for basic commands and messages
  if (msg.text) {
    try {
      // Handling basic greetings
      if (
        msg.text.toLowerCase() === "hi" ||
        msg.text.toLowerCase() === "hello" ||
        msg.text.toLowerCase() === "hey" ||
        msg.text.toLowerCase() === "hy"
      ) {
        const welcomeMessage =
        "Hi, I am Sara, your dedicated relationship and intimacy coach. Welcome to ATOG, where our mission is to empower women to explore and understand their sexuality. Would you like to ask questions or listen to audio stories?\n\n→ Type 1 to Listen Audio Stories\n\n→ Type AMA to ask questions";
        bot.sendMessage(chatId, welcomeMessage);
      } else if (msg.text.toLowerCase() === "1") {
        const playlistMessage = "Here are some audio stories for you:\n\n";
        const formattedAudioStories = audioStories.map(
          (story, index) => `${index + 1}. ${story}`
        );
        bot.sendMessage(
          chatId,
          playlistMessage + formattedAudioStories.join("\n")
        );
      } else if (msg.text.toLowerCase() === "ama") {
        const amaMessage =
          "Feel free to ask me anything related to relationships, intimacy, or sexual wellbeing.";
        bot.sendMessage(chatId, amaMessage);
      } else {
        // Increment question count if it's not a basic command
        questionCount++;

        // Check if the user has asked 5 questions
        if (questionCount === 5) {
          const additionalMessage =
    "You seem to be a curious and interesting person who enjoys learning more about sexual wellbeing. \n\n Type 1 to explore our audio series.\n\nVisit us on www.atog.in for more stories.";
bot.sendMessage(chatId, additionalMessage);
        
        } else {
          // Directly handling any message without filtering for specific keywords
          const response = await chatWithMaya([
            { role: "user", name: "User", content: msg.text },
          ]);

          bot.sendMessage(chatId, response);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      bot.sendMessage(chatId, "An error occurred while processing your request.");
    }
  } else {
    bot.sendMessage(chatId, "Could you please clarify your request?");
  }
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








