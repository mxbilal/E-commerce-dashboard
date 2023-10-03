import React, { useState } from "react";
import { Input, Space, Select, Button, Upload, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import AuthService from "../../services/AuthService";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const { TextArea } = Input,
  initialValues = {
    name: "",
    description: "",
    price: "",
    stock: "",
    isUpdate: false,
  };

const AddInventory = () => {
  const [loader, setLoader] = useState(false),
    navigate = useNavigate(),
    location = useLocation();

  const inventory = location.state ?? initialValues;

  const handleSubmit = (data) => {
    setLoader(true);
    let finalData = inventory.isUpdate ? { ...data, id: inventory.id } : data;
    AuthService({
      method: inventory.isUpdate ? "PUT" : "POST",
      url: `/inventory/${inventory.isUpdate ? "update" : "add"}`,
      data: finalData,
    }).then((res) => {
      if (res.status === 200) {
        toast.success(
          `Inventory ${inventory.isUpdate ? "Updated" : "Added"} Successfully`
        );
        setLoader(false);
        localStorage.setItem("keypath", "3");
        navigate("/inventory");
      } else {
        setLoader(false);
      }
    });
  };
  return (
    <div>
      <Space direction="vertical" size={15}>
        <Form onFinish={handleSubmit} initialValues={inventory}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input Inventory Name!",
              },
            ]}
          >
            <Input placeholder="inventory name" style={{ width: "300px" }} />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please input Description!",
              },
            ]}
          >
            <TextArea placeholder="description" showCount maxLength={100} />
          </Form.Item>
          <Form.Item
            name="price"
            rules={[
              {
                required: true,
                message: "Please enter a valid Inventory Price!",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="inventory price"
              style={{ width: "300px" }}
            />
          </Form.Item>
          <Form.Item
            name="stock"
            rules={[
              {
                required: true,
                message: "Please input Inventory Stock!",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="inventory stock"
              style={{ width: "300px" }}
            />
          </Form.Item>
          <Form.Item
            name="category"
            rules={[
              {
                required: true,
                message: "Please input Category Name!",
              },
            ]}
          >
            <Select
              style={{ width: 200 }}
              // onChange={(e) => console.log(e)}
              placeholder="Select Parent Category"
              options={[
                { value: "phone", label: "phone" },
                { value: "laptop", label: "laptop" },
                { value: "headphones", label: "headphones" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="imageurl"
            rules={[
              {
                required: false,
                message: "Please add Inventory image!",
              },
            ]}
          >
            <Upload
              name="file"
              onChange={(info) => console.log(info)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Inventory Image</Button>
            </Upload>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            disabled={loader}
          >
            {inventory.isUpdate ? "Update" : "Submit"}
          </Button>
        </Form>
      </Space>
    </div>
  );
};

export default AddInventory;
