import Head from 'next/head';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';


export default function Home() {
  // UseState for storing the data from the API
  const [mixData, setMixData] = useState([]);
  const [chargingWindow, setChargingWindow] = useState(null);
  const [hours, setHours] = useState(2);


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#E03C31', '#FF69B4', '#CD853F', '#808080'];

  useEffect(() => {
    // Async function to fetch the data from the API
    async function fetchData() {
      const response_energy_mix = await axios.get('http://localhost:8081/api/energy-mix');
      const response_charging_window = await axios.get('http://localhost:8081/api/charging-window?hours=2');

      const rawDays = response_energy_mix.data.days;
      const coloredDays = rawDays.map(day => ({
        ...day,
        sources: day.sources.map((source, index) => ({
          ...source,
          fill: COLORS[index % COLORS.length]
        }))
      }));

      setMixData(coloredDays); // Returns an array of 3 days with fuel sources (colored)
      setChargingWindow(response_charging_window.data); // Returns the best time to charge for given hours
    }
    fetchData();
  }, []); // Refresh at the start

  const fetchNewWindow = async (hours) => {
    // Async function to fetch the best time to charge for the given hours
    try {
      const response = await axios.get(`http://localhost:8081/api/charging-window?hours=${hours}`)
      setChargingWindow(response.data)
    }
    catch (error) {
      console.error("Error with fetching data from API: ", error)
    }
  }

  return (
    <>
      <Head>
        <title>Energy Mix Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Background */}
      <main className="bg-light min-vh-100 py-5">



        {/* Container */}
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h1 className="fw-bold text-success">Energy Mix Dashboard</h1>
            </div>
          </div>
          {/* Loading Spinner */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card shadow-sm border-success">
                <div className="card-body text-center">
                  <h5 className="card-title text-success">Best time to charge</h5>
                  <div className="card-text text-muted">
                    {chargingWindow ? (
                      <>
                        <div className="d-flex justify-content-center align-items-center gap-4 mb-3 mt-3">
                          <div className="text-dark fs-4 fw-normal">
                            {new Date(chargingWindow.start).toLocaleDateString()} <br />
                            <strong>{new Date(chargingWindow.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</strong>
                          </div>
                          <div className="text-muted fs-5 fw-light">do</div>
                          <div className="text-dark fs-4 fw-normal">
                            {new Date(chargingWindow.end).toLocaleDateString()} <br />
                            <strong>{new Date(chargingWindow.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</strong>
                          </div>
                        </div>
                        <p className="mb-4 fs-5">
                          Clean energy: <strong className="text-success">{chargingWindow.cleanEnergyPerc.toFixed(1)}%</strong>
                        </p>
                      </>
                    ) : (
                      "Loading..."
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted">Set charging time (1-6h):</label>
                    <div className="d-flex justify-content-center gap-2">

                      <input
                        type="number"
                        className="form-control text-center"
                        style={{ width: "80px" }}
                        min="1"
                        max="6"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                      />

                      <button
                        className="btn btn-success"
                        onClick={() => fetchNewWindow(hours)}
                        disabled={hours < 1 || hours > 6}
                      >
                        Calculate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">

            {/* Iterate over the days in the mixData array */}
            {mixData.map((day) => (

              /* Each day as a 4/12 column */
              <div className="col-lg-4 mb-4" key={day.date}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{day.date}</h5>

                    <div style={{ height: '400px', width: '100%' }}>
                      {/* ResponsiveContainer allows the chart to resize */}
                      <ResponsiveContainer>
                        {/* PieChart is the main component for the pie chart */}
                        <PieChart>
                          <Pie
                            data={day.sources}
                            dataKey="perc"
                            nameKey="fuel"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label={({ perc }) => perc >= 10 ? `${Number(perc).toFixed(2)}%` : null}
                            labelLine={false}
                          />
                          <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="card-text text-muted mt-3 text-center">
                      Percentage of clean energy: {day.perc.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
