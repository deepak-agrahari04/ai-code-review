import { useState } from "react";
import axios from "axios";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "highlight.js/styles/github-dark.css";

import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const reviewCode = async () => {
    if (loading || !code.trim()) return;

    try {
      setLoading(true);

      const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/ai/get-review`,
  { code }
);

      setReview(response.data);
    } catch (error) {
      console.error("Review Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <main>

    {/* LEFT SIDE */}
    <div className="left">

      <div className="top">
        <h2>Code Submission</h2>
        <p>Write your code and click Review.</p>
      </div>

      <div className="editor-container">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) =>
            Prism.highlight(code, Prism.languages.javascript, "javascript")
          }
          padding={20}
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: 15,
            minHeight: "100%",
            backgroundColor: "#0c0c0c",
            color: "white",
            outline: "none"
          }}
        />
      </div>

      <button
        className={`review ${loading ? "active" : ""}`}
        onClick={reviewCode}
        disabled={loading}
      >
        {loading ? "Reviewing..." : "Review Code"}
      </button>

    </div>


    {/* RIGHT SIDE */}
    <div className="right">

      <h2>AI Review</h2>

      <div className="review-output">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review || "Your AI review will appear here."}
        </Markdown>
      </div>

    </div>

  </main>
);
}

export default App;