import React, { useEffect } from 'react'
import { API_URL, API_KEY } from '../../Config'

function MovieDetailPage(props) {

    let movieId = props.match.params.movieId 

    useEffect(() => { //useEffect는 dom이 로드되면 할 동작을 넣어주는 것

        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
				let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;
        fetch(endpointInfo)  //fetch를 이용해 정보 가져옴
            .then(response => response.json()) //정보 json으로 받아옴
            .then(response => {
                console.log(response)
            })

    }, [])



		return (
		        <div>
		            
		        </div>
		    )
		}
		
		export default MovieDetail