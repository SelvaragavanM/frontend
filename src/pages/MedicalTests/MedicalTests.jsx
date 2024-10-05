import React, { useState, useEffect } from "react";
import "./MedicalTests.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  notification,
  Tooltip,
  Popconfirm,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";

const { TextArea } = Input;

const MedicalTests = () => {
  const [testsData, setTestsData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMedicalTests();
  }, []);

  const fetchMedicalTests = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/medicalTests");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTestsData(data);
    } catch (error) {
      console.error("Error fetching medical tests:", error);
      notification.error({
        message: "Failed to Fetch Data",
        description: "Could not fetch medical tests. Please try again later.",
        placement: "topRight",
      });
    }
  };

  const handleAddTest = () => {
    setIsEditing(false);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditTest = (test) => {
    setCurrentTest(test);
    form.setFieldsValue({
      patientName: test.patientName,
      testName: test.testName,
      date: moment(test.date),
      result: test.result,
    });
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      const url = isEditing
        ? `http://localhost:5001/api/medicalTests/${currentTest._id}`
        : "http://localhost:5001/api/medicalTests";
      const method = isEditing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          date: values.date.format("YYYY-MM-DD"),
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (isEditing) {
        setTestsData(
          testsData.map((test) => (test._id === result._id ? result : test))
        );
      } else {
        setTestsData([...testsData, result]);
      }
      notification.success({
        message: isEditing ? "Test Updated" : "Test Added",
        description: `The medical test has been ${
          isEditing ? "updated" : "added"
        } successfully.`,
        placement: "topRight",
      });
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving medical test:", error);
      notification.error({
        message: "Failed to Save Test",
        description: "Could not save the medical test. Please try again later.",
        placement: "topRight",
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteTest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/medicalTests/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setTestsData(testsData.filter((test) => test._id !== id));
      notification.success({
        message: "Test Deleted",
        description: "The medical test has been deleted successfully.",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error deleting medical test:", error);
      notification.error({
        message: "Failed to Delete Test",
        description:
          "Could not delete the medical test. Please try again later.",
        placement: "topRight",
      });
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Test Name",
      dataIndex: "testName",
      key: "testName",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="action-buttons">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleEditTest(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditTest(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this test?"
            onConfirm={() => handleDeleteTest(record._id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="medical-tests-container">
      <div className="medical-tests-header">
        <h2>Medical Tests</h2>
        <Button className="add-test-btn" type="primary" onClick={handleAddTest}>
          Add Test
        </Button>
      </div>
      <Table
        className="medical-tests-table"
        columns={columns}
        dataSource={testsData}
        pagination={false}
        rowKey="_id"
      />
      <Modal
        title={isEditing ? "Edit Medical Test" : "Add New Medical Test"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="add-test-modal"
      >
        <Form onFinish={handleModalOk} form={form} layout="vertical">
          <Form.Item
            label="Patient Name"
            name="patientName"
            rules={[
              { required: true, message: "Please enter the patient's name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Test Name"
            name="testName"
            rules={[{ required: true, message: "Please enter the test name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Result"
            name="result"
            rules={[{ required: true, message: "Please enter the result!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalTests;
