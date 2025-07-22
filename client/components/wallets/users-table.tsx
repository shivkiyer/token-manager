import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { AccountUser } from '@/interfaces/account';
import formatEthAddress from '@/utils/ethers/formatEthAddress';

function UsersTable({ users, form }: { users: AccountUser[]; form: any }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {form && <TableCell></TableCell>}
            <TableCell>
              <Typography variant='body1'>Username</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='body1'>A/c Name</Typography>
            </TableCell>
            <TableCell>
              <Typography variant='body1'>A/c address</Typography>
            </TableCell>
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
              <TableCell>
                <Typography variant='body1'>{row.User.username}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>{row.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='body1'>
                  {formatEthAddress(row.address, true)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
