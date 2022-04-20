import "../styles/globals.css";
// import "semantic-ui-css/semantic.min.css";
import Top from "../src/component/Top";
import Footer from "../src/component/Footer";

// MyApp의 props로 넘어온 Component: 현재 페이지. 페이지 전환 시 component props가 변경.
// pageProps는 데이터 patching 메서드를 통해 미리 가져온 초기 객체. 이 메서드 사용 안 하면 빈 객체 전달.
function MyApp({ Component, pageProps }) {
  return (
    <div style={{ width: 1000, margin: "0 auto" }}>
      <Top />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

export default MyApp;

/*
_app.js 이용 시:
페이지 전환시 레이아웃 유지 가능.
페이지 전환시 상태값 유지 가능.
componentDidCatch를 이용해 커스텀 에러 핸들링 가능.
추가적인 데이터를 페이지로 주입 가능.
글로벌 CSS 를 이곳에 선언.
 */
