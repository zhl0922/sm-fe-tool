import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import './index.less';
const Example = ({ className }) => {
    return (
        <div className={cn('example', className)}>example</div>
    )
};
Example.propTypes =  {};
export default Example;