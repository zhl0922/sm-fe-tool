import { connect } from 'react-redux';
import React from 'react';
export default (mapStateToProps = null, mapDispatchToProps = null) => {
    return (Com) => {
        @connect(mapStateToProps, mapDispatchToProps)
        class RetCom extends React.PureComponent {
            render() {
                const dispatch = (action) => {
                    return new Promise((resolve, reject) => {
                        this.props.dispatch(action);
                        resolve(1);
                    });
                };
                const props = {
                    dispatch
                };
                return <Com {...this.props} {...props} />
            }
        }
        return RetCom;
    }
}