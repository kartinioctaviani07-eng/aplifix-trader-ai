import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "APLIFIX DIGITAL — Bagaimana Jika Kantor Trading Dijalankan AI?";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background:
            "radial-gradient(circle at 85% 15%, rgba(16,185,129,0.24), transparent 30%), radial-gradient(circle at 10% 90%, rgba(16,185,129,0.12), transparent 35%), #020617",
          color: "white",
          fontFamily: "Arial",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-120px",
            top: "-120px",
            width: "430px",
            height: "430px",
            border: "2px solid rgba(16,185,129,0.14)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "-45px",
            top: "-45px",
            width: "280px",
            height: "280px",
            border: "2px solid rgba(16,185,129,0.10)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "34px",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "16px",
              border: "1px solid rgba(52,211,153,0.35)",
              background: "rgba(16,185,129,0.10)",
              color: "#34d399",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            A
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "27px",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            APLIFIX
            <span style={{ color: "#34d399", marginLeft: "8px" }}>
              DIGITAL
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "58px",
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: "-2px",
            maxWidth: "980px",
          }}
        >
          Bagaimana Jika Kantor
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "58px",
            lineHeight: 1.08,
            fontWeight: 800,
            letterSpacing: "-2px",
            color: "#34d399",
            maxWidth: "980px",
          }}
        >
          Trading Dijalankan AI?
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "32px",
            fontSize: "23px",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          CEO AI • Market Analyst AI • Risk AI • Trade Executor AI
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "22px",
            fontSize: "18px",
            color: "#64748b",
          }}
        >
          Digital intelligence untuk membaca market, mengambil keputusan,
          menjalankan simulasi, dan memantau posisi.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
