import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import { Radio, Switch, Button, message } from 'antd';
import { 
	toggleCollapsedNav, 
	onNavTypeChange,
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme,
	onDirectionChange
} from 'redux/actions/Theme';

const colorOptions = [
	'#3e82f7',
	'#24a772',
	'#de4436',
	'#924aca',
	'#193550'
]

const ListOption = ({name, selector, disabled, vertical}) => (
	<div className={`my-4 ${vertical? '' : 'd-flex align-items-center justify-content-between'}`}>
		<div className={`${disabled ? 'opacity-0-3' : ''} ${vertical? 'mb-3' : ''}`}>{name}</div>
		<div>{selector}</div>
	</div>
)

export const ThemeConfigurator = ({ myBalance, currentPrice }) => {
	return (
		<>
			<div className="mb-5">
				<h4 className="mb-3 font-weight-bold">Wallet</h4>
				<div>
					<div className='d-flex align-items-center justify-content-between mb-4'>
						<div>BALANCE ($CCF)</div>
						<div>{(Number(myBalance) / 1000000000).toLocaleString() + " $CCF"}</div>
					</div>
					<div className='d-flex align-items-center justify-content-between mb-4'>
						<div>BALANCE ($USD)</div>
						<div>{Number(Number(myBalance) * Number(currentPrice) / 1000000000).toLocaleString() + " $USD"}</div>
					</div>
				</div>
			</div>
		</>
	)
}

const mapStateToProps = ({ theme }) => {
  const { navType, sideNavTheme, navCollapsed, topNavColor, headerNavColor, locale, currentTheme, direction } =  theme;
  return { navType, sideNavTheme, navCollapsed, topNavColor, headerNavColor, locale, currentTheme, direction }
};

const mapDispatchToProps = {
	toggleCollapsedNav,
	onNavTypeChange,
	onNavStyleChange,
	onTopNavColorChange,
	onHeaderNavColorChange,
	onSwitchTheme,
	onDirectionChange
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeConfigurator)
