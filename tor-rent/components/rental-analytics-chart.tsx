"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface RentalAnalyticsChartProps {
  type: "expenses" | "credScore"
}

export function RentalAnalyticsChart({ type }: RentalAnalyticsChartProps) {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    // Generate static data based on chart type
    if (type === "expenses") {
      setChartData({
        labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Monthly Rent (ETH)",
            data: [0.06, 0.06, 0.06, 0.15, 0.15, 0.15],
            borderColor: "rgb(249, 115, 22)",
            backgroundColor: "rgba(249, 115, 22, 0.5)",
            tension: 0.3,
          },
        ],
      })
    } else if (type === "credScore") {
      setChartData({
        labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Cred Score",
            data: [85, 87, 88, 90, 91, 92],
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            tension: 0.3,
          },
        ],
      })
    }
  }, [type])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: type === "expenses",
      },
    },
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  )
}

