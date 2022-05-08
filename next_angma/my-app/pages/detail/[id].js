import Axios from "axios";
import Head from "next/head";
import Item from "../../src/component/Item";

const Post = ({ item, name }) => {
  return (
    <>
      {item && (
        <>
          <Head>
            <title>{item.name}</title>
            <meta name="description" content={item.description}></meta>
          </Head>
          {name} 환경 입니다.
          <Item item={item} />
        </>
      )}
    </>
  );
};

export default Post;

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: "740" } },
      { params: { id: "730" } },
      { params: { id: "729" } },
    ],
    // fallback: true면 getStaticProps로 전달된 경로들은 빌드 타임에 만들어지는 것.
    // 나머지는 최초 접속 시 빈 화면으로 보여지게 되고 이외 백그라운드에서 정적 파일로 html과 json 생성해줌.
    // next.js는 프리렌더링 목록에 추가함.
    // 두 번째 접속부터는 접속생성된 페이지 사용함.
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // getServerSideProps()에서 함수명만 달라짐
  const id = context.params.id;
  const apiUrl = `http://makeup-api.herokuapp.com/api/v1/products/${id}.json`;
  const res = await Axios.get(apiUrl);
  const data = res.data;

  return {
    props: {
      item: data,
      name: process.env.name,
    },
  };
}
