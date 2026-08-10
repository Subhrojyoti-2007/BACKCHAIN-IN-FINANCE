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
  const personalRegex = /\b(my name|who am i|my password|my address|my phone|my email|my private key|where do i live|are you human|your age|your creator|who made you|your gender|where are you from|personal|private(?! keys?))\b/i;
  if (personalRegex.test(q)) {
    return (
      "I am Finny, your secure virtual assistant. To protect your privacy and security, " +
      "I cannot ask for, discuss, or answer questions containing personal or private information " +
      "(such as real names, passwords, contact details, or locations).\n\n" +
      "I am here to help you understand platform features like KYC, audit logs, and authentication processes. " +
      "Please make sure not to share any sensitive credentials!"
    );
  }

  /* ---------- KYC & AML COMPLIANCE ---------- */
  if (
    /\b(kyc|aadhaar|verification|verify|verified|whitelist|whitelisting|whitelisted|identity|aml|anti-money laundering|anti money laundering|compliance|terrorist financing|fatf|blacklist|travel rule)\b/.test(q)
  ) {
    if (/\b(verify|how|where|steps|process|do)\b/.test(q)) {
      return (
        "How to Verify KYC:\n\n" +
        "To verify your identity on our platform:\n" +
        "1. Go to the KYC Verification page from the sidebar.\n" +
        "2. Enter your 12-digit Aadhaar number.\n" +
        "3. Click 'Send OTP'.\n" +
        "4. Enter the 6-digit OTP received. For local debugging, you can use the debug OTP '123456' or inspect the terminal console where the OTP is logged.\n" +
        "5. Submit the OTP. Your wallet address will be automatically whitelisted in our smart contracts."
      );
    }
    if (/\b(aadhaar|privacy|hash|secure)\b/.test(q)) {
      return (
        "Aadhaar & Privacy Security:\n\n" +
        "Your privacy is our highest priority:\n" +
        "• Security Hashing: Your Aadhaar number is hashed using SHA-256 before processing.\n" +
        "• Third-Party Simulation: We use a secure mock licensed KYC provider session (Setu/Sandbox/Karza simulation).\n" +
        "• Non-Custodial: We do not store raw Aadhaar numbers in our persistent database; only the reference IDs and cryptographic verification hashes are saved."
      );
    }
    if (/\b(aml|laundering|terrorist|blacklist|prevent)\b/.test(q)) {
      return (
        "Anti-Money Laundering (AML) controls:\n\n" +
        "To prevent illegal money movement, our system enforces compliance gates:\n" +
        "• Whitelist Verification: The Transaction Manager smart contract restricts unverified addresses from sending or receiving assets.\n" +
        "• Fraud Monitoring: Outlier amounts and transfer behavior are flagged for risk evaluation in real-time."
      );
    }
    if (/\b(whitelist|whitelisted|whitelisting|registry)\b/.test(q)) {
      return (
        "On-Chain Whitelisting:\n\n" +
        "When KYC verification completes:\n" +
        "• The system calls the IdentityRegistry contract's whitelist_address method.\n" +
        "• Whitelisted wallet addresses are permitted to carry out transactions on-chain.\n" +
        "• This ensures only compliant users participate in institutional DeFi trading."
      );
    }
    if (/\b(fatf|travel rule|laws|rules)\b/.test(q)) {
      return (
        "FATF & Travel Rule Compliance:\n\n" +
        "Under FATF (Financial Action Task Force) recommendations, blockchain transfers must share sender and receiver identities (the Travel Rule).\n" +
        "• Our platform enforces this by validating the KYC status of both parties involved in a transfer using on-chain registries before whitelisting a transaction."
      );
    }
    return (
      "KYC & AML Compliance:\n\n" +
      "Regulatory compliance is automated through smart contract filters:\n\n" +
      "• KYC (Know Your Customer): Process verifying a user's identity (such as our 12-digit Aadhaar input and OTP validation) before they can trade.\n" +
      "• AML (Anti-Money Laundering): Rules designed to prevent illegal money movement. The system checks whitelist statuses, tracks large transactions, and restricts non-compliant or blacklisted wallets.\n" +
      "• ERC-3643 Protocol: Exposes an on-chain identity registry to verify token ownership compliance automatically."
    );
  }

  /* ---------- BLOCKCHAIN BASICS ---------- */
  if (
    /\b(blockchain basics|what is blockchain|how blockchain works|decentralized ledger|dlt|genesis block|peer-to-peer|consensus mechanism|proof of work|proof of stake)\b/.test(q)
  ) {
    if (/\b(genesis)\b/.test(q)) {
      return (
        "Genesis Block:\n\n" +
        "The Genesis Block is the first block (index 0) of a blockchain. It is hardcoded into the network software and forms the foundational point of the chain. Every block created thereafter contains a cryptographic reference back to the preceding block, eventually tracing back to the Genesis Block."
      );
    }
    if (/\b(consensus|proof of|pow|pos|work|stake)\b/.test(q)) {
      return (
        "Consensus Mechanisms:\n\n" +
        "Since blockchains are decentralized, they use consensus mechanisms to agree on transaction history:\n" +
        "• Proof of Work (PoW): Validators (miners) solve complex mathematical puzzles using computational energy to secure blocks (e.g., Bitcoin).\n" +
        "• Proof of Stake (PoS): Validators lock up (stake) native tokens to win validation rights, saving energy and improving speed (e.g., Ethereum)."
      );
    }
    if (/\b(decentralized ledger|dlt|ledger)\b/.test(q)) {
      return (
        "Distributed Ledger Technology (DLT):\n\n" +
        "DLT is a decentralized database that is replicated, shared, and synchronized across multiple geographical nodes globally. A blockchain is a special type of DLT where data is structured into cryptographic blocks linked chronologically."
      );
    }
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
    if (/\b(tokenization|tokenized)\b/.test(q)) {
      return (
        "Asset Tokenization:\n\n" +
        "Asset tokenization is the process of representing ownership rights of real-world assets (like real estate, corporate bonds, or equities) as digital tokens on a blockchain. This allows 24/7 liquidity, instant settlement, and reduced intermediary costs."
      );
    }
    if (/\b(fractional)\b/.test(q)) {
      return (
        "Fractional Ownership:\n\n" +
        "By splitting high-value tokenized assets (such as commercial real estate or Treasury bills) into smaller digital fractions, retail and institutional investors can buy tiny percentages. This opens high-yield, premium asset classes to a much broader pool of capital."
      );
    }
    return (
      "Blockchain in Financial Systems:\n\n" +
      "Applying blockchain to modern finance introduces radical efficiencies:\n\n" +
      "• Asset Tokenization: Converting physical or traditional assets (e.g., real estate, equities, bonds) into digital tokens on a ledger.\n" +
      "• Instant Settlement: Bypassing traditional clearing houses (like T+2 settlement windows) for sub-second, atomic settlement of transfers.\n" +
      "• Fractional Ownership: Lowering entry barriers by allowing investors to buy fractions of high-value tokenized securities (e.g., ERC-3643 assets)."
    );
  }

  /* ---------- BANKING, PAYMENTS & TRANSACTIONS ---------- */
  if (
    /\b(banking|payment|payments|transfer|transfers|transaction|transactions|send money|receive money|remittance|remittances|tx|gas|gas fees?|mints)\b/.test(q)
  ) {
    if (/\b(gas|gas fees?)\b/.test(q)) {
      return (
        "Gas Fees:\n\n" +
        "Gas fees represent the computational costs required to process and record transactions on a blockchain. Users pay gas fees to network validators in native tokens to incentivize computing resource allocation and protect the network against spam."
      );
    }
    if (/\b(transfer|transaction|tx|send|receive)\b/.test(q)) {
      return (
        "On-Chain Transfers:\n\n" +
        "Transactions represent state modifications saved on-chain. When you submit a payment:\n" +
        "1. The transaction is signed using your private key.\n" +
        "2. The platform's smart contract performs security, KYC whitelist, and fraud checks.\n" +
        "3. If successful, the transfer is written to a block, modifying account balances permanently."
      );
    }
    return (
      "Banking, Payments & Transactions:\n\n" +
      "• Remittances: Blockchain payments allow instant, global, 24/7 cross-border transfers bypassing clearing houses.\n" +
      "• Gas Fees: Transactions require small network fees (gas) paid to validators to incentivize ledger maintenance.\n" +
      "• On-Chain Transactions: Signed securely by a user's private key, transactions represent state changes written into blocks on the block explorer."
    );
  }

  /* ---------- LOGIN & REGISTER ---------- */
  if (
    /\b(login|logout|sign in|signin|register|registration|sign up|signup|account|credentials|username|password|jwt|session)\b/.test(q)
  ) {
    if (/\b(register|registration|sign up|signup)\b/.test(q)) {
      return (
        "Account Registration:\n\n" +
        "To register on our platform:\n" +
        "1. Input a unique username and a strong password.\n" +
        "2. Submit the form. The system will provision your account and automatically generate a mock Web3 wallet address starting with '0x'."
      );
    }
    if (/\b(login|logout|sign in|signin|jwt|session)\b/.test(q)) {
      return (
        "Authentication & JWT Session:\n\n" +
        "• Login: Submitting correct credentials triggers the server to issue a secure JSON Web Token (JWT).\n" +
        "• Session: The JWT is stored on your client and attached to every API request to authorize transactions.\n" +
        "• Logout: Removes the token, immediately ending your authenticated session."
      );
    }
    return (
      "Account & Authentication:\n\n" +
      "• Login: Secure login requires your username and password. On successful authentication, the server generates a JWT access token, starting a secure session.\n" +
      "• Registration: Creating an account automatically registers you on the platform and provisions a mock Web3 wallet address (e.g., 0x82AF...).\n" +
      "• Logout: Logging out terminates the session and securely removes the local JWT token.\n\n" +
      "Remember: Never share your username or password. I will never ask for your credentials."
    );
  }

  /* ---------- CRYPTOCURRENCY & DIGITAL ASSETS ---------- */
  if (
    /\b(cryptocurrency|crypto|token|tokens|stablecoin|stablecoins|digital asset|digital assets|eth|btc|sol|bitcoin|ethereum|utility token|security token)\b/.test(q)
  ) {
    if (/\b(stablecoin|stablecoins|usdc|usdt)\b/.test(q)) {
      return (
        "Stablecoins:\n\n" +
        "Stablecoins are digital assets designed to track the value of a fiat currency (such as USD). By being backed 1:1 by real reserves, they provide a reliable, non-volatile medium of exchange and unit of account inside the DeFi ecosystem."
      );
    }
    if (/\b(btc|bitcoin)\b/.test(q)) {
      return (
        "Bitcoin (BTC):\n\n" +
        "Bitcoin is the pioneer cryptocurrency, launched in 2009 by Satoshi Nakamoto. It uses a Proof of Work peer-to-peer network to enable trustless payments and act as a secure, decentralized store of value (often referred to as 'digital gold')."
      );
    }
    if (/\b(eth|ethereum|sol|solana)\b/.test(q)) {
      return (
        "Smart Contract Tokens (ETH & SOL):\n\n" +
        "• Ethereum (ETH): The leading decentralized platform for running smart contracts. ETH acts as the network's gas currency and staking asset.\n" +
        "• Solana (SOL): A high-performance blockchain designed for rapid, low-cost decentralized applications, using Proof of History (PoH) consensus."
      );
    }
    if (/\b(security tokens?|utility tokens?)\b/.test(q)) {
      return (
        "Token Classifications:\n\n" +
        "• Security Tokens: Represent investment contracts, shares, or income streams from real-world assets. They are highly regulated.\n" +
        "• Utility Tokens: Grant access to a specific application, service, or platform utility (e.g., transaction gas, governance voting) and do not represent ownership equity."
      );
    }
    return (
      "Cryptocurrency & Digital Assets:\n\n" +
      "Digital assets represent value stored cryptographically on-chain:\n\n" +
      "• Cryptocurrencies: Native network tokens like Bitcoin (BTC) or Ethereum (ETH) used to store value or pay transaction gas fees.\n" +
      "• Stablecoins: Digital assets pegged to a fiat currency (e.g., USDC, USDT) to minimize market volatility.\n" +
      "• Digital Securities: Tokens representing equity or yield rights, bound by automated compliance standards (like ERC-3643 used on our platform)."
    );
  }

  /* ---------- DECENTRALIZED FINANCE (DEFI) & STAKING ---------- */
  if (
    /\b(decentralized finance|defi|staking|stake|yield|liquidity pool|liquidity pools|amm|yield farming|impermanent loss)\b/.test(q)
  ) {
    if (/\b(yield farming|impermanent loss)\b/.test(q)) {
      return (
        "Yield Farming & Impermanent Loss:\n\n" +
        "• Yield Farming: Depositing tokens into liquidity pools to maximize interest return via trading fees and bonus tokens.\n" +
        "• Impermanent Loss: A temporary drop in value that occurs when the market price ratio of your deposited assets diverges from when you deposited them. The loss is locked in only if you withdraw from the pool."
      );
    }
    if (/\b(liquidity pool|pools|amm)\b/.test(q)) {
      return (
        "Liquidity Pools & AMMs:\n\n" +
        "• Liquidity Pools: Automated smart contracts containing a pair of locked assets (e.g., ETH/USDC) funded by liquidity providers.\n" +
        "• Automated Market Makers (AMMs): Decentralized protocols that price pool assets using mathematical algorithms (e.g., constant product formula x * y = k) instead of relying on a traditional buyer-seller order book."
      );
    }
    if (/\b(staking|stake|yield)\b/.test(q)) {
      return (
        "Staking & Yield Generation:\n\n" +
        "Staking requires users to lock their crypto assets in a smart contract to support blockchain network validation and security. In exchange for securing the network, stakers receive recurring payouts or interest yield based on their staked amounts."
      );
    }
    return (
      "Decentralized Finance (DeFi) & Staking:\n\n" +
      "DeFi rebuilds traditional financial instruments on top of public smart contracts:\n\n" +
      "• DeFi Ecosystem: Peer-to-peer trading, lending, and borrowing without intermediary banks or brokers.\n" +
      "• Staking: Locking up digital assets to support a blockchain network's operations. In return, stakers receive rewards or yields on their locked assets.\n" +
      "• Liquidity Pools & AMMs: Automated Market Makers allow users to trade assets using algorithm-priced smart contract pools rather than traditional order books."
    );
  }

  /* ---------- RISKS & REGULATIONS ---------- */
  if (
    /\b(risk|risks|regulation|regulations|sec|fatf|compliance laws|volatility|vulnerabilities|smart contract bug|regulatory|hack|hacks|losses)\b/.test(q)
  ) {
    if (/\b(sec|regulation|regulatory|laws|rules)\b/.test(q)) {
      return (
        "Regulatory Oversight:\n\n" +
        "Institutional finance requires strict compliance with international bodies (SEC, FATF, MiCA):\n" +
        "• ERC-3643 Standard: Implements on-chain identity checks to restrict token transfers to verified users.\n" +
        "• Transaction limits: Monitors and blocks transfers that fail compliance checks."
      );
    }
    if (/\b(bug|bugs|hack|hacks|vulnerabilities|vulnerability)\b/.test(q)) {
      return (
        "Smart Contract Security Risks:\n\n" +
        "Blockchain logic is immutable after deployment. Coding bugs, reentrancy vulnerabilities, or front-running exploits can result in irreversible fund loss. Rigid audit trails and unit tests are mandatory to safeguard capital."
      );
    }
    return (
      "Risks & Regulations:\n\n" +
      "• Market Risks: Digital assets are subject to high price volatility and liquidity risks.\n" +
      "• Technical Risks: Smart contract bugs or vulnerabilities can lead to exploits and financial loss. Rigorous security audits are crucial.\n" +
      "• Regulatory Environment: Evolving guidelines (SEC, FATF Travel Rule, MiCA) require systems to implement rigid compliance controls like ERC-3643 identities to remain legally solvent."
    );
  }

  /* ---------- SMART CONTRACTS ---------- */
  if (
    /\b(smart contract|smart contracts|self-executing code|solidity|evm|compilation|deployment)\b/.test(q)
  ) {
    if (/\b(solidity|evm)\b/.test(q)) {
      return (
        "Solidity & EVM:\n\n" +
        "• Solidity: The primary object-oriented, high-level programming language used to code smart contracts on EVM blockchains.\n" +
        "• Ethereum Virtual Machine (EVM): The sandboxed runtime environment that executes smart contract code consistently across all nodes in the blockchain network."
      );
    }
    if (/\b(compilation|deployment|deploy)\b/.test(q)) {
      return (
        "Contract Lifecycle:\n\n" +
        "1. Compilation: Solidity code is compiled into binary bytecode and an Application Binary Interface (ABI).\n" +
        "2. Deployment: The bytecode is published to a specific address on the blockchain via a transaction. Once deployed, the contract is active, immutable, and executable."
      );
    }
    return (
      "Smart Contracts:\n\n" +
      "Smart contracts are self-executing software programs deployed directly on a blockchain. They automatically perform actions when predefined conditions are met:\n\n" +
      "• Automation: Enforces terms immediately without intermediaries (e.g., automatically whitelisting user accounts or processing bank reserves checks).\n" +
      "• Code is Law: Once compiled and written to the ledger, the execution rules are tamper-proof and public.\n" +
      "• Compliance Control: They act as automated compliance gatekeepers (such as enforcing KYC status before whitelisting a transaction)."
    );
  }

  /* ---------- SECURITY & CRYPTOGRAPHY ---------- */
  if (
    /\b(security|secure|mfa|2fa|authentication|threat|protection|biometric|passkey|passkeys|mpc|cryptography|hash|private key|public key|multi-party computation|encryption)\b/.test(q)
  ) {
    if (/\b(key|keys|private|public|cryptography)\b/.test(q)) {
      return (
        "Key Pair Cryptography:\n\n" +
        "Wallet security utilizes asymmetric cryptography:\n" +
        "• Public Key: Your public wallet address, visible to everyone. Anyone can send funds here.\n" +
        "• Private Key: Your secret signature. Used to authorize transactions. **Never share your private key**; anyone with access to it can control all assets in the wallet."
      );
    }
    if (/\b(passkey|passkeys|biometric|mfa|2fa|authentication)\b/.test(q)) {
      return (
        "MFA & Biometrics Setup:\n\n" +
        "You can configure passwordless, phishing-resistant security under the Settings panel:\n" +
        "• Biometric Passkeys: Secures logins using your device's biometric face/fingerprint scanners.\n" +
        "• Multi-Factor Authentication: Requires hardware keys or PINs in addition to your session password to execute high-value actions."
      );
    }
    if (/\b(mpc|multi-party computation)\b/.test(q)) {
      return (
        "Multi-Party Computation (MPC):\n\n" +
        "MPC is a cryptographic custody protocol. It splits the private key into multiple secret shares distributed across separate servers. When signing a transaction, the nodes compute the signature cooperatively, ensuring the full private key is never assembled or exposed on any single machine."
      );
    }
    return (
      "Platform Security & Cryptography:\n\n" +
      "DeFi security is built on deep cryptographic standards:\n\n" +
      "• Asymmetric Cryptography: Public keys act as wallet addresses, while private keys provide the signature to authorize transactions.\n" +
      "• Multi-Party Computation (MPC): Splitting private keys into multiple shards distributed across nodes so that no single node holds the complete key, mitigating exploit risks.\n" +
      "• Biometrics & MFA: Adding hardware key authenticators and passkeys (managed in Settings) to secure ledger entry."
    );
  }

  /* ---------- AUDIT LOGS ---------- */
  if (
    /\b(audit|log|logs|logged|logging|trail|history|event|events|record|records)\b/.test(q)
  ) {
    if (/\b(detail|details|event|events|types|logged)\b/.test(q)) {
      return (
        "Audit Log Events:\n\n" +
        "The system records a comprehensive list of actions, including:\n" +
        "• User Registration and Logins\n" +
        "• KYC OTP Requests and Submissions\n" +
        "• Wallet Transfers and Block Validation\n" +
        "• Profile Settings Updates\n" +
        "• Solvency reserves audits"
      );
    }
    if (/\b(access|admin|search|filter|clear)\b/.test(q)) {
      return (
        "Audit Log Management:\n\n" +
        "• Admins can search and filter the audit trail by action type (e.g., TRANSACTION, KYC_VERIFICATION) or status (SUCCESS/FAILED).\n" +
        "• To preserve memory, admins can clear the log history, which logs a final 'Cleared all system audit logs' action."
      );
    }
    return (
      "Audit Logs & Traceability:\n\n" +
      "To ensure total transparency, all platform actions are logged in real-time:\n\n" +
      "• Event Capture: Logins, KYC attempts, transfer transactions, and settings updates are recorded.\n" +
      "• Traceability Data: Captures the unique Log ID, timestamp, actor, action details, IP address, and SUCCESS/FAILED status.\n" +
      "• Administrative Access: Audit logs page displays warnings for failed log-ins or rate limits, giving admins clean tools to verify security and generate reports."
    );
  }





  /* ---------- OTHER SECTIONS & FEATURES ---------- */
  if (
    /\b(dashboard|explorer|payments|analytics|settings|terminal|admin|proof of reserves|reserves|solvency|treasury)\b/.test(q)
  ) {
    if (/\b(proof of reserves|reserves|solvency|treasury)\b/.test(q)) {
      return (
        "Proof of Reserves (PoR):\n\n" +
        "PoR verifies platform solvency by proving that the platform's assets in the treasury ($500,000 USD) exceed the total user balances (liabilities). The verification executes a sum of liabilities and performs a conceptual zero-knowledge solvency check in our backend, logging results for complete transparency."
      );
    }
    if (/\b(explorer|block|blocks)\b/.test(q)) {
      return (
        "Block Explorer:\n\n" +
        "Our custom Block Explorer allows you to inspect the blockchain ledger. It displays:\n" +
        "• Block index and block timestamp.\n" +
        "• Complete transaction details (sender, receiver, amount, and asset token type).\n" +
        "• Cryptographic block hashes.\n" +
        "• On-chain Fraud Risk evaluation metrics (Risk score, level, and flagged reason list)."
      );
    }
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