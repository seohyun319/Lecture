import Gnb from "./Gnb";

export default function Top() {
  return (
    <div>
      <div style={{ display: "flex", paddingTop: 20 }}>
        <div style={{ flex: "100px 0 0" }}>
          <img
            src="/images/angma.png"
            alt="logo"
            style={{ display: "block", width: 80 }}
          />
        </div>
      </div>
      <Gnb />
    </div>
  );
}
