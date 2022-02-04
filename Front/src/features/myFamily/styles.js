import tableStyle from 'assets/jss/components/tableStyle'

const myFamilyStyle = theme => {
  return {
    ...tableStyle(theme),
    boldLabel: {
      fontWeight: 'bold'
    },
    collapseContainer: {
      padding: '10px',
      borderBottom: '1px solid #eee'
    },
    typeTitle: {
      paddingLeft: '10px',
      marginTop: '20px'
    },
    formControlLabel: {
      marginRight: '2px'
    },
    customMargin: {
      margin: '10px',
      padding: '15px'
    }
  }
}

export default myFamilyStyle
