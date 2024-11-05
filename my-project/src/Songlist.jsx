import React, { useState, useEffect } from "react";
import Postsong from "./Postsong";


const Songlist = ({ songs, TOKEN}) => {
  const [lagu, setLagu] = useState([]);
  const [newSong, setNewSong] = useState([]);

  useEffect(() => {
    if (songs.length > 0) {
      setLagu(songs);
    }
  }, [songs]);

  function handleCLick(index) {
    setNewSong((prevArray) => [...prevArray, lagu[index]]);
    setLagu((prevLagu) => prevLagu.filter((_, i) => i !== index));
    console.log(lagu)
  }

  return (
    <div className="flex flex-col sm:justify-center sm:flex-row p-4 gap-3">
      <div className="tracklist border border-black w-full px-5 pr-8 mt-10">
        <h1 className="font-bold text-2xl text-white my-3">Results</h1>
        <ul>
          {lagu.map((song, index) => (
            <li key={index}>
              <div className="border-b-2 border-b-slate-300 mb-5">
                <h2 className="font-bold text-white">{song.name}</h2>
                <div className="flex justify-between">
                  <p className="mt-0 mb-2  font-semibold text-gray-500 text-xs">
                    {" "}
                    {song.artists[0].name} | {song.album.name}
                  </p>
                  <span
                    className="add text-xl relative text-blue-50"
                    onClick={() => handleCLick(index)}
                  >
                    +
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Postsong playlist = {newSong}/>
    </div>
  );
};

export default Songlist;
