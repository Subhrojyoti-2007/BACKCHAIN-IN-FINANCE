import React, { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

/*
  FINNY - BLOCKCHAIN-IN-FINANCE HELP CHATBOT

  This chatbot:
  ✓ Answers questions about the application (KYC, Audit Logs, Logins, etc.)
  ✓ Replaces floating button with animated robot face SVG
  ✓ Adheres to Glassmorphism layout & theme colors
  ✓ Strictly filters out and declines personal/private questions
  ✓ Never prompts the user for personal information
*/

const QUICK_ACTIONS = [
  ["KYC & AML", "kyc"],
  ["Audit Logs", "audit"],
  ["Blockchain", "blockchain"],
  ["DeFi & Staking", "defi"],
  ["Risks & Rules", "rules"],
  ["Payments", "payment"],
];

function getQuickQuestion(topic) {
  const questions = {
    kyc: "Explain KYC and AML compliance process.",
    audit: "How do audit logs and compliance work?",
    blockchain: "Explain blockchain basics and smart contracts.",
    defi: "What is DeFi and how does staking work?",
    rules: "What are the financial risks and regulations?",
    payment: "How does payments and banking work on-chain?",
  };

  return questions[topic] || "What can you help me with?";
}


/* =========================================================
   BOT RESPONSE SYSTEM
   ========================================================= */

function getBotReply(message) {
  const q = message.toLowerCase().trim();

  if (!q) {
    return "Please type a question or choose one of the help options.";
  }

  /* ---------- PERSONAL & PRIVATE QUESTIONS GUARD (MANDATORY) ---------- */
  const personalRegex = /\b(my name|who am i|my password|my address|my phone|my email|my private key|where do i live|are you human|your age|your creator|who made you|your gender|where are you from|personal|private)\b/i;
  if (personalRegex.test(q)) {
    return (
      "I am Finny, your secure virtual assistant. To protect your privacy and security, " +
      "I cannot ask for, discuss, or answer questions containing personal or private information " +
      "(such as real names, passwords, contact details, or locations).\n\n" +
      "I am here to help you understand platform features like KYC, audit logs, and authentication processes. " +
      "Please make sure not to share any sensitive credentials!"
    );
  }

  /* ---------- BLOCKCHAIN BASICS ---------- */
  if (
    /\b(blockchain basics|what is blockchain|how blockchain works|decentralized ledger|dlt|genesis block|peer-to-peer|consensus mechanism|proof of work|proof of stake)\b/.test(q)
  ) {
    return (
      "Blockchain Basics:\n\n" +
      "A blockchain is a decentralized, distributed ledger that securely records transactions across a peer-to-peer network. Key concepts include:\n\n" +
      "• Blocks & Hashes: Transactions are bundled into blocks. Each block has a cryptographic hash (digital fingerprint) and the hash of the previous block, chaining them together immutably.\n" +
      "• Consensus Mechanisms: Networks use algorithms like Proof of Stake (PoS) or Proof of Work (PoW) to validate entries without needing central authority trust.\n" +
      "• Distributed Ledger Technology (DLT): Data is replicated across multiple nodes worldwide, preventing a single point of failure."
    );
  }

  /* ---------- BLOCKCHAIN IN FINANCE ---------- */
  if (
    /\b(blockchain in finance|financial blockchain|institutional defi|tokenization|tokenized assets|fractional ownership)\b/.test(q)
  ) {
    return (
      "Blockchain in Financial Systems:\n\n" +
      "Applying blockchain to modern finance introduces radical efficiencies:\n\n" +
      "• Asset Tokenization: Converting physical or traditional assets (e.g., real estate, equities, bonds) into digital tokens on a ledger.\n" +
      "• Instant Settlement: Bypassing traditional clearing houses (like T+2 settlement windows) for sub-second, atomic settlement of transfers.\n" +
      "• Fractional Ownership: Lowering entry barriers by allowing investors to buy fractions of high-value tokenized securities (e.g., ERC-3643 assets)."
    );
  }

  /* ---------- CRYPTOCURRENCY & DIGITAL ASSETS ---------- */
  if (
    /\b(cryptocurrency|crypto|token|tokens|stablecoin|stablecoins|digital asset|digital assets|eth|btc|sol|bitcoin|ethereum|utility token|security token)\b/.test(q)
  ) {
    return (
      "Cryptocurrency & Digital Assets:\n\n" +
      "Digital assets represent value stored cryptographically on-chain:\n\n" +
      "• Cryptocurrencies: Native network tokens like Bitcoin (BTC) or Ethereum (ETH) used to store value or pay transaction gas fees.\n" +
      "• Stablecoins: Digital assets pegged to a fiat currency (e.g., USDC, USDT) to minimize market volatility.\n" +
      "• Digital Securities: Tokens representing equity or yield rights, bound by automated compliance standards (like ERC-3643 used on our platform)."
    );
  }

  /* ---------- SMART CONTRACTS ---------- */
  if (
    /\b(smart contract|smart contracts|self-executing code|solidity|evm|compilation|deployment)\b/.test(q)
  ) {
    return (
      "Smart Contracts:\n\n" +
      "Smart contracts are self-executing software programs deployed directly on a blockchain. They automatically perform actions when predefined conditions are met:\n\n" +
      "• Automation: Enforces terms immediately without intermediaries (e.g., automatically whitelisting user accounts or processing bank reserves checks).\n" +
      "• Code is Law: Once compiled and written to the ledger, the execution rules are tamper-proof and public.\n" +
      "• Compliance Control: They act as automated compliance gatekeepers (such as enforcing KYC status before whitelisting a transaction)."
    );
  }

  /* ---------- DECENTRALIZED FINANCE (DEFI) & STAKING ---------- */
  if (
    /\b(decentralized finance|defi|staking|stake|yield|liquidity pool|liquidity pools|amm|yield farming|impermanent loss)\b/.test(q)
  ) {
    return (
      "Decentralized Finance (DeFi) & Staking:\n\n" +
      "DeFi rebuilds traditional financial instruments on top of public smart contracts:\n\n" +
      "• DeFi Ecosystem: Peer-to-peer trading, lending, and borrowing without intermediary banks or brokers.\n" +
      "• Staking: Locking up digital assets to support a blockchain network's operations. In return, stakers receive rewards or yields on their locked assets.\n" +
      "• Liquidity Pools & AMMs: Automated Market Makers allow users to trade assets using algorithm-priced smart contract pools rather than traditional order books."
    );
  }

  /* ---------- BANKING, PAYMENTS & TRANSACTIONS ---------- */
  if (
    /\b(banking|payment|payments|transfer|transfers|transaction|transactions|send money|receive money|remittance|remittances|tx|gas fee|mints)\b/.test(q)
  ) {
    return (
      "Banking, Payments & Transactions:\n\n" +
      "• Remittances: Blockchain payments allow instant, global, 24/7 cross-border transfers bypassing clearing houses.\n" +
      "• Gas Fees: Transactions require small network fees (gas) paid to validators to incentivize ledger maintenance.\n" +
      "• On-Chain Transactions: Signed securely by a user's private key, transactions represent state changes written into blocks on the block explorer."
    );
  }

  /* ---------- SECURITY & CRYPTOGRAPHY ---------- */
  if (
    /\b(security|secure|mfa|2fa|authentication|threat|protection|biometric|passkey|passkeys|mpc|cryptography|hash|private key|public key|multi-party computation|encryption)\b/.test(q)
  ) {
    return (
      "Platform Security & Cryptography:\n\n" +
      "DeFi security is built on deep cryptographic standards:\n\n" +
      "• Asymmetric Cryptography: Public keys act as wallet addresses, while private keys provide the signature to authorize transactions.\n" +
      "• Multi-Party Computation (MPC): Splitting private keys into multiple shards distributed across nodes so that no single node holds the complete key, mitigating exploit risks.\n" +
      "• Biometrics & MFA: Adding hardware key authenticators and passkeys (managed in Settings) to secure ledger entry."
    );
  }

  /* ---------- KYC & AML COMPLIANCE ---------- */
  if (
    /\b(kyc|aadhaar|verification|verify|verified|whitelist|identity|aml|anti-money laundering|anti money laundering|compliance|terrorist financing|fatf|blacklist|travel rule)\b/.test(q)
  ) {
    return (
      "KYC & AML Compliance:\n\n" +
      "Regulatory compliance is automated through smart contract filters:\n\n" +
      "• KYC (Know Your Customer): Process verifying a user's identity (such as our 12-digit Aadhaar input and OTP validation) before they can trade.\n" +
      "• AML (Anti-Money Laundering): Rules designed to prevent illegal money movement. The system checks whitelist statuses, tracks large transactions, and restricts non-compliant or blacklisted wallets.\n" +
      "• ERC-3643 Protocol: Exposes an on-chain identity registry to verify token ownership compliance automatically."
    );
  }

  /* ---------- AUDIT LOGS ---------- */
  if (
    /\b(audit|log|logs|trail|history|event|events|record|records)\b/.test(q)
  ) {
    return (
      "Audit Logs & Traceability:\n\n" +
      "To ensure total transparency, all platform actions are logged in real-time:\n\n" +
      "• Event Capture: Logins, KYC attempts, transfer transactions, and settings updates are recorded.\n" +
      "• Traceability Data: Captures the unique Log ID, timestamp, actor, action details, IP address, and SUCCESS/FAILED status.\n" +
      "• Administrative Access: Audit logs page displays warnings for failed log-ins or rate limits, giving admins clean tools to verify security and generate reports."
    );
  }

  /* ---------- RISKS & REGULATIONS ---------- */
  if (
    /\b(risk|risks|regulation|regulations|sec|fatf|compliance laws|volatility|vulnerabilities|smart contract bug|regulatory|hack|hacks|losses)\b/.test(q)
  ) {
    return (
      "Risks & Regulations:\n\n" +
      "• Market Risks: Digital assets are subject to high price volatility and liquidity risks.\n" +
      "• Technical Risks: Smart contract bugs or vulnerabilities can lead to exploits and financial loss. Rigorous security audits are crucial.\n" +
      "• Regulatory Environment: Evolving guidelines (SEC, FATF Travel Rule, MiCA) require systems to implement rigid compliance controls like ERC-3643 identities to remain legally solvent."
    );
  }

  /* ---------- LOGIN & REGISTER ---------- */
  if (
    /\b(login|logout|sign in|signin|register|registration|sign up|signup|account|credentials|username|password)\b/.test(q)
  ) {
    return (
      "Account & Authentication:\n\n" +
      "• Login: Secure login requires your username and password. On successful authentication, the server generates a JWT access token, starting a secure session.\n" +
      "• Registration: Creating an account automatically registers you on the platform and provisions a mock Web3 wallet address (e.g., 0x82AF...).\n" +
      "• Logout: Logging out terminates the session and securely removes the local JWT token.\n\n" +
      "Remember: Never share your username or password. I will never ask for your credentials."
    );
  }

  /* ---------- OTHER SECTIONS ---------- */
  if (
    /\b(dashboard|explorer|payments|analytics|settings|terminal|admin|proof of reserves|reserves|solvency|treasury)\b/.test(q)
  ) {
    return (
      "Application Features:\n\n" +
      "• Dashboard: Real-time assets tracker, wallet details, and transaction interface.\n" +
      "• Explorer: Cryptographic block examiner tracking transaction history and hashes.\n" +
      "• Analytics: Statistical tools charting volume, liquidity, and asset distribution.\n" +
      "• Admin Terminal: Access restricted panel featuring live Proof of Reserves solvency validation comparing liabilities to the Treasury."
    );
  }

  /* ---------- GREETING ---------- */
  if (
    /\b(hello|hi|hey|help|finny|bot|assistant)\b/.test(q)
  ) {
    return (
      "Hello! 👋\n\n" +
      "I'm Finny, your Blockchain-in-Finance Assistant.\n\n" +
      "I can explain how blockchain works, smart contracts, DeFi and staking, KYC & AML regulations, risks, banking and payments, and how audit logs operate.\n\n" +
      "How can I help you today?"
    );
  }

  /* ---------- DEFAULT ---------- */
  return (
    "I can help you navigate and understand the Blockchain-in-Finance application.\n\n" +
    "Try asking me about:\n" +
    "• Blockchain Basics & Smart Contracts\n" +
    "• DeFi & Staking yields\n" +
    "• KYC & AML compliance process\n" +
    "• Audit Logs & Transactions tracking\n" +
    "• Financial Risks & Regulations (SEC, FATF)"
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
        "Hi! 👋 I'm Finny, your Blockchain-in-Finance Help Assistant.\n\n" +
        "Ask me about KYC, audit logs, login processes, or other platform features!",
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
      {/* FLOATING ROBOT LOGO */}

      {!isOpen && (
        <button
          className="bf-chat-fab-robot"
          onClick={() => setIsOpen(true)}
          aria-label="Open help chatbot"
          title="Chat with Finny"
        >
          <div className="bf-robot-container">
            <svg
              className="bf-robot-face-svg"
              width="60"
              height="60"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Antenna */}
              <rect x="30" y="4" width="4" height="10" rx="2" fill="var(--primary, #adc6ff)" />
              <circle className="bf-robot-antenna-tip" cx="32" cy="4" r="4" fill="var(--tertiary, #4cd7f6)" />
              
              {/* Ears */}
              <rect x="4" y="24" width="6" height="16" rx="3" fill="var(--outline-variant, #424754)" />
              <rect x="54" y="24" width="6" height="16" rx="3" fill="var(--outline-variant, #424754)" />
              
              {/* Head Shell */}
              <rect
                className="bf-robot-head-shell"
                x="10"
                y="14"
                width="44"
                height="38"
                rx="12"
                fill="#111827"
                stroke="var(--primary, #adc6ff)"
                strokeWidth="2"
              />
              
              {/* Screen/Faceplate */}
              <rect
                x="15"
                y="20"
                width="34"
                height="24"
                rx="8"
                fill="#050816"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />
              
              {/* Eyes */}
              <circle className="bf-robot-eye bf-robot-eye-left" cx="24" cy="30" r="3.5" fill="var(--tertiary, #4cd7f6)" />
              <circle className="bf-robot-eye bf-robot-eye-right" cx="40" cy="30" r="3.5" fill="var(--tertiary, #4cd7f6)" />
              
              {/* Mouth */}
              <path
                className="bf-robot-mouth"
                d="M26 38 C 28 40, 34 40, 36 38"
                stroke="var(--tertiary, #4cd7f6)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="bf-robot-tooltip">Chat with Finny!</div>
          </div>
        </button>
      )}


      {/* CHAT PANEL */}

      {isOpen && (
        <section
          className="bf-chatbot"
          aria-label="Finny Help Assistant"
        >

          {/* HEADER */}

          <header className="bf-chat-header">

            <div className="bf-chat-brand">

              <div className="bf-chat-avatar-robot">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="30" y="4" width="4" height="10" rx="2" fill="var(--primary, #adc6ff)" />
                  <circle cx="32" cy="4" r="4" fill="var(--tertiary, #4cd7f6)" />
                  <rect x="4" y="24" width="6" height="16" rx="3" fill="var(--outline-variant, #424754)" />
                  <rect x="54" y="24" width="6" height="16" rx="3" fill="var(--outline-variant, #424754)" />
                  <rect
                    x="10"
                    y="14"
                    width="44"
                    height="38"
                    rx="12"
                    fill="#111827"
                    stroke="var(--primary, #adc6ff)"
                    strokeWidth="2"
                  />
                  <rect
                    x="15"
                    y="20"
                    width="34"
                    height="24"
                    rx="8"
                    fill="#050816"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1.5"
                  />
                  <circle cx="24" cy="30" r="3.5" fill="var(--tertiary, #4cd7f6)" />
                  <circle cx="40" cy="30" r="3.5" fill="var(--tertiary, #4cd7f6)" />
                  <path
                    d="M26 38 C 28 40, 34 40, 36 38"
                    stroke="var(--tertiary, #4cd7f6)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <strong className="bf-chat-title-finny">
                  Finny
                </strong>

                <span className="bf-chat-subtitle-finny">
                  DeFi Compliance Guard
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
                Choose a topic below or ask Finny any question.
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
                placeholder="Ask Finny about this application..."
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


            <small className="bf-disclaimer-finny">
              Finny Security Guard • KYC & Compliance Help • No Personal Data Collected
            </small>

          </div>

        </section>
      )}
    </>
  );
}