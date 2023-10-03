import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import io from "socket.io-client";
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
      position: "top",
    },
    title: {
      display: true,
      text: "Visualization of Sales",
    },
  },
};

const Dashboard = () => {
  const socket = io('ws://localhost:4000', {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });
  const [sales, setSales] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    sortedSales: [{ name: "no product", totalOrder: 0, totalPrice: 0 }],
    list: [],
  });

  useEffect(() => {
    socket.on("revenue", (data) => {
      setSales(data);
      console.log(data);
      let labels = data.sortedSales.map((dt) => dt.name);
      let barChart = [
        {
          label: "Total Products Sales",
          data: labels.map((_, i) => data.sortedSales[i].totalOrder),
          backgroundColor: "#ADD8E6",
        },
      ];
      console.log(labels, barChart);
      setBarData({
        labels,
        datasets: barChart,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <Row gutter={26}>
        <Col span={8}>
          <Card
            title="Total Sales"
            bordered={false}
            style={{ background: "lightblue" }}
          >
            $ {sales.totalRevenue}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Total Orders"
            bordered={false}
            style={{ background: "lightblue" }}
          >
            {sales.totalOrders}
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Highest Sold Product"
            bordered={false}
            style={{ background: "lightblue" }}
          >
            {sales.sortedSales[0]?.name} --- {sales.sortedSales[0]?.totalOrder}{" "}
            Sold
          </Card>
        </Col>
      </Row>
      <div style={{ margin: "50px 0" }}></div>
      <Bar options={options} data={barData} />
    </>
  );
};

export default Dashboard;
