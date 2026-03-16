import StatsBar from "@/components/notes/StatsBar";
import NotesGrid from "@/components/notes/NotesGrid";

export default function DashboardPage() {
  return (
    <>
      <style>{`
        .dashboard-page {
          padding: 28px;
        }

        .dashboard-heading {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }

        .dashboard-gradient-text {
          background: linear-gradient(135deg, #5ebaff, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dashboard-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
        }

        /* Tablet */
        @media (max-width: 768px) {
          .dashboard-page {
            padding: 20px 16px;
          }

          .dashboard-heading {
            font-size: 22px;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .dashboard-page {
            padding: 16px 12px;
          }

          .dashboard-heading {
            font-size: 20px;
            letter-spacing: -0.02em;
          }

          .dashboard-subtitle {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="dashboard-page">
        <div style={{ marginBottom: 24 }}>
          <h1 className="dashboard-heading">
            Your <span className="dashboard-gradient-text">Second Brain</span>
          </h1>
          <p className="dashboard-subtitle">
            All your knowledge, intelligently organized.
          </p>
        </div>
        <StatsBar />
        <NotesGrid />
      </div>
    </>
  );
}
