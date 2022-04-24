import React, { useState } from "react";
import { getDistance } from "geolib";
import { lookUp } from "geojson-places";
import * as Suncalc from "suncalc";
import './App.css';

const App = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [countryName, setCountryName] = useState("");
  const [distancePole, setDistancePole] = useState(0);
  const [distanceMoon, setDistanceMoon] = useState(0);
  const [part, setPart] = useState(0);
  const day = new Date();

  const inputs = (
    <>
      <label>Latitude</label>
      <input
        id="lat_field"
        type="number"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <label>Longitude</label>
      <input
        id="lon_field"
        type="number"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />

    </>
  );

  const usegpsdist = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
    });
  };

  const calcPoleDistLoc = () => {
    const distance = getDistance(
      { latitude, longitude },
      { latitude: 90.0, longitude: 0.0 }
    );
    setDistancePole(distance);
  };

  const calculateCountry = () => {
    const result = lookUp(parseInt(latitude), parseInt(longitude));
    console.log(result);
    setCountryName(result?.country_a3);
  };

  const calcMoonDist = () => {
    console.log(day);
    const moonPosition = Suncalc.getMoonPosition(day, latitude, longitude);
    setDistanceMoon(moonPosition.distance);
  };

  return (
    <div className="App">
      <p id="title" hidden={true}> {part} </p>
      <div className="App-header">
        <h1 id='parta' onClick={() => setPart(0)}>Part A</h1>
        <h1 id='partb' onClick={() => setPart(1)}>Part B</h1>
        <h1 id='partc' onClick={() => setPart(2)}>Part C</h1>
      </div>

      {part === 0 && (
        <div className="parts" id="calc1">
          {inputs}
          <button onClick={() => calculateCountry()}> Calculate </button>
          <p>{countryName}</p>
        </div>
      )}
      {part === 1 && (
        <div className="parts" id="calc2">
          {inputs}
          <button id="calcdist" onClick={() => calcPoleDistLoc()}> Calculate </button>
          <button id="usegps" onClick={() => usegpsdist()}> Use GPS </button>
          <h1>Distances from the North Pole: <p id="distance">{distancePole.toString().substring(0, 4)}</p> km</h1>
        </div>
      )}
      {part === 2 && (
        <div className="parts" id="calc3">
          {inputs}
          <label>Year</label>
          <input
            id="lat_year"
            type="number"
            onChange={(e) => day.setFullYear(e.target.value)}
          />
          <label>Month</label>
          <input
            id="lat_month"
            type="number"
            onChange={(e) => day.setMonth(e.target.value)}
          />
          <label>Day</label>
          <input
            id="lat_day"
            type="number"
            onChange={(e) => day.setDate(e.target.value)}
          />
          <label>Hour</label>
          <input
            id="lat_day"
            type="number"
            onChange={(e) => day.setHours(e.target.value)}
          />
          <label>Minute</label>
          <input
            id="lat_day"
            type="number"
            onChange={(e) => day.setMinutes(e.target.value)}
          />
          <label>Second</label>
          <input
            id="lat_day"
            type="number"
            onChange={(e) => day.setSeconds(e.target.value)}
          />
          <button onClick={() => calcMoonDist()}> Calculate </button>
          <h1>Distance to Moon is: {parseInt(distanceMoon)} km </h1>
        </div>
      )}
    </div>
  );
};

export default App;
