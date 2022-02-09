import React, { useState } from "react";
import { Row, Col, Card, Table } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { BuybackStatisticData, BuybackTransactionData } from './BuybackData';
import {withRouter} from 'react-router-dom';


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
    return null;
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
                    value={(i === 0 ) ? "# " + buybacks : (i === 1) ? "$ " + sumUsd.toLocaleString() : "$ " + avergeUsd}
                    status={elm.status}
                    subtitle={elm.subtitle}
                  />
                </Col>
              ))
            }
          </Row>
          <Row gutter={16}>
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
