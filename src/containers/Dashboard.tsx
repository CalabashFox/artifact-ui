import React from 'react';
import SGFView from './SGFView';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';

const Dashboard: React.FC = () => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    return <SGFView/>;
};

export default Dashboard;