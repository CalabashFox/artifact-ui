import React from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {SGFStackGraphValue} from 'models/SGF';
import { makeStyles } from '@material-ui/core';

export interface SGFStackGraphProps {
    identifier: string
    data: Array<SGFStackGraphValue>
    name: string
}

const useStyles = makeStyles((theme) => ({
    tooltip: {
      backgroundColor: '#fffff3',
      padding: theme.spacing(1)
    }
}));

const WHITE = '#fffff3';
const RED = '#b71c1c';
const GREEN = '#54cc7c';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GraphTooltip = ({ active, payload, label }: any) => {
    const classes = useStyles();
    if (active && payload.length !== 0) {
        const data = payload[0].payload;
        const color = data.diff >= 0 ? RED : GREEN;
        return (
            <div className={classes.tooltip}>
                <p className="label">{`move ${label}`}</p>
                <p className="label">{`winrate ${data.player.toFixed(2)}`}</p>
                <p className="label" style={{color: color}}>{`katago diff ${data.diff.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};
const SGFStackGraph: React.FC<SGFStackGraphProps> = ({identifier, data, name}) => {
    const margin = 10;
    //#54cc7c gr
    //#b71c1c re
    return (
        <ResponsiveContainer width={'100%'} height={360}>
            <BarChart
                data={data}
                margin={{
                    top: margin, right: margin, bottom: margin, left: margin
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis stroke={WHITE} dataKey="label" minTickGap={50}/>
                <YAxis stroke={WHITE}/>
                <Tooltip content={<GraphTooltip/>}/>
                <Legend />
                <Bar key={`stack-${identifier}-player`} dataKey="player" name={name} stackId="stack" fill={WHITE}/>
                <Bar key={`stack-${identifier}-ai`} dataKey="diff" name={'katago'} stackId="stack" fill={GREEN}>
                    {data.map((entry) => (
                        <Cell key={`stack-${identifier}-entry-${entry.label}-ai`} fill={entry.diff >= 0 ? GREEN : RED }/>
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
export default SGFStackGraph;