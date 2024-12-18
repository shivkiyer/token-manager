import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import formatEthAddress from '../../../utils/web3/formatEthAddress';

function UsersTable({ users, form }: { users: any; form: any }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {form && <TableCell></TableCell>}
            <TableCell>Username</TableCell>
            <TableCell>A/c Name</TableCell>
            <TableCell>A/c address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row: any) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {form && (
                <TableCell>
                  <input
                    type='checkbox'
                    name='checked'
                    value={row.id}
                    onChange={form.handleChange}
                  />
                </TableCell>
              )}
              <TableCell>{row.User.username}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{formatEthAddress(row.address, true)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
