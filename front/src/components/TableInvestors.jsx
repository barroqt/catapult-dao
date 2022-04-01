import { Table, Tag, Space } from 'antd';

const columns = [
  {
    title: 'Addresses',
    dataIndex: 'address',
    key: 'address',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Fund',
    dataIndex: 'amount',
    key: 'amount',
  },
];


export default function TableInvestors(props) {
  return (
    <Table columns={columns} dataSource={props.data} />
  );
}
