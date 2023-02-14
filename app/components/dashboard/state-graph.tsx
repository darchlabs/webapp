import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Working Services",
    },
  },
  scales: {
    y: {
      suggestedMax: 100,
      suggestedmMin: 0,

      title: {
        text: "%",
        display: true,
      },
    },
    x: {
      title: {
        text: "Hours",
        display: true,
      },
    },
  },
};

export default function StateGraph({
  input,
  labels,
}: {
  input: number[];
  labels: string[];
}) {
  // TODO
  const data = {
    labels,
    datasets: [
      {
        label: "Working Services",
        data: input,
        borderColor: "rgb(199,21,133)",
        backgroundColor: "rgba(199,21,133, 0.75)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
