
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

// A custom theme for this app
const theme = makeStyles({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;