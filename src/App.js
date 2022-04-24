import React, { useState } from "react";
import { getDistance } from "geolib";
import { lookUp } from "geojson-places";
import * as Suncalc from "suncalc";
import './App.css';
import { useEffect } from "react/cjs/react.production.min";

const App = () => {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [countryName, setCountryName] = useState("");
  const [distancePole, setDistancePole] = useState(0);
  const [distanceMoon, setDistanceMoon] = useState(0);
  const [laterror, setlaterror] = useState("");
  const [longerror, setlongerror] = useState("");
  const [dateerror, setdateerror] = useState("");
  const [part, setPart] = useState(0);
  const day = {
    year: 2020,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
  };

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

  useEffect(() => {
    setLatitude();
    setLongitude();
    setCountryName("");
  }, [part]);

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

  const calculateCountry = (tempLat, tempLong) => {
    setlongerror("");
    setlaterror("");
    let check = 0;
    if (isNaN(tempLat)) {
      setlaterror("Latitude must be between -90 and 90");
      check = 1;
    }
    if (isNaN(tempLong)) {
      setlongerror("Longitude must be between -180 and 180");
      check = 1;
    }
    if (check === 0) {
      tempLat = parseInt(tempLat);
      tempLong = parseInt(tempLong);
      const result = lookUp(tempLat, tempLong);
      setCountryName(result?.country_a3);
      if (longitude > 180 || longitude < -180) {
        setlongerror("Longitude must be between -180 and 180");
      }
      if (latitude > 90 || latitude < -90) {
        setlaterror("Latitude must be between -90 and 90");
      }
    }
    setLatitude();
    setLongitude();
  };

  const calcMoonDist = () => {
    const date = new Date(day.year, day.month, day.day, day.hour, day.minute, day.second);
    console.log(date);
    console.log(date.getTime());
    if (!isNaN(date)) {
      const moonPosition = Suncalc.getMoonPosition(day, latitude, longitude);
      setDistanceMoon(moonPosition.distance);
    } else {
      setdateerror("Date is wrong");
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1 id='parta' onClick={() => setPart(0)}>Part A</h1>
        <h1 id='partb' onClick={() => setPart(1)}>Part B</h1>
        <h1 id='partc' onClick={() => setPart(2)}>Part C</h1>
      </div>

      {part === 0 && (
        <div className="parts" id="calc1">
          <label>Latitude</label>
          <input
            id="lat_field"
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <label>Longitude</label>
          <input
            id="lon_field"
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
          <button id="calculate" onClick={() => calculateCountry(latitude, longitude)}> Calculate </button>
          <p id="country">{countryName}</p>
          <span id="longitude-error" >{longerror}</span>
          <span id="latitude-error" >{laterror}</span>
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
            id="year"
            type="text"
            onChange={(e) => day.year = (e.target.value)}
          />
          <label>Month</label>
          <input
            id="month"
            type="text"
            onChange={(e) => day.month = (e.target.value)}
          />
          <label>Day</label>
          <input
            id="day"
            type="text"
            onChange={(e) => day.day = (e.target.value)}
          />
          <label>Hour</label>
          <input
            id="hour"
            type="text"
            onChange={(e) => day.hour = (e.target.value)}
          />
          <label>Minute</label>
          <input
            id="minute"
            type="text"
            onChange={(e) => day.minute = (e.target.value)}
          />
          <label>Second</label>
          <input
            id="second"
            type="text"
            onChange={(e) => day.second = (e.target.value)}
          />
          <button id="calculate" onClick={() => calcMoonDist()}> Calculate </button>
          <h1>Distance to Moon is: <p id="distance">{parseInt(distanceMoon)}</p> km </h1>
          <span id="date-error" >{dateerror}</span>
        </div>
      )}
    </div>
  );
};

export default App;
