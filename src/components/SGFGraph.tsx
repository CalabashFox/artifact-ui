import React, {ReactElement} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import {useSelector} from 'react-redux';
import {SGFState, StoreState, ViewState} from 'models/StoreState';
import {SGFGraphValue} from 'models/SGF';
import { makeStyles } from '@material-ui/core';

export interface SGFGraphProps {
    identifier: string
    data: Array<SGFGraphValue>
    color: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    tooltip: {
      backgroundColor: '#fff',
      padding: theme.spacing(1)
    }
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GraphTooltip = ({ active, payload, label }: any) => {
    const classes = useStyles();
    if (active && payload.length !== 0) {
        return (
            <div className={classes.tooltip}>
                <p className="label">{`move ${label}: ${payload[0].value.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};

export default function SGFGraph(props: SGFGraphProps): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const viewState = useSelector<StoreState, ViewState>(state => state.viewState);
    const {identifier, data, color, name} = props;

    return (
        <LineChart
            width={viewState.infoWidth}
            height={200}
            data={data}
            margin={{
                left: 5, right: 5
            }}
        >
            <ReferenceLine x={sgfState.sgfProperties.currentMove} stroke={color}/>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke={'#fff'} dataKey="label" minTickGap={50}/>
            <YAxis stroke={'#fff'}/>
            <Tooltip content={<GraphTooltip/>}/>
            <Legend />
            <Line key={`${identifier}`} connectNulls dataKey="value" type="monotone" name={name} stroke={color} dot={false} />
        </LineChart>
    );
}