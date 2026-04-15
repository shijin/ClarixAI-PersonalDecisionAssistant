import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { sendFollowUp } from "../../lib/claude";
import { ROUTES } from "../../constants/routes";

function IconBack() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="#1A1917"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconSend({ ready }) {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke={ready ? "white" : "#9C9A92"}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ─────────────────────────────────────
// Single message bubble
// ─────────────────────────────────────

function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3
                    ${
                      isUser
                        ? "bg-brand-purple text-white rounded-tr-sm"
                        : "bg-surface-0 border border-[rgba(26,25,23,0.08)] text-ink-80 rounded-tl-sm"
                    }`}
      >
        {!isUser && (
          <p
            className="text-[9px] font-bold text-ink-30 uppercase
                        tracking-[0.05em] mb-1"
          >
            Clarix
          </p>
        )}
        <p
          className={`text-[13px] leading-relaxed
                       ${isUser ? "text-white" : "text-ink-80"}`}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="bg-surface-0 border border-[rgba(26,25,23,0.08)]
                      rounded-2xl rounded-tl-sm px-4 py-3"
      >
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[6px] h-[6px] rounded-full bg-ink-30
                         animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// Main screen
// ─────────────────────────────────────

export default function ConversationScreen() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [situation, setSituation] = useState("");

  const isReady = inputText.trim().length > 2 && !isTyping;

  useEffect(() => {
    const sit = sessionStorage.getItem("clarix_situation");
    const rec = sessionStorage.getItem("clarix_recommendation");
    const prefilled = sessionStorage.getItem("clarix_prefilled_question");

    if (!sit || !rec) {
      navigate(ROUTES.INTAKE);
      return;
    }

    setSituation(sit);

    try {
      const parsed = JSON.parse(rec);
      setRecommendation(parsed);

      const seededMessages = [
        { role: "user", content: sit },
        { role: "assistant", content: JSON.stringify(parsed) },
      ];
      setMessages(seededMessages);

      // If a question was pre-selected from the recommendation
      // screen auto-fill and send it immediately
      if (prefilled) {
        sessionStorage.removeItem("clarix_prefilled_question");
        setInputText(prefilled);

        // Small delay to let the component mount fully
        setTimeout(() => {
          autoSendQuestion(prefilled, seededMessages, parsed);
        }, 500);
      }
    } catch {
      navigate(ROUTES.INTAKE);
    }
  }, []);

  const autoSendQuestion = async (question, seededMessages, rec) => {
    setInputText("");
    setIsTyping(true);

    const userMessage = { role: "user", content: question };
    const updatedMessages = [...seededMessages, userMessage];
    setMessages(updatedMessages);

    try {
      const result = await sendFollowUp(updatedMessages, question);

      let responseText = "";
      if (result.type === "structured" && result.data?.recommendation) {
        responseText = result.data.recommendation;
        if (result.data.summary) {
          responseText += "\n\n" + result.data.summary;
        }
        sessionStorage.setItem(
          "clarix_recommendation",
          JSON.stringify(result.data),
        );
        setRecommendation(result.data);
      } else if (result.type === "text") {
        responseText = result.data;
      } else {
        responseText = "Here is what I would consider for your situation.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch {
      setError("Could not get a response. Please try again.");
      setMessages(seededMessages);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    setInputText("");
    setError(null);

    // Add user message immediately
    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const result = await sendFollowUp(updatedMessages, text);

      let responseText = "";

      if (result.type === "structured" && result.data?.recommendation) {
        // Claude returned an updated recommendation
        responseText = result.data.recommendation;

        // If there is a summary add it
        if (result.data.summary) {
          responseText += "\n\n" + result.data.summary;
        }

        // Update the stored recommendation
        sessionStorage.setItem(
          "clarix_recommendation",
          JSON.stringify(result.data),
        );
        setRecommendation(result.data);
      } else if (result.type === "text") {
        responseText = result.data;
      } else {
        responseText =
          "I have updated your recommendation based on that context.";
      }

      const assistantMessage = {
        role: "assistant",
        content: responseText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError("Could not get a response. Please try again.");
      // Remove the user message if the call failed
      setMessages(messages);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  // Only show visible messages — hide the seeded context messages
  const visibleMessages = messages.filter((_, i) => i >= 2);

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col">
      <div className="h-12 bg-surface-0" />

      {/* Nav bar */}
      <div
        className="flex items-center justify-between px-5 h-14
                      bg-surface-0 border-b border-[rgba(26,25,23,0.07)]
                      flex-shrink-0"
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-surface-1 border border-[rgba(26,25,23,0.1)]
                     rounded-[10px] flex items-center justify-center"
          aria-label="Go back"
        >
          <IconBack />
        </button>
        <span className="text-body-sm font-semibold text-ink-30">
          Follow-up
        </span>
        <button
          onClick={() => navigate(ROUTES.RECOMMENDATION)}
          className="text-[12px] font-bold text-brand-purple"
        >
          View result
        </button>
      </div>

      {/* Recommendation mini card */}
      {recommendation && (
        <div
          className="mx-5 mt-4 mb-2 bg-brand-teal-light border
                     border-[rgba(15,110,86,0.15)] rounded-xl px-4 py-3
                     cursor-pointer flex-shrink-0"
          onClick={() => navigate(ROUTES.RECOMMENDATION)}
        >
          <p
            className="text-[9px] font-bold text-brand-teal uppercase
                        tracking-[0.06em] mb-1"
          >
            Current recommendation
          </p>
          <p
            className="text-[13px] font-semibold text-ink-100
                        leading-snug line-clamp-2"
          >
            {recommendation.recommendation}
          </p>
          <p className="text-caption text-brand-teal-mid mt-1">
            Tap to view full result
          </p>
        </div>
      )}

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32">
        {/* Empty state — no messages yet */}
        {visibleMessages.length === 0 && !isTyping && (
          <div
            className="flex flex-col items-center justify-center
                          gap-3 py-10"
          >
            <div
              className="w-12 h-12 bg-brand-purple-light rounded-xl
                            flex items-center justify-center"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="#534AB7"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[14px] font-bold text-ink-100 mb-1">
                Ask anything about this recommendation
              </p>
              <p className="text-body-sm text-ink-50">
                What if questions, clarifications, objections — anything.
              </p>
            </div>

            {/* Suggested questions */}
            <div className="w-full flex flex-col gap-2 mt-2">
              {[
                "What if my income increases in 2 years?",
                "What are the risks I should know about?",
                "How does this compare to other options?",
                "Help me explain this to my family.",
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(q)}
                  className="flex items-center justify-between gap-3
                             px-4 py-3 bg-surface-0 border
                             border-[rgba(26,25,23,0.08)] rounded-xl
                             text-left group"
                >
                  <span
                    className="text-[13px] text-ink-80
                                   group-hover:text-ink-100
                                   transition-colors leading-snug"
                  >
                    {q}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    stroke="#9C9A92"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    className="flex-shrink-0"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex flex-col gap-3">
          {visibleMessages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2 mt-3 px-4 py-3
                          bg-semantic-error-bg border
                          border-[rgba(163,45,45,0.2)] rounded-xl"
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="#A32D2D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-body-sm text-semantic-error-dark">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full
                      max-w-[480px] px-5 py-4 bg-surface-1
                      border-t border-[rgba(26,25,23,0.07)]"
      >
        <div
          className={`flex items-end gap-3 bg-surface-0 rounded-2xl
                         px-4 py-3 border-[1.5px] transition-all duration-150
                         ${
                           inputText.length > 0
                             ? "border-brand-purple shadow-[0_0_0_3px_rgba(83,74,183,0.08)]"
                             : "border-[rgba(26,25,23,0.12)]"
                         }`}
        >
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            rows={1}
            className="flex-1 bg-transparent text-[14px] text-ink-100
                       placeholder-ink-30 leading-relaxed resize-none
                       outline-none border-none font-sans
                       max-h-[120px] overflow-y-auto"
            style={{
              height: "auto",
              minHeight: "24px",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!isReady}
            className={`w-8 h-8 rounded-lg flex items-center justify-center
                        flex-shrink-0 transition-colors duration-150
                        ${
                          isReady
                            ? "bg-brand-purple cursor-pointer"
                            : "bg-surface-3 cursor-not-allowed"
                        }`}
            aria-label="Send"
          >
            <IconSend ready={isReady} />
          </button>
        </div>
        <p className="text-caption text-ink-30 text-center mt-2">
          Cmd + Enter to send
        </p>
      </div>
    </div>
  );
}
