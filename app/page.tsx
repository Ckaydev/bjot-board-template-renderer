"use client";

import { ChangeEvent, useRef, useState } from "react";
import { toPng } from "html-to-image";

type Content = {
  examYear: string; subject: string;
  number: string; question: string; optionA: string; optionB: string;
  optionC: string; optionD: string; answer: string; answerText: string;
  solution: string; keyPoint: string; examTip: string; commonMistake: string; example: string;
};

const initial: Content = {
  examYear: "UTME 2027", subject: "CHEMISTRY",
  number: "001",
  question: "2.24 dm³ of CO₂ was collected at 27°C and 750 mmHg.\n\nFind the volume it will occupy at 100°C and 600 mmHg.\n\n(R = 0.0821 L·atm·mol⁻¹·K⁻¹)",
  optionA: "2.80 dm³", optionB: "2.24 dm³", optionC: "1.68 dm³", optionD: "1.40 dm³",
  answer: "C", answerText: "1.68 dm³",
  solution: "Use the Combined Gas Law:\n\nP₁V₁ / T₁ = P₂V₂ / T₂\n\nWhere:\nP₁ = 750 mmHg, V₁ = 2.24 dm³, T₁ = 27°C\nP₂ = 600 mmHg, V₂ = ?, T₂ = 100°C\n\nConvert temperatures to Kelvin:\nT₁ = 27 + 273 = 300 K\nT₂ = 100 + 273 = 373 K\n\n750 × 2.24 / 300 = 600 × V₂ / 373\n\nSolve for V₂:\nV₂ = (750 × 2.24 × 373) / (300 × 600)\nV₂ = 1.68 dm³",
  keyPoint: "For gas law problems involving pressure, volume and temperature changes, always use the combined gas law when the number of moles is constant.",
  examTip: "Convert °C to Kelvin before substituting into any gas law formula. It saves time and prevents errors.",
  commonMistake: "Using °C instead of Kelvin in gas law calculations. Kelvin does not have zero or negative values, while °C does.",
  example: "If 1.0 dm³ of gas is at 300 K and 1 atm, what is its volume at 600 K and 2 atm?\nV₂ = (1.0 × 1 × 600) / (300 × 2) = 1.0 dm³",
};

const labels: [keyof Content, string, "short" | "medium" | "long"][] = [
  ["examYear", "Exam title / year", "short"], ["subject", "Subject", "short"],
  ["number", "Question number", "short"], ["question", "Question", "long"],
  ["optionA", "Option A", "short"], ["optionB", "Option B", "short"],
  ["optionC", "Option C", "short"], ["optionD", "Option D", "short"],
  ["answer", "Correct option", "short"], ["answerText", "Final answer", "short"],
  ["solution", "Solution", "long"], ["keyPoint", "Key point", "medium"],
  ["examTip", "Exam tip", "medium"], ["commonMistake", "Common mistake", "medium"],
  ["example", "Worked example", "medium"],
];

const scienceSubjects = new Set(["math", "maths", "mathematics", "physics", "chemistry", "biology"]);
const isScienceSubject = (subject: string) => scienceSubjects.has(subject.toLowerCase().replace(/[^a-z]/g, ""));
const readable = (value: string) => value
  .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
  .replace(/\\(log|ln|sin|cos|tan)\b/g, "$1")
  .replace(/_\{(\d+)\}/g, (_, digits) => digits.replace(/[0-9]/g, (n: string) => "₀₁₂₃₄₅₆₇₈₉"[Number(n)]))
  .replace(/_(\d+)/g, (_, digits) => digits.replace(/[0-9]/g, (n: string) => "₀₁₂₃₄₅₆₇₈₉"[Number(n)]))
  .replace(/\^\{?([0-9+-]+)\}?/g, "^($1)")
  .replace(/\$/g, "").replace(/\\times/g, "×").replace(/\\cdot/g, "·")
  .replace(/\bmass\s*[□�]\s*/gi, "mass ~ ").replace(/\bcharge\s*[□�]\s*/gi, "charge -").replace(/\be[□�](?=\s|\(|,)/g, "e-")
  .replace(/[⁻−₋]/g, "-").replace(/⁺/g, "+").replace(/≈/g, "~").replace(/[□�]/g, " ")
  .replace(/\\([A-Za-z]+)/g, "$1");

function SectionTitle({ icon, children, dark = false }: { icon: string; children: React.ReactNode; dark?: boolean }) {
  return <div className={`section-title ${dark ? "dark" : "gold"}`}><span>{icon}</span>{children}</div>;
}

export default function Home() {
  const [content, setContent] = useState(initial);
  const [tab, setTab] = useState<"question" | "solution" | "tips">("question");
  const [exporting, setExporting] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const scienceTemplate = isScienceSubject(content.subject);

  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContent((old) => ({ ...old, [e.target.name]: e.target.value }));

  const download = async () => {
    if (!posterRef.current) return;
    setExporting(true);
    try {
      const url = await toPng(posterRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: scienceTemplate ? "#fffdf7" : "#5a3b1d",
        width: 920,
        height: 1080,
        style: { transform: "none", transformOrigin: "top left", margin: "0" },
      });
      const link = document.createElement("a");
      link.download = `BJOT-${content.subject || "Subject"}-${content.number || "question"}.png`;
      link.href = url; link.click();
    } finally { setExporting(false); }
  };

  const groups = { question: labels.slice(0, 10), solution: labels.slice(10, 11), tips: labels.slice(11) };

  return (
    <main className="app-shell">
      <aside className="editor">
        <div className="editor-head"><div className="mini-logo">BJ</div><div><h1>BJOT Image Builder</h1><p>UTME lesson card renderer</p></div></div>
        <div className="tabs" role="tablist">
          {(["question", "solution", "tips"] as const).map((item) =>
            <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}
        </div>
        <div className="fields">
          {groups[tab].map(([name, label, size]) => (
            <label key={name}><span>{label}</span>
              {size === "short" ? <input name={name} value={content[name]} onChange={update} /> :
                <textarea name={name} rows={size === "long" ? 8 : 5} value={content[name]} onChange={update} />}
            </label>
          ))}
        </div>
        <div className="editor-actions"><button className="secondary" onClick={() => setContent(initial)}>Reset sample</button><button className="primary" onClick={download} disabled={exporting}>{exporting ? "Preparing…" : "Download PNG"}</button></div>
      </aside>

      <section className="preview-area">
        <div className="preview-bar"><div><strong>Live preview</strong><span>920 × 1080 design</span></div><span className="status-dot">Ready</span></div>
        <div className="poster-stage">
          <div className={`poster ${scienceTemplate ? "science-template" : "arts-template"}`} ref={posterRef}>
            <header className="poster-header">
              <div className="template-logo" aria-label="BJOT Blast JAMB Online Tutorials"><img src="/template-reference.png" alt="" /></div>
              <div className="motto"><i/> <span>DISCIPLINE<br/>CONSISTENCY<br/>EXCELLENCE</span></div>
              <div className="header-contact"><b>0916 044 3504<br/>0813 055 0960</b><i/><div><strong>{content.examYear}</strong><em>{content.subject}</em></div></div>
            </header>

            <div className="poster-grid">
              <section className="question-col">
                <div className="watermark">0916 044 3504&nbsp;&nbsp; 0813 055 0960</div>
                <SectionTitle icon="" dark>QUESTION</SectionTitle>
                <div className="q-number">Q No. {content.number} <i/></div>
                <div className="question-copy">{readable(content.question)}</div>
                <div className="option-rule" />
                {(["A","B","C","D"] as const).map((letter) => {
                  const text = content[`option${letter}` as keyof Content];
                  return <div className="option" key={letter}><b>{letter}</b><span>{readable(text)}</span>{content.answer.toUpperCase() === letter && <em>✓</em>}</div>;
                })}
                <div className="final-answer"><span className="medal">★</span><div><b>FINAL ANSWER</b><strong>OPTION {content.answer.toUpperCase()}. <small>{content.answerText}</small></strong></div></div>
              </section>

              <section className="solution-col">
                <div className="watermark">0916 044 3504&nbsp;&nbsp; 0813 055 0960</div>
                <SectionTitle icon="">SOLUTION</SectionTitle>
                <div className="solution-copy">{readable(content.solution)}</div>
              </section>

              <section className="tips-col">
                <div className="key-card"><h2>KEY POINT</h2><p>{readable(content.keyPoint)}</p></div>
                <div className="tip-section exam"><h2>EXAM TIP</h2><p>{readable(content.examTip)}</p></div>
                <div className="tip-section mistake"><h2>COMMON<br/>MISTAKE</h2><p>{readable(content.commonMistake)}</p></div>
              </section>
            </div>

            <footer className="poster-footer">
              <div className="footer-phone">◉ 0916 044 3504, 0813 055 0960</div>
              <div className="footer-social">● ♪ ◎ &nbsp; BJOT REPUBLIC &nbsp;&nbsp; ◉ www.bjotofficial.com &nbsp;&nbsp; ▶ BJOT OFFICIAL</div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}
