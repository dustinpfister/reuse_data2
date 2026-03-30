const el_ds = document.querySelector("#dept_select");
const el_ptype = document.getElementById('ptype_select');
const el_ps = document.querySelector("#price_select");
const el_cs = document.querySelector("#count_select");
const el_out = document.querySelector("#out");
const el_submit_item = document.querySelector("#submit_item");

const CONFIG = {
    print_color : null
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

const del_items = (rec_nums=[])=> {
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

const get_items = () => {
  return fetch('/json', {
    method: "GET"
  })
  .then((data)=>{ 
    return data.json()
  })
};
/********* **********
print_items
********** *********/
const create_header_tr = (item={}) => {
    const tr = document.createElement('tr');
    Object.keys(item).forEach((key)=>{
        const th = document.createElement('th');
        th.innerText = key;
        tr.appendChild(th);
    });
    const th = document.createElement('th');
    th.innerText = 'actions';
    tr.appendChild(th);
    return tr;
};
const print_items = () => {
  return get_items()
  .then ( (result)=> {
    let total_grand = 0;
    const dept = CONFIG.DEPT_OPTIONS.split(',');
    const table = document.createElement('table');
    table.appendChild( create_header_tr( result.items[0] ) );
    result.items.forEach( (item, i) => {
      const total_price = item.count * item.price;
      total_grand += total_price;
      const tr = document.createElement('tr');
      Object.keys(item).forEach((key)=>{
          const td = document.createElement('td');
          
          let text = item[key];
          
          if(key === 't'){
              const d = new Date( parseInt(item[key]) );
              const wd = d.toLocaleString('en-US', { weekday: 'short'  });
              const month = d.toLocaleString('en-US', { month: 'short'  });
              const time = d.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }).padStart(8, ' ')
              text = wd + ' ' + month + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + time;
          }
          
          td.innerText = text;
          tr.appendChild(td);
      });
      const td = document.createElement('td');
      const input_del = document.createElement('input');
      input_del.value = 'del';
      input_del.type='button';
      input_del.addEventListener('click', ()=>{
          del_items([item.rec_num])
          .then(()=>{
              print_items();
          });
      });
      td.appendChild(input_del)
      tr.appendChild(td);
      table.appendChild(tr);
    });
    const container = document.querySelector('#disp_items');
    container.innerHTML = '';
    container.appendChild(table);
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
  
  const cs = CONFIG.color_status;
  const i_array = cs.array;
  const colorObj = CONFIG.COLOR_CONF.array[ i_array ];
  const printColorObj = colorObj.data[cs.print];
  const print_color = CONFIG.print_color = printColorObj.desc.toLowerCase(); 
  el_out.innerHTML = 'printing color: <span style=\"color:' + printColorObj.web +';\">' + print_color + '</span>';


  el_submit_item.addEventListener('click', ( ) => {
    post_item(el_ds.value, el_ps.value, el_cs.value)
    .then(()=>{
      return print_items();
    })
  });
  
  
  print_items();
  
});

/*
document.getElementById('logout_link').addEventListener('click', ()=>{
    console.log('logout request');

  fetch('/logout', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })

});
*/


