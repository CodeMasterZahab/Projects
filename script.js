let pumpOn = false;

function updateDashboard(data) {
  document.getElementById("moisture").innerText = data.moisture + " %";
  document.getElementById("humidity").innerText = data.humidity + " %";
  document.getElementById("temperature").innerText = data.temperature + " °C";
  document.getElementById("pumpStatus").innerText = data.pump ? "ON" : "OFF";

  const ctx = document.getElementById("moistureChart").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
      datasets: [{
        label: 'Soil Moisture (%)',
        data: data.chart,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      }
    }
  });
}

function fetchData() {
  fetch("/get_data")
    .then(res => res.json())
    .then(data => updateDashboard(data));
}

function togglePump() {
  fetch("/toggle_pump", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      document.getElementById("pumpStatus").innerText = data.pump ? "ON" : "OFF";
    });
}

window.onload = fetchData;
