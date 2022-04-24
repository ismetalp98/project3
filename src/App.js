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
  const day = {
    year: 2022,
    month: 1,
    day: 1,
  }

  const inputs = (
    <>
      <label>Latitude</label>
      <input
        id="lat_field"
        type="number"
        onChange={(e) => setLatitude(e.target.value)}
      />
      <label>Longitude</label>
      <input
        id="lon_field"
        type="number"
        onChange={(e) => setLongitude(e.target.value)}
      />

    </>
  );

  const calcPoleDistGps = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const distance = getDistance(
        { latitude, longitude },
        { latitude: 90.0, longitude: 0.0 }
      );
      setDistancePole(distance);
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
    const date = new Date(day.year, day.month - 1, day.day);
    const moonPosition = Suncalc.getMoonPosition(date, latitude, longitude);
    setDistanceMoon(moonPosition.distance);
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1 onClick={() => setPart(0)}>Part A</h1>
        <h1 onClick={() => setPart(1)}>Part B</h1>
        <h1 onClick={() => setPart(2)}>Part C</h1>
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
          <button onClick={() => calcPoleDistLoc()}> Calculate </button>
          <button onClick={() => calcPoleDistGps()}> Use GPS Location </button>
          <h1>Distances from the North Pole: {distancePole} meters</h1>
        </div>
      )}
      {part === 2 && (
        <div className="parts" id="calc3">
          {inputs}
          <label>Year</label>
          <input
            id="lat_year"
            type="number"
            onChange={(e) => day.year = e.target.value}
          />
          <label>Month</label>
          <input
            id="lat_month"
            type="number"
            onChange={(e) => day.month = e.target.value}
          />
          <label>Day</label>
          <input
            id="lat_day"
            type="number"
            onChange={(e) => day.day = e.target.value}
          />
          <button onClick={() => calcMoonDist()}> Calculate </button>
          <h1>Distance to Moon is: { distanceMoon } meters</h1>
        </div>
      )}
    </div>
  );
};

export default App;
