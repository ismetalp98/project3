import React, { useEffect, useState } from "react";
import { getDistance } from "geolib";
import { lookUp } from "geojson-places";
import './App.css';

const App = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [countryName, setCountryName] = useState("");
  const [distancePole, setDistancePole] = useState(0);
  const [part, setPart] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const distance = getDistance(
        { latitude, longitude },
        { latitude: 90.0, longitude: 0.0 }
      );
      setDistancePole(distance);
    });
  }, []);

  const calculateCountry = () => {
    const result = lookUp(parseInt(latitude), parseInt(longitude));
    setCountryName(result.country_a3);
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1 onClick={() => setPart(0)}>Part A</h1>
        <h1 onClick={() => setPart(1)}>Part B</h1>
        <h1 onClick={() => setPart(2)}>Part C</h1>
      </div>

      {part === 0 && (
        <div className="part-b" id="calc1">
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
          <button onClick={() => calculateCountry()}> Calculate </button>
          <p>{countryName}</p>
        </div>
      )}
      {part === 1 && (
        <h1>Distances from the North Pole: {distancePole} meters</h1>
      )}
      {part === 2 && (
        <h1>Distance from the North Pole: { } meters</h1>
      )}
    </div>
  );
};

export default App;
