import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
    //<option>
    //null    =>  아무나 출입이 가능한 페이지
    //true    =>  로그인한 유저만 출입이 가능한 페이지
    //false   =>  로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();  //react-redux의 기능 사용

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)
                //로그인 하지 않은 상태 
                if (!response.payload.isAuth) {
                    if (option) { //===true
                        props.history.push('/login')
                    }
                } else {
                    //로그인 한 상태 
                    if (adminRoute && !response.payload.isAdmin) {
                        //admin이 아닌데 admin만 들어갈 수 있는 곳 가려고 하면
                        props.history.push('/') //랜딩 페이지로 보내줌
                    } else {
                        if (option === false) //로그인한 유저가 출입 불가능한 페이지에 들어가려고 하면
                            props.history.push('/') //랜딩 페이지로
                    }
                }
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}