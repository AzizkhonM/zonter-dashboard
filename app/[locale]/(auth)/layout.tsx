import { LeftPanelCarousel } from "@/components/register/LeftPanelCarousel";
import "@/app/globals.css";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-wrapper">
      <LocaleSwitcher />
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="left-glow" />
        <div className="left-glow-2" />
        <LeftPanelCarousel />
      </div>

      {/* RIGHT PANEL (dynamic page) */}
      <div className="right-panel">{children}</div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: var(--font-satoshi);
        }
          
        .auth-wrapper {
          display: flex;
          min-height: 100svh;
          width: 100%;
          background: #09090B;
        }

        .left-panel {
          width: 50%;
          position: relative;
          overflow: hidden;
          background: #0F1115;
          border-right: 1px solid #232A34;
        }

        .right-panel {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .left-glow {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%);
          animation: glowPulse1 8s ease-in-out infinite;
        }

        .left-glow-2 {
          position: absolute;
          bottom: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%);
          animation: glowPulse2 10s ease-in-out infinite;
          animation-delay: -3s;
        }

        @keyframes glowPulse1 {
          0%, 100% { transform: scale(1);   opacity: 1;    }
          50%       { transform: scale(1.15); opacity: 0.6; }
        }
              
        @keyframes glowPulse2 {
          0%, 100% { transform: scale(1);   opacity: 1;    }
          50%       { transform: scale(1.2); opacity: 0.5; }
        }

        
        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .left-panel  { display: none; }
          .right-panel { width: 100%; }
        }
      `}</style>
    </div>
  );
}
