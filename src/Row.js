/** type 'rfce' for easy setup */
import React, { useState, useEffect } from 'react'
import axios from './axios';
import "./Row.css";
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';


const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // A snippet of code which runs based on a specific condition
    // So this code runs every time the rows are refreshed
    useEffect (() => {
        // if [] (blank), run once when the row loads and don't run again else it'll run every time the variable changes, this is called a dependency
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);// this is compulsory to put the variable that you are using outside the useEffect, cause it is a dependency

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || "")
                .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get("v"));
                })
                .catch((error) => console.log(error));
        }
    }

    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row__posters">

                {movies.map((movie) => (
                    <img 
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`} // everything gets the normal row poster class except for isLargeRow
                        src={`${base_url}${
                            isLargeRow ? movie.poster_path: movie.backdrop_path
                        }`} // a conditional statement
                        alt={movie.name}
                    />
                ))}
            </div>
            
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} /> }  {/* only show video when trailerurl available */}
        </div>
    )
}

export default Row;
