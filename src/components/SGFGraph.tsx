import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Label, ResponsiveContainer
} from 'recharts';
import {useSelector} from 'react-redux';
import {SGFState, StoreState} from 'models/StoreState';
import {SGFGraphValue} from 'models/SGF';
import { makeStyles } from '@material-ui/core';
import { TooltipProps } from 'recharts';
import usePlayerTitle from './hook/playerTitle';

export interface SGFGraphProps {
    identifier: string
    percentage: boolean
    data: Array<SGFGraphValue>
    color: string
    name: string
    diplayPlayerName: boolean
}

const useStyles = makeStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.primary,
      borderColor: theme.palette.text.primary,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 2,
      padding: theme.spacing(1)
    }
}));

interface GraphTooltipProps extends TooltipProps<number, string> {
    percentage: boolean
}

const GraphTooltip = ({ active, payload, label, percentage }: GraphTooltipProps) => {
    const classes = useStyles();
    if (active && payload !== undefined && payload.length !== 0) {
        return (
            <div className={classes.tooltip}>
                <p className="label">{`move ${label}: ${payload[0].value?.toFixed(2)}${percentage ? '%' : ''}`}</p>
            </div>
        );
    }
    return null;
};

const SGFGraph: React.FC<SGFGraphProps> = ({identifier, percentage, data, color, name, diplayPlayerName}) => {
    const sgfState = useSelector<StoreState, SGFState>(state => state.sgfState);
    const [playerBlack, playerWhite] = usePlayerTitle();
    const vMargin = 5;
    const hMargin = 0;

    const chartColor = '#fffff3';

    return (
        <ResponsiveContainer
            width={'100%'}
            height={200}>
            <LineChart
                data={data}
                margin={{
                    left: hMargin, top: vMargin, right: hMargin, bottom: vMargin
                }}>
                <ReferenceLine x={sgfState.navigation.col} stroke={color}/>*
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis stroke={chartColor} dataKey="label" minTickGap={50}/>
                <YAxis stroke={chartColor} width={40}/>
                {diplayPlayerName && 
                    <YAxis yAxisId='labelAxis' orientation='right' tickLine={false} axisLine={false} stroke={chartColor}>
                        <Label position="insideTop" fill={chartColor}>{playerBlack}</Label>
                        <Label position="insideBottom" fill={chartColor}>{playerWhite}</Label>
                    </YAxis>
                }
                <Tooltip content={<GraphTooltip percentage={percentage}/>}/>
                <Legend />
                <Line key={`${identifier}`} connectNulls dataKey="value" type="monotone" name={name} stroke={color} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
export default SGFGraph;