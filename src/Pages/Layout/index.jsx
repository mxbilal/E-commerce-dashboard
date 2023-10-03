import { DashboardOutlined, ProfileOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCrums from "../../Component/BreadCrums";
const { Header, Content, Sider } = Layout;

const getItem = (label, key, icon, path, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
    path,
  };
};
const items = [
  getItem("Dashboard", "1", <DashboardOutlined />, "/"),
  getItem("Inventory", "sub1", <ProfileOutlined />, undefined, [
    getItem("Add Inventory", "2", undefined, "/add-inventory"),
    getItem("Listing", "3", undefined, "/inventory"),
  ]),
];
const LayoutPage = ({ children }) => {
  const navigateTo = useNavigate(),
    [crumbs, setCrumbs] = useState([{ title: "Dashboard" }]),
    keyPath =
      window.location.pathname.split("/")[1] !== ""
        ? [localStorage.getItem("keypath") ?? "1"]
        : "1",
    openKeys = [["2", "3"].includes(keyPath[0]) ? "sub1" : ""],
    {
      token: { colorBgContainer },
    } = theme.useToken();
  useEffect(() => {
    let url = window.location.pathname.split("/");
    let crumb = [
      { title: "Dashboard" },
      { title: url[1] === "" ? "My Dashboard" : url[1] ?? "" },
    ];
    setCrumbs(crumb);
  }, [window.location.pathname]);
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: "0",
          zIndex: "999",
        }}
      >
        <div className="admin-logo">
          <img src="/vite.svg " />
          <p>E-Commerce Task</p>
        </div>
        {/* <Button>Logout</Button> */}
      </Header>
      <Layout hasSider>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
            overflow: "auto",
            height: "88vh",
            position: "sticky",
            left: 0,
            top: "65px",
            bottom: 0,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={keyPath}
            defaultOpenKeys={openKeys}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            onSelect={(it) => {
              localStorage.setItem("keypath", it.key);
              navigateTo(it.item.props.path);
            }}
            items={items}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
            // marginTop: '65px'
          }}
        >
          <BreadCrums items={crumbs} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 300,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default LayoutPage;
