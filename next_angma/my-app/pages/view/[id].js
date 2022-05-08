import Axios from "axios";
import Head from "next/head";
import Item from "../../src/component/Item";

// getServerSideProps의 응답값 item을 Post 페이지에 props로 넘겨줄 수 있음.
const Post = ({ item, name }) => {
  return (
    <>
      {item && (
        <>
          {/* Head에 title이랑 meta 데이터 넣어주면 SEO가 읽을 수 있음. */}
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

// context에는 prams, 요청, 응답 쿼리 등이 담겨서 옴.
export async function getServerSideProps(context) {
  const id = context.params.id;
  const apiUrl = `http://makeup-api.herokuapp.com/api/v1/products/${id}.json`;
  // id와 api 호출하고 받아온 응답값을
  const res = await Axios.get(apiUrl);
  const data = res.data;

  return {
    props: {
      // item에 넣어줌
      item: data,
      name: process.env.name,
    },
  };
}
