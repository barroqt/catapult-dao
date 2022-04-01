import React, { useContext, useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Radio,
  DatePicker,
  InputNumber,
  Card,
  Typography,
} from "antd";
import Web3Context from "../store/web3Context";
const { Title } = Typography;

const CreateFunding = (props) => {
  const [redirctTo, setRedirctTo] = useState(false);
  const [componentName, setComponentName] = useState("");
  const [componentDate, setComponentDate] = useState("");
  const [componentEndDate, setComponentEndDate] = useState("");
  const [componentCurrency, setComponentCurrency] = useState("USDC");
  const [componentGoal, setComponentGoal] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [builded, setBuilded] = useState(false);
  const isLogged = props.isLogged;
  const formRef = useRef();
  const {
    createDAO,
    loadingDAO,
  } = useContext(Web3Context);

  useEffect(() => {
    if (!isLogged) {
      setRedirctTo(true);
    }
  }, [isLogged]);

  const onFormLayoutChange = ({ name, date, currency, goal }) => {
    setComponentName(name);
    setComponentDate(date);
    setComponentCurrency(currency);
    setComponentGoal(goal);
  };

  const onFinish = async (values) => {
    setLoading(true);
    await createDAO({
      name: componentName,
      date: componentDate,
      endDate: componentEndDate,
      currency: componentCurrency,
      goal: componentGoal,
    });
    setBuilded(true);
    if (formRef.current)
      formRef.current.resetFields();
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

  const render = (
    <div>
      {loadingDAO && <Title level={5}>Loading...</Title>}
      {builded && <Title style={{ textAlign: 'center', color: '#2bd22b' }} level={4}>Funding builded!</Title>}
      <Card title="Create a Funding" bordered={false} style={{ width: 600 }}>
        <Form
          ref={formRef}
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
            endDate: componentEndDate,
            currency: componentCurrency,
            goal: componentGoal,
          }}
          onValuesChange={onFormLayoutChange}
          name={componentName}
          date={componentDate}
          endDate={componentEndDate}
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
            <Radio.Group>
              <Radio.Button value="USDC">USDC</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Please input a start date." }]}
            name="date"
            label="Funding Period starts"
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Please input a end date." }]}
            name="endDate"
            label="Funding Period end"
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
    </div>
  );

  return redirctTo ? <Redirect to="/" /> : render;
};

export default CreateFunding;
