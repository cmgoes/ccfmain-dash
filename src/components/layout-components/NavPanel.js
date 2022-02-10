import React, { useState, useEffect } from 'react';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Drawer, Menu, Button, Dropdown } from 'antd';
import ThemeConfigurator from './ThemeConfigurator';
import { connect } from "react-redux";
import axios from 'axios';
import ccfTokenAbi from './abi/ccf-abi';

const Web3 = require('web3');
const tokenAddress = "0x7f9528b913A99989B88104b633D531241591A358";

const NavPanel = () => {
  const [visible, setVisible] = useState(false)

  const [myBalance, setBalance] = useState(0);
	const [currentPrice, setCurrentPrice] = useState('0');
	const [currentAccountAddress, setCurrentAccountAddress] = useState('0');

	const ethEnabled = async () => {
		if (window.ethereum) {
		  await window.ethereum.request({ method: 'eth_requestAccounts' });
		  window.web3 = new Web3(window.ethereum);
		  return true;
		}
		return false;
  }
  const getAccount = async () => {
		var accounts, account;
		accounts = await window.ethereum.request({ method: 'eth_accounts' });
		account = accounts[0];
		return account;
  }
  const getBalanceValue = () => {
		const ids = "cross-chain-farming";
		const vs_currencies = "usd";

		axios.get("https://api.coingecko.com/api/v3/simple/price", { params: { "ids": ids, "vs_currencies": vs_currencies } })
		  .then(res => {
			setCurrentPrice(res.data[ids].usd.toString());
		  })
		  .catch(err => {
	
			console.log(err);
		  });
	  }
	  const getBalance = userAddress => {
		const provider = new Web3(window.web3.currentProvider);
		var ccfContract = new provider.eth.Contract(ccfTokenAbi, tokenAddress);
	
		ccfContract.methods.balanceOf(userAddress).call().then(res => {
	
		  setBalance(res);
		}).catch(err => {
	
		  console.log(err);
		});
  };
  const initWallet = async () => {
		await getAccount().then(res => {
	
		  const _currentAccount = res;
	
		  setCurrentAccountAddress(_currentAccount);
		  getBalance(_currentAccount);
		  getBalanceValue();
		}).catch(err => {
		  console.log(err);
		});
  }
  const clickConnectWallet = () => {
		if (typeof web3 === 'undefined') {
		  return;
		}
		if (!ethEnabled()) {
		  initWallet();
		  return true;
		}
		return false;
	  }
	  const intervalFunc = () => {
		if (typeof web3 === 'undefined')
		  return;
		if ((currentAccountAddress === undefined || currentAccountAddress === '0')) {
		  if (currentAccountAddress === undefined)
			setCurrentAccountAddress('0');
		  initWallet();
		}
  }

  const clickDisConnectWallet = async () => {
  }

  useEffect(() => {
		intervalFunc();
  });

  const disconnectComponent = () => {
    return (
      <div>
        <Button type="secondary" onClick={clickDisConnectWallet} >Disconnect Wallet</Button>
      </div>
    )
  }

  return (
    <>
      {(currentAccountAddress === undefined || currentAccountAddress === '0') ? (
        <div>
          <Button type="primary" onClick={clickConnectWallet} >Connect Wallet</Button>
        </div>
      ) : (
        <div className='d-flex align-items-center'>
          <Menu mode="horizontal">
            <Menu.Item key="panel" onClick={() => setVisible(true)}>
              <a href={void (0)}><UserOutlined className="nav-icon mr-0" /></a>
            </Menu.Item>
          </Menu>
          {/* <Dropdown overlay={disconnectComponent} trigger={['click']}> */}
            <Button type="primary">
              {currentAccountAddress.slice(0, 6) + "..." + currentAccountAddress.slice(currentAccountAddress.length - 4, currentAccountAddress.length)}
            </Button>
          {/* </Dropdown> */}
        </div>
      )}
      <Drawer
        title="User Infomation"
        placement='right'
        width={350}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <ThemeConfigurator myBalance={myBalance} currentPrice={currentPrice} />
      </Drawer>
    </>
  );
}

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale }
};

export default connect(mapStateToProps)(NavPanel);