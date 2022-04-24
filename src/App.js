import React, { useState, useEffect } from "react";
import { getDistance } from "geolib";
import { lookUp } from "geojson-places";
import * as Suncalc from "suncalc";
import './App.css';

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
  const [dayState, setDayState] = useState({
    year: 'asd',
    month: 'asd',
    day: 'asd',
    hour: 'asd',
    minute: 'asd',
    second: 'asd',
  });

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
    if (dayState.month < 0 || dayState.month > 12 || dayState.day < 0 || dayState.day > 31 || dayState.hour < 0 || dayState.hour > 23 || dayState.minute < 0 || dayState.minute > 59 || dayState.second < 0 || dayState.second > 59) {
      setDistanceMoon('NaN');
      setdateerror("Date is wrong");
    } else {
      const date = new Date(dayState.year, dayState.month, dayState.day, dayState.hour, dayState.minute, dayState.second);
      if (!isNaN(date)) {
        const moonPosition = Suncalc.getMoonPosition(date, latitude, longitude);
        setDistanceMoon(moonPosition.distance);
        setdateerror("");
      } else {
        setDistanceMoon('NaN');
        setdateerror("Date is wrong");
      }
    }
    setLatitude();
    setLongitude();
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
            onChange={(e) => setDayState({ ...dayState, year: e.target.value })}
          />
          <label>Month</label>
          <input
            id="month"
            type="text"
            onChange={(e) => setDayState({ ...dayState, month: e.target.value })}
          />
          <label>Day</label>
          <input
            id="day"
            type="text"
            onChange={(e) => setDayState({ ...dayState, day: e.target.value })}
          />
          <label>Hour</label>
          <input
            id="hour"
            type="text"
            onChange={(e) => setDayState({ ...dayState, hour: e.target.value })}
          />
          <label>Minute</label>
          <input
            id="minute"
            type="text"
            onChange={(e) => setDayState({ ...dayState, minute: e.target.value })}
          />
          <label>Second</label>
          <input
            id="second"
            type="text"
            onChange={(e) => setDayState({ ...dayState, second: e.target.value })}
          />
          <button id="calculate" onClick={() => calcMoonDist()}> Calculate </button>
          <button id="usegps" onClick={() => usegpsdist()}> Use GPS </button>
          <h1>Distance to Moon is: <p id="distance">{parseInt(distanceMoon)}</p> km </h1>
          <span id="date-error" >{dateerror}</span>
        </div>
      )}
    </div>
  );
};

export default App;
