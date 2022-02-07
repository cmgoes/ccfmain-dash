import React, { useState, useEffect} from "react";
import { Row, Col, Button, Card, Avatar, Dropdown, Table, Menu, Tag } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { BuybackStatisticData, BuybackTransactionData } from './BuybackData';
import { 
  UserAddOutlined, 
  FileExcelOutlined, 
  PrinterOutlined, 
  PlusOutlined, 
  EllipsisOutlined, 
  StopOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import utils from 'utils';
import {withRouter} from 'react-router-dom';
import { useSelector } from 'react-redux';


const cardDropdown = (menu) => (
  <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
    <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
      <EllipsisOutlined />
    </a>
  </Dropdown>
)

const tableColumns = [
  {
    title: 'no',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'AMOUNT in BNB',
    dataIndex: 'bnb',
    key: 'bnb',
  },
  {
    title: 'AMOUNT in USD',
    dataIndex: 'usd',
    key: 'usd',
    render: (text, row, index) => {
      return (<div>{Number(text).toLocaleString()} USD</div>)
    }
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'TX',
    dataIndex: 'hash',
    key: 'hash',
    render: (text, row, index) => {
      return (<a href = {text}>{text}</a>);
    }
  },
  
];



export const BuybackDashboard = () => {
  const [buybackStatisticData] = useState(BuybackStatisticData);
  const [buybackTransactionData] = useState(BuybackTransactionData);
  const buybacks = BuybackTransactionData.length;
  let sumUsd = 0 ;
  BuybackTransactionData.map((item) => {
    sumUsd += Number(item.usd);
    console.log(item.usd + '------');
  })
  let avergeUsd = (sumUsd/buybacks).toLocaleString();


  return (
    <>  
      <Row gutter={16} padding>
        <Col xs={32} sm={32} md={32} lg={24}>
          <Row gutter={40}>
            {
              buybackStatisticData.map((elm, i) => (
                <Col xs={16} sm={16} md={16} lg={16} xl={8} key={i}>
                  <StatisticWidget 
                    title={elm.title} 
                    value={(i == 0 ) ? "# " + buybacks : (i == 1) ? "$ " + sumUsd.toLocaleString() : "$ " + avergeUsd}
                    status={elm.status}
                    subtitle={elm.subtitle}
                  />
                </Col>
              ))
            }
          </Row>
          <Row gutter={16,0}>
            <Col span={24}>
                <Card title="Buyback transaction ledger">
                  <Table 
                    className="no-border-last" 
                    columns={tableColumns} 
                    dataSource={buybackTransactionData} 
                    rowKey='id' 
                    pagination={false}
                  />
                </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}


export default withRouter(BuybackDashboard);
