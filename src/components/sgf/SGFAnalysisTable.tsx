import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { KatagoMoveInfo } from "models/Katago";
import { TablePagination } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

interface Props {
    data: Array<KatagoMoveInfo>
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof KatagoMoveInfo>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string | Array<string> }, b: { [key in Key]: number | string | Array<string> }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean
    id: keyof KatagoMoveInfo
    label: string
    numeric: boolean
}

const headers: Array<HeadCell> = [
    { id: 'move', numeric: false, disablePadding: true, label: 'ui.sgf.move' },
    { id: 'winrate', numeric: true, disablePadding: false, label: 'ui.sgf.winrate' },
    { id: 'scoreLead', numeric: true, disablePadding: false, label: 'ui.sgf.lead' },
    { id: 'visits', numeric: true, disablePadding: false, label: 'ui.sgf.visits' }
]

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof KatagoMoveInfo) => void
    order: Order
    orderBy: string
}

const EnhancedTableHead: React.FC<EnhancedTableProps> = ({ classes, order, orderBy, onRequestSort }) => {
    const createSortHandler = (property: keyof KatagoMoveInfo) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };
    const { t } = useTranslation();

    return (
        <TableHead>
            <TableRow>
                {headers.map((header: HeadCell) => (
                    <TableCell
                        key={header.id}
                        align={header.numeric ? 'right' : 'left'}
                        padding={header.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === header.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === header.id}
                            direction={orderBy === header.id ? order : 'asc'}
                            onClick={createSortHandler(header.id)}>
                            {t(header.label)}
                            {orderBy === header.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const translate = (move: string): string => {
    const translatedIndex = 19 - parseInt(move.substring(1)) + 1;
    return move[0] + translatedIndex;
}

const SGFAnalysisTable: React.FC<Props> = ({ data }) => {
    const classes = useStyles();
    const rowsPerPage = 10;

    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof KatagoMoveInfo>('winrate');
    const [page, setPage] = React.useState(0);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof KatagoMoveInfo) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return <React.Fragment>
        <TableContainer>
            <Table size="small" aria-label="dense table">
                <EnhancedTableHead
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}/>
                <TableBody>
                    {stableSort(data, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.move}>
                                    <TableCell component="th" id={labelId} scope="row" padding="none">
                                        {translate(row.move)}
                                    </TableCell>
                                    <TableCell align="right">{(row.winrate * 100).toFixed(2)}</TableCell>
                                    <TableCell align="right">{row.scoreLead.toFixed(2)}</TableCell>
                                    <TableCell align="right">{row.visits}</TableCell>
                                </TableRow>
                            );
                        })}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 33 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            component="div"
            count={data.length}
            rowsPerPageOptions={[rowsPerPage]}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
        />
    </React.Fragment>;
}

export default SGFAnalysisTable;