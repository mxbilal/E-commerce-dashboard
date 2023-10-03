import React, { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import { Space, Table, Input, Skeleton, Modal, Form } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { callSocket } from "../../socket";

const Inventory = () => {
  const [inventory, setInventory] = useState([]),
    [filteredData, setFilteredData] = useState([]),
    [loader, setLoader] = useState(true),
    [isModalOpen, setIsModalOpen] = useState(false),
    [orderModal, setOrderModal] = useState(false),
    [data, setData] = useState({}),
    navigate = useNavigate(),
    handleOk = () => {
      deleteInventory(data.id);
      setIsModalOpen(false);
    },
    handleOrder = () => {
      orderNow();
    },
    handleCancel = () => {
      setIsModalOpen(false);
      setOrderModal(false);
    },
    { Search } = Input,
    onSearch = (e) => {
      let searchTerm = e.target.value;
      const filteredProducts = inventory.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
      setFilteredData(filteredProducts);
    },
    getInventory = () => {
      AuthService.get("/inventory/list").then((res) => {
        if (res.status === 200) {
          toast.success("Inventory Data Recieved");
          setInventory(res?.data?.data ?? []);
          setFilteredData(res?.data?.data ?? []);
          setLoader(false);
        } else {
          setLoader(false);
        }
      });
    },
    deleteInventory = (id) => {
      AuthService.delete(`inventory/delete?id=${id}`).then((res) => {
        if (res.status === 200) {
          toast.success("Inventory Deleted");
          getInventory();
          setLoader(false);
        } else {
          setLoader(false);
        }
      });
    },
    orderNow = () => {
      AuthService.post("/order/add", data).then((res) => {
        if (res.status === 200) {
          toast.success("order success");
          callSocket("revenue", "ordered");
          getInventory();
          setOrderModal(false);
        } else {
          setOrderModal(false);
        }
      });
    };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      key: "price",
      render: (data) => <p>$ {data?.price}</p>,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              navigate("/add-inventory", {
                state: { ...record, isUpdate: true },
              });
            }}
          >
            Update
          </a>
          <a
            onClick={() => {
              setData(record);
              setIsModalOpen(true);
            }}
          >
            Delete
          </a>
          <a
            onClick={() => {
              setData({ ...record, order: 1 });
              setOrderModal(true);
            }}
          >
            Order Now
          </a>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    getInventory();
  }, []);
  return (
    <div>
      {loader ? (
        <Skeleton active />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <Search
              placeholder="search"
              onChange={onSearch}
              style={{ width: 200 }}
            />
          </div>
          <Table rowKey="id" columns={columns} dataSource={filteredData} />
        </>
      )}
      <Modal
        title="Are you sure you want to delete this inventory?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      />
      <Modal
        title="Order Now"
        open={orderModal}
        onOk={handleOrder}
        onCancel={handleCancel}
      >
        <h3>{data.name ?? ""}</h3>
        <p>{data.description ?? ""}</p>

        <div
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "baseline",
          }}
        >
          <p>Stock:</p>
          <button
            onClick={() =>
              setData({ ...data, order: parseInt(data.order) + 1 })
            }
          >
            +
          </button>
          <p>{data.order}</p>
          <button
            onClick={() =>
              setData({ ...data, order: parseInt(data.order) - 1 })
            }
          >
            -
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
