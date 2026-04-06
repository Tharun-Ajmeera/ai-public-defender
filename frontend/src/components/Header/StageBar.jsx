import { STAGES } from "../../constants";
import styles from "../../styles";

export default function StageBar({ stage }) {
  const steps = [
    { key: "intake",  label: "Your Info" },
    { key: "chat",    label: "Consultation" },
    { key: "summary", label: "Summary" },
  ];

  return (
    <div style={styles.stageBar}>
      {steps.map((step, i) => {
        const currentIdx = STAGES.indexOf(stage);
        const isDone     = currentIdx > i;
        const isActive   = stage === step.key;

        return (
          <div key={step.key} style={styles.stageStep(isActive, isDone)}>
            <div style={styles.stepNum(isActive, isDone)}>
              {isDone ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400 }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}