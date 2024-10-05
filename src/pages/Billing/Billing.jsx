import React, { useState } from "react";
import "./Billing.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  notification,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import { formatCurrency } from "../../utils";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { RangePicker } = DatePicker;

const Billing = () => {
  const [billingData, setBillingData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    patientId: "",
    address: "",
    phone: "",
  });
  const [form] = Form.useForm();
  const [addItemForm] = Form.useForm();
  const [patientForm] = Form.useForm();

  const handleGenerateInvoice = () => {
    if (billingData.length === 0) {
      notification.warning({
        message: "No Items",
        description: "Please add at least one item to generate an invoice.",
        placement: "topRight",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalOk = async (values) => {
    try {
      const docDefinition = {
        content: [
          { text: "Invoice", style: "header" },
          {
            text: `Invoice Date: ${values.invoiceDate.format("YYYY-MM-DD")}`,
            style: "subheader",
          },
          {
            text: `Billing Period: ${values.billingPeriod[0].format(
              "YYYY-MM-DD"
            )} to ${values.billingPeriod[1].format("YYYY-MM-DD")}`,
            style: "subheader",
          },
          {
            text: "Patient Details",
            style: "subheader",
          },
          {
            text: [
              `Name: ${patientDetails.name}\n`,
              `Patient ID: ${patientDetails.patientId}\n`,
              `Address: ${patientDetails.address}\n`,
              `Phone: ${patientDetails.phone}\n`,
            ],
            style: "patientDetails",
          },
          {
            table: {
              widths: ["*", "*", "*", "*"],
              body: [
                ["Item Description", "Quantity", "Unit Price", "Total Price"],
                ...billingData.map((item) => [
                  item.description,
                  item.quantity,
                  formatCurrency(item.unitPrice),
                  formatCurrency(item.totalPrice),
                ]),
                [
                  { text: "Total Amount", colSpan: 3 },
                  {},
                  {},
                  formatCurrency(
                    billingData.reduce((sum, item) => sum + item.totalPrice, 0)
                  ),
                ],
              ],
            },
          },
        ],
        styles: {
          header: { fontSize: 24, bold: true, margin: [0, 0, 0, 20] },
          subheader: { fontSize: 16, margin: [0, 10, 0, 20] },
          patientDetails: { margin: [0, 10, 0, 20] },
        },
      };

      pdfMake
        .createPdf(docDefinition)
        .download(`Invoice_${new Date().toLocaleDateString()}.pdf`);

      await axios.post("http://localhost:5001/api/billing", {
        invoiceDate: values.invoiceDate,
        billingPeriod: values.billingPeriod,
        data: billingData,
        patientDetails: patientDetails,
      });

      notification.success({
        message: "Invoice Generated",
        description:
          "Your invoice has been generated and downloaded successfully.",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Invoice Generation Failed",
        description:
          "There was an error generating your invoice. Please try again.",
        placement: "topRight",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => setIsModalOpen(false);
  const handleAddItem = (values) => {
    const newItem = {
      key: billingData.length + 1,
      description: values.description,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      totalPrice: values.quantity * values.unitPrice,
    };

    setBillingData([...billingData, newItem]);
    setIsAddItemModalOpen(false);
    addItemForm.resetFields();
  };
  const handleAddItemCancel = () => setIsAddItemModalOpen(false);
  const handlePatientDetails = (values) => {
    setPatientDetails({
      name: values.name,
      patientId: values.patientId,
      address: values.address,
      phone: values.phone,
    });
    setIsPatientModalOpen(false);
    patientForm.resetFields();
  };
  const handlePatientModalCancel = () => setIsPatientModalOpen(false);

  const columns = [
    {
      title: "Item Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => formatCurrency(text),
    },
  ];

  const totalAmount = billingData.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return (
    <div className="billing-container">
      <header className="billing-header">
        <h2>Billing Management</h2>
        <div className="button-group">
          <Button
            className="add-item-btn"
            type="default"
            onClick={() => setIsAddItemModalOpen(true)}
          >
            Add Item
          </Button>
          <Button
            className="generate-invoice-btn"
            type="primary"
            onClick={handleGenerateInvoice}
          >
            Generate Invoice
          </Button>
          <Button
            className="edit-patient-btn"
            type="default"
            onClick={() => setIsPatientModalOpen(true)}
          >
            Edit Patient Details
          </Button>
        </div>
      </header>
      <section className="billing-summary">
        <div className="patient-details">
          <h3 className="patient-details-header">Patient Details</h3>
          <p>
            <strong>Name:</strong> {patientDetails.name || "N/A"}
          </p>
          <p>
            <strong>Patient ID:</strong> {patientDetails.patientId || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {patientDetails.address || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {patientDetails.phone || "N/A"}
          </p>
        </div>
        <Table
          className="billing-table"
          columns={columns}
          dataSource={billingData}
          pagination={false}
          footer={() => <h3>Total Amount: {formatCurrency(totalAmount)}</h3>}
        />
      </section>
      <Modal
        title="Generate Invoice"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        className="billing-modal"
      >
        <Form onFinish={handleModalOk} form={form} layout="vertical">
          <Form.Item
            label="Invoice Date"
            name="invoiceDate"
            rules={[
              { required: true, message: "Please select the invoice date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Billing Period"
            name="billingPeriod"
            rules={[
              { required: true, message: "Please select the billing period!" },
            ]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Generate Invoice
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add New Item"
        open={isAddItemModalOpen}
        onCancel={handleAddItemCancel}
        footer={null}
        className="add-item-modal"
      >
        <Form onFinish={handleAddItem} form={addItemForm} layout="vertical">
          <Form.Item
            label="Item Description"
            name="description"
            rules={[
              { required: true, message: "Please enter item description!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="Unit Price"
            name="unitPrice"
            rules={[{ required: true, message: "Please enter unit price!" }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Item
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Patient Details"
        open={isPatientModalOpen}
        onCancel={handlePatientModalCancel}
        footer={null}
        className="patient-modal"
      >
        <Form
          onFinish={handlePatientDetails}
          form={patientForm}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the patient name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Patient ID"
            name="patientId"
            rules={[
              { required: true, message: "Please enter the patient ID!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

Billing.propTypes = {
  billingData: PropTypes.array,
  setBillingData: PropTypes.func,
};

export default Billing;
