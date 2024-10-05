import React, { useState, useEffect } from "react";
import "./Inventory.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Pagination,
} from "antd";

const { Option } = Select;

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({ category: "", search: "" });

  useEffect(() => {
    fetchInventory();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const fetchedInventory = await fetchInventoryData(filters, pagination);
      setInventory(fetchedInventory.items);
      setPagination((prev) => ({ ...prev, total: fetchedInventory.total }));
    } catch (error) {
      openNotification("Error", "Failed to fetch inventory data.");
    } finally {
      setLoading(false);
    }
  };

  const openNotification = (message, description) => {
    notification.success({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await fetch(`http://localhost:5000/api/inventory/${record._id}`, {
        method: "DELETE",
      });
      setInventory(inventory.filter((item) => item._id !== record._id));
      openNotification(
        "Item Deleted",
        `${record.name} has been removed from the inventory.`
      );
    } catch (error) {
      openNotification("Error", "Failed to delete item.");
    }
  };

  const handleModalOk = async (values) => {
    try {
      if (editingItem) {
        const response = await fetch(
          `http://localhost:5000/api/inventory/${editingItem._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) throw new Error("Failed to update item");

        const updatedItem = await response.json();
        setInventory((prev) =>
          prev.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
        openNotification("Item Updated", `${values.name} has been updated.`);
      } else {
        const response = await fetch("http://localhost:5001/api/inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Failed to add item");

        const newItem = await response.json();
        setInventory((prev) => [...prev, newItem]);
        openNotification(
          "Item Added",
          `${values.name} has been added to the inventory.`
        );
      }
      setIsModalVisible(false);
    } catch (error) {
      openNotification("Error", "Failed to save item.");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (value) => {
    setFilters({ ...filters, category: value });
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: () => (
        <Input.Search
          placeholder="Search by name"
          onChange={handleSearchChange}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Medicines", value: "Medicines" },
        { text: "Equipment", value: "Equipment" },
        { text: "Supplies", value: "Supplies" },
      ],
      onFilter: (value, record) => record.category === value,
      filterMultiple: false,
      onChange: handleCategoryChange,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <Button className="add-item-btn" type="primary" onClick={handleAdd}>
          Add New Item
        </Button>
      </div>
      <Table
        className="inventory-table"
        columns={columns}
        dataSource={inventory}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        className="pagination"
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
      />
      <Modal
        title={editingItem ? "Edit Item" : "Add New Item"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        centered
      >
        <Form
          initialValues={
            editingItem || { name: "", category: "", quantity: 1, unitPrice: 0 }
          }
          onFinish={handleModalOk}
          layout="vertical"
        >
          <Form.Item
            label="Item Name"
            name="name"
            rules={[{ required: true, message: "Please input the item name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select the category!" }]}
          >
            <Select>
              <Option value="Medicines">Medicines</Option>
              <Option value="Equipment">Equipment</Option>
              <Option value="Supplies">Supplies</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Unit Price"
            name="unitPrice"
            rules={[
              { required: true, message: "Please input the unit price!" },
            ]}
          >
            <Input type="number" min={0} step="0.01" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const fetchInventoryData = async (filters, pagination) => {
  const response = await fetch(
    `http://localhost:5001/api/inventory?page=${pagination.current}&limit=${pagination.pageSize}&category=${filters.category}&search=${filters.search}`
  );
  const data = await response.json();
  return {
    items: data.items,
    total: data.total,
  };
};

export default Inventory;
