import React, { useEffect, useState } from 'react'
import { API_URL, API_KEY } from '../../Config';

function LandingPage() {


    const [Movies, setMovies] = useState([])  //array로 usestate 정보 받아옴

    useEffect(() => {   //api 가져옴
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(endpoint)  //현재 인기있는 영화 가져옴

    }, [])


    const fetchMovies = (endpoint) => {
        fetch(endpoint)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setMovies([...response.results])
                setMainMovieImage(response.results[0])
                setCurrentPage(response.page)
            })
    }

  


    return (
        <div style={{ width: '100%', margin: '0' }}>

            {/* Main Image */}
            


            <div style={{ width: '85%', margin: '1rem auto' }}>

                <h2>Movies by latest</h2>
                <hr />

                {/* Movie Grid Cards */}

            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button> Load More</button>
            </div>

        </div>
    )
}

export default LandingPage