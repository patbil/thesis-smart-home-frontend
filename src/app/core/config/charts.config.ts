export const tempOptions: Highcharts.Options = {
  chart: {
    type: "line",
  },
  title: {
    text: "Wykres temperatury",
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      data: [1, 2, 3],
      type: "line",
      name: "Temperatura",
    },
  ],
  yAxis: {
    title: {
      text: "",
    },
  },
};

export const humidityOptions: Highcharts.Options = {
  chart: {
    type: "line",
  },
  title: {
    text: "Wykres wilgotności",
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      data: [1, 2, 3],
      type: "line",
      name: "Wilgotność",
    },
  ],
  yAxis: {
    title: {
      text: "",
    },
  },
  plotOptions: {
    series: {
      color: "green",
    },
  },
};
