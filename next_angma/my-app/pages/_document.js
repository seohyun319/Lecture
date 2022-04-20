import Document, { Html, Head, Main, NextScript } from "next/document";

// Html. head, body 등을 이용해야 할 때 이 파일 필수적으로 사용해야.
class MyDocument extends Document {
  render() {
    return (
      <Html lang="ko">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
