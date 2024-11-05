import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const client_id = import.meta.env.VITE_CLIENT_ID;
const redirect_uri = "http://localhost:5173";
const scope = "user-read-private user-read-email playlist-modify-public playlist-modify-private";
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

const Postsong = ({ playlist }) => {
  const [NamaPlaylist, setNamaPlaylist] = useState("Playlist");
  const [accessToken, setAccessToken] = useState(null);
  const location = useLocation();
  const [newPL, setNewPL] = useState([]);

  // Update `newPL` ketika `playlist` berubah
  useEffect(() => {
    if (playlist.length > 0) {
      const updatedPL = playlist.map((element) => element.uri);
      setNewPL(updatedPL);
    }
  }, [playlist]);

  // Mendapatkan kode dari query parameter untuk otorisasi
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code && !accessToken) {
      fetchAccessToken(code);
    }
  }, [location, accessToken]);

  // Fungsi untuk menangani perubahan input nama playlist
  function handleChange(e) {
    setNamaPlaylist(e.target.value);
  }

  // Fungsi untuk mengonversi objek ke format query string
  function objectToQueryString(obj) {
    const keys = Object.keys(obj);
    const keyValuePairs = keys.map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    return keyValuePairs.join("&");
  }

  // Fungsi untuk mendapatkan akses token menggunakan authorization code
  async function fetchAccessToken(code) {
    const credentials = btoa(`${client_id}:${client_secret}`);
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + credentials,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirect_uri,
        }),
      });

      const data = await response.json();
      console.log("Access token data:", data);
      setAccessToken(data.access_token);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  }

  async function handleSave() {
    if (!accessToken) {
      const authParams = {
              response_type: "code",
              client_id: client_id,
              scope: scope,
              redirect_uri: redirect_uri,
              state: Math.random().toString(36).substring(2),
            };
            window.location.href =
              "https://accounts.spotify.com/authorize?" + objectToQueryString(authParams);
    }else{
      try {
        const playlistParams = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            name: NamaPlaylist,
            description: "New playlist description",
            public: false,
          }),
        };
  
        // Membuat playlist baru
        const res = await fetch("https://api.spotify.com/v1/me/playlists", playlistParams);
        const data = await res.json();
        console.log("Created playlist:", data);
  
        const playlist_id = data.id;
  
        // Menambahkan track ke playlist yang baru dibuat
        const trackParams = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          body: JSON.stringify({
            uris: newPL,
            position: 0,
          }),
        };
  
        const resT = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, trackParams);
        const dataT = await resT.json();
        console.log("Added tracks:", dataT);
      } catch (error) {
        console.error("Error saving playlist:", error);
      }
      if(newPL){
        window.location.reload();
      }
    }

  }

  return (
    <div className="tracklist border border-black w-full px-5 pr-8 mt-10">
      <input
        className="list font-bold text-3xl text-white my-6 focus:outline-none"
        id="NamaPlaylist"
        name="NamaPlaylist"
        value={NamaPlaylist}
        onChange={handleChange}
      />

      <ul>
        {playlist.map((pl, index) => (
          <li key={index}>
            <div className="border-b-2 border-b-slate-300 mb-5">
              <h2 className="font-bold text-white">{pl.name}</h2>
              <div className="flex justify-between">
                <p className="mt-0 mb-2 font-semibold text-gray-500 text-xs">
                  {pl.artists[0].name} | {pl.album.name}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-5 border-r-fuchsia-800 rounded-2xl bg-violet-500 py-2 px-6 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white mb-6"
        onClick={handleSave}
      >
        Save to Spotify
      </button>
    </div>
  );
};

export default Postsong;
