import React, { useState, useEffect } from "react";
import { Table } from 'antd';

var axios = require('axios');

var dataSource = [
  {
    key: '1',
    name: 'Fetch.ai',
    symbol: 'FET',
    price: '',
    iconURL: "https://assets.coingecko.com/coins/images/5681/thumb/Fetch.jpg?1572098136"
  },
  {
    key: '2',
    name: 'LTO Network',
    symbol: 'LTO',
    price: '',
    iconURL: "https://assets.coingecko.com/coins/images/6068/thumb/lto.png?1638855565"
  },
  {
    key: '3',
    name: 'Oasis Network',
    symbol: 'ROSE',
    price: '',
    iconURL: "https://assets.coingecko.com/coins/images/13162/thumb/rose.png?1605772906"
  },
  {
    key: '4',
    name: 'iMe Lab',
    symbol: 'LIME',
    price: '',
    iconURL: "https://assets.coingecko.com/coins/images/16243/thumb/lim_200.2.png?1623376205"
  },
  {
    key: '5',
    name: 'Qredo',
    symbol: 'QRDO',
    price: '',
    iconURL: "https://assets.coingecko.com/coins/images/17541/thumb/qrdo.png?1630637735"
  },
  {
    key: '6',
    name: 'Numers Protocol',
    symbol: 'NUM',
    price: '',
    iconURL: "https://assets.coingecko.com/coins/images/20495/thumb/5J3RAUO2_400x400.jpg?1637131666"
  },
];


const Holdings = (props) => {
  const [marketingData, setMarketingData] = useState([]);
  const [needRenderAgain, setRenderAgain] = useState(true);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <>
            <img class="" alt={record.name} src={record.iconURL} style={{
              marginRight: "10px"
            }}></img>
            {text}
          </>);
      }
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const getMarketingData = () => {
    axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: "fetch-ai,lto-network,oasis-network,ime-lab,qredo,numbers-protocol",
        vs_currencies: "usd",
        include_market_cap: "true",
        include_24hr_vol: "true",
        include_24hr_change: "true",
        include_last_updated_at: "true"
      }
    })
      .then(res => {
        console.log(res.data);
        setMarketingData(res.data);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    getMarketingData();
    setInterval(() => {
      getMarketingData();
    }, 1000 * 30);
  }, [])

  useEffect(() => {
    if (marketingData === undefined || marketingData === null)
      return;
    if (marketingData["fetch-ai"] !== undefined)
      dataSource[0].price = marketingData["fetch-ai"].usd;
    if (marketingData["lto-network"] !== undefined)
      dataSource[1].price = marketingData["lto-network"].usd;
    if (marketingData["oasis-network"] !== undefined)
      dataSource[2].price = marketingData["oasis-network"].usd;
    if (marketingData["ime-lab"] !== undefined)
      dataSource[3].price = marketingData["ime-lab"].usd;
    if (marketingData["qredo"] !== undefined)
      dataSource[4].price = marketingData["qredo"].usd;
    if (marketingData["numbers-protocol"] !== undefined)
      dataSource[5].price = marketingData["numbers-protocol"].usd;

    console.log(dataSource);

    setRenderAgain(!needRenderAgain);
  }, [marketingData])

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}

export default Holdings;