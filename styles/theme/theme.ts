import {ThemeOptions} from '@mui/material/styles';
import {amber} from '@mui/material/colors';

const Theme: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 320,
      sm: 525,
      md: 767,
      lg: 992,
      xl: 1200,
    },
  },
  palette: {
    mode: 'light',

    primary: {
      main: '#7862E4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8c79e8',
      contrastText: '#fff',
    },
  },
  components: {
    // Name of the component
    MuiFormHelperText:{
      styleOverrides:{
        root:{
          marginLeft:0,
          marginRight: 0
        }
      }
    },
    MuiSpeedDial: {
      styleOverrides: {
        fab: {
          '&:hover': {
            backgroundColor: amber[400]
          },
        },
        actions: {
          width: 50,
          justifyContent: 'space-around',
          alignItems: 'center'
        }

      }
    },
    MuiSpeedDialAction: {
      styleOverrides: {
        fab: {

          transition: 'width 300ms, height 300ms, margin 300ms',
          '&:hover': {
            backgroundColor: '#fff',
            width: 46,
            height: 46,
            margin: 5
          },
          '& > svg': {
            width: '60%',
            height: '60%',
          },
        },
      },

    },
    MuiContainer: {
      styleOverrides: {

      }

    }
  }
};

export default Theme;
