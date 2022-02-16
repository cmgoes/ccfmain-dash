import React, { useState, useEffect } from "react";
import { Row, Col } from 'antd';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import tokenAbi from './abi/ccf-abi';
import ccfWbnbLpTokenAbi from './abi/ccf-bnb-abi'
const Web3 = require('web3');
const tokenAddress = "0x7f9528b913A99989B88104b633D531241591A358";
const lptokenAddress = "0x83a0962aE816604a6b162a5E054912982C8e4C1C";
const wbnbTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const busdTokenAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const deadAddress = "0x000000000000000000000000000000000000dead";

export const DefaultDashboard = () => {
  const [recentTransactionData , setrecentTransactionData] = useState([
    {
      title: 'Market Cap',
      value: '$ 0'
    },
    {
      title: 'CCF/BNB Liquidity',
      value: '$ 0',
    },
    {
      title: '24H Volume',
      value: '$ 0',
    },
    {
      title: 'Total supply',
      value: 0,
    },
    {
      title: 'Circulating supply',
      value: 0,
    },
    {
      title: 'Burnt token',
      value: 0,
    }, {
      title: 'Burning rate',
      value: '0 %',
    },
    {
      title: 'Pancakeswap Price',
      value: '$ 0'
    },
    {
      title: 'Holders',
      value: 0
    },
    {
      title: 'Market Cap(Fully Dilluted)',
      value: '$ 0'
    },
    {
      title: 'All-Time High',
      value: '$ 0'
    }
  ]);

  const params = {
    "ids": "cross-chain-farming",
    "vs_currency": "usd"
  };
  const MINUTE_MS = 600000;
  const maxSupply = 2000000000000;

  const getAllData = async () => {
    const provider = new Web3(window.web3.currentProvider);
    const ccfContract = new provider.eth.Contract(tokenAbi, tokenAddress);
    const wbnbContract = new provider.eth.Contract(tokenAbi, wbnbTokenAddress);
    const busdContract = new provider.eth.Contract(tokenAbi, busdTokenAddress);
    const lpContract = new provider.eth.Contract(ccfWbnbLpTokenAbi, lptokenAddress);
    const ccfbalanceOfLP = (await ccfContract.methods.balanceOf(lptokenAddress).call()) / 10 ** 9;
    const wbnbbalanceOfLP = (await wbnbContract.methods.balanceOf(lptokenAddress).call()) / 10 ** 18;
    const priceOfBNB = (await busdContract.methods.balanceOf("0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16").call()) / (await wbnbContract.methods.balanceOf("0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16").call())
    const ccfPrice = wbnbbalanceOfLP / ccfbalanceOfLP * priceOfBNB
    const burnRate = (await ccfContract.methods.brnFee().call()) / 100
    const totalSupply = (await ccfContract.methods.totalSupply().call()) / 10 ** 9
    const marketCapFull = ccfPrice * totalSupply
    const lpTotalSupply = (await lpContract.methods.totalSupply().call()) / 10 ** 18
    const burntAmount = (await ccfContract.methods.balanceOf(deadAddress).call())  / 10 ** 9;
    const treasuryAmount = (await ccfContract.methods.balanceOf('0xA7930111Db88dc1bD9cB3197db535B9AefAFdD92').call()) / 10 ** 9
    const totalBurnt = maxSupply - totalSupply + burntAmount
    const circulatingSupply = totalSupply - burntAmount + treasuryAmount
    const marketCap = ccfPrice * circulatingSupply
    const liquidity = 2 * ccfbalanceOfLP * ccfPrice / lpTotalSupply
    let volumePerDay = 0
    const holders = 5818
    let ath = 0
    await axios.get("https://api.coingecko.com/api/v3/coins/markets", { params },
      { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } })
      .then(res => {
        volumePerDay = res.data[0].total_volume;
        ath = res.data[0].ath;
      })
    setrecentTransactionData([
      {
        title: 'Market Cap',
        value: '$ ' + Number(marketCap).toLocaleString(),
      },
      {
        title: 'CCF/BNB Liquidity',
        value: '$ ' + Number(liquidity).toLocaleString(),
      },
      {
        title: '24H Volume',
        value: '$ ' + Number(volumePerDay).toLocaleString(),
      },
      {
        title: 'Total supply',
        value: Number(totalSupply).toLocaleString(),
      },
      {
        title: 'Circulating supply',
        value: Number(circulatingSupply).toLocaleString(),
      },
      {
        title: 'Burnt token',
        value: Number(totalBurnt).toLocaleString(),
      }, {
        title: 'Burning rate',
        value: Number(burnRate).toLocaleString() + ' %',
      },
      {
        title: 'Pancakeswap Price',
        value: '$ ' + ccfPrice.toFixed(9),
      },
      {
        title: 'Holders',
        value: Number(holders).toLocaleString(),
      },
      {
        title: 'Market Cap(Fully Dilluted)',
        value: '$ ' + Number(marketCapFull).toLocaleString(),
      },
      {
        title: 'All-Time High',
        value: '$ ' + ath,
      }
    ]);
  }
  
  // const getPriceData = async () => {
  //   await axios.get(`https://api.coingecko.com/api/v3/coins/cross-chain-farming/market_chart?vs_currency=usd&days=1&interval=1s`,
  //   { headers: { "Access-Control-Allow-Origin": 'http://localhost:3000' } })
  //   .then(res => {
  //     const pricesData = res.data.prices.filter((_, index) => index % 10 === 9).map((price, key) => {
  //       let openPrice = res.data.prices[key * 10][1];
  //       let highPrice = res.data.prices[key * 10][1];
  //       let lowPrice = res.data.prices[key * 10][1];
  //       let closePrice = res.data.prices[key * 10 + 9][1];
  //       for (let i = 0; i <= 9; i++) {
  //         if (highPrice < res.data.prices[key * 10 + i][1]) {
  //           highPrice = res.data.prices[key * 10 + i][1];
  //         }
  //         if (lowPrice > res.data.prices[key * 10 + i][1]) {
  //           lowPrice = res.data.prices[key * 10 + i][1];
  //         }
  //       }
  //       return {
  //         x: new Date(price[0]),
  //         y: [openPrice, highPrice, lowPrice, closePrice]
  //       }
  //     })
  //     setSeries([{
  //       data: pricesData
  //     }])
  //   })
  //   .catch(err => {
  //     console.log(err + "first--------------------------");
  //   });
  // }

  useEffect(() => {
    getAllData()
    setInterval(() => {
      getAllData()
    }, MINUTE_MS);

  }, []);

  return (
    <>
      <Row gutter={16} padding="true">
        <Col xs={32} sm={32} md={32} lg={24}>
          <Row gutter={40}>
            {
              recentTransactionData.map((elm, i) => (
                <Col xs={24} sm={24} md={24} lg={12} xl={8} key={i}>
                  <StatisticWidget
                    title={elm.title}
                    value={elm.value}
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
