import React, { useState, useEffect } from 'react';
import * as Plotly from 'plotly.js';
import {ShowChart as ShowChartIcon, TableRows as TableRowsIcon} from '@mui/icons-material';
import {Button, InputAdornment, Menu, MenuItem, TextField} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {URL, QUERY_MODES, DATASET_QUERIES} from './constants';

export default function QueryBar({state, setState}) {

    const [query, setQuery] = useState(DATASET_QUERIES[state.queryMode][state.dataset]);
    const [defaultQuery, setDefaultQuery] = useState(DATASET_QUERIES[state.queryMode][state.dataset]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setDefaultQuery(DATASET_QUERIES[state.queryMode][state.dataset]);
        setQuery(DATASET_QUERIES[state.queryMode][state.dataset]);
    }, [state.dataset, state.queryMode]);

    const handleQueryInput = (event) => {
        setQuery(event.target.value);
    };

    const handleQuerySubmit = () => {
        setIsLoading(true)
        try {
          let formData = new FormData()
          formData.append("rawData", state.raw);
          formData.append("query", query);
          const endpoint = state.queryMode == QUERY_MODES.PLOT ? URL :URL + "/table"
          fetch(endpoint, {
              method: 'POST',
              body: formData
    
          })
          .then(response => {
            return response.text()
          })
          .then(jsonText => {
            if (state.queryMode == QUERY_MODES.PLOT) {
              var figure = JSON.parse(jsonText);
              figure.layout.template = "plotly_dark"
              figure.layout.plot_bgcolor = "#1f1f1f"
              figure.layout.paper_bgcolor = "#1f1f1f"
              figure.layout.font = {color: "#ffffff"}
              Plotly.newPlot('graph-div', figure.data, figure.layout)
              setState({...state, responseCode: figure.response_code.replace('; ','\n'), isExecuted: true})
              setIsLoading(false)
            } else {
              const table = JSON.parse(jsonText);
            //   setTableColumns(table["header"].map(header => ({name:header, selector:header})));
              // enumeratd map over rows 
            //   setTableRows(table["rows"].map(row => {
            //       let result = {}
            //       for (let i = 0; i < table["header"].length; i++) {
            //         result[table["header"][i]] = row[i]
            //       }
            //       return result
            //     })
            //   );
              setIsLoading(false)
            }
          });
        } catch (error) {
          console.log("caught error=", error)
        //   setResponseCode(error)
          setIsLoading(false)
        }
    }

    return (
        <TextField 
            fullWidth
            label={"Query"}
            variant="outlined" 
            onChange={handleQueryInput}
            placeholder={defaultQuery}
            InputProps={
                {
                    sx: {borderRadius: '16px'},
                    startAdornment: 
                    <InputAdornment sx={{mr: 2}}> 
                        <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                            <Button variant="outlined" {...bindTrigger(popupState)}>
                                {state.queryMode == QUERY_MODES.PLOT ? <ShowChartIcon /> : <TableRowsIcon />}
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => {
                                setState({...state, queryMode: QUERY_MODES.PLOT})
                                popupState.close()
                                }}>
                                <ShowChartIcon /> 
                                </MenuItem>
                                <MenuItem onClick={() => {
                                setState({...state, queryMode: QUERY_MODES.TABLE})
                                popupState.close()
                                }}>
                                <TableRowsIcon /> 
                                </MenuItem>
                            </Menu>
                            </React.Fragment>
                        )}
                        </PopupState>
                    </InputAdornment>,
                    endAdornment: 
                    <Button 
                        onClick={handleQuerySubmit}
                        variant="contained" 
                        disabled={query == "" || isLoading} 
                        sx={{ml: 1}}
                    >
                        Generate
                    </Button>
                }
            }
        />
    )
}