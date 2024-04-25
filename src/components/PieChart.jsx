import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { mockPieData as data } from "../data/mockData";

const PieChart = ({ mockdata }) => {
  const theme = useTheme();
  const colorsForMonths = [
    "#e6194b", // Tháng 1 - Màu đỏ
    "#3cb44b", // Tháng 2 - Màu xanh lá cây
    "#ffe119", // Tháng 3 - Màu vàng
    "#4363d8", // Tháng 4 - Màu xanh dương
    "#f58231", // Tháng 5 - Màu cam
    "#911eb4", // Tháng 6 - Màu tím
    "#46f0f0", // Tháng 7 - Màu ngọc lam
    "#f032e6", // Tháng 8 - Màu hồng
    "#bcf60c", // Tháng 9 - Màu xanh lục
    "#fabebe", // Tháng 10 - Màu hồng nhạt
    "#008080", // Tháng 11 - Màu teal
    "#e6beff", // Tháng 12 - Màu tím nhạt
  ];
  const colors = tokens(theme.palette.mode);
  return (
    <ResponsivePie
      colors={colorsForMonths}
      data={mockdata}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "column",
          justify: false,
          translateX: 500,
          translateY: 40,
          itemsSpacing: 0,
          itemWidth: 120,
          itemHeight: 25,
          itemTextColor: "#e0e0e0",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 20,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#4cceac",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
