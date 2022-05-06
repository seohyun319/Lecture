import Axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Item from "../../src/component/Item";

const Post = () => {
  // 라우터
  const router = useRouter();
  // [id].js로 파일 만들어줬을 때 라우터에 {id}값 아무거나 들어오면 여기로 라우팅됨.
  const { id } = router.query;

  const [item, setItem] = useState({});

  const API_URL = `http://makeup-api.herokuapp.com/api/v1/products/${id}.json`;

  function getData() {
    Axios.get(API_URL).then((res) => {
      setItem(res.data);
    });
  }

  useEffect(() => {
    // id가 있고 0보다 클 경우
    if (id && id > 0) {
      getData();
    }
  }, [id]);

  // return <p>Post: {id}</p>
  return <Item item={item} />;
};

export default Post;
