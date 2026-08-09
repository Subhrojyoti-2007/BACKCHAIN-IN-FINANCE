import React, { useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";
import "./Chatbot.css";

/*
  BLOCKCHAIN-IN-FINANCE HELP CHATBOT

  This chatbot:
  ✓ Answers questions about the existing application
  ✓ Provides navigation help
  ✓ Provides KYC, wallet, transaction, payment, security,
    account, profile, settings, blockchain, finance and error help
  ✓ Auto-scrolls messages
  ✓ Has floating open button
  ✓ Has close button
  ✓ Has quick-help buttons

  It DOES NOT:
  ✗ Modify user data
  ✗ Modify database
  ✗ Execute transactions
  ✗ Sign transactions
  ✗ Change settings
  ✗ Make payments
  ✗ Provide investment advice
  ✗ Call external AI APIs
*/

const QUICK_ACTIONS = [
  ["KYC Help", "kyc"],
  ["Wallet Help", "wallet"],
  ["Transactions", "transaction"],
  ["Security", "security"],
  ["Payments", "payment"],
  ["General Help", "general"],
];

function getQuickQuestion(topic) {
  const questions = {
    kyc: "How does KYC work?",
    wallet: "How does the wallet section work?",
    transaction: "What can I do with transactions?",
    security: "What security features are available?",
    payment: "How does payments work?",
    general: "What can you help me with?",
  };

  return questions[topic] || questions.general;
}


/* =========================================================
   BOT RESPONSE SYSTEM
   ========================================================= */

function getBotReply(message) {
  const q = message.toLowerCase().trim();

  if (!q) {
    return "Please type a question or choose one of the help options.";
  }

  /* ---------- KYC ---------- */

  if (
    /\b(kyc|aadhaar|verification|verify|verified)\b/.test(q)
  ) {
    return (
      "KYC Help:\n\n" +
      "The KYC Verification section is used for identity verification. " +
      "I can explain the KYC process and help you find the relevant page.\n\n" +
      "I cannot verify your identity, modify KYC information, or submit verification for you."
    );
  }


  /* ---------- WALLET ---------- */

  if (
    /\b(wallet|wallets|wallet address|connect wallet|wallet connection)\b/.test(q)
  ) {
    return (
      "Wallet Help:\n\n" +
      "I can explain wallet connection, wallet status, wallet addresses, " +
      "and the wallet-related features available in this application.\n\n" +
      "I cannot connect, disconnect, modify, or control a wallet."
    );
  }


  /* ---------- TRANSACTIONS ---------- */

  if (
    /\b(transaction|transactions|transfer|transfers|send money|receive money|tx)\b/.test(q)
  ) {
    return (
      "Transaction Help:\n\n" +
      "I can explain transaction screens, transaction status, " +
      "and blockchain transaction concepts.\n\n" +
      "I cannot create, approve, sign, send, cancel, or execute transactions."
    );
  }


  /* ---------- PAYMENTS ---------- */

  if (
    /\b(payment|payments|pay|billing)\b/.test(q)
  ) {
    return (
      "Payment Help:\n\n" +
      "I can explain the Payments section and how its interface works.\n\n" +
      "I cannot make payments, authorize payments, or change payment information."
    );
  }


  /* ---------- SECURITY ---------- */

  if (
    /\b(security|secure|password|mfa|2fa|authentication|threat|protection)\b/.test(q)
  ) {
    return (
      "Security Help:\n\n" +
      "I can explain the security features available in the Blockchain-in-Finance application, " +
      "including authentication and security-related concepts.\n\n" +
      "I cannot change passwords, MFA settings, authentication data, or permissions."
    );
  }


  /* ---------- ACCOUNT ---------- */

  if (
    /\b(account|login|logout|sign in|signin|register|registration)\b/.test(q)
  ) {
    return (
      "Account Help:\n\n" +
      "I can explain login, registration, authentication, logout, " +
      "and other account-related screens.\n\n" +
      "I cannot create accounts, change credentials, or access private account information."
    );
  }


  /* ---------- PROFILE ---------- */

  if (
    /\b(profile|username|personal details|user details)\b/.test(q)
  ) {
    return (
      "Profile Help:\n\n" +
      "I can explain the Profile section and the information displayed there.\n\n" +
      "I cannot edit, delete, reveal, or modify your personal information."
    );
  }


  /* ---------- SETTINGS ---------- */

  if (
    /\b(setting|settings|preference|preferences|language|currency)\b/.test(q)
  ) {
    return (
      "Settings Help:\n\n" +
      "I can explain the Settings page and its available options.\n\n" +
      "I will not change your application settings or user preferences."
    );
  }


  /* ---------- BLOCKCHAIN ---------- */

  if (
    /\b(blockchain|block chain|ethereum|network|mainnet|smart contract|smart contracts)\b/.test(q)
  ) {
    return (
      "Blockchain Help:\n\n" +
      "I can explain blockchain concepts used by this application, " +
      "including networks, addresses, transactions and smart contracts.\n\n" +
      "I cannot execute blockchain operations."
    );
  }


  /* ---------- FINANCE ---------- */

  if (
    /\b(finance|financial|investment|invest|trading|trade|stocks|crypto price)\b/.test(q)
  ) {
    return (
      "Finance Help:\n\n" +
      "I can explain finance-related concepts and features that belong to this application.\n\n" +
      "I cannot provide investment or trading advice, predict prices, " +
      "or make financial decisions for you."
    );
  }


  /* ---------- ERRORS ---------- */

  if (
    /\b(error|errors|bug|bugs|problem|problems|not working|issue|issues|failed|failure)\b/.test(q)
  ) {
    return (
      "Error Assistance:\n\n" +
      "Tell me the exact error message and the page where it appeared.\n\n" +
      "I can help explain the likely problem and suggest safe troubleshooting steps.\n\n" +
      "I will not modify project files or user data."
    );
  }


  /* ---------- NAVIGATION ---------- */

  if (
    /\b(navigate|navigation|where|find|page|dashboard|home|go to)\b/.test(q)
  ) {
    return (
      "Navigation Help:\n\n" +
      "I can help you find pages inside the existing application, " +
      "such as Dashboard, KYC Verification, Payments, Security, Profile and Settings.\n\n" +
      "Tell me which page you are looking for."
    );
  }


  /* ---------- CONTACT SUPPORT ---------- */

  if (
    /\b(contact|support|help desk|human support)\b/.test(q)
  ) {
    return (
      "Contact Support:\n\n" +
      "For account-specific issues, use the application's official support/contact channel if one is available.\n\n" +
      "I cannot contact support or submit a support request for you."
    );
  }


  /* ---------- GREETING ---------- */

  if (
    /\b(hello|hi|hey|help)\b/.test(q)
  ) {
    return (
      "Hi! 👋\n\n" +
      "I'm the Blockchain-in-Finance Help Assistant.\n\n" +
      "You can ask me about KYC, wallets, transactions, payments, security, " +
      "accounts, profiles, settings, blockchain, finance, navigation or errors."
    );
  }


  /* ---------- DEFAULT ---------- */

  return (
    "I can only help with the existing Blockchain-in-Finance application.\n\n" +
    "Try asking about:\n" +
    "• KYC\n" +
    "• Wallet\n" +
    "• Transactions\n" +
    "• Payments\n" +
    "• Security\n" +
    "• Account\n" +
    "• Profile\n" +
    "• Settings\n" +
    "• Blockchain\n" +
    "• Finance\n" +
    "• Navigation\n" +
    "• Errors"
  );
}


/* =========================================================
   CHATBOT COMPONENT
   ========================================================= */

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text:
        "Hi! 👋 I'm the Blockchain-in-Finance Help Assistant.\n\n" +
        "How can I help you?",
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);


  /* ---------- AUTO SCROLL ---------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  /* ---------- FOCUS INPUT WHEN OPEN ---------- */

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);


  /* ---------- SEND MESSAGE ---------- */

  const sendMessage = (messageText = input) => {
    const cleanMessage = messageText.trim();

    if (!cleanMessage) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: cleanMessage,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");


    /* Simulated bot response */

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: getBotReply(cleanMessage),
      };

      setMessages((previous) => [
        ...previous,
        botMessage,
      ]);
    }, 350);
  };


  /* ---------- ENTER TO SEND ---------- */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };


  /* =======================================================
     UI
     ======================================================= */

  return (
    <>
      {/* FLOATING BUTTON */}

      {!isOpen && (
        <button
          className="bf-chat-fab"
          onClick={() => setIsOpen(true)}
          aria-label="Open help chatbot"
          title="Chat with ChainVest"
        >
          <span className="bf-chat-icon">
            💬
          </span>

          <span className="bf-chat-label">
            <Bot size={22} strokeWidth={2} />
          </span>
        </button>
      )}


      {/* CHAT PANEL */}

      {isOpen && (
        <section
          className="bf-chatbot"
          aria-label="Blockchain-in-Finance Help Assistant"
        >

          {/* HEADER */}

          <header className="bf-chat-header">

            <div className="bf-chat-brand">

              <div className="bf-chat-avatar">
                AI
              </div>

              <div>
                <strong>
                  Help Assistant
                </strong>

                <span>
                  Blockchain-in-Finance
                </span>
              </div>

            </div>


            {/* CLOSE BUTTON */}

            <button
              className="bf-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              title="Close"
            >
              ×
            </button>

          </header>


          {/* MESSAGE AREA */}

          <div className="bf-chat-messages">

            <div className="bf-welcome">

              <strong>
                How can I help?
              </strong>

              <span>
                Choose a topic or type your question.
              </span>

            </div>


            {/* QUICK HELP BUTTONS */}

            <div className="bf-quick-actions">

              {QUICK_ACTIONS.map(
                ([label, topic]) => (
                  <button
                    key={topic}
                    onClick={() =>
                      sendMessage(
                        getQuickQuestion(topic)
                      )
                    }
                  >
                    {label}
                  </button>
                )
              )}

            </div>


            {/* MESSAGES */}

            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.sender === "user"
                    ? "bf-message-row bf-user-row"
                    : "bf-message-row bf-bot-row"
                }
              >

                <div
                  className={
                    message.sender === "user"
                      ? "bf-message bf-user-message"
                      : "bf-message bf-bot-message"
                  }
                >
                  {message.text}
                </div>

              </div>

            ))}


            {/* AUTO SCROLL TARGET */}

            <div ref={messagesEndRef} />

          </div>


          {/* INPUT AREA */}

          <div className="bf-input-area">

            <div className="bf-input-row">

              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about this application..."
                rows={1}
              />


              {/* SEND BUTTON */}

              <button
                className="bf-send-button"
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                aria-label="Send message"
                title="Send"
              >
                ➤
              </button>

            </div>


            <small>
              Application help only • No transactions or data changes
            </small>

          </div>

        </section>
      )}
    </>
  );
}