"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserChartProps {
  data: { quizSet: string; average: number }[];
}

const UserChart: React.FC<UserChartProps> = ({ data }) => {
  const quizSets = data.map((item) => item.quizSet);
  const counts = data.map((item) => item.average);

  const chartData: ChartData<"bar"> = {
    labels: quizSets,
    datasets: [
      {
        label: "Average Correct Percentage",
        data: counts,
        backgroundColor: "#02a9ea",
        borderColor: "#0293bb",
        borderWidth: 1,
        barThickness: 60,
        maxBarThickness: 60,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      title: {
        display: true,
        text: "Average Correct Percentage",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Quiz Sets",
        },
      },
      y: {
        title: {
          display: true,
          text: "Average Correct Percentage",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] flex justify-center items-center m-auto p-4 border-4 dark:border  border-[#02a9ea] rounded-lg">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default UserChart;
