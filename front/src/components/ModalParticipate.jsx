import React, { useState } from "react";
import { 
  Modal,
  Form,
  Button,
  InputNumber,
} from 'antd';


export default function ModalParticipate(props) {
  const [loading, setLoading] = useState(false);
  const [componentAmount, setComponentAmount] = useState(0);
  const onFormLayoutChange = ({ amount }) => {
    setComponentAmount(amount);
  };

  const onFinish = async (values) => {
    console.log({ values });
    setLoading(true);
  };

  return (
    <Modal
      title={props.title}
      visible={props.isModalVisible}
      onOk={props.handleOk}
      onCancel={props.handleCancel}>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          amount: componentAmount,
        }}
        onValuesChange={onFormLayoutChange}
        amount={componentAmount}
        onFinish={onFinish}
      >
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please indicate an amount" }]}
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
    </Modal>
  );
}
