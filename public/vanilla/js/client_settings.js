
const append_td = (tr, content='', active) => {
    const td = document.createElement('td');
    td.innerText = content;
    td.className = active ? 'active_row' : '';
    tr.appendChild(td);
};

const render_cs_array_wrap = (color_conf, status) => {
    const el = document.getElementById('cs_array_wrap');
    const container = document.createElement('form');
    
    console.log(color_conf)
    
    color_conf.array.forEach( ( color_obj, i ) => {
        const active = i === status.i_array;
        const form_cc = document.createElement('form');
        Object.keys(color_obj).forEach( (key) => {
            const content = color_obj[key];
            let feild = null;
            feild = document.createElement('p');
            feild.innerText = key + content;         
            if(key === 'first_tuesday'){
                console.log(content)
                //<input type="date" id="cs_start_date" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" />
                const el = document.createElement('input');
                const d = new Date( content );
                el.type='date';
                el.value = d.getFullYear() + "-" + 
                  String( d.getMonth() + 1 ).padStart(2, '0') + "-" + 
                  String( d.getDate() ).padStart(2, '0') ;
                form_cc.appendChild(el);
                form_cc.appendChild( document.createElement('br') )    
            }
            // the 'data' key contains a info for each color, the order of this matters!
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
    render_cs_array_wrap(conf.COLOR_CONF, conf.color_status)
});


