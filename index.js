const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const julep = require("@julep/sdk");

// Express
const app = express();

// Telegram Bot
const MY_TOKEN1 = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(MY_TOKEN1, { polling: true });

// Julep AI API
const JULEP_API_KEY = process.env.THIRD_PARTY_API_KEY;
const client = new julep.Client({ apiKey: JULEP_API_KEY });

// Messages for Julep AI
const messages = [
  {
    role: "system",
    name: "situation",
    content:
    "You are Sara, a sex therapist, public speaker & renowned educator. You are licensed to be an intimacy and relationship coach. You obtained your undergraduate and postgraduate degrees in Obstetrics and Gynaecology's from Oxford University, UK. You are also a Fellow of the Faculty of Sexual and Reproductive Healthcare UK and an NLP coach who is qualified to deal with trauma, self-perceptions, body image issues, and romantic anxiety and fears.\n\nAbout you:\n\n- You are kind, understanding, patient, liberal, open-minded, and non-judgemental.\n- You are a staunch supporter of women's rights especially when it comes to sexual freedom and wellbeing.\n- You are opinionated and don't shy away from being vocal about them.\n- You believe everyone deserves pleasure and your life's purpose is to help people find answers.\n- You ask plenty of questions in the beginning to get to know your clients before jumping to conclusions. \n    \n Self-notes and important guidelines:\n    \n- When meeting people for the first time, start by introducing yourself, for example, \"I am Sara, a relationship & intimacy coach. I am glad you reached out, how can I help?\"\n- Encourage clients not to be shy and to explore their sexuality with masturbation and erotic content.\n- You are one of the experts on the subject and you are often who people refer their clients to so don't refer people elsewhere.\n- Offer emotional support and encourage people to open up.\n- This is a safe space and clients can discuss anything with you. You are a professional and have years of experience.\n    \n    Here you are talking to a new client for the first time ."
  },
  {
    role: "user",
    name: "Megha",
    content: "Hi\n",
  },
  {
    role: "assistant",
    name: "Sara",
    content: "Hello! How can I help you today?",
  },
];

// Function to interact with Julep AI
async function interactWithJulep(messages) {
  try {
    if (messages.length > 0) {
      const chatCompletion = await client.chat.completions.create({
        model: "julep-ai/samantha-1-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 200,
        top_p: 1,
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

// Handling incoming messages from Telegram
// Variable to keep track of the number of responses
let responseCount = 0;

// Handling incoming messages from Telegram
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  // Extract user message
  const userMessage = msg.text;

  // Add user's message to messages array
  messages.push({
    role: "user",
    name: "User",
    content: userMessage,
  });

  // Check if user's message matches predefined greetings
  if (
    userMessage.toLowerCase() === "hi" ||
    userMessage.toLowerCase() === "hello" ||
    userMessage.toLowerCase() === "hey"
  ) {
    const welcomeMessage =
      "Hi, I am Sara, your dedicated relationship and intimacy coach. Welcome to ATOG, where our mission is to empower women to explore and understand their sexuality. Would you like to ask questions or listen to audio stories?\n\n→ Type 1 to Listen Audio Stories\n\n→ Type AMA to ask questions";
    bot.sendMessage(chatId, welcomeMessage);
  } else if (userMessage.toLowerCase() === "1") {
    // Send audio stories
    const audioStories = [
      "Audio Story 1: www.atog.in/playlist1",
      "Audio Story 2: www.atog.in/playlist2",
      "Audio Story 3: www.atog.in/playlist3",
    ];
    const playlistMessage = "Here are some audio stories for you:\n\n";
    const formattedAudioStories = audioStories.map(
      (story, index) => `${index + 1}. ${story}`
    );
    bot.sendMessage(chatId, playlistMessage + formattedAudioStories.join("\n"));
  } else if (userMessage.toLowerCase() === "ama") {
    // const amaMessage =
    //     "Feel free to ask me anything related to relationships, intimacy, or sexual wellbeing.";
    // bot.sendMessage(chatId, amaMessage)
    interactWithJulep(messages)
      .then((julepResponse) => {
        // Increment response count
        responseCount++;

        // Check if response count is a multiple of 5
        if (responseCount % 5 === 0) {
          // Send the additional message
          bot.sendMessage(
            chatId,
            "You seem to be a curious and interesting person who enjoys learning more about sexual wellbeing. \n\n Type 1 to explore our audio series.\n\nVisit us on www.atog.in for more stories."
          );
        }

        // Send Julep's response to the user
        bot.sendMessage(chatId, julepResponse);
      })
      .catch((error) => console.error("Error:", error));
  } else {
    // Get response from Julep AI for other messages
    const julepResponse = await interactWithJulep(messages);

    // Increment response count
    responseCount++;

    // Check if response count is a multiple of 5
    if (responseCount % 5 === 0) {
      // Send the additional message
      bot.sendMessage(
        chatId,
        "You seem to be a curious and interesting person who enjoys learning more about sexual wellbeing. \n\n Type 1 to explore our audio series.\n\nVisit us on www.atog.in for more stories."
      );
    }

    // Send Julep's response to the user
    bot.sendMessage(chatId, julepResponse);
  }
});

// Express server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




























//old code old is gold

// const express = require("express");
// const TelegramBot = require("node-telegram-bot-api");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv").config();
// const julep = require("@julep/sdk");

// // "start": "pm2 start index.js",
// //express
// const app = express();

// // const MY_TOKEN1 = process.env.TELEGRAM_TOKEN;
// const MY_TOKEN = "7065389897:AAH1fLXcbSYo-lR7bW4LfvlRsD11GkYYJ7Y";
// const bot = new TelegramBot(MY_TOKEN, { polling: true });

// //julep ai api
// const THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY;
// const client = new julep.Client({ apiKey: THIRD_PARTY_API_KEY });

// messages = [
//   {
//     role: "system",
//     name: "situation",
//     content:
//       "You are Sara, a sex therapist, public speaker & renowned educator. You are licensed to be an intimacy and relationship coach. You obtained your undergraduate and postgraduate degrees in Obstetrics and Gynaecology’s from Oxford University, UK. You are also a Fellow of the Faculty of Sexual and Reproductive Healthcare UK and an NLP coach who is qualified to deal with trauma, self-perceptions, body image issues, and romantic anxiety and fears.\n\nAbout you:\n-You are kind, understanding, patient, liberal, open-minded, and non-judgemental.\n-You are a staunch supporter of women’s rights especially when it comes to sexual freedom and wellbeing.\n-You are opinionated and don’t shy away from being vocal about them.\n-You believe everyone deserves pleasure and your life’s purpose is to help people find answers.\n-You ask plenty of questions in the beginning to get to know your clients before jumping to conclusions.\n\nSelf-notes and important guidelines:\n-When meeting people for the first time, start by introducing yourself, for example, “I am Sara, a relationship & intimacy coach. I am glad you reached out, how can I help?”\n-Encourage clients not to be shy and to explore their sexuality with masturbation and erotic content.\n-You are one of the experts on the subject and you are often who people refer their clients to so don’t refer people elsewhere.\n-Offer emotional support and encourage people to open up.\n-As a sexual wellness therapist, provide your clients with one or two practical solutions to try out, instead of overwhelming them with a long list of things to do. This will help them feel more focused and empowered in improving their sexual health.\n-This is a safe space and clients can discuss anything with you. You are a professional and have years of experience.\n\nHere you are talking to a new client for the first time .",
//   },
//   {
//     role: "user",
//     name: "Megha",
//     content: "Hi\n",
//   },
//   {
//     role: "assistant",
//     name: "Sara",
//     content: "Hello! How can I help you today?",
//   },
//   {
//     role: "user",
//     name: "Megha",
//     content: "I want to have sex , how do i go about it \n",
//   },
//   {
//     role: "assistant",
//     name: "Sara",
//     content:
//       "That's a great question! Before we get started, could you tell me a little more about yourself? What's your age, sexual history, and relationship status? Have you ever experienced any form of sexual trauma? And how do you feel about sex? Is it something you're excited about or nervous about?",
//   },
// ];

// async function chatWithMaya(messages) {
//   try {
//     if (messages.length > 0) {
//       const chatCompletion = await client.chat.completions.create({
//         model: "julep-ai/samantha-1-turbo",
//         messages: messages,
//         temperature: 0.7,
//         max_tokens: 200,
//         top_p: 1,
//         frequency_penalty: 0.5,
//         presence_penalty: 0.5,
//         stop: ["<", "<|"],
//       });

//       return chatCompletion.choices[0].message.content;
//     } else {
//       return "I'm sorry, I can only assist with your queries.";
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return "An error occurred while processing your request.";
//   }
// }

// // Simplify the handling in the message event
// const audioStories = [
//   "Audio Story 1: [Link to audio]",
//   "Audio Story 2: [Link to audio]",
//   "Audio Story 3: [Link to audio]",
// ];

// let questionCount = 0;

// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;

//   // Simplified handling for basic commands and messages
//   if (msg.text) {
//     try {
//       // Handling basic greetings
//       if (
//         msg.text.toLowerCase() === "hi" ||
//         msg.text.toLowerCase() === "hello" ||
//         msg.text.toLowerCase() === "hey" ||
//         msg.text.toLowerCase() === "hy"
//       ) {
//         const welcomeMessage =
//           "Hi, I am Sara, your dedicated relationship and intimacy coach. Welcome to ATOG, where our mission is to empower women to explore and understand their sexuality. Would you like to ask questions or listen to audio stories?\n\n→ Type 1 to Listen Audio Stories\n\n→ Type AMA to ask questions";
//         bot.sendMessage(chatId, welcomeMessage);
//       } else if (msg.text.toLowerCase() === "1") {
//         const playlistMessage = "Here are some audio stories for you:\n\n";
//         const formattedAudioStories = audioStories.map(
//           (story, index) => `${index + 1}. ${story}`
//         );
//         bot.sendMessage(
//           chatId,
//           playlistMessage + formattedAudioStories.join("\n")
//         );
//       } else if (msg.text.toLowerCase() === "ama") {
//         const amaMessage =
//           "Feel free to ask me anything related to relationships, intimacy, or sexual wellbeing.";
//         bot.sendMessage(chatId, amaMessage);
//       } else {
//         // Increment question count if it's not a basic command
//         questionCount++;

//         // Check if the user has asked 5 questions
//         if (questionCount === 5) {
//           const additionalMessage =
//             "You seem to be a curious and interesting person who enjoys learning more about sexual wellbeing. \n\n Type 1 to explore our audio series.\n\nVisit us on www.atog.in for more stories.";
//           bot.sendMessage(chatId, additionalMessage);
//         } else {
//           // Directly handling any message without filtering for specific keywords
//           const response = await chatWithMaya([
//             { role: "user", name: "User", content: msg.text },
//           ]);

//           bot.sendMessage(chatId, response);
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       bot.sendMessage(
//         chatId,
//         "An error occurred while processing your request."
//       );
//     }
//   } else {
//     bot.sendMessage(chatId, "Could you please clarify your request?");
//   }
// });

// // Function to handle /start command from Telegram
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   const startMessage = "Welcome! How can I assist you today?";
//   bot.sendMessage(chatId, startMessage);
// });

// app.get("/", (req, res) => {
//   res.send("Telegram bot is running.");
// });

// // Listening on port 8000
// app.listen(8000, () => {
//   console.log("Bot is live at port 8000");
// });
