import React, { useState, useEffect } from "react";
import { Table } from 'antd';

var axios = require('axios');

const namesOfCoins = ["fetch-ai", "lto-network", "oasis-network", "ime-lab", "qredo", "numbers-protocol"];
const chartURL = {
  "fetch-ai": "https://www.coingecko.com/coins/5681/sparkline",
  "lto-network": "https://www.coingecko.com/coins/6068/sparkline",
  "oasis-network": "https://www.coingecko.com/coins/13162/sparkline",
  "ime-lab": "https://www.coingecko.com/coins/16243/sparkline",
  "qredo": "https://www.coingecko.com/coins/17541/sparkline",
  "numbers-protocol": "https://www.coingecko.com/coins/20495/sparkline",
}

var dataSource = [
];

const Holdings = (props) => {
  const [marketingData, setMarketingData] = useState([]);
  const [needRenderAgain, setRenderAgain] = useState(true);

  const renderPriceChangeFunction = (text, record) => {
    return (
      <div style={{
        color: Number(text) < 0 ? "#e15241" : "#4eaf0a"
      }}>
        {text} {" "} %
      </div>
    );
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return (
          <>
            <img className="" alt={record.name} src={record.iconURL} style={{
              marginRight: "10px",
              width: "20px",
              height: "20px"
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
    {
      title: '1h',
      dataIndex: 'change_1',
      key: 'change_1',
      render: renderPriceChangeFunction
    },
    {
      title: '24h',
      dataIndex: 'change_24',
      key: 'change_24',
      render: renderPriceChangeFunction
    },
    {
      title: '7d',
      dataIndex: 'change_7d',
      key: 'change_7d',
      render: renderPriceChangeFunction
    },
    {
      title: '24h Volume',
      dataIndex: 'volume_24',
      key: 'volume_24'
    },
    {
      title: 'Mkt Cap',
      dataIndex: 'marketCap',
      key: 'marketCap'
    },
    {
      title: 'Last 7 Days',
      dataIndex: 'sparkline',
      key: 'sparkline',
      render: (text, record) => {
        return <img className="" alt={record.name} src={chartURL[record.coinId]} style={{
        }}></img>
      }
    }
  ];

  const getMarketingData = () => {
    axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd", {
      params: {
        ids: "fetch-ai,lto-network,oasis-network,ime-lab,qredo,numbers-protocol",
        vs_currency: "usd",
        include_market_cap: "true",
        per_page: "250",
        page: "1",
        sparkline: "true",
        price_change_percentage: "1h,24h,7d",
        order: "id_asc"
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
    let ind = 1;
    dataSource = marketingData.map(coinData => {
      if (coinData !== undefined) {
        /*
        key: '1',
    name: 'Fetch.ai',
    symbol: 'FET',
    price: '',
    iconURL: "https://assets.coingecko.com/coins/images/5681/thumb/Fetch.jpg?1572098136"
     */
        const rowData = {
          key: ind,
          coinId: coinData.id,
          name: coinData.name,
          symbol: coinData.symbol.toUpperCase(),
          price: '$' + coinData.current_price,
          iconURL: coinData.image,
          change_1: coinData.price_change_percentage_1h_in_currency.toFixed(1),
          change_24: coinData.price_change_percentage_24h_in_currency.toFixed(1),
          change_7d: coinData.price_change_percentage_7d_in_currency.toFixed(1),
          volume_24: '$' + coinData.total_volume.toLocaleString(),
          marketCap: '$' + coinData.market_cap.toLocaleString(),
          sparkline: coinData.sparkline
        }
        ind++;
        return rowData;
      }
      ind++;
    });
    console.log(dataSource);
    console.log(dataSource.length);

    setRenderAgain(!needRenderAgain);
  }, [marketingData]);

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}

export default Holdings;
