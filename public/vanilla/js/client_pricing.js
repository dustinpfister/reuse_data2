const el_ds = document.querySelector("#dept_select");
const el_ptype = document.getElementById('ptype_select');
const el_ps = document.querySelector("#price_select");
const el_cs = document.querySelector("#count_select");
const el_color_cycle = document.querySelector("#color_cycle");
const el_submit_item = document.querySelector("#submit_item");

const CONFIG = {
    print_color : null
};

const get_html_color_status_string = (conf, status, now = new Date() ) => {
    const colorObj = conf.array[ status.i_array ];
    const str_disc = status.disc.map( (disc) => {
        const color_d = colorObj.data[ disc[1] ];
        return '<span style=\"color:' + color_d.web + ';\">' + color_d.desc + '</span> tags are ' + disc[0] + '% off';
    }).join(', ');
    
    const color_p = colorObj.data[ status.i_print ];
    const color_c = colorObj.data[ status.i_cull ];
    const str = 'We are printing new color tags in <span style=\"color:' + color_p.web + ';\">' + color_p.desc + '</span>.</br>' +
        //'Color discounts are now the following... <br>' + 
        str_disc + '. <br>' +
        'Please cull or reprice any <span style=\"color:' + color_c.web + ';\" >' + color_c.desc + '</span> tags.'
    return str;  
};

const post_item = (depart_index=0, price_index=0, count=1)=> {

  let ptype = el_ptype.value;
  if(ptype === 'color'){
      ptype = 'color:' + CONFIG.print_color;
  }

  return fetch('/json', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        mode: 'post_item',
        price_type: ptype,
        depart_index: depart_index,
        price_index: price_index,
        count: count
    })
  })
};

const del_items = ( rec_nums=[] )=> {
  return fetch('/json', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        mode: 'del_items',
        rec_nums: rec_nums
    })
  })
};

const get_config = () => {
  return fetch('/json?mode=config', {
    method: "GET"
  })
  .then((data)=>{ 
    return data.json()
  })
};

const create_header_tr = (item={}) => {
    const tr = document.createElement('tr');
    const item_keys = Object.keys(item);
    item_keys.forEach((key)=>{
        const th = document.createElement('th');
        th.innerText = key;
        tr.appendChild(th);
    });
    if(item_keys.length > 0){
        const th = document.createElement('th');
        th.innerText = 'actions';
        tr.appendChild(th);
    }
    return tr;
};

const print_items = () => {
    const now = new Date();
    return json_tools.get_items_page()
    .then ( ( result ) => {
        let total_grand = 0;
            const container = document.querySelector('#items_wrap');
            container.innerHTML = '';
        if(result.pages.length === 0){
            return;
        }
        const dept = CONFIG.DEPT_OPTIONS.split(',');
        const table = document.createElement('table');
        table.appendChild( create_header_tr( result.pages[0][0] ) );
        result.pages.forEach( (page)=> {
            page.forEach( (item, i) => {
                const total_price = item.count * item.price;
                total_grand += total_price;
                const tr = document.createElement('tr');
                let d = new Date();
                Object.keys(item).forEach((key)=>{
                    const td = document.createElement('td');
                    let text = item[key];      
                    if(key === 't'){
                        d = new Date( parseInt(item[key]) );
                        const wd = d.toLocaleString('en-US', { weekday: 'short'  });
                        const month = d.toLocaleString('en-US', { month: 'short'  });
                        const time = d.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                            fractionalSecondDigits: 3,
                            hour12: true
                        }).padStart(8, ' ')
                        text = wd + ' ' + month + '/' + d.getDate() + '/' + d.getFullYear() + '<br>' + time;
                    }
                    td.innerHTML = text;
                    tr.appendChild(td);
                });
                const td = document.createElement('td');
                if( d.getDate() === now.getDate() ){
                    const input_del = document.createElement('input');
                    input_del.value = 'del';
                    input_del.type='button';
                    input_del.addEventListener('click', ()=>{
                        del_items( [ item.rec_num ] )
                        .then(()=>{
                            print_items();
                        });
                    });
                    td.appendChild(input_del)
                }
                tr.appendChild(td);
                table.appendChild(tr);
            });

            container.appendChild(table);
        });
    });
};

get_config()
.then((config)=>{

  Object.assign(CONFIG, config);

  CONFIG.DEPT_OPTIONS.split(',').forEach( (dept_str, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i + ') ' + dept_str;
    el_ds.appendChild(opt)
  });
  
  CONFIG.PRICE_OPTIONS.split(',').forEach( (price_str, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i + ') ' + price_str;
    el_ps.appendChild(opt)
  });
  
  CONFIG.COUNT_OPTIONS.split(',').forEach( (count_str, i) => {
    const opt = document.createElement('option');
    opt.value = count_str;
    opt.innerText = i + ') ' + count_str;
    el_cs.appendChild(opt)
  });
  
  
  const conf = CONFIG.COLOR_CONF;
const stat = CONFIG.color_status;
const color_setting = conf.array[ stat.i_array ];
const color_print = color_setting.data[ stat.i_print ];
const color_cull = color_setting.data[ stat.i_cull ];
const color_disc = stat.disc.map( (arr)=> {  return { off: arr[0], color:  color_setting.data[ arr[1] ] } });
CONFIG.print_color = color_print.desc.toLowerCase(); 

[
  { color: color_print, off: 'PRINT', title: 'PRINT NEW ITEMS', mess: 'NEW<br> ITEMS<br> ARE<br> THIS<br> TAG' },
  { color: color_cull, off: 'CULL', title: 'CULL ITEMS', mess: 'CULL<br> OR<br> REPRICE<br> THIS<br> TAG' },
    { color: color_disc[0].color, off: color_disc[0].off + '%', title: 'COLOR TAG DISCOUNT' },
  { color: color_disc[1].color, off: color_disc[1].off + '%', title: 'COLOR TAG DISCOUNT' }
].forEach((a)=>{
  el_tag = document.createElement('div');
  el_tag.className = 'tag';
  el_tag.style.background = a.color.web;
  [ 
    ['tag_title', a.title],
    ['tag_percent', a.off],
    ['tag_mess_text', a.mess || 'ALL<br> ITEMS<br> WITH<br> THIS<br> TAG'],
    ['tag_color_text', a.color.desc]
  ].forEach((b)=>{
    const el_child = document.createElement('div');
    el_child.className = b[0];
    el_child.innerHTML = b[1];
    el_tag.appendChild(el_child);
  });
  el_color_cycle.appendChild(el_tag);
});

  
  
  el_submit_item.addEventListener('click', ( ) => {
    post_item(el_ds.value, el_ps.value, el_cs.value)
    .then(()=>{
      return print_items();
    })
  });
  
  print_items();
  
});

