import React, { useState, useEffect } from "react";

import Songlist from "./Songlist";

var client_id = toString(import.meta.env.VITE_CLIENT_ID) ;
var client_secret = toString(import.meta.env.VITE_CLIENT_SECRET);

function App() {
  const [input, setInput] = useState("");
  const [token, setToken] = useState("");
  const [track, setTrack] = useState([]);

  useEffect(() => {
    var authOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        client_id +
        "&client_secret=" +
        client_secret,
      json: true,
    };
    async function getToken() {
      const res = await fetch(
        "https://accounts.spotify.com/api/token",
        authOptions
      );
      const data = await res.json();
    
      setToken(data.access_token);
    }
    getToken();
  }, []);

  function handleChange(e) {
    setInput(e.target.value);
  }

 async function handleSearch() {
    let artisParam = {
      method : 'GET',
      headers:{
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + token
      }
    }
    let res = await fetch('https://api.spotify.com/v1/search?q=' + input + '&type=artist', artisParam)
    let data = await res.json()
    let artisID = data.artists.items[0].id
    
    let lagu = await fetch('https://api.spotify.com/v1/artists/' + artisID +'/top-tracks',artisParam)
    let datalagu = await lagu.json()
    setTrack(datalagu.tracks)
  }
  return (
    <div >
      <div className="flex flex-col items-center mt-8">
        <input
          className="w-80 p-3 rounded-md "
          type="text"
          name="judul"
          id="judul"
          onChange={handleChange}
        />
        <button
          className="mt-5 border-r-fuchsia-800 rounded-2xl bg-violet-500 py-2 px-6 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <Songlist 
        songs={track}   
        TOKEN = {token} 
      />
      
    </div>
  );
}

export default App;
