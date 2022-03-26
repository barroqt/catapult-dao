import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  InputNumber,
  Card,
} from "antd";

const CreateFunding = () => {
  const [componentName, setComponentName] = useState("");
  const [componentDate, setComponentDate] = useState("");
  const [componentCurrency, setComponentCurrency] = useState("AVAX");
  const [componentGoal, setComponentGoal] = useState(10000);
  const [loading, setLoading] = useState(false);

  const onFormLayoutChange = ({ name, date, currency, goal }) => {
    setComponentName(name);
    setComponentDate(date);
    setComponentCurrency(currency);
    setComponentGoal(goal);
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    setLoading(true);
  };

  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <Card title="Create a Funding" bordered={false} style={{ width: 600 }}>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          name: componentName,
          date: componentDate,
          currency: componentCurrency,
          goal: componentGoal,
        }}
        onValuesChange={onFormLayoutChange}
        name={componentName}
        date={componentDate}
        currency={componentCurrency}
        goal={componentGoal}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input a name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Please choose a currency" }]}
          label="Currency"
          name="currency"
        >
          <Radio.Group defaultValue={"AVAX"}>
            <Radio.Button value="USDC">USDC</Radio.Button>
            <Radio.Button value="AVAX">AVAX</Radio.Button>
            <Radio.Button value="ETC">ETC</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Please input a funding period" }]}
          name="date"
          label="Funding Period starts"
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Please input a funding goal" }]}
          name="goal"
          label="Funding Goal"
        >
          <InputNumber />
        </Form.Item>
        <Form.Item>
          {!loading && (
            <Button type="primary" style={{ float: "right" }} htmlType="submit">
              Submit
            </Button>
          )}
          {loading && (
            <Button type="primary" style={{ float: "right" }} loading>
              Loading
            </Button>
          )}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateFunding;
