import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card, Avatar, Dropdown, Table, Menu, Tag, Modal } from 'antd';
import utils from 'utils';
import axios from 'axios';
import ChainModal from 'components/shared-components/ChainModal';

const Web3 = require('web3');
const tokenAddress = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82";
const apiKey = "2Vdnspvyim8Zw8LdNKuVE6oZI6p51Oece8lKmvXk";

const walletColumns = [
  {
    title: 'ASSETS',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text, record) => (
      <div className="d-flex align-items-center">
        <Avatar size={25} className="font-size-sm" src={record.logo_url}>
        </Avatar>
        <span className="ml-2">{record.symbol}</span>
      </div>
    ),
  },
  {
    title: 'PRICE',
    dataIndex: 'price',
    key: 'price',
    render: (text, record) => (
      <div>
        <span className="ml-2">$ {record.price}</span>
      </div>
    )
  },
  {
    title: 'BALANCE',
    dataIndex: 'balance',
    key: 'balance',
    render: (text, record) => (
      <div>
        <span className="ml-2">{(record.balance / 10 ** (record.decimals)).toFixed(4)}</span>
      </div>
    )
  },
  {
    title: 'VALUE',
    dataIndex: 'value',
    key: 'value',
    render: (text, record) => (
      <div>
        <span className="ml-2">$ {(record.price * record.balance / 10 ** (record.decimals)).toFixed(4)}</span>
      </div>
    )
  },

];

const support1Columns = [
  {
    title: 'Pool',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text, record) => (
      <div className="d-flex align-items-center">
        <Avatar size={25} className="font-size-sm" src={record.logo_url}>
        </Avatar>
        <span className="ml-2">{record.symbol}</span>
      </div>
    ),
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (text, record) => (
      <div>
        <span className="ml-2">{(record.amount).toFixed(2)} {record.symbol}</span>
      </div>
    )
  },
  {
    title: 'USD Value',
    dataIndex: 'value',
    key: 'value',
    render: (text, record) => (
      <div>
        <span className="ml-2">$ {parseInt(record.price * record.amount).toLocaleString()}</span>
      </div>
    )
  },

];

const support2Columns = [
  {
    title: 'Pool',
    dataIndex: 'symbol',
    key: 'symbol',
    render: (text, record) => (
      <div className="d-flex align-items-center">
        <Avatar size={25} className="font-size-sm" src={record.logo_url}>
        </Avatar>
        <span className="ml-2">{record.symbol}</span>
      </div>
    ),
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (text, record) => (
      <div>
        <span className="ml-2">{(record.amount).toFixed(2)} {record.symbol}</span>
      </div>
    )
  },
  {
    title: 'USD Value',
    dataIndex: 'value',
    key: 'value',
    render: (text, record) => (
      <div>
        <span className="ml-2">$ {parseInt(record.price * record.amount).toLocaleString()}</span>
      </div>
    )
  },

];

const PortfolioPane = (props) => {
  const [walletInfo, setWalletInfo] = useState([]);
  const [support1Info, setSupport1Info] = useState([]);
  const [support2Info, setSupport2Info] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [chainbalance, setChainbalance] = useState();
  const [sum, setSum] = useState();
  const [protocolBalance, setProtocolBalance] = useState([

    {
      "id": "avax_wonderland",
      "chain": "avax",
      "name": "Wonderland",
      "site_url": "https://app.wonderland.money",
      "logo_url": "https://static.debank.com/image/project/logo_url/avax_wonderland/a9d941ebe5882548057179e46185cd09.png",
      "has_supported_portfolio": true,
      "tvl": 2664533165.3499336,
      "net_usd_value": 36326.499754343946,
      "asset_usd_value": 36326.499754343946,
      "debt_usd_value": 0
    }

  ]);
  let resdata1;
  let resdata2;
  let sum1 = 0;

  const walletInfoParam = {
    user_addr: props.accountAddress,
    is_all: false,
    chain: "avax"
  }
  const support1InfoParam = {
    user_addr: props.accountAddress,
    project_id: "avax_wonderland"
  }
  const support2InfoParam = {
    user_addr: props.accountAddress,
    project_id: "avax_papadao"
  }
  const chainBalanceParam = {
    id: props.accountAddress,
    chain_id: "avax"
  }
  const protocolBalanceParam = {
    id: props.accountAddress,
    chain_id: "avax"
  }
  //Get tokeninfo from benmark
  async function getWalletInfo() {
    await axios.get("https://api.debank.com/token/balance_list", { params: walletInfoParam },
      { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } }).then(res => {
        setWalletInfo(res.data.data);

      }).catch(err => {
        console.log(err);
      })
  }

  async function getSupport1Info() {
    await axios.get("https://api.debank.com/portfolio/list", { params: support1InfoParam },
      { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } }).then(res => {
        resdata1 = res.data.data.portfolio_list[0].detail.supply_token_list;

        setData1({
          resdata1: res.data.data.portfolio_list[0].detail.supply_token_list,
          detailType1: res.data.data.portfolio_list[0].name,
          projectName1: res.data.data.project.name,
          projectLogoUrl1: res.data.data.project.logo_url,
          projectSiteUrl1: res.data.data.project.site_url
        })
        setSupport1Info(resdata1);
      }).catch(err => {
        console.log(err);
      })
  }

  async function getSupport2Info() {
    await axios.get("https://api.debank.com/portfolio/list", { params: support2InfoParam },
      { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } }).then(res => {
        resdata2 = res.data.data.portfolio_list[0].detail.supply_token_list;

        setData2({
          resdata2: res.data.data.portfolio_list[0].detail.supply_token_list,
          detailType2: res.data.data.portfolio_list[0].name,
          projectName2: res.data.data.project.name,
          projectLogoUrl2: res.data.data.project.logo_url,
          projectSiteUrl2: res.data.data.project.site_url
        })
        setSupport2Info(resdata2);
      }).catch(err => {
        console.log(err);
      })
  }

  async function getChainBalance() {
    await axios.get("https://openapi.debank.com/v1/user/chain_balance", { params: chainBalanceParam }
    ).then(res => {
      setChainbalance(res.data.usd_value);
      console.log(res.data.usd_value + "----------------chainbalance--------");
    }).catch(err => {
      console.log(err);
    })
  }

  async function getProtocolBalance() {
    await axios.get("https://openapi.debank.com/v1/user/simple_protocol_list", { params: protocolBalanceParam },
      { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } }).then(res => {
        setProtocolBalance(res.data);

        console.log(res.data + "----------------chainbalance--------");
      }).catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    sum1 = 0
    getWalletInfo();
    getSupport1Info();
    getSupport2Info();
    getChainBalance();
    getProtocolBalance();

  }, [])

  useEffect(() => {
    walletInfo.map((elm, i) => {
      sum1 += elm.price * elm.balance / 10 ** (elm.decimals);
    });

    setSum(sum1)
  }, [walletInfo])
  return (
    <>
      <Row gutter={16, 0}>
        <Col span={24}>
          <Card>
            <div className="d-flex align-items-center mb-4">
              <Avatar size={40} className="font-size-sm" src="https://debank.com/static/media/avalanche.850d5617.svg">
              </Avatar>
              <div className="ml-2">
                <p className="mb-0 mt-0" style={{ fontSize: "13px" }}>Assets on BSC</p>
                <h5 className="mb-0 " style={{ fontSize: "15px", marginTop: "-5px" }}>${(chainbalance !== undefined) ? Number((chainbalance).toFixed(3)).toLocaleString() : null}</h5>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <ChainModal
                name="Wallet"
                icon="https://debank.com/static/media/wallet.d67a695b.svg"
                balance={Number(sum).toFixed(3).toLocaleString()}
                sizeAvatar={30}
              />
              {protocolBalance.map((elm, i) => {
                return (
                  <ChainModal
                    name={elm.name}
                    icon={elm.logo_url}
                    balance={Number((elm.net_usd_value).toFixed(3)).toLocaleString()}
                    sizeAvatar={30}
                  />
                );
              })}
            </div>
          </Card>
          <Card>
            <div className="d-flex text-center mb-2">
              <Avatar size={30} className="font-size-sm" src="https://debank.com/static/media/wallet.d67a695b.svg">
              </Avatar>
              <p className="font-size-lg ml-2">Wallet</p>
            </div>
            <Table
              className="no-border-last"
              columns={walletColumns}
              // rows={Info}
              // dataSource={nativeTokenInfo !== undefined ? nativeTokenInfo.concat(tokensInfo) : null}
              dataSource={walletInfo !== undefined ? walletInfo : []}
              rowKey='id'
              pagination={false}
            />
          </Card>
          <Card>
            <div className="d-flex align-items-center mb-4">
              <Avatar size={30} className="font-size-sm" src={data1.projectLogoUrl1}>
              </Avatar>
              <a href={data1.projectSiteUrl1} className="font-size-lg ml-2">{data1.projectName1}
                {/* <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" style="font-size: 14px;"><path d="M16.1147 9.99466C16.5956 9.99466 16.989 10.3881 17 10.869V14.3883C17 15.8308 15.8305 17.0002 14.3879 17.0002H5.61173C4.16919 17.0002 3 15.831 3 14.3881V5.61208C2.99983 4.16954 4.16901 3 5.61173 3H9.12C9.35168 3.00065 9.57369 3.09297 9.73752 3.25679C9.90134 3.42062 9.99367 3.64263 9.99431 3.87431C9.99367 4.10599 9.90134 4.328 9.73752 4.49183C9.57369 4.65565 9.35168 4.74798 9.12 4.74862H5.61173C5.131 4.74862 4.74845 5.1422 4.74845 5.61208V14.3772C4.74845 14.8581 5.14185 15.2407 5.61173 15.2407H14.3769C14.8578 15.2407 15.2404 14.8471 15.2404 14.3772V10.869C15.241 10.6373 15.3333 10.4153 15.4971 10.2515C15.661 10.0876 15.883 9.99531 16.1147 9.99466ZM16.1147 3C16.5956 3 16.989 3.3934 17 3.87431V7.37173C16.9994 7.60344 16.907 7.82548 16.7431 7.98931C16.5793 8.15314 16.3572 8.24544 16.1255 8.24604C15.8938 8.24539 15.6718 8.15307 15.508 7.98925C15.3442 7.82542 15.2518 7.60341 15.2512 7.37173V5.98361L9.31688 11.9181C9.14188 12.0821 8.9233 12.1696 8.69387 12.1696C8.46427 12.1696 8.24587 12.0931 8.07086 11.9181C7.73206 11.5793 7.73206 11.0221 8.07086 10.6831L14.0052 4.7488H12.6174C12.3857 4.74815 12.1637 4.6558 11.9998 4.49194C11.836 4.32808 11.7437 4.10602 11.7431 3.87431C11.7438 3.64263 11.8361 3.42062 11.9999 3.25679C12.1637 3.09297 12.3857 3.00065 12.6174 3H16.1147Z" fill="currentColor"></path></svg> */}
              </a>
            </div>
            <p className="ml-10 text-center" style={{ background: "#8b93a7", color: "white", width: "100px", borderRadius: "5px" }}>{data1.detailType1}</p>
            <Table
              className="no-border-last"
              columns={support1Columns}
              dataSource={support1Info !== undefined ? support1Info : []}
              rowKey='id'
              pagination={false}
            />
          </Card>
          <Card>
            <div className="d-flex align-items-center mb-4">
              <Avatar size={30} className="font-size-sm" src={data2.projectLogoUrl2}>
              </Avatar>
              <a href={data2.projectSiteUrl2} className="font-size-lg ml-2">{data2.projectName2}
                {/* <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" style="font-size: 14px;"><path d="M16.1147 9.99466C16.5956 9.99466 16.989 10.3881 17 10.869V14.3883C17 15.8308 15.8305 17.0002 14.3879 17.0002H5.61173C4.16919 17.0002 3 15.831 3 14.3881V5.61208C2.99983 4.16954 4.16901 3 5.61173 3H9.12C9.35168 3.00065 9.57369 3.09297 9.73752 3.25679C9.90134 3.42062 9.99367 3.64263 9.99431 3.87431C9.99367 4.10599 9.90134 4.328 9.73752 4.49183C9.57369 4.65565 9.35168 4.74798 9.12 4.74862H5.61173C5.131 4.74862 4.74845 5.1422 4.74845 5.61208V14.3772C4.74845 14.8581 5.14185 15.2407 5.61173 15.2407H14.3769C14.8578 15.2407 15.2404 14.8471 15.2404 14.3772V10.869C15.241 10.6373 15.3333 10.4153 15.4971 10.2515C15.661 10.0876 15.883 9.99531 16.1147 9.99466ZM16.1147 3C16.5956 3 16.989 3.3934 17 3.87431V7.37173C16.9994 7.60344 16.907 7.82548 16.7431 7.98931C16.5793 8.15314 16.3572 8.24544 16.1255 8.24604C15.8938 8.24539 15.6718 8.15307 15.508 7.98925C15.3442 7.82542 15.2518 7.60341 15.2512 7.37173V5.98361L9.31688 11.9181C9.14188 12.0821 8.9233 12.1696 8.69387 12.1696C8.46427 12.1696 8.24587 12.0931 8.07086 11.9181C7.73206 11.5793 7.73206 11.0221 8.07086 10.6831L14.0052 4.7488H12.6174C12.3857 4.74815 12.1637 4.6558 11.9998 4.49194C11.836 4.32808 11.7437 4.10602 11.7431 3.87431C11.7438 3.64263 11.8361 3.42062 11.9999 3.25679C12.1637 3.09297 12.3857 3.00065 12.6174 3H16.1147Z" fill="currentColor"></path></svg> */}
              </a>
            </div>
            <p className="ml-10 text-center" style={{ background: "#8b93a7", color: "white", width: "100px", borderRadius: "5px" }}>{data2.detailType2}</p>
            <Table
              className="no-border-last"
              columns={support2Columns}
              dataSource={support2Info !== undefined ? support2Info : []}
              rowKey='id'
              pagination={false}
            />
          </Card>
        </Col>
      </Row>


    </>
  );
}

export default PortfolioPane;