# db lib for data2

This is a lib to help work with the local database solution that I started out with in R0 of the project. For now I am using 'lowdb' which works by creating local json files, and can work on top of just nodejs alone, without having to install any additional software.

## data storage location

On Linux systems the database storage location is in the home folder at '~/.data2' or '/home/\[username\]/.data2' where \[username\] is the Linux user under which data2 is running.

### db.get_dates_file

To get the items data file for 2026/04/06 date:

```js
db.get_dates_file({ 
  date: new Date(2026, 4 - 1, 6), 
  file_name: 'items.json', file_data: { rec_num: 0, items: [] }
}).then((result) => {
    console.log(result.data);
});
```

Note that with javaScript dates months are zero relative so 3 means April, that is why I did 4 - 1.


### db.get_rel_file

To get a conf.json file at '~/data2/conf.json' you can do this:

```js
db.get_rel_file({ dir_rel: '', file_name: 'conf.json', file_data: { id: 0, users: [] } }).then((result) => {
    console.log(result.data);
});
```

