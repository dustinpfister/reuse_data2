
const mod = function(x, m) {
    return (x % m + m) % m;
};


const default_conf = {
    automatic: true,
    manual : {   // if automatic = false the array and color index values to use
        i_array: 0,
        i_color: 0
    },
    array : [
        {
            first_tuesday: new Date(2025, 9 - 1, 9, 0, 0, 0, 0),
            first_index: 0,
            ascending: true,
            discounts: [ [25, 3], [50, 2] ],
            cull: 1,
            data: [  
                { i: 0, short: 'G', desc: 'Green',  web: '#00dd00' },
                { i: 1, short: 'B', desc: 'Blue',   web: '#0000dd' },
                { i: 2, short: 'Y', desc: 'Yellow', web: '#efef00' },
                { i: 3, short: 'O', desc: 'Orange', web: '#dd5500' },
                { i: 4, short: 'R', desc: 'Red',    web: '#dd0000' }
            ]
        }
    ]
};

const get_conf_array_index = ( conf = default_conf, now = new Date() ) => {
    if(!conf.automatic){
        return conf.manual.i_array;
    }
    let i_array = 0;
    const ca_len = conf.array.length;
    if( ca_len > 1 ){
        let i = 0;
        while(i < ca_len){
            const cb = conf.array[ i ];
            if( now.getTime() >= cb.first_tuesday.getTime()){
               i_array = i;
            }
            i += 1;
        }
    }
    return i_array;
};


const color_cycle = {
    default_conf : default_conf
};

color_cycle.parse_conf = ( conf = color_cycle.default_conf ) => {
    const n = Object.assign({}, color_cycle.default_conf, conf);
    
    n.array = !n.array ? [] : n.array;
    n.array = typeof n.array != 'object' ? [] : n.array;
    n.array = n.array instanceof Array === false ? [] : n.array;
    n.array = n.array.length === 0 ? Array.from( color_cycle.default_conf.array ) : n.array;
     
    n.array.map( (obj) => {
        obj = Object.assign(obj, color_cycle.default_conf.array[0]);
        obj.first_tuesday = typeof obj.first_tuesday === 'string' ? new Date( obj.first_tuesday ): obj.first_tuesday;
        return obj;
    });
    return n;
};

color_cycle.get_index = (conf = color_cycle.default_conf, delta = 0, now=new Date()) => {
    conf = color_cycle.parse_conf( conf );
    const time = now.getTime();
    const i_array = get_conf_array_index(conf, now);
    const colorObj = conf.array[ i_array ];
    const ms = Math.round( time  - colorObj.first_tuesday.getTime() );
    const week_count = Math.floor( ms  / ( 1000  * 60 * 60 * 24 * 7) );
    const week_delta = week_count * ( colorObj.ascending ? 1 : -1 );
    if(!conf.automatic){
        return mod( conf.manual.i_color + delta, colorObj.data.length );
    }
    return mod( colorObj.first_index + week_delta + delta, colorObj.data.length );
};

color_cycle.get_status = ( conf={}, now = new Date() ) => {
    conf = color_cycle.parse_conf( conf );
    const i_array = get_conf_array_index( conf, 0, now );
    const colorObj = conf.array[i_array];
    const cs = {
       i_array: i_array
    };
    cs.i_print = color_cycle.get_index( conf, 0, now );
    cs.disc = colorObj.discounts.map(( disc )=>{
        return [
            disc[0],
            color_cycle.get_index( conf, disc[1], now )
        ];
    });
    cs.i_cull = color_cycle.get_index( conf, colorObj.cull, now );
    return cs;
};

export { color_cycle }
