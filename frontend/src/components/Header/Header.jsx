import StageBar from "./StageBar";
import styles from "../../styles";

export default function Header({ stage }) {
  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={{ fontSize: 28 }}>⚖️</span>
          <div>
            <h1 style={styles.logoTitle}>
              PublicDefender<span style={{ color: "#4f8ef7" }}>.ai</span>
            </h1>
            <p style={styles.tagline}>Know your rights. Free. Now.</p>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8 }}>
          <span style={styles.badge("#e8f0fe", "#3b5bdb")}>Confidential</span>
          <span style={styles.badge("#e6f9ef", "#2b7a4b")}>Free Access</span>
        </div>
      </div>

      <StageBar stage={stage} />
    </header>
  );
}