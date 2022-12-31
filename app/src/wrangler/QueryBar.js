import React, { useState, useEffect } from 'react';
import * as Plotly from 'plotly.js';
import {
  Save as SaveIcon,
  ShowChart as ShowChartIcon,
  TableRows as TableRowsIcon,
  ScatterPlot as ScatterPlotIcon
} from '@mui/icons-material';
import {
  Button,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  TextField
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { URL, QUERY_MODES, DATASET_QUERIES } from '../constants';

export default function QueryBar({ state, setState }) {
  const [query, setQuery] = useState('');
  const [defaultQuery, setDefaultQuery] = useState(
    DATASET_QUERIES[state.queryMode][state.dataset]
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDefaultQuery(DATASET_QUERIES[state.queryMode][state.dataset]);
  }, [state.dataset, state.queryMode]);

  const handleQueryInput = (event) => {
    setQuery(event.target.value);
    setState({ ...state, errorText: '' });
  };

  const handleQuerySubmit = () => {
    Plotly.purge('graph-div');
    setState({ ...state, responseCode: '', isExecuted: false, errorText: '' });
    setIsLoading(true);
    try {
      let formData = new FormData();
      formData.append('name', state.dataset);
      formData.append(
        'query',
        query == '' ? DATASET_QUERIES[state.queryMode][state.dataset] : query
      );
      const endpoint =
        state.queryMode == QUERY_MODES.PLOT ? URL + '/plot' : URL + '/table';

      if (DATASET_QUERIES[0][state.dataset] === undefined) {
        console.log("appending token  = ", localStorage.getItem('storage-token'))
        formData.append('token', localStorage.getItem('storage-token'));
      }
    
      fetch(endpoint, {
        method: 'POST',
        body: formData
      })
        .then((response) => {
          return response.text();
        })
        .then((jsonText) => {
          var payload = JSON.parse(jsonText);
          console.log('payload=', jsonText)
          console.log('payload[error] =.', payload["error"] )
          if (payload["error"] != undefined) {
            console.log('in error workflow...., err=', payload["error"])
            setState({
              ...state,
              errorText:
                'Execution encountered the following error: ' + payload["error"]
            });
            setIsLoading(false);
          }
          else{

          if (state.queryMode == QUERY_MODES.PLOT) {
            try {
              payload.layout.plot_bgcolor = '#000000';
              payload.layout.paper_bgcolor = '#000000';
              payload.layout.font = { color: '#ffffff' };
              Plotly.newPlot('graph-div', payload.data, payload.layout);
              setState({
                ...state,
                responseCode: payload.response_code.replaceAll('; ', '\n'),
                isExecuted: true
              });
              setIsLoading(false);
            } catch (error) {
              console.log('caught error=', error);
              setState({
                ...state,
                errorText:
                  'An error occurred while parsing the response. Please modify your query and try again.'
              });
              setIsLoading(false);
            }
          } else {
            try {
              const outputColumns = payload['data']['header'].map((header) => {
                let cleanHeader = header.replace('`', '').replace('`', '');
                return {
                  field: cleanHeader,
                  headerName: cleanHeader,
                  description: cleanHeader,
                  minWidth: 200,
                  sortable: true
                };
              });
              let counter = 0;
              const outputRows = payload['data']['rows'].map((row) => {
                let result = {};
                for (let i = 0; i < payload['data']['header'].length; i++) {
                  let cleanHeader = payload['data']['header'][i]
                    .replace('`', '')
                    .replace('`', '');
                  result[cleanHeader] = row[i];
                }
                result['id'] = counter;
                counter += 1;
                return result;
              });
              setState({
                ...state,
                outputColumns,
                outputRows,
                responseCode: payload.nsql,
                isExecuted: true
              });
              setIsLoading(false);
            } catch (error) {
              setState({
                ...state,
                errorText:
                  'An error occurred while parsing the response. Please modify your query and try again.'
              });
              setIsLoading(false);
            }
          }
        }
      });
    } catch (error) {
      console.log('caught error=', error);
      //   setResponseCode(error)
      setIsLoading(false);
    }
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <TextField
          fullWidth
          label={'Query'}
          variant="outlined"
          onChange={handleQueryInput}
          placeholder={defaultQuery}
          error={state.errorText != ''}
          helperText={state.errorText}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              // Do code here
              handleQuerySubmit();
            }
          }}
          InputProps={{
            sx: { borderRadius: '16px' },
            startAdornment: (
              <InputAdornment sx={{ mr: 2 }}>
                <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <React.Fragment>
                      <Button variant="outlined" {...bindTrigger(popupState)}>
                        {state.queryMode == QUERY_MODES.PLOT ? (
                          <ShowChartIcon />
                        ) : (
                          <TableRowsIcon />
                        )}
                      </Button>
                      <Menu {...bindMenu(popupState)}>
                        <MenuItem
                          onClick={() => {
                            setState({
                              ...state,
                              responseCode: '',
                              isExecuted: false,
                              queryMode: QUERY_MODES.PLOT,
                              defaultQuery:
                                DATASET_QUERIES[state.queryMode][state.dataset],
                              errorText: ''
                            });
                            Plotly.purge('graph-div');
                            popupState.close();
                          }}
                        >
                          <ShowChartIcon />
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setState({
                              ...state,
                              responseCode: '',
                              isExecuted: false,
                              queryMode: QUERY_MODES.TABLE,
                              defaultQuery:
                                DATASET_QUERIES[state.queryMode][state.dataset],
                              errorText: ''
                            });
                            Plotly.purge('graph-div');
                            popupState.close();
                          }}
                        >
                          <TableRowsIcon />
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
              </InputAdornment>
            ),
            endAdornment: isLoading ? (
              <LoadingButton
                loading
                startIcon={<SaveIcon />}
                variant="contained"
                color="primary"
              >
                {/* Loading */}
              </LoadingButton>
            ) : (
              <Button
                type="submit"
                onClick={handleQuerySubmit}
                variant="contained"
                disabled={defaultQuery == undefined && query === "" || isLoading}
                sx={{ ml: 1 }}
              >
                {/* Generate */}
                <ScatterPlotIcon />
              </Button>
            )
          }}
        />
      </Grid>
    </Grid>
  );
}
