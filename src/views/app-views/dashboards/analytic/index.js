import React, { useState, useEffect } from "react";
import { Row, Col, Card, Avatar, Dropdown, Table, Menu } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import ChartWidget from 'components/shared-components/ChartWidget';
import {
  VisitorChartData,
  AnnualStatisticData,
} from './DefaultDashboardData';
import ApexChart from "react-apexcharts";
import { apexLineChartDefaultOption, COLOR_2 } from 'constants/ChartConstant';
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
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ccfTokenAbi from './abi/ccf-abi';
import ccfWbnbLpTokenAbi from './abi/ccf-bnb-abi'
const Web3 = require('web3');
const tokenAddress = "0x7f9528b913A99989B88104b633D531241591A358";
const lptokenAddress = "0x83a0962aE816604a6b162a5E054912982C8e4C1C";
const deadAddress = "0x000000000000000000000000000000000000dead";

const latestTransactionOption = (
  <Menu>
    <Menu.Item key="0">
      <span>
        <div className="d-flex align-items-center">
          <ReloadOutlined />
          <span className="ml-2">Refresh</span>
        </div>
      </span>
    </Menu.Item>
    <Menu.Item key="1">
      <span>
        <div className="d-flex align-items-center">
          <PrinterOutlined />
          <span className="ml-2">Print</span>
        </div>
      </span>
    </Menu.Item>
    <Menu.Item key="12">
      <span>
        <div className="d-flex align-items-center">
          <FileExcelOutlined />
          <span className="ml-2">Export</span>
        </div>
      </span>
    </Menu.Item>
  </Menu>
);

const cardDropdown = (menu) => (
  <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
    <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
      <EllipsisOutlined />
    </a>
  </Dropdown>
)

const tableColumns = [
  {
    title: 'METRIC',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div className="d-flex align-items-center">
        <Avatar size={30} className="font-size-sm" style={{ backgroundColor: record.avatarColor }}>
          {utils.getNameInitial(text)}
        </Avatar>
        <span className="ml-2">{text}</span>
      </div>
    ),
  },
  {
    title: 'VALUE',
    dataIndex: 'date',
    key: 'date',
  },

];

export const DefaultDashboard = () => {
  const [visitorChartData] = useState(VisitorChartData);
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [manualburntToken, setburntToken] = useState();
  const [lpTokenAmount, setLpTokenAmount] = useState();
  const [series, setSeries] = useState(VisitorChartData.series);
  const [lpTokenTotalSupply, setLpTokenTotalSupply] = useState();
  const [recentTransactionData , setrecentTransactionData] = useState([]);
  const { direction } = useSelector(state => state.theme)

  const params = {
    "ids": "cross-chain-farming",
    "vs_currency": "usd"
  };
  const [token, setToken] = useState({ max_supply: '', circulatingSupply: '', burntToken: '', pancakeswap_price: '', volumePerDay: '', liquidity: '', holders: '', marketcapFull: '', ath: '' })
  const MINUTE_MS = 600000;
  let circulatingSupply;
  let burntToken;
  let pancakeswap_price;
  let volumePerDay;
  let liquidity;
  let holders;
  let marketcapFull;
  let ath;
  let total_supply;
  let max_supply = 2000000000000;

  async function getData() {
    await axios.get("https://api.coingecko.com/api/v3/coins/markets", { params },
      { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } })
      .then(res => {
        pancakeswap_price = res.data[0].current_price;
        volumePerDay = res.data[0].total_volume;
        // liquidity = 152614;
        holders = 3712;
        total_supply = res.data[0].total_supply;
        marketcapFull = pancakeswap_price * total_supply;
        ath = res.data[0].ath;
        burntToken = max_supply - total_supply + manualburntToken;
        circulatingSupply = total_supply - burntToken;
        liquidity = 2 * lpTokenAmount * pancakeswap_price / lpTokenTotalSupply;
        setToken({ max_supply: max_supply, circulatingSupply: circulatingSupply, burntToken: burntToken, pancakeswap_price: pancakeswap_price, volumePerDay: volumePerDay, liquidity: liquidity, holders: holders, marketcapFull: marketcapFull, ath: ath });
        setrecentTransactionData([
          {
            id: '#5327',
            name: 'Total supply',
            date: Number(total_supply).toLocaleString(),
            avatarColor: '#fa8c16'
          },
          {
            id: '#5328',
            name: 'Circulating supply',
            date: Number(circulatingSupply).toLocaleString(),
            avatarColor: '#04d182'
          },
          {
            id: '#5329',
            name: 'Burnt token',
            date: Number(burntToken).toLocaleString(),
            avatarColor: '#ffc542'
          }, {
            id: '#5330',
            name: 'Burning rate',
            date: 2 + ' %',
            avatarColor: '#04d182'
          },
          {
            id: '#5331',
            name: 'Pancakeswap Price',
            date: '$ ' + pancakeswap_price,
            avatarColor: '#04d182'
          },
          {
            id: '#5332',
            name: '24H Volume',
            date: '$ ' + Number(volumePerDay).toLocaleString(),
            avatarColor: '#fa8c16'
          },
          {
            id: '#5333',
            name: 'Liquidity',
            date: '$ ' + Number(liquidity).toLocaleString(),
            avatarColor: '#1890ff'
          },
          {
            id: '#5334',
            name: 'Holders',
            date: Number(holders).toLocaleString(),
            avatarColor: '#ffc542'
          },
          {
            id: '#5335',
            name: 'Market Cap(Fully Dilluted)',
            date: '$ ' + Number(marketcapFull).toLocaleString(),
            avatarColor: '#ff6b72'
          },
          {
            id: '#5336',
            name: 'All-Time High',
            date: '$ ' + ath,
            avatarColor: '#ff6b72'
          }]);
        console.log(recentTransactionData);
      })
      .catch(err => {
        console.log(err + "first--------------------------");
      });
  };

  const getccfTokenData = async () => {
    const provider = new Web3(window.web3.currentProvider);
    const ccfContract = new provider.eth.Contract(ccfTokenAbi, tokenAddress);
    const burntAmount = (await ccfContract.methods.balanceOf(deadAddress).call())  / 10 ** 9;
    const lpAmount = (await ccfContract.methods.balanceOf(lptokenAddress).call()) / 10 ** 9;
    setLpTokenAmount(lpAmount);
    setburntToken(burntAmount);
  };

  const getLpData = async () => {
    const provider = new Web3(window.web3.currentProvider);
    const lpContract = new provider.eth.Contract(ccfWbnbLpTokenAbi, lptokenAddress);
    const lpTotalSupply = (await lpContract.methods.totalSupply().call()) / Math.pow(10, 18);
    setLpTokenTotalSupply(lpTotalSupply);
  }
  
  const getPriceData = async () => {
    await axios.get(`https://api.coingecko.com/api/v3/coins/cross-chain-farming/market_chart?vs_currency=usd&days=1&interval=1s`,
    { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } })
    .then(res => {
      const pricesData = res.data.prices.filter((_, index) => index % 10 === 9).map((price, key) => {
        let openPrice = res.data.prices[key * 10][1];
        let highPrice = res.data.prices[key * 10][1];
        let lowPrice = res.data.prices[key * 10][1];
        let closePrice = res.data.prices[key * 10 + 9][1];
        for (let i = 0; i <= 9; i++) {
          if (highPrice < res.data.prices[key * 10 + i][1]) {
            highPrice = res.data.prices[key * 10 + i][1];
          }
          if (lowPrice > res.data.prices[key * 10 + i][1]) {
            lowPrice = res.data.prices[key * 10 + i][1];
          }
        }
        return {
          x: new Date(price[0]),
          y: [openPrice, highPrice, lowPrice, closePrice]
        }
      })
      setSeries([{
        data: pricesData
      }])
    })
    .catch(err => {
      console.log(err + "first--------------------------");
    });
  }

  useEffect(() => {
    getccfTokenData();
    getLpData();
    getData();
    getPriceData();
    setInterval(() => {
      getccfTokenData();
      getLpData();
      getData();
      getPriceData();
    }, MINUTE_MS);

  }, [manualburntToken]);

  return (
    <>
      <Row gutter={16} padding="true">
        <Col xs={32} sm={32} md={32} lg={24}>
          <Row gutter={40}>
            {
              annualStatisticData.map((elm, i) => (
                <Col xs={24} sm={24} md={24} lg={16} xl={8} key={i}>
                  <StatisticWidget
                    title={elm.title}
                    value={(i == 0 && token.circulatingSupply != undefined) ? "$ " + (token.circulatingSupply * token.pancakeswap_price).toLocaleString() :
                      (i == 2 && token.volumePerDay != undefined) ? "$ " + token.volumePerDay.toLocaleString() :
                        "$ " + token.liquidity.toLocaleString()}
                    status={elm.status}
                    subtitle={elm.subtitle}
                  />
                </Col>
              ))
            }
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <ChartWidget
                title="$CCF Metrics"
                extra={'$ ' + token.pancakeswap_price}
                series={series}
                height={400}
                type="candlestick"
                direction={direction}
              ></ChartWidget>
              {/* <Card title="Token Information" extra={cardDropdown(latestTransactionOption)}>
                <Table
                  className="no-border-last"
                  columns={tableColumns}
                  dataSource={recentTransactionData}
                  rowKey='id'
                  pagination={false}
                />
              </Card> */}
            </Col>
          </Row>
          <Row gutter={40}>
            {
              recentTransactionData.map((elm, i) => (
                <Col xs={24} sm={24} md={24} lg={16} xl={8} key={i}>
                  <StatisticWidget
                    title={elm.name}
                    value={elm.date}
                  />
                </Col>
              ))
            }
          </Row>
        </Col>
      </Row>
    </>
  )
}


export default withRouter(DefaultDashboard);
