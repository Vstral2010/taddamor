const clickButton = document.getElementById("clickButton");
const clickCountDisplay = document.getElementById("clickCount");
const ctx = document.getElementById("myChart").getContext("2d");

let clickCount = 0;
let dailyClicks = [0, 0, 0, 0, 0, 0, 0]; // Array for storing daily clicks (Sunday to Saturday)
const dailyLimit = 5; // Set the daily limit

// Load the stored data from localStorage
const loadStoredData = () => {
  const storedClicks = JSON.parse(localStorage.getItem("dailyClicks"));
  const storedDate = localStorage.getItem("lastClickedDate");

  if (storedClicks && storedDate) {
    dailyClicks = storedClicks;

    // Check if the stored date is the same as today
    const today = new Date().toLocaleDateString();
    if (storedDate !== today) {
      resetDailyClicks(); // Reset clicks if the date is different
    }
  }
  clickCount = dailyClicks.reduce((sum, count) => sum + count, 0); // Sum of all clicks
  clickCountDisplay.textContent = clickCount;
  updateChart();
};

// Store the current data to localStorage
const storeData = () => {
  const today = new Date().toLocaleDateString();
  localStorage.setItem("dailyClicks", JSON.stringify(dailyClicks));
  localStorage.setItem("lastClickedDate", today);
};

// Reset daily clicks when a new day starts
const resetDailyClicks = () => {
  dailyClicks = [0, 0, 0, 0, 0, 0, 0]; // Reset all daily clicks
  storeData(); // Save reset data
};

// Update the chart with the latest data
const updateChart = () => {
  myChart.data.datasets[0].data = dailyClicks;
  myChart.update();
};

// Handle button click event
clickButton.addEventListener("click", () => {
  const today = new Date().getDay();

  // Check if the daily limit has been reached
  if (dailyClicks[today] < dailyLimit) {
    clickCount++;
    dailyClicks[today]++;
    clickCountDisplay.textContent = clickCount;
    storeData(); // Store updated data

    updateChart();
  } else {
    alert("لقد وصلت إلى الحد اليومي!");
  }
});

// Initialize chart
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    datasets: [{
      label: "عدد النقرات حسب الأيام (هذا الأسبوع):",
      data: dailyClicks,
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: dailyLimit, // Set maximum to daily limit
        ticks: {
          stepSize: 1
        }
      }
    }
  }
});

// Load data on page load
loadStoredData();
