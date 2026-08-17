import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LIFT_TRANSITION = { type: "spring", stiffness: 360, damping: 24, mass: 0.65 };

function AtmosphericBackdrop() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="atmospheric-backdrop" aria-hidden="true">
      <motion.div
        className="atmospheric-base"
        animate={reducedMotion ? undefined : {
          backgroundPosition: ["53% 0px", "58% 560px", "53% 1120px"],
        }}
        transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="atmospheric-dust"
        animate={reducedMotion ? undefined : {
          backgroundPosition: ["0px 0px", "260px 780px"],
          opacity: [0.32, 0.5, 0.32],
        }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

const PROBLEMS = [
  {
    index: "01",
    title: "Leads trapped in conversations",
    text: "Enquiries arrive across WhatsApp, forms, and inboxes. Ownership is unclear, context is lost, and follow-up depends on memory.",
  },
  {
    index: "02",
    title: "Approvals without a trail",
    text: "A decision waits in a chat or call while the rest of the process stalls. Nobody can see what is blocked or why.",
  },
  {
    index: "03",
    title: "Reports assembled by hand",
    text: "Teams copy figures between spreadsheets and tools before leadership can see what already happened.",
  },
  {
    index: "04",
    title: "Knowledge living with one person",
    text: "The answer exists, but only inside an employee’s inbox, document folder, or memory — making scale fragile.",
  },
];

const SYSTEM_STEPS = [
  {
    id: "capture",
    label: "Capture",
    before: "Inputs scattered across channels",
    after: "Every request becomes one structured record",
    detail: "Source, owner, priority, files, and the next action stay attached to the work.",
  },
  {
    id: "decide",
    label: "Decide",
    before: "Rules interpreted differently each time",
    after: "Clear logic routes routine decisions",
    detail: "Humans stay in control at the decisions that need judgement, risk review, or approval.",
  },
  {
    id: "act",
    label: "Act",
    before: "Handoffs rely on reminders",
    after: "Tasks move automatically with ownership",
    detail: "The system updates tools, creates tasks, sends follow-ups, and escalates blocked work.",
  },
  {
    id: "report",
    label: "Report",
    before: "Outcomes reconstructed after the fact",
    after: "Every result feeds a live operating view",
    detail: "Leaders see throughput, exceptions, and next actions without another manual report.",
  },
];

const CAPABILITIES = [
  {
    index: "01",
    eyebrow: "REVENUE OPERATIONS",
    title: "Lead and customer workflows",
    text: "Intake, qualification, routing, quoting, onboarding, and follow-up — connected from first enquiry to outcome.",
    items: ["WhatsApp + form capture", "CRM orchestration", "Quote and approval flows"],
  },
  {
    index: "02",
    eyebrow: "BUSINESS OPERATIONS",
    title: "Internal operations and reporting",
    text: "Recurring processes that collect data, enforce ownership, flag exceptions, and publish decision-ready views.",
    items: ["Daily operating reports", "Approval and escalation paths", "Data reconciliation"],
  },
  {
    index: "03",
    eyebrow: "KNOWLEDGE SYSTEMS",
    title: "AI-assisted support and knowledge",
    text: "Reliable answers grounded in your own documents, with sources, confidence rules, and human escalation built in.",
    items: ["Internal knowledge assistants", "Customer support triage", "Document intelligence"],
  },
];

const DELIVERY = [
  { index: "01", title: "Map the real workflow", text: "We follow the work as it happens — tools, exceptions, decisions, owners, and the places context gets lost." },
  { index: "02", title: "Design the controls", text: "Together we define rules, approval boundaries, data sources, and what must remain a human decision." },
  { index: "03", title: "Build inside your stack", text: "We connect the tools your team already uses and introduce new infrastructure only where it earns its place." },
  { index: "04", title: "Run, measure, improve", text: "We test with live scenarios, train owners, monitor exceptions, and improve the system against real outcomes." },
];

const FAQS = [
  {
    question: "Do we need to replace our current tools?",
    answer: "Usually not. ANTRIV is designed around the tools your team already relies on. We connect and govern the workflow first, then recommend a replacement only when an existing tool is the actual constraint.",
  },
  {
    question: "Where does AI fit — and where does it not?",
    answer: "AI is used for tasks such as classification, extraction, drafting, and knowledge retrieval. Financial commitments, sensitive approvals, and high-risk decisions keep an explicit human control point.",
  },
  {
    question: "What happens in a workflow audit?",
    answer: "We map one important process, identify the operational cost of its gaps, define a practical target workflow, and leave you with a prioritised automation brief.",
  },
  {
    question: "Can you work with teams across the GCC?",
    answer: "Yes. ANTRIV is based in the UAE and designs systems for operational teams across the UAE and wider GCC, with remote and on-site delivery depending on the engagement.",
  },
];

function SectionHeading({ code, title, text }) {
  return (
    <div className="section-heading">
      <span className="section-code">{code}</span>
      <div>
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}

export function ProductionHeader({ onAudit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const hoverLift = reducedMotion ? undefined : { y: -4, scale: 1.035 };

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="production-header">
      <a className="brand-link" href="#top" aria-label="ANTRIV home">
        <img className="brand-logo" src="/antriv-logo-horizontal.png" alt="ANTRIV" />
      </a>
      <nav className={menuOpen ? "production-nav open" : "production-nav"} aria-label="Main navigation">
        <motion.a className="lift-link" href="#problem" whileHover={hoverLift} transition={LIFT_TRANSITION} onClick={() => setMenuOpen(false)}>The problem</motion.a>
        <motion.a className="lift-link" href="#system" whileHover={hoverLift} transition={LIFT_TRANSITION} onClick={() => setMenuOpen(false)}>The system</motion.a>
        <motion.a className="lift-link" href="#capabilities" whileHover={hoverLift} transition={LIFT_TRANSITION} onClick={() => setMenuOpen(false)}>What we build</motion.a>
        <motion.a className="lift-link" href="#delivery" whileHover={hoverLift} transition={LIFT_TRANSITION} onClick={() => setMenuOpen(false)}>How we work</motion.a>
      </nav>
      <div className="header-actions">
        <span>Dubai · UAE</span>
        <motion.button className="header-audit lift-action" type="button" whileHover={hoverLift} whileTap={reducedMotion ? undefined : { scale: 0.98 }} transition={LIFT_TRANSITION} onClick={onAudit}>Begin audit</motion.button>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
    </header>
  );
}

function ProblemSection() {
  return (
    <section className="content-section problem-section" id="problem">
      <SectionHeading
        code="02 / THE OPERATIONAL PROBLEM"
        title="The work nobody sees is slowing everything down."
        text="Most operational friction does not look dramatic. It looks like small delays repeated across every lead, approval, report, and customer request."
      />
      <div className="problem-grid">
        {PROBLEMS.map((problem) => (
          <article className="problem-card" key={problem.index}>
            <span>{problem.index}</span>
            <h3>{problem.title}</h3>
            <p>{problem.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SystemSection() {
  const [active, setActive] = useState(SYSTEM_STEPS[0].id);
  const step = SYSTEM_STEPS.find((item) => item.id === active) ?? SYSTEM_STEPS[0];
  const reducedMotion = useReducedMotion();

  return (
    <section className="content-section system-section" id="system">
      <SectionHeading
        code="03 / MANUAL WORK → CONTROLLED SYSTEM"
        title="One workflow. Visible from input to outcome."
        text="The goal is not more automation. It is a system your team can understand, operate, and trust."
      />
      <div className="system-tabs" aria-label="Workflow transformation steps">
        {SYSTEM_STEPS.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            aria-pressed={active === item.id}
            whileHover={reducedMotion ? undefined : { y: -4, scale: 1.025 }}
            whileTap={reducedMotion ? undefined : { scale: 0.985 }}
            transition={LIFT_TRANSITION}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </motion.button>
        ))}
      </div>
      <div className="system-comparison" aria-live="polite">
        <div className="comparison-side before">
          <span className="comparison-label">BEFORE / MANUAL</span>
          <strong>{step.before}</strong>
        </div>
        <div className="comparison-transition" aria-hidden="true">BECOMES</div>
        <div className="comparison-side after">
          <span className="comparison-label">AFTER / ANTRIV SYSTEM</span>
          <strong>{step.after}</strong>
          <p>{step.detail}</p>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className="content-section capabilities-section" id="capabilities">
      <SectionHeading
        code="04 / WHAT ANTRIV BUILDS"
        title="Intelligent systems, built into real operations."
        text="Each engagement begins with a real workflow and ends with clear ownership, controls, and measurable outputs."
      />
      <div className="capability-grid">
        {CAPABILITIES.map((capability) => (
          <article className="capability-card" key={capability.index}>
            <div className="capability-topline">
              <span>{capability.index}</span>
              <small>{capability.eyebrow}</small>
            </div>
            <h3>{capability.title}</h3>
            <p>{capability.text}</p>
            <ul>
              {capability.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function DeliverySection() {
  return (
    <section className="content-section delivery-section" id="delivery">
      <SectionHeading
        code="05 / HOW WE WORK"
        title="Designed with your team. Owned by your business."
        text="We build enough structure to make the workflow dependable — without turning everyday work into an IT project."
      />
      <ol className="delivery-list">
        {DELIVERY.map((item) => (
          <li key={item.index}>
            <span>{item.index}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="content-section faq-section" id="faq">
      <SectionHeading code="06 / PRACTICAL QUESTIONS" title="Before we map the first workflow." />
      <div className="faq-list">
        {FAQS.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}<span aria-hidden="true">View</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ProductionSections({ onAudit }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="post-hero-shell">
      <AtmosphericBackdrop />
      <div className="post-hero-content">
        <ProblemSection />
        <SystemSection />
        <CapabilitiesSection />
        <DeliverySection />
        <section className="audit-callout" id="audit">
          <div>
            <span className="section-code">START WITH THE REAL WORK</span>
            <h2>Bring us one workflow that should run better.</h2>
            <p>We’ll map the friction, controls, and most practical path to a dependable system.</p>
          </div>
          <motion.button
            className="primary-button inverse lift-action"
            type="button"
            whileHover={reducedMotion ? undefined : { y: -5, scale: 1.035 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={LIFT_TRANSITION}
            onClick={onAudit}
          >
            Book a workflow audit
          </motion.button>
        </section>
        <FAQSection />
      </div>
    </div>
  );
}

export function ProductionFooter({ onAudit }) {
  return (
    <footer className="production-footer">
      <div className="footer-lead">
        <a className="brand-link" href="#top"><img className="brand-logo footer-logo" src="/antriv-logo-horizontal.png" alt="ANTRIV" /></a>
        <p>Operational intelligence for real work.<br />UAE + GCC.</p>
      </div>
      <div className="footer-links">
        <div><span>EXPLORE</span><a href="#problem">The problem</a><a href="#capabilities">What we build</a><a href="#delivery">How we work</a></div>
        <div><span>CONTACT</span><button type="button" onClick={onAudit}>Workflow audit</button><a href="mailto:me.dxb.ae@gmail.com">me.dxb.ae@gmail.com</a><a href="https://wa.me/971545670668" target="_blank" rel="noreferrer">WhatsApp · +971 54 567 0668</a><a href="tel:+971545670668">Call · +971 54 567 0668</a></div>
        <div id="privacy"><span>PRIVACY</span><p>Audit details are used only to respond to your enquiry and assess the requested workflow. We do not sell personal data.</p></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ANTRIV</span><span>DUBAI · UNITED ARAB EMIRATES</span></div>
    </footer>
  );
}

export function ProductionAuditDialog({ open, onClose }) {
  const dialogRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [brief, setBrief] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) {
      setSent(false);
      setBrief("");
      setCopied(false);
    }
  }, [open]);

  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      `Name: ${data.get("name")}`,
      `Work email: ${data.get("email")}`,
      `Company: ${data.get("company") || "Not provided"}`,
      "",
      "Workflow to improve:",
      data.get("workflow"),
    ].join("\n");
    setBrief(message);
    setSent(true);
    const subject = encodeURIComponent(`Workflow audit enquiry — ${data.get("company") || data.get("name")}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:me.dxb.ae@gmail.com?subject=${subject}&body=${body}`;
  };

  const copyBrief = async () => {
    await navigator.clipboard.writeText(brief);
    setCopied(true);
  };

  const closeDialog = () => {
    onClose();
  };

  const title = useMemo(() => sent ? "Your workflow brief is ready." : "Where does work slow down?", [sent]);

  return (
    <dialog
      className="audit-dialog production-audit-dialog"
      ref={dialogRef}
      onClose={closeDialog}
      onClick={(event) => { if (event.target === dialogRef.current) closeDialog(); }}
    >
      <button className="dialog-close" type="button" onClick={closeDialog} aria-label="Close dialog">Close</button>
      {sent ? (
        <div className="dialog-success" role="status">
          <span className="eyebrow">NEXT STEP</span>
          <h2>{title}</h2>
          <p>Your email app should open with the details prepared. Send that message to complete the request, or copy the brief below.</p>
          <div className="success-actions">
            <a className="primary-button" href={`mailto:me.dxb.ae@gmail.com?subject=${encodeURIComponent("Workflow audit enquiry")}&body=${encodeURIComponent(brief)}`}>Open email again</a>
            <a className="secondary-button" href="https://wa.me/971545670668" target="_blank" rel="noreferrer">Open WhatsApp</a>
            <button className="secondary-button" type="button" onClick={copyBrief}>{copied ? "Brief copied" : "Copy brief"}</button>
          </div>
          <small>Response target: one business day.</small>
        </div>
      ) : (
        <form onSubmit={submit}>
          <span className="eyebrow">WORKFLOW AUDIT</span>
          <h2>{title}</h2>
          <p>Give us the real process. We’ll map the friction, controls, and most practical automation path.</p>
          <div className="form-grid">
            <label>Name<input type="text" name="name" autoComplete="name" required /></label>
            <label>Work email<input type="email" name="email" autoComplete="email" placeholder="you@company.ae" required /></label>
          </div>
          <label>Company<input type="text" name="company" autoComplete="organization" /></label>
          <label>Workflow to improve<textarea name="workflow" placeholder="Example: lead intake, approvals, client reporting, or support triage" required /></label>
          <label className="consent-label"><input type="checkbox" required /><span>I agree that ANTRIV may use these details to respond to this enquiry.</span></label>
          <button className="primary-button" type="submit">Prepare audit request</button>
          <small>Submitting opens your email app. No details are stored on this website.</small>
        </form>
      )}
    </dialog>
  );
}
