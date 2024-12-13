<template>
  <div>
    <div class="header">
      <h1>Poverty Data Visualization</h1>
      <button class="logout-button" @click="logout">Logout</button>
    </div>
    <div class="chart-container">
      <canvas id="povertyLineChart"></canvas>
    </div>
    <h2>Alternative Visualization</h2>
    <div class="chart-container">
      <canvas id="povertyBarChart"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useRouter } from 'vue-router';


Chart.register(...registerables);

export default defineComponent({
  name: 'DashboardView',
  setup() {
    const router = useRouter();
    const fetchPovertyData = async () => {
      try {
        const response = await fetch('https://api.worldbank.org/pip/v1/pip?country=PER');
        const data = await response.json();

        const povertyData: Array<{ reporting_year: string; headcount: number }> =
          Array.isArray(data) ? data : data.data || [];

        if (!povertyData.length) {
          console.error('No data available');
          return;
        }

        const labels = povertyData.map((item) => item.reporting_year);
        const headcountData = povertyData.map((item) => item.headcount);

        renderLineChart(labels, headcountData);
        renderBarChart(labels, headcountData);
      } catch (error) {
        console.error('Error fetching or rendering data:', error);
      }
    };


    const renderLineChart = (labels: string[], data: number[]) => {
      const ctx = document.getElementById('povertyLineChart') as HTMLCanvasElement;
      if (!ctx) {
        console.error('Canvas element not found');
        return;
      }

      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Poverty Headcount (%)',
              data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    };

    const renderBarChart = (labels: string[], data: number[]) => {
      const ctx = document.getElementById('povertyBarChart') as HTMLCanvasElement;
      if (!ctx) {
        console.error('Canvas element not found');
        return;
      }

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Poverty Headcount (%)',
              data,
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };

    const logout = async () => {
      localStorage.clear();
      await router.push('/');
    };

    onMounted(fetchPovertyData);

    return {
      logout,
    };
  },
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  margin: 30px 0 20px;
}

.chart-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

canvas {
  width: 100%;
  height: 500px;
}
</style>
