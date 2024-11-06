const clickButton = document.getElementById("clickButton");
const clickCountDisplay = document.getElementById("clickCount");
const ctx = document.getElementById("myChart").getContext("2d");

let clickCount = 0;
let dailyClicks = [0, 0, 0, 0, 0, 0, 0]; // Array for storing daily clicks (Thursday to Wednesday)
const dailyLimit = 9; // New daily limit

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
  myChart.data.datasets[0].data = dailyClicks; // Update the chart data
  myChart.update(); // Re-render the chart with the new data
};

// Handle button click event
clickButton.addEventListener("click", () => {
  const today = new Date().getDay();

  // Adjust the `today` value to match Thursday to Wednesday (Thursday is 0)
  const adjustedToday = (today === 0) ? 6 : today - 1;

  // Check if the daily limit has been reached
  if (dailyClicks[adjustedToday] < dailyLimit) {
    clickCount++; // Increase the total click count
    dailyClicks[adjustedToday]++; // Increase the count for the clicked day
    clickCountDisplay.textContent = clickCount; // Update the total clicks on the page
    storeData(); // Save the updated data to localStorage

    updateChart(); // Update the chart with the new data
  } else {
    alert("لقد وصلت إلى الحد اليومي!"); // Notify user when limit is reached
  }
});

// Initialize chart with orange color scheme
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"], // Days in Arabic from right to left
    datasets: [{
      label: "عدد النقرات حسب الأيام (هذا الأسبوع):",
      data: dailyClicks,
      backgroundColor: "rgba(255, 165, 0, 0.6)", // Orange bars
      borderColor: "rgba(255, 165, 0, 1)", // Orange border
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: dailyLimit, // Set maximum to daily limit
        ticks: {
          stepSize: 1
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 165, 0, 1)', // Legend text in orange
        }
      }
    }
  }
});

// Load data on page load
loadStoredData();

