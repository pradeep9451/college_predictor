import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function TrendComparison() {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        percentile: 90, // test input
        branch: "Information Technology",
        category: "GOPENH",
        year: 2025
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // if response has matches -> set them
        if (data.matches) {
          setColleges(data.matches);
        } else {
          setColleges([]);
        }
      })
      .catch((err) => console.error("Error fetching trends:", err));
  }, []);

  const years = ["2019", "2020", "2021", "2022"];
  const chartData = years.map((year) => {
    const entry = { Year: year };
    colleges.forEach((c) => {
      if (c.trends) {
        const trend = c.trends.find(
          (t) => t.year?.toString() === year.toString()
        );
        entry[c.college] = trend ? trend.percentile : null;
      }
    });
    return entry;
  });

  return (
    <div style={{ width: "100%", height: 600, padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Top 20 Colleges – Cutoff Trends (2019–2022)
      </h2>

      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />

          {Array.isArray(colleges) &&
            colleges.map((c, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={c.college}
                stroke={`hsl(${(i * 40) % 360}, 70%, 50%)`}
                strokeWidth={2}
                dot={false}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendComparison;
