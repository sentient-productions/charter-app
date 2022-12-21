import copy
import os
import sqlite3

import datasets.table
import pandas as pd
from typing import Dict, List, Union
import uuid

import records
import sqlalchemy

from binder.utils.normalizer import convert_df_type, prepare_df_for_neuraldb_from_table


def check_in_and_return(key: str, source: dict):
    # `` wrapped means as a whole
    if key.startswith("`") and key.endswith("`"):
        key = key[1:-1]
    if key in source.keys():
        return source[key]
    else:
        for _k, _v in source.items():
            if _k.lower() == key.lower():
                return _v
        raise ValueError("{} not in {}".format(key, source))


class NeuralDB(object):
    def __init__(self, tables: List[Dict[str, Union[datasets.table.MemoryMappedTable, pd.DataFrame, Dict]]], passages=None, images=None):
        self.raw_tables = copy.deepcopy(tables)

        for table_info in tables:
            if not isinstance(table_info['table'], pd.DataFrame):
                table_info['table'] = prepare_df_for_neuraldb_from_table(table_info['table'])

        self.tables = tables

        self._set_sqlite_db()

    def _set_sqlite_db(self):
        # Connect to SQLite database
        self.tmp_path = "tmp"
        os.makedirs(self.tmp_path, exist_ok=True)
        # self.db_path = os.path.join(self.tmp_path, '{}.db'.format(hash(time.time())))
        self.db_path = os.path.join(self.tmp_path, '{}.db'.format(uuid.uuid4()))
        self.sqlite_conn = sqlite3.connect(self.db_path)

        # Create DB
        assert len(self.tables) >= 1, "DB has no table inside"
        table_0 = self.tables[0]
        if len(self.tables) > 1:
            raise ValueError("More than one table not support yet.")
        else:
            table_0["table"].to_sql("w", self.sqlite_conn)
            self.table_name = "w"
            self.table_title = table_0.get('title', None)

        # Records conn
        self.db = records.Database('sqlite:///{}'.format(self.db_path), connect_args={'check_same_thread': False})


    def __str__(self):
        return str(self.execute_query("SELECT * FROM {}".format(self.table_name)))

    def connect_and_execute(self, sql_query: str):
        # Due to change in versioning we do not need to make a connection any longer
        return self.db.query(sql_query)

    def get_table(self, table_name=None):
        table_name = self.table_name if not table_name else table_name
        sql_query = "SELECT * FROM {}".format(table_name)
        _table = self.execute_query(sql_query)
        return _table

    def get_header(self, table_name=None):
        _table = self.get_table(table_name)
        return _table['header']

    def get_rows(self, table_name):
        _table = self.get_table(table_name)
        return _table['rows']

    def get_table_df(self):
        return self.tables[0]['table']

    def get_table_df_head(self):
        return self.tables[0]['table'].head()

    def get_table_raw(self):
        return self.raw_tables[0]['table']

    def get_table_title(self):
        return self.tables[0]['title']

    def execute_query(self, sql_query: str):
        """
        Basic operation. Execute the sql query on the database we hold.
        @param sql_query:
        @return:
        """
        # Due to change in versioning we do not need to make a connection any longer
        if len(sql_query.split(' ')) == 1 or (sql_query.startswith('`') and sql_query.endswith('`')):
            col_name = sql_query
            new_sql_query = r"SELECT row_id, {} FROM {}".format(col_name, self.table_name)
            # Here we use a hack that when a value is surrounded by '' or "", the sql will return a column of the value,
            # while for variable, no ''/"" surrounded, this sql will query for the column.
            out = self.db.query(new_sql_query)
        # When the sql query wants all cols or col_id, which is no need for us to add 'row_id'.
        elif sql_query.lower().startswith("select *") or sql_query.startswith("select col_id"):
            out = self.db.query(sql_query)
        else:
            try:
                # SELECT row_id in addition, needed for result and old table alignment.
                new_sql_query = "SELECT row_id, " + sql_query[7:]
                out = self.db.query(new_sql_query)
            except sqlalchemy.exc.OperationalError as e:
                print(e)
                # Execute normal SQL, and in this case the row_id is actually in no need.
                out = self.db.query(sql_query)

        results = out.all()
        unmerged_results = []
        merged_results = []

        headers = out.dataset.headers
        for i in range(len(results)):
            unmerged_results.append(list(results[i].values()))
            merged_results.extend(results[i].values())
        return {"header": headers, "rows": unmerged_results}

def add_sub_table(self, sub_table, table_name=None, verbose=True):
        """
        Add sub_table into the table.
        @return:
        """
        table_name = self.table_name if not table_name else table_name
        sql_query = "SELECT * FROM {}".format(table_name)
        oring_table = self.execute_query(sql_query)
        old_table = pd.DataFrame(oring_table["rows"], columns=oring_table["header"])
        # concat the new column into old table
        sub_table_df_normed = convert_df_type(pd.DataFrame(data=sub_table['rows'], columns=sub_table['header']))
        new_table = old_table.merge(sub_table_df_normed,
                                    how='left', on='row_id')  # do left join
        new_table.to_sql(table_name, self.sqlite_conn, if_exists='replace',
                         index=False)
        if verbose:
            print("Insert column(s) {} (dtypes: {}) into table.\n".format(', '.join([_ for _ in sub_table['header']]),
                                                                          sub_table_df_normed.dtypes))
