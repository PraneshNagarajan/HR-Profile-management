import { Card } from "react-bootstrap";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Line, HorizontalBar } from "react-chartjs-2";
import { useMediaQuery } from "react-responsive";

const Charts = (props) => {
  const sm = useMediaQuery({ maxWidth: 768 });
  Chart.plugins.register(ChartDataLabels);
  const chartDatas = Object.values(props.datas);
  const data = [];
  const bg_color = [];
  const border_color = [];
  const datasets = [];
  const supply_bg_color = [];
  const supply_border_color = [];
  const demand_bg_color = [];
  const demand_border_color = [];
  const supplyDatas = [];
  const demandDatas = [];
  const labels = [];

  if (props.type === "Hbar") {
    chartDatas.slice(0, -1).map((item) => {
      const data = {
        label: item.label,
        data: item.count,
        backgroundColor: item.bg_color,
        borderColor: item.border_color,
        borderWidth: 1,
      };
      datasets.push(data);
    });
  } else if (props.type === "line") {
    chartDatas.map((item) => {
      labels.push(item.label);
      data.push(item.count);
      bg_color.push(item.bg_color);
      border_color.push(item.border_color);
    });
    datasets.push({
      label: {
        display: false,
      },
      data,
      backgroundColor: bg_color,
      borderColor: border_color,
      borderWidth: 1,
    });
  } else {
    chartDatas.map((item) => {
      labels.push(item.name);
      supplyDatas.push(
        props.title.includes("Days")
          ? item.supply.days_worked
          : item.supply.count
      );
      demandDatas.push(
        props.title.includes("Days")
          ? item.demand.days_worked
          : item.demand.count
      );
      supply_bg_color.push(item.supply.bg_color);
      demand_bg_color.push(item.demand.bg_color);
      supply_border_color.push(item.supply.border_color);
      demand_border_color.push(item.demand.border_color);
    });
    datasets.push(
      {
        label: "Supply",
        data: supplyDatas,
        backgroundColor: supply_bg_color,
        borderColor: supply_border_color,
        borderWidth: 1,
      },
      {
        label: "Demand",
        data: demandDatas,
        backgroundColor: demand_bg_color,
        borderColor: demand_border_color,
        borderWidth: 1,
      }
    );
  }

  const Hbardata = {
    datasets,
  };

  const lineData = {
    labels,
    datasets,
  };

  const barData = {
    labels,
    datasets,
  };

  const options1 = {
    title: {
      display: true,
      text: props.title,
      position: "top",
    },
    legend: {
      labels: {
        filter: function (label) {
          if (label.text != "Supply") return true; //only show when the label is cash
        },
      },
    },
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
            stepSize: sm ? 10 : 10,
          },
          gridLines: {
            display: true,
          },
          max: 100,
        },
      ],
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: true,
          },
        },
      ],
    },
  };

  const options = {
    legend: {
      labels: {
        filter: function (label) {
          if (label.text != undefined) return true; //only show when the label is cash
        },
      },
      display: props.type === "line" ? false : true,
      position: "top",
    },
    plugins: {
      datalabels: {
        display: true,
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
            stepSize: sm ? 10 : 5,
          },
          gridLines: {
            display: true,
          },
          max: 100,
        },
      ],
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: true,
          },
        },
      ],
    },
    title: {
      display: true,
      text: props.title,
      position: "top",
    },
  };

  return (
    <Card
      className={`mx-1 my-2 ${sm ? `mx-1` : ``}`}
      style={{ width: props.width, height: props.height }}
    >
      {props.type === "Vbar" && <Bar data={barData} options={options} />}
      {props.type === "line" && <Line data={lineData} options={options} />}
      {props.type === "Hbar" && (
        <HorizontalBar data={Hbardata} options={options1} />
      )}
    </Card>
  );
};
export default Charts;
