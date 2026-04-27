(function(){
    const el_color_cycle = document.querySelector("#color_cycle");
    const CONFIG = {
        print_color : null
    };
    json_tools.get_config()
    .then( ( config ) => {
        Object.assign(CONFIG, config);
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
    });
}());

