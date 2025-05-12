// frontend/src/pages/user.jsx

import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Tabs,
  List,
  Avatar,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  notification,
  Typography,
  Space,
} from "antd";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Title from "../components/title";
import { ShopContext } from "../context/shopcontext";

const { TabPane } = Tabs;
const { Text } = Typography;

const statusColor = {
  "Order Placed":    "blue",
  Packing:           "cyan",
  Shipped:           "gold",
  "Out for delivery":"orange",
  Delivered:         "green",
  Cancelled:         "red",
};

export default function UserPage() {
  const {
    profile,
    fetchProfile,
    orders,
    fetchOrders,
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    currency,
  } = useContext(ShopContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex]     = useState(null);
  const [addressType, setAddressType]       = useState("Home");
  const [customType, setCustomType]         = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditingIndex(null);
    form.resetFields();
    setAddressType("Home");
    setCustomType("");
    setIsModalVisible(true);
  };

  const openEditModal = (addr, idx) => {
    setEditingIndex(idx);
    form.setFieldsValue({
      fullName:   addr.fullName,
      line1:      addr.line1,
      line2:      addr.line2,
      city:       addr.city,
      state:      addr.state,
      postalCode: addr.postalCode,
      country:    addr.country,
      phone:      addr.phone,
    });
    const label = addr.type || "Home";
    if (["Home","Work","Other"].includes(label)) {
      setAddressType(label);
      setCustomType("");
    } else {
      setAddressType("Other");
      setCustomType(label);
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const type =
        addressType === "Other"
          ? (customType.trim() || "Other")
          : addressType;
      const addressPayload = {
        fullName:   values.fullName,
        line1:      values.line1,
        line2:      values.line2 || "",
        city:       values.city,
        state:      values.state,
        postalCode: values.postalCode,
        country:    values.country,
        phone:      values.phone,
        type,
      };

      if (editingIndex !== null) {
        await updateAddress(editingIndex, addressPayload);
        notification.success({ message: "Address updated" });
      } else {
        await addAddress(addressPayload);
        notification.success({ message: "Address added" });
      }

      setIsModalVisible(false);
      fetchAddresses();
    } catch (err) {
      // validation errors handled by Form
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (idx) => {
    await deleteAddress(idx);
    notification.success({ message: "Address deleted" });
    fetchAddresses();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card title={<Title text1="My" text2="Profile" />}>
        <Descriptions column={1}>
          <Descriptions.Item label="Name">
            {profile?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {profile?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Joined">
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : ""}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs defaultActiveKey="1" className="mt-8">
        <TabPane
          tab={
            <span>
              <ShoppingCartOutlined /> Past Orders
            </span>
          }
          key="1"
        >
          <List
            itemLayout="horizontal"
            dataSource={orders}
            renderItem={(order) => (
              <List.Item
                extra={
                  <Tag color="blue">
                    {currency}
                    {order.totalAmount}
                  </Tag>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<ShoppingCartOutlined />} />}
                  title={`Order ${order._id}`}
                  description={
                    <Space size="small">
                      <Text>Status:</Text>
                      <Tag color={statusColor[order.status] || "default"}>
                        {order.status}
                      </Tag>
                      <Text>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <HomeOutlined /> Saved Addresses
            </span>
          }
          key="2"
        >
          <List
            itemLayout="horizontal"
            dataSource={addresses}
            renderItem={(addr, idx) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(addr, idx)}
                  >
                    Edit
                  </Button>,
                  <Button
                    key="delete"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<HomeOutlined />} />}
                  title={
                    <Space>
                      {addr.fullName}
                      <Tag color="purple">{addr.type}</Tag>
                    </Space>
                  }
                  description={
                    <>
                      <div>
                        {addr.line1}
                        {addr.line2 && `, ${addr.line2}`}
                      </div>
                      <div>
                        {addr.city}, {addr.state} {addr.postalCode},{" "}
                        {addr.country}
                      </div>
                      <div>📞 {addr.phone}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={openAddModal}
            className="mt-4"
          >
            Add New Address
          </Button>
        </TabPane>
      </Tabs>

      <Modal
        title={editingIndex !== null ? "Edit Address" : "Add New Address"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="line1"
            label="Address Line 1"
            rules={[
              { required: true, message: "Please enter address line 1" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="line2" label="Address Line 2">
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please enter city" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please enter state" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="postalCode"
            label="Postal Code"
            rules={[
              { required: true, message: "Please enter postal code" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please enter country" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Address Type">
            <Radio.Group
              onChange={(e) => setAddressType(e.target.value)}
              value={addressType}
            >
              <Radio value="Home">Home</Radio>
              <Radio value="Work">Work</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>

          {addressType === "Other" && (
            <Form.Item
              label="Please specify"
              rules={[{ required: true, message: "Specify address type" }]}
            >
              <Input
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
