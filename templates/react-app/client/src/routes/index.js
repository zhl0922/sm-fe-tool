import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { hot } from 'react-hot-loader';
import Example from './example';
class App extends React.Component {
    render() {
        const model = this.props.model;
        return (
            <Router history={model.history}>
                <Switch>
                    <Route path="/" component={Example(model)} />
                    <Route render={() => <span>404</span>} />
                </Switch>
            </Router>
        )
    }
}
export default hot(module)(App);