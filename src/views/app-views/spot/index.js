import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const SpotAsset = ({ match }) => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        <Route path={`${match.url}/holdings`} component={lazy(() => import(`./holdings`))} />
        <Route path={`${match.url}/watchlist`} component={lazy(() => import(`./watchlist`))} />
        <Redirect from={`${match.url}`} to={`${match.url}/holdings`} />
      </Switch>
    </Suspense>
  )
};

export default SpotAsset;