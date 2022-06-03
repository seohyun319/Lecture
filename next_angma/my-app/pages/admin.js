import Axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";

export default function Admin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);

  function checkLogin() {
    Axios.get("/api/isLogin").then((res) => {
      if (res.status === 200 && res.data.name) {
        //로그인
        setIsLogin(true);
      } else {
        //로그인 안 된 상태면 로그인 페이지로 보냄
        router.push("/login");
      }
    });
  }

  function logout() {
    // 로그아웃하면 첫화면으로 보냄
    Axios.get("/api/logout").then((res) => {
      if (res.status === 200) {
        router.push("/");
      }
    });
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      admin
      {/* 로그인한 상태이면 로그아웃 버튼 보임. */}
      {isLogin && <Button onClick={logout}>Logout</Button>}
    </>
  );
}
