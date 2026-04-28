const el_ds = document.querySelector("#dept_select");
const el_ptype = document.getElementById('ptype_select');
const el_ps = document.querySelector("#price_select");
const el_cs = document.querySelector("#count_select");
//const el_color_cycle = document.querySelector("#color_cycle");
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

/*
const get_config = () => {
  return fetch('/json?mode=config', {
    method: "GET"
  })
  .then((data)=>{ 
    return data.json()
  })
};
*/

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

const PRINT_OPT_DEFAULT = {
   start: new Date(),
   end: new Date()
};

const print_items = ( opt = {} ) => {
    opt = Object.assign( {}, PRINT_OPT_DEFAULT, opt );
    const now = new Date();
    return json_tools.get_items_page( opt.start, opt.end)
    .then ( ( result ) => {
        let total_grand = 0;
        const container = document.querySelector('#items_page');
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

json_tools.get_config()
.then((config)=>{

    Object.assign(CONFIG, config);
  
    const conf = CONFIG.COLOR_CONF;
    const stat = CONFIG.color_status;
    const color_setting = conf.array[ stat.i_array ];
    const color_print = color_setting.data[ stat.i_print ];
    CONFIG.print_color = color_print.desc.toLowerCase();

    const el_date_start = document.getElementById('items_date_start');
    const el_date_end = document.getElementById('items_date_end');
    const now = new Date();
  
    el_date_start.value = now.toISOString().substr(0, 10);
    el_date_end.value = now.toISOString().substr(0, 10);


    const convertTZ = (date = new Date(), tzString = 'UTC') => {
        date = typeof date != 'object' ? new Date(date) : date;
        const local_str = date.toLocaleString("en-US", {timeZone: tzString});
        return new Date( local_str );
    };

    const update_pages = (e)=> {
        //const d_start = new Date( el_date_start.valueAsNumber );
        //const d_end = new Date( el_date_end.valueAsNumber );

        //const ms_adjust = 1000 * 60 * 60 * 4;
        //const d_start = new Date( el_date_start.valueAsNumber + ms_adjust );
        //const d_end = new Date( el_date_end.valueAsNumber + ms_adjust );
      
        const d_start = convertTZ( new Date( el_date_start.valueAsNumber ), 'UTC' );
        const d_end = convertTZ( new Date( el_date_end.valueAsNumber), 'UTC' );

        console.log('dates: ');
        console.log( d_start, d_end );

        print_items({ start: d_start, end: d_end });
    };

    el_date_start.addEventListener('change', update_pages);
    el_date_end.addEventListener('change', update_pages);

    CONFIG.DEPT_OPTIONS.split(',').forEach( (dept_str, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i + ') ' + dept_str;
        el_ds.appendChild(opt)
    });
  
    CONFIG.PRICE_OPTIONS.split(',').forEach( (price_str, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i + ') $' + price_str + '';
        el_ps.appendChild(opt)
    });
  
    CONFIG.COUNT_OPTIONS.split(',').forEach( (count_str, i) => {
        const opt = document.createElement('option');
        opt.value = count_str;
        opt.innerText = i + ') ' + count_str;
        el_cs.appendChild(opt)
    });
  
    el_submit_item.addEventListener('click', ( ) => {
        post_item(el_ds.value, el_ps.value, el_cs.value)
        .then(()=>{
            return print_items();
        })
    });
  
    const el_pricing = document.getElementById('ptype_select');
    const el_pinput = document.getElementById('pricing_input');
    const el_color_cycle = document.getElementById('color_cycle');
  
    const set_pricing_style = () => {
  
        el_pinput.style.background='white';
        el_color_cycle.style.display = 'none';
        if(el_pricing.value === 'color'){
            const cc = CONFIG.COLOR_CONF;
            const cs = CONFIG.color_status;
          
            const color = cc.array[ cs.i_array ].data[ cs.i_print ];
          
            el_pinput.style.background = color.web + '90';
            //el_pinput.style.opacity = 0.25;
            el_color_cycle.style.display = 'block';
        }
    };
  
    el_pricing.addEventListener('change', set_pricing_style);
    set_pricing_style();
    print_items();
});

