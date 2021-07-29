import React, { useEffect, useState } from 'react'
import { API_URL, API_KEY } from '../../Config'
import MainImage from '../../views/LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';

function MovieDetailPage(props) {

    let movieId = props.match.params.movieId 
    const [Movie, setMovie] = useState([])

    useEffect(() => { //useEffect는 dom이 로드되면 할 동작을 넣어주는 것

        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
		let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;
        fetch(endpointInfo)  //fetch를 이용해 정보 가져옴
            .then(response => response.json()) //정보 json으로 받아옴
            .then(response => {
                console.log(response)
                setMovie(response)
            })

    }, [])



		return (
            <div>
                {/* Header */}
                
                    <MainImage
                        image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${Movie.backdrop_path}`}
                        title={Movie.original_title}     /* 현재 state이 movie니까 movie로 넣어줌*/
                        text={Movie.overview}
                    />              

                {/* Body */}
                <div style={{ width: '85%', margin: '1rem auto' }}>

                    {/* Movie Info */}
                    
                        <MovieInfo 
                            movie={Movie} /> //movie state에 movie 넣어줌
                                           

                    <br />
                    {/* Actors Grid*/}

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                        <Button>Toggle Actor View </Button>
                    </div>

                </div>

            </div>
		    )
		}
		
		export default MovieDetail