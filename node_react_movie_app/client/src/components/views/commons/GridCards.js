import React from 'react'
import { Col } from 'antd';


function GridCards(props) {

    if (props.landingPage) {
        return (   
            <Col lg={6} md={8} xs={24}>   {/*low 총 24. 젤 작을 때 1개, 중간일 때 3개 이런 식으로 띄워줌*/}
                <div style={{ position: 'relative' }}>
                    <a href={`/movie/${props.movieId}`} >
                        <img style={{ width: '100%', height: '320px' }} src={props.image} alt={props.movieName} />
                    </a>
                </div>
            </Col>
        )
    } else {
        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{ position: 'relative' }}>

                    <img style={{ width: '100%', height: '320px' }} src={props.image} alt={props.characterName} />

                </div>
            </Col>
        )
    }

}

export default GridCards