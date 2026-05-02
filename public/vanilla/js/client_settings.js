
const append_td = (tr, content='', active) => {
    const td = document.createElement('td');
    td.innerText = content;
    td.className = active ? 'active_row' : '';
    tr.appendChild(td);
};

const update_cs_array_wrap = (color_conf, status) => {
    const el = document.getElementById('cs_array_wrap');
    const html = document.createElement('table');
    const tr = document.createElement('tr');
    tr.innerHTML = '<th>index</th>' + 
        Object.keys(color_conf.array[0]).map((key)=>{ return '<th>' + key + '</th>'}).join('') + 
        '<th>actions</th>';
    html.appendChild(tr);
    color_conf.array.forEach( ( color_obj, i ) => {
        const tr = document.createElement('tr');
        const active = i === status.i_array;
        append_td(tr, i, active);
        Object.keys(color_obj).forEach( (key) => {
            const td = document.createElement('td');
            let content = color_obj[key];
            if(key === 'data'){
                content = JSON.stringify(color_obj[key]);
            }
            append_td(tr, content, active);
        });
        append_td(tr, 'actions', active);
        html.appendChild(tr);
    });
    el.appendChild(html);
}

// update the color status html
json_tools.get_config()
.then( (conf) => {
    update_cs_array_wrap(conf.COLOR_CONF, conf.color_status)
});


