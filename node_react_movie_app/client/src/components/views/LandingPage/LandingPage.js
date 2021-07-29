import React,{useEffect} from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
        .then(response => {console.log(response)})
    }, [])

    const onClickHandler = () => {
        axios.get(`/api/users/logout`)
            .then(response => {
                if (response.data.success) {
                    props.history.push("/login") 
                    //이거 쓰려면 withRouter로 맨 마지막줄 export 해줘야. history가 withRouter 돔 이용해서 한 거라서. 
                } else {
                    alert('로그아웃 하는데 실패 했습니다.')
                }
            })
    }
    
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems:'center',
            width:'100%', height:'100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)
