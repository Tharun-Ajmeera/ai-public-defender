import { CHARGE_OPTIONS, US_STATES } from "../../constants";
import styles from "../../styles";

export default function IntakeForm({ intake, onChange, onSubmit, error }) {
  return (
    <div style={styles.card}>
      {/* Heading */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 600 }}>
          Begin Your Free Consultation
        </h2>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
          Your information is private and never stored.
        </p>
      </div>

      {/* Full Name */}
      <div style={styles.formRow}>
        <label style={styles.label}>Full Name *</label>
        <input
          style={styles.input}
          type="text"
          placeholder="e.g. Jordan Lee"
          value={intake.name}
          onChange={(e) => onChange({ ...intake, name: e.target.value })}
        />
      </div>

      {/* Charge */}
      <div style={styles.formRow}>
        <label style={styles.label}>Charge / Alleged Offense *</label>
        <select
          style={styles.input}
          value={intake.charge}
          onChange={(e) => onChange({ ...intake, charge: e.target.value })}
        >
          <option value="">Select a charge...</option>
          {CHARGE_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* State */}
      <div style={styles.formRow}>
        <label style={styles.label}>State *</label>
        <select
          style={styles.input}
          value={intake.state}
          onChange={(e) => onChange({ ...intake, state: e.target.value })}
        >
          <option value="">Select a state...</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Additional Details */}
      <div style={styles.formRow}>
        <label style={styles.label}>
          Additional Details{" "}
          <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          style={{ ...styles.input, resize: "vertical", minHeight: 80 }}
          placeholder="Briefly describe what happened..."
          value={intake.details}
          onChange={(e) => onChange({ ...intake, details: e.target.value })}
        />
      </div>

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Submit */}
      <button style={styles.btnPrimary} onClick={onSubmit}>
        Start My Consultation →
      </button>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ⚠️ This tool provides general legal information, not legal advice.
        Always consult a licensed attorney.
      </div>
    </div>
  );
}