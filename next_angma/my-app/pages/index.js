import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>HOME</title>
      </Head>
      create-next-app 으로 설치하면 <br />
      1. 컴파일과 번들링이 자동으로 됨 (webpack 과 babel)
      <br />
      2. 자동 리프레쉬 기능으로 수정하면 화면에 바로 반영
      <br />
      3. 서버사이드 렌더링 지원
      <br />
      4. 스태틱(정적) 파일 지원
      <br />
    </div>
  );
}
