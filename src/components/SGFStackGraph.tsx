import React, {ReactElement} from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {SGFGraphValue} from 'models/SGF';

export interface SGFGraphProps {
    identifier: string
    data: Array<SGFGraphValue>
    color: string
    name: string
}

export default function SGFGraph(props: SGFGraphProps): ReactElement {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const {identifier, data, color, name} = props;

    return (
        <LineChart
            width={380}
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
            <Tooltip />
            <Legend />
            <Line key={`${identifier}`} connectNulls dataKey="value" type="monotone" name={name} stroke={color} dot={false} />
        </LineChart>
    );
}