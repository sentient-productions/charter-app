import React, { useState, useEffect } from 'react';
import * as Plotly from 'plotly.js';
import {
  Save as SaveIcon,
  ShowChart as ShowChartIcon,
  TableRows as TableRowsIcon
} from '@mui/icons-material';
import {
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  TextField
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { URL, QUERY_MODES, DATASET_QUERIES } from './constants';

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
      formData.append('rawData', state.raw);
      formData.append(
        'query',
        query == '' ? DATASET_QUERIES[state.queryMode][state.dataset] : query
      );
      const endpoint =
        state.queryMode == QUERY_MODES.PLOT ? URL : URL + '/table';
      fetch(endpoint, {
        method: 'POST',
        body: formData
      })
        .then((response) => {
          return response.text();
        })
        .then((jsonText) => {
          if (state.queryMode == QUERY_MODES.PLOT) {
            try {
              var figure = JSON.parse(jsonText);
              figure.layout.plot_bgcolor = '#1f1f1f';
              figure.layout.paper_bgcolor = '#1f1f1f';
              figure.layout.font = { color: '#ffffff' };
              Plotly.newPlot('graph-div', figure.data, figure.layout);
              setState({
                ...state,
                responseCode: figure.response_code.replace('; ', '\n'),
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
              const table = JSON.parse(jsonText);
              const outputColumns = table['data']['header'].map((header) => {
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
              const outputRows = table['data']['rows'].map((row) => {
                let result = {};
                for (let i = 0; i < table['data']['header'].length; i++) {
                  let cleanHeader = table['data']['header'][i]
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
                responseCode: table.nsql,
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
        });
    } catch (error) {
      console.log('caught error=', error);
      //   setResponseCode(error)
      setIsLoading(false);
    }
  };

  return (
    <TextField
      fullWidth
      label={'Query'}
      variant="outlined"
      onChange={handleQueryInput}
      placeholder={defaultQuery}
      error={state.errorText != ''}
      helperText={state.errorText}
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
            onClick={handleQuerySubmit}
            variant="contained"
            disabled={defaultQuery == undefined || isLoading}
            sx={{ ml: 1 }}
          >
            Generate
          </Button>
        )
      }}
    />
  );
}
