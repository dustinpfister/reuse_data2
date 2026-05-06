
const append_td = (tr, content='', active) => {
    const td = document.createElement('td');
    td.innerText = content;
    td.className = active ? 'active_row' : '';
    tr.appendChild(td);
};

/*
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
*/

const update_cs_array_wrap = (color_conf, status) => {
    const el = document.getElementById('cs_array_wrap');
    const container = document.createElement('form');
    color_conf.array.forEach( ( color_obj, i ) => {
        const active = i === status.i_array;
        
        const form_cc = document.createElement('form');
        
        Object.keys(color_obj).forEach( (key) => {
            const content = color_obj[key];
            let feild = null;
            
            feild = document.createElement('p');
            feild.innerText = key + content;
            
            if(key === 'data'){
                 content.forEach(( color_data ) => {
                     const in_cd = document.createElement('input');
                     in_cd.type = 'text';
                     in_cd.value = color_data.desc;
                     form_cc.appendChild(in_cd);
                     const in_web = document.createElement('input');
                     in_web.type = 'color';
                     in_web.value = color_data.web;
                     form_cc.appendChild(in_web);
                     form_cc.appendChild( document.createElement('br') )
                 });
            }
            
            
        });
        container.appendChild(form_cc);
    });
    el.appendChild(container);
};

// update the color status html
json_tools.get_config()
.then( (conf) => {
    update_cs_array_wrap(conf.COLOR_CONF, conf.color_status)
});


